import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/marketing/hero-section";
import FeaturesSection from "@/components/marketing/features-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import TestimonialsSection from "@/components/marketing/testimonials-section";
import { useAuth } from "@/hooks/use-auth";
import { Footer } from "@/components/marketing/footer";
import { ChevronRight, Menu, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

export default function LandingPage() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0.9]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.05], [0, 8]);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <motion.header
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
        className="sticky top-0 z-50 bg-white/80 border-b border-gray-100"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-shrink-0">
              <Link href="/">
                <a className="flex items-center">
                  <svg
                    className="h-8 w-8 text-primary-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.25 11.5L4.75 14L12 18.25L19.25 14L14.6722 11.4468"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ml-2 text-xl font-semibold text-gray-900">
                    MarketingPro.ai
                  </span>
                </a>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <a
                href="#features"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Testimonials
              </a>
            </div>

            <div className="hidden md:flex items-center">
              <Link href="/auth">
                <Button variant="outline" className="mr-3">
                  Log in
                </Button>
              </Link>
              <Link href="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <Link href="/auth">
                <a
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </a>
              </Link>
              <Link href="/auth">
                <a
                  className="block w-full px-5 py-3 text-center font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </a>
              </Link>
            </div>
          </div>
        )}
      </motion.header>

      <main>
        {/* Hero section */}
        <HeroSection />

        {/* Features section */}
        <div id="features">
          <FeaturesSection />
        </div>

        {/* CTA with screenshot */}
        <div className="relative bg-gray-900">
          <div className="relative h-80 overflow-hidden bg-primary-600 md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
            <motion.div 
              className="h-full w-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-8">
                <motion.div
                  initial={{ scale: 0.9, y: 10 }}
                  whileInView={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="ml-2 text-xs text-gray-500">MarketingPro.ai</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="h-8 bg-primary-100 rounded flex items-center justify-center">
                        <div className="h-4 w-1/2 bg-primary-200 rounded"></div>
                      </div>
                      <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="mt-4 h-32 bg-gray-100 rounded"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="md:ml-auto md:w-2/3 md:pl-10 lg:pl-16 lg:w-1/2">
              <h2 className="text-base font-semibold uppercase tracking-wider text-gray-300">
                Advanced AI-Powered
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                Content that converts
              </p>
              <p className="mt-3 text-lg text-gray-300">
                Our AI-powered content generation system uses psychological conversion tactics to create engaging content that drives results. With intelligent model switching and multi-platform publishing, you'll never hit rate limits or miss an opportunity to engage your audience.
              </p>
              <div className="mt-8">
                <div className="inline-flex rounded-md shadow">
                  <Link href="/auth">
                    <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50">
                      Try it now
                      <ChevronRight className="ml-2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing section */}
        <div id="pricing">
          <PricingSection />
        </div>

        {/* Testimonials section */}
        <div id="testimonials">
          <TestimonialsSection />
        </div>

        {/* Final CTA */}
        <div className="bg-primary-600">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-primary-200">
                Create your account today.
              </span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/auth">
                  <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50">
                    Get started
                  </a>
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
