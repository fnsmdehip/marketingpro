import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Sparkles, BarChart2, Zap, CheckCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-background px-4 lg:px-6 border-b py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Marketing Pro</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/auth?signup=true">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            All-in-one Marketing Solution
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your Marketing Arsenal, <span className="text-primary">Powered by AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Revolutionize your marketing strategy with our all-in-one platform. Create, schedule, analyze, and optimize your content with powerful AI tools.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/auth?signup=true">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border bg-background shadow-lg">
            {/* Dashboard Preview Image would go here */}
            <div className="aspect-[16/9] bg-gradient-to-tr from-muted to-muted/50 flex items-center justify-center p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Powerful Dashboard</h3>
                <p className="text-muted-foreground">
                  All your marketing tools and analytics in one place
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Marketing Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create, manage, and optimize your marketing campaigns
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="space-y-1">
                <Sparkles className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI Generator</CardTitle>
                <CardDescription>
                  Create marketing content with advanced AI tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Copy for ads, emails, & social</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Blog posts & articles</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Product descriptions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>
                  Schedule and manage your content publishing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Visual content calendar</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Automated publishing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Team collaboration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <BarChart2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Track and measure your marketing performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Performance metrics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Audience insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Conversion tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Marketing Tools</CardTitle>
                <CardDescription>
                  Advanced tools to optimize your campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Conversion tactics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Growth engines</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Prompt arsenal</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include full access to our core features.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:max-w-5xl lg:mx-auto">
            {/* Starter Plan */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Starter Plan</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-4">
                  Perfect for individuals and small businesses just getting started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>10,000 AI words per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>50 social media posts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>1 user</span>
                  </li>
                </ul>
                <Link href="/auth?signup=true&plan=starter" className="mt-6 block">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="border-primary relative">
              <div className="absolute -top-5 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded">Most Popular</span>
              </div>
              <CardHeader>
                <CardTitle>Professional Plan</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">$79</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-4">
                  Ideal for growing businesses and marketing teams.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>50,000 AI words per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>200 social media posts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>3 team members</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>Premium marketing templates</span>
                  </li>
                </ul>
                <Link href="/auth?signup=true&plan=professional" className="mt-6 block">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Enterprise Plan</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">Custom</span>
                </div>
                <CardDescription className="mt-4">
                  For larger organizations with custom requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>Unlimited AI content generation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>Unlimited social media management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>Custom analytics dashboards</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <Link href="mailto:sales@marketingpro.ai" className="mt-6 block">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it, hear from our satisfied customers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Zap key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="flex-1">
                    <p className="text-muted-foreground">
                      "Marketing Pro has transformed how we approach content creation. The AI tools save us hours every week, and the analytics help us understand what's working."
                    </p>
                  </blockquote>
                  <div className="mt-6 pt-6 border-t">
                    <div className="font-medium">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">Marketing Director, TechStart</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Zap key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="flex-1">
                    <p className="text-muted-foreground">
                      "The content calendar feature is a game-changer. We've increased our social media engagement by 200% since adopting Marketing Pro for our agency."
                    </p>
                  </blockquote>
                  <div className="mt-6 pt-6 border-t">
                    <div className="font-medium">James Wilson</div>
                    <div className="text-sm text-muted-foreground">Founder, Creative Spark Agency</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Zap key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="flex-1">
                    <p className="text-muted-foreground">
                      "As a small business owner, I was overwhelmed with marketing. Marketing Pro's arsenal of tools and resources makes it easy to compete with larger brands."
                    </p>
                  </blockquote>
                  <div className="mt-6 pt-6 border-t">
                    <div className="font-medium">Emily Chen</div>
                    <div className="text-sm text-muted-foreground">Owner, Artisan Bakery</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Marketing?</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Join thousands of businesses using Marketing Pro to reach their audience, engage customers, and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth?signup=true">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Get Started For Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 hover:bg-primary-foreground/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Marketing Pro</span>
              </div>
              <p className="text-muted-foreground">
                Your all-in-one marketing solution powered by AI.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
            <p>© 2025 Marketing Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}