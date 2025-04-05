import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useContentScheduler } from '@/hooks/use-content-scheduler';
import { 
  Calendar, 
  Copy, 
  Edit, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube,
  MessageCircle,
  Globe,
  Sparkles,
  TrendingUp,
  Zap,
  MessageSquare
} from 'lucide-react';

interface Template {
  id: number;
  title: string;
  description: string;
  category: string;
  platforms: string[];
  contentType: string;
  tags: string[];
  featured?: boolean;
  new?: boolean;
}

interface TemplateGalleryProps {
  searchQuery?: string;
}

export function TemplateGallery({ searchQuery = '' }: TemplateGalleryProps) {
  const { openScheduler, updateSchedulerContent } = useContentScheduler();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  
  // Sample template data
  const templates: Template[] = [
    {
      id: 1,
      title: "The Ultimate Guide to [Topic]",
      description: "A comprehensive guide that positions you as an authority on your topic",
      category: "educational",
      platforms: ["linkedin", "twitter", "blog"],
      contentType: "article",
      tags: ["guide", "authority", "comprehensive"],
      featured: true
    },
    {
      id: 2,
      title: "5 Ways to Improve Your [Process]",
      description: "Actionable list-based content that provides immediate value",
      category: "listicle",
      platforms: ["instagram", "facebook", "twitter"],
      contentType: "post",
      tags: ["tips", "list", "how-to"]
    },
    {
      id: 3,
      title: "Behind the Scenes at [Company]",
      description: "Authentic content that humanizes your brand",
      category: "storytelling",
      platforms: ["instagram", "youtube", "tiktok"],
      contentType: "video",
      tags: ["authentic", "brand story", "behind-the-scenes"],
      new: true
    },
    {
      id: 4,
      title: "Case Study: How [Client] Achieved [Result]",
      description: "Proof-focused content that demonstrates your value",
      category: "case study",
      platforms: ["linkedin", "blog", "email"],
      contentType: "article",
      tags: ["results", "case study", "success story"]
    },
    {
      id: 5,
      title: "Ask Me Anything: [Topic] Edition",
      description: "Engagement-focused content that positions you as an expert",
      category: "interactive",
      platforms: ["instagram", "twitter", "linkedin"],
      contentType: "post",
      tags: ["engagement", "ama", "expert"]
    },
    {
      id: 6,
      title: "The [Industry] Trends Report for [Year]",
      description: "Trend analysis that showcases your industry knowledge",
      category: "educational",
      platforms: ["linkedin", "blog", "email"],
      contentType: "report",
      tags: ["trends", "insights", "industry"],
      featured: true
    },
    {
      id: 7,
      title: "How We Solved [Common Problem]",
      description: "Problem-solution content that resonates with your audience",
      category: "problem-solving",
      platforms: ["blog", "linkedin", "facebook"],
      contentType: "article",
      tags: ["solution", "problem", "how-to"]
    },
    {
      id: 8,
      title: "What Every [Audience] Needs to Know About [Topic]",
      description: "Essential information packaged for a specific audience",
      category: "educational",
      platforms: ["blog", "linkedin", "email"],
      contentType: "guide",
      tags: ["essentials", "knowledge", "audience-specific"],
      new: true
    },
    {
      id: 9,
      title: "[Product] vs [Competitor]: Which is Right for You?",
      description: "Comparison content that helps buyers make decisions",
      category: "comparison",
      platforms: ["blog", "youtube", "email"],
      contentType: "comparison",
      tags: ["product", "comparison", "decision"]
    },
    {
      id: 10,
      title: "The Complete [Beginner/Advanced] Guide to [Topic]",
      description: "Skill-level specific content that targets specific user segments",
      category: "educational",
      platforms: ["blog", "youtube", "linkedin"],
      contentType: "guide",
      tags: ["complete", "skill-level", "guide"]
    },
    {
      id: 11,
      title: "Introducing Our New [Feature/Product]",
      description: "Announcement content that generates excitement",
      category: "announcement",
      platforms: ["all social", "email", "blog"],
      contentType: "announcement",
      tags: ["new", "launch", "feature"]
    },
    {
      id: 12,
      title: "Q&A: Your Top [Topic] Questions Answered",
      description: "FAQ content that addresses common pain points",
      category: "educational",
      platforms: ["blog", "youtube", "instagram"],
      contentType: "q&a",
      tags: ["faq", "questions", "answers"]
    }
  ];
  
  // Filter templates based on search query, category, and content type
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesContentType = selectedContentType === 'all' || template.contentType === selectedContentType;
    
    return matchesSearch && matchesCategory && matchesContentType;
  });
  
  // Get unique categories and content types for filtering
  const categories = ['all', ...new Set(templates.map(t => t.category))];
  const contentTypes = ['all', ...new Set(templates.map(t => t.contentType))];
  
  // Helper function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'blog':
        return <Globe className="h-4 w-4" />;
      case 'email':
        return <MessageCircle className="h-4 w-4" />;
      case 'tiktok':
        return <Zap className="h-4 w-4" />;
      case 'all social':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };
  
  // Function to handle using a template
  const handleUseTemplate = (template: Template) => {
    updateSchedulerContent({
      title: template.title,
      description: template.description,
      content: `# ${template.title}\n\n${template.description}\n\n## Key Points\n\n- Point 1\n- Point 2\n- Point 3`
    });
    openScheduler();
  };
  
  // Category colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'educational':
        return "bg-blue-100 text-blue-800";
      case 'listicle':
        return "bg-purple-100 text-purple-800";
      case 'storytelling':
        return "bg-green-100 text-green-800";
      case 'case study':
        return "bg-amber-100 text-amber-800";
      case 'interactive':
        return "bg-pink-100 text-pink-800";
      case 'problem-solving':
        return "bg-red-100 text-red-800";
      case 'comparison':
        return "bg-indigo-100 text-indigo-800";
      case 'announcement':
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper function for category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'educational':
        return <Sparkles className="h-5 w-5" />;
      case 'listicle':
        return <Copy className="h-5 w-5" />;
      case 'storytelling':
        return <MessageCircle className="h-5 w-5" />;
      case 'case study':
        return <TrendingUp className="h-5 w-5" />;
      case 'interactive':
        return <MessageSquare className="h-5 w-5" />;
      case 'problem-solving':
        return <Zap className="h-5 w-5" />;
      case 'comparison':
        return <Copy className="h-5 w-5" />;
      case 'announcement':
        return <Calendar className="h-5 w-5" />;
      default:
        return <Edit className="h-5 w-5" />;
    }
  };
  
  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="mr-4">
          <span className="text-sm font-medium mr-2">Category:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <span className="text-sm font-medium mr-2">Type:</span>
          <div className="flex flex-wrap gap-2">
            {contentTypes.map(type => (
              <Button
                key={type}
                size="sm"
                variant={selectedContentType === type ? "default" : "outline"}
                onClick={() => setSelectedContentType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="overflow-hidden border hover:shadow-md transition-shadow">
              <div className={`p-4 flex items-center gap-3 border-b ${getCategoryColor(template.category)}`}>
                {getCategoryIcon(template.category)}
                <div>
                  <h3 className="font-medium">{template.title}</h3>
                  <p className="text-xs capitalize">{template.category} · {template.contentType}</p>
                </div>
              </div>
              
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">{template.description}</p>
                
                <div className="mt-3 flex gap-1">
                  {template.platforms.slice(0, 3).map((platform, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full"
                      title={platform}
                    >
                      {getPlatformIcon(platform)}
                    </div>
                  ))}
                  {template.platforms.length > 3 && (
                    <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                      <span className="text-xs">+{template.platforms.length - 3}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center p-4 pt-0">
                <div className="flex gap-1">
                  {template.featured && (
                    <Badge variant="default" className="bg-primary text-white">
                      Featured
                    </Badge>
                  )}
                  {template.new && (
                    <Badge variant="outline" className="border-green-500 text-green-600">
                      New
                    </Badge>
                  )}
                </div>
                <Button size="sm" onClick={() => handleUseTemplate(template)}>
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}