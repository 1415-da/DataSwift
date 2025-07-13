"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Database, BarChart3, Brain, Users, Zap, Shield, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function LandingPagePreview() {
  const { theme, setTheme } = useTheme()

  const features = [
    {
      icon: Database,
      title: "Smart Data Management",
      description: "Connect, upload, and manage your data sources with intelligent automation and real-time sync.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Automated EDA, smart visualizations, and AI-powered insights to understand your data instantly.",
    },
    {
      icon: Brain,
      title: "ModelLab",
      description: "Train and deploy ML models with AI guidance on the best algorithms for your specific use case.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Real-time collaboration, version control, and seamless knowledge sharing across your team.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with instant loading, real-time updates, and responsive interactions.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security, compliance ready, with granular access controls and audit trails.",
    },
  ]

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

  const [billing, setBilling] = useState<'monthly' | 'annual'>("monthly");

  function PricingSectionBillingToggle() {
    return (
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
    );
  }

  function PricingSectionCards() {
    return (
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
                  {billing === "annual" ? annualPrices[plan.priceId as keyof typeof annualPrices] : plan.price}
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
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Dataswift</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost">Login</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent" />
        <div className="container mx-auto px-6 pt-32 pb-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight" variants={fadeInUp}>
              The future of{" "}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                collaborative
              </span>{" "}
              data analytics
            </motion.h1>

            <motion.p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto" variants={fadeInUp}>
              Dataswift empowers teams to analyze, model, and share insights faster than ever. Built for modern data
              teams who demand speed, collaboration, and intelligence.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" variants={fadeInUp}>
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
                View Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* App Preview */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Interactive App Preview</p>
                  <p className="text-sm text-muted-foreground">Dashboard, Analytics & Collaboration Tools</p>
                </div>
              </div>
            </div>
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/20 rounded-full blur-sm" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-500/20 rounded-full blur-sm" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to <span className="text-primary">succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From data ingestion to model deployment, Dataswift provides all the tools your team needs in one
              integrated platform.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-4">Trusted by data teams worldwide</h2>
            <p className="text-muted-foreground mb-12">From next-gen startups to established enterprises.</p>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                { name: "TechCorp", logo: "🚀" },
                { name: "DataFlow", logo: "📊" },
                { name: "AI Labs", logo: "🤖" },
                { name: "Analytics Pro", logo: "📈" },
                { name: "ML Studio", logo: "🧠" },
                { name: "Insight Co", logo: "💡" },
              ].map((company, index) => (
                <motion.div
                  key={company.name}
                  className="text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="mr-2">{company.logo}</span>
                  {company.name}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-24 bg-gradient-to-b from-background via-muted/40 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your team. No hidden fees, no surprises.
            </p>
          </div>
          {/* Billing Toggle */}
          <PricingSectionBillingToggle />
          {/* Pricing Cards */}
          <PricingSectionCards />
          {/* FAQ / Note */}
          <div className="mt-12 text-center text-muted-foreground text-sm max-w-xl mx-auto">
            <p>
              All plans include unlimited users. Annual billing saves you 2 months. Need a custom solution? <a href="#" className="text-primary underline">Contact us</a>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to transform your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                data workflow?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of data teams who trust Dataswift to power their analytics and collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Dataswift</span>
              </div>
              <p className="text-muted-foreground">
                The modern platform for collaborative data analytics and machine learning.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Dataswift. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
