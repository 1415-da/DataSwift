"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Database, BarChart3, Brain, Users, Zap, Shield, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { LoginModal, SignUpModal } from "@/components/AuthModals"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

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

// Add SVG logo components at the top of the file (or in the same file for demo):
const companyLogos = {
  TechCorp: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#6366F1"/><text x="16" y="21" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">T</text></svg>
  ),
  DataFlow: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#0EA5E9"/><circle cx="16" cy="16" r="7" fill="#fff"/><circle cx="16" cy="16" r="3" fill="#0EA5E9"/></svg>
  ),
  AILabs: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#F59E42"/><rect x="10" y="10" width="12" height="12" rx="6" fill="#fff"/><circle cx="16" cy="16" r="3" fill="#F59E42"/></svg>
  ),
  AnalyticsPro: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#10B981"/><rect x="8" y="20" width="3" height="4" rx="1.5" fill="#fff"/><rect x="14" y="14" width="3" height="10" rx="1.5" fill="#fff"/><rect x="20" y="8" width="3" height="16" rx="1.5" fill="#fff"/></svg>
  ),
  MLStudio: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#F472B6"/><path d="M10 22L16 10L22 22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  InsightCo: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#FBBF24"/><circle cx="16" cy="16" r="7" fill="#fff"/><circle cx="16" cy="16" r="3" fill="#FBBF24"/></svg>
  ),
  DataNest: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#A3E635"/><path d="M8 20C12 24 20 24 24 20" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><ellipse cx="16" cy="16" rx="6" ry="3" fill="#fff"/></svg>
  ),
  CloudSync: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#38BDF8"/><ellipse cx="16" cy="20" rx="8" ry="4" fill="#fff"/><ellipse cx="16" cy="16" rx="5" ry="2" fill="#38BDF8"/></svg>
  ),
  QuantumAnalytics: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#8B5CF6"/><circle cx="16" cy="16" r="7" fill="#fff"/><circle cx="16" cy="16" r="3" fill="#8B5CF6"/></svg>
  ),
  FinSight: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#F43F5E"/><rect x="10" y="14" width="12" height="4" rx="2" fill="#fff"/><rect x="14" y="10" width="4" height="12" rx="2" fill="#fff"/></svg>
  ),
  // ...add more as needed...
};

export default function LandingPagePreview() {
  const { data: session } = useSession()
  const user = session?.user
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignUpOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Pricing section logic
  const plans = [
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
      price: "$99",
      period: "/mo",
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
    pro: "$210",
    enterprise: "$900",
  };
  const [billing, setBilling] = useState<'monthly' | 'annual'>("monthly");

  // In the companies array, use the logo key and render the SVG in the marquee:
  const companies = [
    { name: "TechCorp", logo: companyLogos.TechCorp },
    { name: "DataFlow", logo: companyLogos.DataFlow },
    { name: "AI Labs", logo: companyLogos.AILabs },
    { name: "Analytics Pro", logo: companyLogos.AnalyticsPro },
    { name: "ML Studio", logo: companyLogos.MLStudio },
    { name: "Insight Co", logo: companyLogos.InsightCo },
    { name: "DataNest", logo: companyLogos.DataNest },
    { name: "CloudSync", logo: companyLogos.CloudSync },
    { name: "Quantum Analytics", logo: companyLogos.QuantumAnalytics },
    { name: "FinSight", logo: companyLogos.FinSight },
    // ...add more as needed...
  ];

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
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                <Image
                  src="/LOGO.jpg"
                  alt="Dataswift Logo"
                  width={60}
                  height={60}
                  className="object-cover w-12 h-12 rounded-lg"
                  priority
                />
              </div>
              <span className="text-xl font-bold">DataSwift</span>
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
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</Button>
              {!user ? (
                <>
                  <Button variant="ghost" onClick={() => setLoginOpen(true)}>Login</Button>
                  <Button onClick={() => setSignUpOpen(true)}>Sign up</Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <Avatar>
                        {user.image ? (
                          <AvatarImage src={user.image} alt={user.name || user.email || "User"} />
                        ) : (
                          <AvatarFallback>{user.name ? user.name.split(" ").map(n => n[0]).join("") : user.email?.split("@")[0].slice(0,2).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <SignUpModal open={signupOpen} onOpenChange={setSignUpOpen} />

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
      <section id="features" className="py-20 bg-muted/20">
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
      <section className="py-20 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by data teams worldwide
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
              From next-gen startups to established enterprises, leading teams trust Dataswift to power their analytics and collaboration.
            </p>
            <motion.div
              className="marquee mt-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="marquee-content">
                {companies.concat(companies).map((company, index) => (
                  <motion.span
                    key={company.name + index}
                    className="inline-flex items-center gap-2 text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer mx-8"
                    style={{ minWidth: 180 }}
                    variants={fadeInUp}
                  >
                    {company.logo}
                    {company.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
        <style jsx>{`
          .marquee {
            display: flex;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
            position: relative;
          }
          .marquee-content {
            display: flex;
            animation: marquee 45s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="w-full py-24 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your team. No hidden fees, no surprises.
            </p>
          </motion.div>
                <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            {/* Billing Toggle */}
            <motion.div variants={fadeInUp} className="flex justify-center mb-10">
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
                  Annual <span className="ml-2 text-xs text-white bg-green-500 rounded px-2 py-0.5">Save 2 months</span>
                </Button>
              </div>
            </motion.div>
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto h-full flex">
              {plans.map((plan, idx) => (
                <motion.div key={plan.name} variants={fadeInUp} className="h-full">
                  <Card
                    className={`h-full flex flex-col justify-between shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl border-2 ${
                      plan.highlight
                        ? "border-primary/80 shadow-primary/20 relative z-10 scale-105 bg-gradient-to-br from-primary/5 to-background"
                        : plan.name === "Enterprise"
                        ? "border-muted bg-card/80"
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
                          {billing === "annual"
                            ? annualPrices[plan.priceId as keyof typeof annualPrices]
                            : plan.price}
                        </span>
                        <span className="text-lg text-muted-foreground font-medium">
                          {billing === "monthly" ? plan.period : ""}
                          {billing === "annual" && plan.priceId === "pro" && (
                            <span className="ml-1 text-xs">(billed yearly)</span>
                          )}
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
                </motion.div>
              ))}
            </div>
            {/* FAQ / Note */}
            <motion.div variants={fadeInUp} className="mt-12 text-center text-muted-foreground text-sm max-w-xl mx-auto">
              <p>
                All plans include unlimited users. Annual billing saves you 2 months. Need a custom solution? <a href="#" className="text-primary underline">Contact us</a>.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Story & Values
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 font-medium">
              Dataswift was founded to empower every team to unlock the full potential of their data. Our mission is to make advanced analytics and machine learning accessible, collaborative, and lightning-fast for everyone.
            </p>
            <motion.div
              className="flex flex-col md:flex-row gap-8 justify-center items-center"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div className="mb-6 md:mb-0" variants={fadeInUp}>
                <h3 className="font-bold text-xl mb-2">Our Mission</h3>
                <p className="text-muted-foreground">To democratize data science and make collaboration seamless for all teams.</p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 className="font-bold text-xl mb-2">Our Values</h3>
                <p className="text-muted-foreground">Innovation, transparency, and customer obsession drive everything we do.</p>
              </motion.div>
            </motion.div>
          </motion.div>
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
                <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/LOGO.jpg"
                    alt="DataSwift Logo"
                    width={60}
                    height={60}
                    className="object-cover w-12 h-12 rounded-lg"
                    priority
                  />
                </div>
                <span className="text-xl font-bold">DataSwift</span>
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
