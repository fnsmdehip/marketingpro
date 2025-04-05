import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowRight, Zap, Calendar, BarChart2, Monitor, Stars } from "lucide-react";

export default function LandingPage() {
  // We'll just use a direct link to dashboard if user has an active session
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Marketing Pro</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-background/40 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Your Marketing Arsenal in One Place
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              AI-powered tools, Content Calendar, UGC generation, Analytics, and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth">
                  Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="hidden md:block absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-primary/5"></div>
          <div className="hidden md:block absolute top-10 -right-10 w-40 h-40 rounded-full bg-primary/10"></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Marketing Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, manage, and optimize your marketing campaigns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Content Calendar</h3>
              <p className="text-muted-foreground">
                Schedule and manage your content across multiple platforms with ease
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Generator</h3>
              <p className="text-muted-foreground">
                Create high-quality content with our intelligent AI tools
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <BarChart2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground">
                Track performance metrics and optimize your marketing strategies
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <Monitor className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">UGC Creation</h3>
              <p className="text-muted-foreground">
                Generate user-generated content that drives engagement and conversions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose a plan that works best for your marketing needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-lg border bg-card p-8">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">Perfect for individuals and small projects</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Content calendar
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic AI generation
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  2 connected platforms
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/auth">Sign Up Free</Link>
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-8 shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">Ideal for growing businesses and marketers</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced content calendar
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Full AI generation capabilities
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  10 connected platforms
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced analytics
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/auth">Get Started</Link>
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-8">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">For larger teams and organizations</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited platforms
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom AI model training
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/auth">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from the marketers who use our platform every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
              </div>
              <p className="text-muted-foreground mb-6">
                "Marketing Pro has completely transformed how we manage our social media content. The AI tools save us hours every week."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                  S
                </div>
                <div>
                  <p className="font-medium">Sarah J.</p>
                  <p className="text-sm text-muted-foreground">Social Media Manager</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
              </div>
              <p className="text-muted-foreground mb-6">
                "The analytics dashboard gives us insights we never had before. We can now make data-driven decisions for our campaigns."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                  M
                </div>
                <div>
                  <p className="font-medium">Michael T.</p>
                  <p className="text-sm text-muted-foreground">Marketing Director</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
                <Stars className="h-5 w-5 text-primary" />
              </div>
              <p className="text-muted-foreground mb-6">
                "The UGC generation tools helped us increase our engagement rates by 250%. Our customers love the content we create now."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                  L
                </div>
                <div>
                  <p className="font-medium">Laura K.</p>
                  <p className="text-sm text-muted-foreground">Content Strategist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Marketing?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-primary-foreground/80">
            Join thousands of marketers who have already upgraded their marketing arsenal
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth">
              Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Marketing Pro</span>
              </div>
              <p className="text-muted-foreground">
                The all-in-one platform for your marketing needs
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Tutorials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Marketing Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}