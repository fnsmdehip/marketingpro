import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
// Only load Stripe if the public key is available
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

// The checkout form component
const CheckoutForm = ({ priceId, planName }: { priceId: string, planName: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSucceeded(true);
      toast({
        title: "Payment Successful",
        description: `You are now subscribed to the ${planName} plan!`,
      });
      // Redirect will be handled by the return_url in confirmPayment
    }

    setLoading(false);
  };

  // If payment succeeded, show success message
  if (succeeded) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
        <p className="text-gray-500 mb-6">
          Thank you for subscribing to the {planName} plan.
        </p>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      <div className="mb-6">
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || loading} 
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Subscribe to ${planName}`
        )}
      </Button>
    </form>
  );
};

// The main subscription page
export default function SubscribePage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get the plan from the URL
  const params = new URLSearchParams(window.location.search);
  const planId = params.get("plan");
  
  // Plan configuration
  const plans = {
    pro: {
      name: "Pro Plan",
      priceId: "price_pro",
      description: "For professionals who need more power and advanced features.",
      price: "$29/month",
      features: [
        "Unlimited scheduled posts",
        "Advanced AI content generation",
        "Connect unlimited social platforms",
        "Advanced analytics",
        "UGC generation",
        "All AI models included",
        "Marketing tools access",
        "Optimal posting time recommendations",
        "Priority support",
      ]
    },
    enterprise: {
      name: "Enterprise Plan",
      priceId: "price_enterprise",
      description: "For organizations with advanced needs and multiple team members.",
      price: "Custom",
      features: [
        "Everything in Pro",
        "Multiple team members",
        "Custom AI model training",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Enterprise SLA",
        "Advanced security",
      ]
    }
  };
  
  // Get the selected plan
  const selectedPlan = planId && (planId in plans) 
    ? plans[planId as keyof typeof plans] 
    : plans.pro;

  useEffect(() => {
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      setError("Stripe is not configured. Please contact support.");
      setLoading(false);
      return;
    }
    
    // Create subscription
    const createSubscription = async () => {
      try {
        const response = await apiRequest("POST", "/api/get-or-create-subscription", {
          priceId: selectedPlan.priceId,
        });
        
        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else if (data.status === "active" || data.status === "trialing") {
          // Already subscribed
          toast({
            title: "Already Subscribed",
            description: `You are already subscribed to the ${selectedPlan.name}.`,
          });
          navigate("/dashboard");
        }
      } catch (err: any) {
        console.error("Error creating subscription:", err);
        setError(err.message || "Failed to create subscription");
        toast({
          title: "Error",
          description: "Failed to create subscription. Please try again.",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    createSubscription();
  }, [selectedPlan.priceId, selectedPlan.name, navigate, toast]);

  return (
    <DashboardLayout title="Subscribe">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Subscribe to {selectedPlan.name}</CardTitle>
            <CardDescription>{selectedPlan.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium text-lg mb-2">{selectedPlan.name}</h3>
                <p className="text-2xl font-bold mb-4">{selectedPlan.price}</p>
                
                <h4 className="text-sm font-medium mb-2 text-gray-700">Includes:</h4>
                <ul className="space-y-1">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                {loading ? (
                  <div className="h-60 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-gray-500">Preparing checkout...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="h-60 flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
                      <p className="text-gray-500 mb-4">{error}</p>
                      <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
                    </div>
                  </div>
                ) : clientSecret && stripePromise ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm 
                      priceId={selectedPlan.priceId} 
                      planName={selectedPlan.name}
                    />
                  </Elements>
                ) : clientSecret && !stripePromise ? (
                  <div className="h-60 flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Stripe Not Configured</h3>
                      <p className="text-gray-500 mb-4">Payment processing is not available at this time. Please try again later.</p>
                      <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            {selectedPlan.name === "Enterprise Plan" && (
              <Button onClick={() => window.location.href = "mailto:sales@marketingpro.ai"}>
                Contact Sales
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}