import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowUpRight, 
  BarChart2, 
  ChevronDown, 
  Download, 
  Copy,
  ExternalLink
} from "lucide-react";

export default function ConversionTactics() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("persuasion");
  const [industryType, setIndustryType] = useState("ecommerce");
  const [audienceType, setAudienceType] = useState("general");
  const [generatedCopy, setGeneratedCopy] = useState("");
  
  // Mock function to simulate generating copy
  const generatePersuasiveCopy = () => {
    // In a real application, this would use AI providers
    const copyExamples = {
      ecommerce: {
        general: "Limited time offer: Get 20% off your first purchase when you sign up today. Our customers love how our product saves them time and enhances their lifestyle. Don't miss out on joining thousands of satisfied customers!",
        professional: "Streamline your workflow with our professional-grade solutions. Trusted by industry leaders to increase efficiency by 35%. Start your 14-day free trial today - no credit card required.",
        technical: "Engineered with cutting-edge technology, our product achieves 99.9% reliability. Technical specs exceed industry standards by 27%. Deploy now and experience measurable performance improvements within 48 hours."
      },
      saas: {
        general: "Try our platform free for 30 days. No credit card required. Join over 10,000 companies already saving 5+ hours per week with our intuitive software.",
        professional: "Designed for enterprise-level scalability. Our solution integrates seamlessly with your existing tech stack. Schedule a demo to see how we can increase your team's productivity by 40%.",
        technical: "Built on a robust API-first architecture with 99.99% uptime. Supports custom integrations and advanced workflows. Start with our developer-friendly documentation and implement within minutes."
      },
      consulting: {
        general: "Book a free 30-minute consultation today. Our approach has helped clients increase revenue by an average of 27% in the first quarter.",
        professional: "Strategic consulting tailored to your industry challenges. Our methodology is backed by 15+ years of successful client transformations. Request our case studies to see the results.",
        technical: "Data-driven consulting that delivers measurable outcomes. Our analytical framework identifies optimization opportunities others miss. Review our technical whitepaper to learn more."
      }
    };
    
    setGeneratedCopy(copyExamples[industryType][audienceType]);
    
    toast({
      title: "Copy generated",
      description: "Persuasive copy has been created based on your specifications.",
    });
  };
  
  // Function to copy content to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };
  
  return (
    <DashboardLayout title="Conversion Tactics">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Conversion Tactics</h2>
            <p className="text-sm text-gray-500">
              Proven techniques to boost your conversion rates
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <BarChart2 className="mr-2 h-4 w-4" />
              Run A/B Test
            </Button>
          </div>
        </div>
        
        {/* Conversion Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Conversion Rate</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">3.6%</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      0.8%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. previous 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">$86.42</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12.3%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. previous 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Acquisition Cost</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">$24.18</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      5.2%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">improvement (lower is better)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Conversion Tactics Tabs */}
        <Tabs 
          defaultValue="persuasion" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="persuasion">Persuasion Principles</TabsTrigger>
            <TabsTrigger value="copy">Conversion Copy</TabsTrigger>
            <TabsTrigger value="funnels">Sales Funnels</TabsTrigger>
            <TabsTrigger value="cro">CRO Tactics</TabsTrigger>
          </TabsList>
          
          {/* Persuasion Principles Tab */}
          <TabsContent value="persuasion">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Social Proof",
                  description: "People rely on the actions and opinions of others to determine their own",
                  examples: ["Customer testimonials", "Reviews and ratings", "Case studies", "User statistics"],
                  impact: "Up to 270% increase in conversions when implemented correctly"
                },
                {
                  title: "Scarcity",
                  description: "People want what they can't have or what is limited in availability",
                  examples: ["Limited-time offers", "Low stock indicators", "Exclusive membership", "Countdown timers"],
                  impact: "Creates urgency and can increase conversion rates by 332%"
                },
                {
                  title: "Authority",
                  description: "People trust credible, knowledgeable experts and sources",
                  examples: ["Industry certifications", "Expert endorsements", "Media mentions", "Statistical data"],
                  impact: "Establishes credibility and can lift conversions by 125%"
                },
                {
                  title: "Reciprocity",
                  description: "People feel obligated to give when they receive something first",
                  examples: ["Free trials/samples", "Valuable content", "Unexpected bonuses", "Personalized offers"],
                  impact: "Can increase conversion rates by up to 40% when offering genuine value"
                },
                {
                  title: "Commitment",
                  description: "People strive to be consistent with their past actions and commitments",
                  examples: ["Progress indicators", "Multi-step forms", "Public commitments", "Foot-in-the-door technique"],
                  impact: "Step-by-step processes can increase form completions by 140%"
                },
                {
                  title: "Loss Aversion",
                  description: "People prefer avoiding losses more than acquiring equivalent gains",
                  examples: ["Free shipping thresholds", "Abandoned cart emails", "FOMO messaging", "Risk reversals"],
                  impact: "Highlighting potential losses can be twice as powerful as emphasizing gains"
                }
              ].map((principle, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{principle.title}</CardTitle>
                    <CardDescription>{principle.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-medium mb-2">Implementation Examples:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {principle.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 p-3 bg-primary-50 text-primary-700 text-sm rounded-md">
                      <strong>Impact:</strong> {principle.impact}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Conversion Copy Tab */}
          <TabsContent value="copy">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Conversion Copy Generator</CardTitle>
                    <CardDescription>
                      Create high-converting copy based on proven psychological principles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          value={industryType}
                          onValueChange={setIndustryType}
                        >
                          <SelectTrigger id="industry">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ecommerce">E-Commerce</SelectItem>
                            <SelectItem value="saas">SaaS</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="fitness">Fitness & Health</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="audience">Target Audience</Label>
                        <Select
                          value={audienceType}
                          onValueChange={setAudienceType}
                        >
                          <SelectTrigger id="audience">
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Consumer</SelectItem>
                            <SelectItem value="professional">Professional/B2B</SelectItem>
                            <SelectItem value="technical">Technical/Developer</SelectItem>
                            <SelectItem value="luxury">Luxury/Premium</SelectItem>
                            <SelectItem value="value">Budget/Value-Conscious</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="copyType">Copy Type</Label>
                      <Select defaultValue="headline">
                        <SelectTrigger id="copyType">
                          <SelectValue placeholder="Select copy type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="headline">Headlines & Hooks</SelectItem>
                          <SelectItem value="productDescription">Product Description</SelectItem>
                          <SelectItem value="cta">Call-to-Action Buttons</SelectItem>
                          <SelectItem value="emailSubject">Email Subject Lines</SelectItem>
                          <SelectItem value="landingPage">Landing Page Copy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="copyNotes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="copyNotes"
                        placeholder="Add specific details about your product/service, key benefits, or unique selling points..."
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      onClick={generatePersuasiveCopy}
                      className="w-full"
                    >
                      Generate Conversion Copy
                    </Button>
                  </CardContent>
                </Card>
                
                {generatedCopy && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Generated Copy</CardTitle>
                      <CardDescription>
                        Based on your selected parameters
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                        {generatedCopy}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(generatedCopy)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Save to Library
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Copy Tips</CardTitle>
                    <CardDescription>
                      Best practices for writing copy that converts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <ChevronDown className="h-4 w-4 mr-1 text-primary" />
                        Focus on Benefits, Not Features
                      </h4>
                      <p className="text-sm text-gray-600">
                        Explain how your product/service improves customers' lives rather than just listing technical specs.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <ChevronDown className="h-4 w-4 mr-1 text-primary" />
                        Create a Sense of Urgency
                      </h4>
                      <p className="text-sm text-gray-600">
                        Use time-limited offers and scarcity to encourage immediate action.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <ChevronDown className="h-4 w-4 mr-1 text-primary" />
                        Address Objections Proactively
                      </h4>
                      <p className="text-sm text-gray-600">
                        Anticipate and address potential concerns before they become barriers to conversion.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <ChevronDown className="h-4 w-4 mr-1 text-primary" />
                        Use Social Proof
                      </h4>
                      <p className="text-sm text-gray-600">
                        Incorporate testimonials, reviews, and case studies to build trust and credibility.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <ChevronDown className="h-4 w-4 mr-1 text-primary" />
                        Craft Strong CTAs
                      </h4>
                      <p className="text-sm text-gray-600">
                        Use action-oriented, benefit-focused language in your call-to-action buttons.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                      Average metrics by copy type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Headlines</span>
                          <span className="text-sm text-gray-500">4.2% CTR</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Product Descriptions</span>
                          <span className="text-sm text-gray-500">3.8% Conv.</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "68%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">CTAs</span>
                          <span className="text-sm text-gray-500">5.7% Click</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Email Subjects</span>
                          <span className="text-sm text-gray-500">22.4% Open</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "62%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Sales Funnels Tab */}
          <TabsContent value="funnels">
            <Card>
              <CardHeader>
                <CardTitle>Sales Funnel Templates</CardTitle>
                <CardDescription>
                  Pre-built conversion funnels for different business models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "E-Commerce Product Launch",
                      stages: ["Awareness: Ad Campaign", "Interest: Landing Page", "Desire: Product Demo", "Action: Limited Offer", "Retention: Follow-up Sequence"],
                      conversionRate: "4.8%",
                      bestFor: "Physical product launches"
                    },
                    {
                      title: "SaaS Free Trial",
                      stages: ["Awareness: SEO Content", "Interest: Free Guide Download", "Desire: Free Trial", "Action: Onboarding", "Retention: Feature Updates"],
                      conversionRate: "3.2%",
                      bestFor: "Software products and services"
                    },
                    {
                      title: "Lead Generation Webinar",
                      stages: ["Awareness: Social Media", "Interest: Webinar Registration", "Desire: Live Training", "Action: Special Offer", "Retention: Community Access"],
                      conversionRate: "5.6%",
                      bestFor: "Coaching and consulting services"
                    },
                    {
                      title: "Content Upgrade Funnel",
                      stages: ["Awareness: Blog Post", "Interest: Content Upgrade", "Desire: Email Sequence", "Action: Sales Page", "Retention: Bonus Content"],
                      conversionRate: "2.9%",
                      bestFor: "Info products and digital downloads"
                    },
                    {
                      title: "Multi-Channel Retargeting",
                      stages: ["Awareness: Paid Traffic", "Interest: Video Content", "Desire: Retargeting Ads", "Action: Abandoned Cart Recovery", "Retention: Loyalty Program"],
                      conversionRate: "6.3%",
                      bestFor: "Established e-commerce stores"
                    },
                    {
                      title: "High-Ticket Sales",
                      stages: ["Awareness: Podcast/Guest Posts", "Interest: Case Study", "Desire: Free Consultation", "Action: Sales Call", "Retention: Implementation Support"],
                      conversionRate: "8.1%",
                      bestFor: "Premium services and products"
                    }
                  ].map((funnel, index) => (
                    <Card key={index} className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{funnel.title}</CardTitle>
                        <CardDescription className="text-xs">
                          Avg. Conversion: {funnel.conversionRate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mt-2 space-y-1">
                          {funnel.stages.map((stage, i) => (
                            <div key={i} className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-medium mr-2">{i+1}</div>
                              <span className="text-sm">{stage}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-xs bg-gray-100 p-2 rounded">
                          <strong>Best for:</strong> {funnel.bestFor}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button size="sm" className="w-full">
                          Use This Funnel
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* CRO Tactics Tab */}
          <TabsContent value="cro">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <Card>
                  <CardHeader>
                    <CardTitle>CRO Tactics Library</CardTitle>
                    <CardDescription>
                      Proven tactics to increase conversion rates across your marketing assets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-gray-200">
                      {[
                        {
                          title: "Simplified Form Fields",
                          description: "Reduce form fields to only those absolutely necessary. Each additional field can reduce conversion rates by up to 11%.",
                          impact: "High",
                          difficulty: "Low",
                          beforeAfter: "+28% form completion rate"
                        },
                        {
                          title: "Strategic CTA Placement",
                          description: "Position call-to-action buttons where users are most engaged, following the natural eye-scanning pattern (F-pattern for text, Z-pattern for visual designs).",
                          impact: "Medium",
                          difficulty: "Medium",
                          beforeAfter: "+17% click-through rate"
                        },
                        {
                          title: "Benefit-Focused Button Text",
                          description: "Replace generic button text ('Submit', 'Click Here') with benefit-focused text ('Get My Free Guide', 'Start Saving Today').",
                          impact: "Medium",
                          difficulty: "Low",
                          beforeAfter: "+32% conversion lift"
                        },
                        {
                          title: "Trust Signals Above the Fold",
                          description: "Add security badges, customer logos, or review stars near conversion elements to establish immediate trust.",
                          impact: "High",
                          difficulty: "Low",
                          beforeAfter: "+12% conversion improvement"
                        },
                        {
                          title: "Exit-Intent Popups",
                          description: "Capture abandoning visitors with a compelling final offer as they attempt to leave your page.",
                          impact: "High",
                          difficulty: "Medium",
                          beforeAfter: "Recovers 5-15% of abandoning visitors"
                        }
                      ].map((tactic, index) => (
                        <div key={index} className="py-4">
                          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                            <div>
                              <h3 className="font-medium text-base">{tactic.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{tactic.description}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 min-w-[220px]">
                              <div className="flex flex-col items-center px-3 py-2 bg-primary-50 rounded text-center">
                                <span className="text-xs text-gray-500">Impact</span>
                                <span className={`text-sm font-medium ${
                                  tactic.impact === 'High' ? 'text-green-600' :
                                  tactic.impact === 'Medium' ? 'text-yellow-600' :
                                  'text-gray-600'
                                }`}>{tactic.impact}</span>
                              </div>
                              <div className="flex flex-col items-center px-3 py-2 bg-primary-50 rounded text-center">
                                <span className="text-xs text-gray-500">Difficulty</span>
                                <span className={`text-sm font-medium ${
                                  tactic.difficulty === 'Low' ? 'text-green-600' :
                                  tactic.difficulty === 'Medium' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>{tactic.difficulty}</span>
                              </div>
                              <div className="flex flex-col items-center px-3 py-2 bg-primary-50 rounded text-center">
                                <span className="text-xs text-gray-500">Avg. Result</span>
                                <span className="text-sm font-medium text-primary-700">{tactic.beforeAfter}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>A/B Testing Ideas</CardTitle>
                    <CardDescription>
                      Quick wins to test on your website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      "Headline variations (question vs. statement)",
                      "CTA button color and position",
                      "Product image size and angles",
                      "Price presentation (with vs. without strikethrough)",
                      "Social proof placement (top vs. bottom)",
                      "Form layout (single vs. multi-step)",
                      "Navigation options (more vs. fewer choices)",
                      "Testimonial formats (text vs. video)"
                    ].map((idea, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="h-5 w-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm">{idea}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>CRO Tools</CardTitle>
                    <CardDescription>
                      Recommended tools for optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-gray-200">
                      {[
                        { name: "Hotjar", category: "Behavior Analytics", feature: "Heatmaps & Recordings" },
                        { name: "Google Optimize", category: "A/B Testing", feature: "Free experimentation" },
                        { name: "Unbounce", category: "Landing Pages", feature: "Drag & drop builder" },
                        { name: "Lucky Orange", category: "Visitor Tracking", feature: "Session recordings" },
                        { name: "Optimizely", category: "Enterprise Testing", feature: "Multi-page testing" }
                      ].map((tool, index) => (
                        <div key={index} className="py-3 flex justify-between">
                          <div>
                            <p className="font-medium text-sm">{tool.name}</p>
                            <p className="text-xs text-gray-500">{tool.category}</p>
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full self-center">
                            {tool.feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}