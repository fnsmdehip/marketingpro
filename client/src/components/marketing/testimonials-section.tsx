import { motion } from "framer-motion";

const testimonials = [
  {
    content: "MarketingPro.ai has completely transformed our social media strategy. The AI-powered content generation and scheduling across platforms has saved us hours every week.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechSolutions Inc."
  },
  {
    content: "The psychological conversion tactics built into this platform have increased our conversion rates by 35%. The ROI on this tool has been incredible.",
    author: "Michael Chen",
    role: "Growth Lead",
    company: "StartupGrowth"
  },
  {
    content: "I was skeptical about AI-generated content, but MarketingPro.ai produces results that are indistinguishable from human writers. The UGC generator is a game-changer.",
    author: "Alex Rodriguez",
    role: "Social Media Manager",
    company: "BrandExperts"
  },
  {
    content: "The platform's ability to seamlessly integrate with all our social channels while providing unified analytics has given us insights we never had before.",
    author: "Emily Parker",
    role: "Content Strategist",
    company: "ContentMasters"
  }
];

export function TestimonialsSection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted by marketers worldwide
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            See what our customers are saying about MarketingPro.ai
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-600 italic">"{testimonial.content}"</p>
              <div className="mt-4 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
