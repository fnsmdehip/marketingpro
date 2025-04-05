import { Express } from "express";
import Stripe from "stripe";
import { storage } from "./storage";

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Warning: STRIPE_SECRET_KEY is not set. Payment functionality will not work correctly.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

export function setupPaymentRoutes(app: Express) {
  // Create a payment intent for one-time purchases
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { amount, currency = "usd" } = req.body;

      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          userId: req.user.id.toString(),
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        message: "Error creating payment intent",
        error: error.message,
      });
    }
  });

  // Create or retrieve a subscription
  app.post("/api/get-or-create-subscription", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;
      const { priceId } = req.body;

      if (!priceId) {
        return res.status(400).json({ message: "Price ID is required" });
      }

      // Check if user already has a subscription
      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(
            user.stripeSubscriptionId
          );

          // If subscription is active, return the client secret
          if (
            subscription.status === "active" ||
            subscription.status === "trialing"
          ) {
            return res.json({
              subscriptionId: subscription.id,
              status: subscription.status,
              clientSecret: null, // No payment needed for active subscription
            });
          }

          // For other statuses, we'll create a new subscription
        } catch (error) {
          console.error("Error retrieving subscription:", error);
          // If the subscription doesn't exist, we'll create a new one
        }
      }

      // Create or get a Stripe customer
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        // Create a new customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
          metadata: {
            userId: user.id.toString(),
          },
        });
        customerId = customer.id;

        // Update user with Stripe customer ID
        await storage.updateStripeCustomerId(user.id, customerId);
      }

      // Create a new subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
      });

      // Update user with subscription ID
      await storage.updateUserStripeInfo(user.id, {
        customerId,
        subscriptionId: subscription.id,
      });

      // Get the client secret
      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        status: subscription.status,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({
        message: "Error creating subscription",
        error: error.message,
      });
    }
  });

  // Webhook to handle Stripe events
  app.post("/api/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    // Verify webhook signature
    if (endpointSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          endpointSecret
        );
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      // For testing without signature verification
      event = req.body;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("PaymentIntent was successful:", paymentIntent.id);
        // Handle successful payment logic here
        break;

      case "invoice.paid":
        const invoice = event.data.object;
        console.log("Invoice was paid:", invoice.id);
        // Update subscription status to active
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          // Find user by customer ID and update their subscription status
          // This depends on your database structure
        }
        break;

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object;
        console.log("Subscription status:", subscription.status);
        // Update user's subscription status
        // Find the user by customer ID and update their subscription status
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  });

  // Get subscription details
  app.get("/api/subscription", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;

      if (!user.stripeSubscriptionId) {
        return res.json({ subscription: null });
      }

      const subscription = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId,
        {
          expand: ["items.data.price.product"],
        }
      );

      res.json({ subscription });
    } catch (error: any) {
      console.error("Error retrieving subscription:", error);
      res.status(500).json({
        message: "Error retrieving subscription",
        error: error.message,
      });
    }
  });

  // Cancel subscription
  app.post("/api/cancel-subscription", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription" });
      }

      const subscription = await stripe.subscriptions.update(
        user.stripeSubscriptionId,
        {
          cancel_at_period_end: true,
        }
      );

      res.json({ subscription });
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({
        message: "Error cancelling subscription",
        error: error.message,
      });
    }
  });
}