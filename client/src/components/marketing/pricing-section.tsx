import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { user } = useAuth();
  
  const plans = [
    {
      id: "free",
      name: "Free",
      description: "For personal use and testing",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      features: [
        "3 scheduled posts per month",
        "Basic AI content generation",
        "Connect up to 2 social platforms",
        "Limited analytics",
      ],
      cta: "Get Started",
      path: user ? "/dashboard" : "/auth",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "For professionals who need more power",
      monthlyPrice: "$29",
      yearlyPrice: "$290",
      features: [
        "Unlimited scheduled posts",
        "Advanced AI content generation",
        "Connect unlimited social platforms",
        "Advanced analytics",
        "UGC generation",
        "All AI models included",
        "Marketing tools access",
        "Optimal posting time recommendations",
      ],
      cta: "Upgrade Now",
      path: "/subscribe?plan=pro",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For organizations with advanced needs",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      features: [
        "Everything in Pro",
        "Multiple team members",
        "Custom AI model training",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Enterprise SLA",
      ],
      cta: "Contact Sales",
      path: "/subscribe?plan=enterprise",
      popular: false,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-gray-50" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-500 md:text-xl max-w-3xl mx-auto">
            Choose the plan that's right for you and start creating incredible content today.
          </p>
          
          <div className="mt-8 inline-flex items-center p-1 bg-gray-100 rounded-full">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly" 
                  ? "bg-white shadow-sm text-gray-900" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "yearly" 
                  ? "bg-white shadow-sm text-gray-900" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly <span className="text-primary">Save 17%</span>
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`flex flex-col ${
                plan.popular 
                  ? "border-primary shadow-lg relative md:scale-105 md:-mt-2 md:-mb-2" 
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full flex items-center">
                  <Sparkles className="h-3 w-3 mr-1.5" />
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2 mb-2">
                  <span className="text-3xl font-bold">
                    {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  {plan.id !== "enterprise" && (
                    <span className="text-gray-500 ml-1 text-sm">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-2.5">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button
                  asChild
                  className={`w-full ${plan.popular ? "" : "variant-outline"}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href={plan.path}>
                    <span className="flex items-center justify-center">
                      {plan.cta}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-4">
            Need Something More Custom?
          </h3>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6">
            We offer tailored solutions for agencies and large enterprises with specific needs.
            Contact our sales team to discuss how we can help you achieve your marketing goals.
          </p>
          <Button size="lg" asChild>
            <a href="mailto:sales@marketingpro.ai">Contact Our Sales Team</a>
          </Button>
        </div>
      </div>
    </section>
  );
}