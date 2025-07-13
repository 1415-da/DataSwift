import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans: Array<{
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlight: boolean;
  priceId: keyof typeof annualPrices;
}> = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    features: [
      "Upload up to 10 datasets",
      "Basic EDA tools and visualizations",
      "Access to Knowledge Hub articles",
      "Community support",
    ],
    cta: "Get Started",
    highlight: false,
    priceId: "starter",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    features: [
      "Unlimited datasets and storage",
      "Advanced EDA and ModelLab features",
      "AI-powered model recommendations",
      "Real-time collaboration and commenting",
      "Priority email support",
      "Access to interactive tutorials and feedback analytics",
    ],
    cta: "Start Free Trial",
    highlight: true,
    priceId: "pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "All Pro features",
      "Dedicated account manager",
      "Custom integrations and SSO",
      "Enhanced security and compliance (GDPR, SOC2)",
      "SLA and premium support",
      "Tailored onboarding and training",
    ],
    cta: "Contact Sales",
    highlight: false,
    priceId: "enterprise",
  },
];

const annualPrices = {
  starter: "$0",
  pro: "$290",
  enterprise: "Custom",
};

export default function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>("monthly");

  return (
    <div className="w-full py-24 bg-gradient-to-b from-background via-muted/40 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your team. No hidden fees, no surprises.
          </p>
        </div>
        {/* Billing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center bg-muted rounded-full p-1 shadow-sm">
            <Button
              variant={billing === "monthly" ? "default" : "ghost"}
              size="sm"
              className="rounded-full px-6"
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={billing === "annual" ? "default" : "ghost"}
              size="sm"
              className="rounded-full px-6"
              onClick={() => setBilling("annual")}
            >
              Annual <span className="ml-2 text-xs text-primary-foreground bg-primary/70 rounded px-2 py-0.5">Save 2 months</span>
            </Button>
          </div>
        </div>
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col justify-between shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl border-2 ${
                plan.highlight
                  ? "border-primary/80 shadow-primary/10 relative z-10 scale-105 bg-gradient-to-br from-primary/5 to-background"
                  : "border-border bg-card"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    {plan.name}
                    {plan.highlight && (
                      <Badge className="ml-2" variant="secondary">
                        Most Popular
                      </Badge>
                    )}
                  </CardTitle>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl md:text-5xl font-extrabold">
                    {billing === "annual" ? annualPrices[plan.priceId] : plan.price}
                  </span>
                  <span className="text-lg text-muted-foreground font-medium">
                    {plan.period}
                    {billing === "annual" && plan.priceId === "pro" && <span className="ml-1 text-xs">(billed yearly)</span>}
                  </span>
                </div>
                <CardDescription className="mt-2">
                  {plan.name === "Starter" && "Perfect for individuals and hobbyists."}
                  {plan.name === "Pro" && "For growing teams who need more power and collaboration."}
                  {plan.name === "Enterprise" && "Custom solutions for large organizations."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ul className="space-y-3 mt-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-base">
                      <Check className="text-primary w-5 h-5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-6 flex flex-col">
                <Button
                  size="lg"
                  className={`w-full font-semibold ${plan.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {/* FAQ / Note */}
        <div className="mt-12 text-center text-muted-foreground text-sm max-w-xl mx-auto">
          <p>
            All plans include unlimited users. Annual billing saves you 2 months. Need a custom solution? <a href="#" className="text-primary underline">Contact us</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 