import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Form validation schema
const formSchema = z.object({
  url: z.string()
    .url({ message: 'Please enter a valid URL' })
    .min(1, { message: 'URL is required' }),
});

export function WebScraperPage() {
  const { toast } = useToast();
  const [scrapedContent, setScrapedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('url');
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/web-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: values.url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to scrape website');
      }
      
      if (data.success && data.data) {
        setScrapedContent(data.data);
        toast({
          title: 'Content scraped successfully',
          description: 'The website content has been extracted.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'No content found on this webpage.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error scraping website:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to scrape website',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Web Content Scraper</h1>
      <p className="text-muted-foreground mb-6">
        Extract clean, readable text from any webpage. Simply enter the URL and we'll retrieve the important content.
      </p>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Extract Content</CardTitle>
            <CardDescription>
              Enter the URL of the webpage you want to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="url">URL Input</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="mt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/article"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scraping Content...
                        </>
                      ) : (
                        'Scrape Content'
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t pt-4">
            <Alert className="mb-2">
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription>
                Best for article pages, blog posts, and other content-rich sites.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              This tool removes navigation, ads, and other distractions to focus on the main content.
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Extracted Content</CardTitle>
            <CardDescription>
              The main text content from the webpage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] border rounded-md p-3">
              {scrapedContent ? (
                <div className="whitespace-pre-wrap">
                  {scrapedContent}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    {isLoading 
                      ? 'Extracting content...' 
                      : 'Enter a URL and click "Scrape Content" to see the results here'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex w-full justify-between">
              <Button 
                variant="outline" 
                onClick={() => setScrapedContent('')}
                disabled={!scrapedContent || isLoading}
              >
                Clear Results
              </Button>
              <Button
                disabled={!scrapedContent || isLoading}
                onClick={() => {
                  navigator.clipboard.writeText(scrapedContent);
                  toast({
                    title: 'Copied to clipboard',
                    description: 'Content has been copied to your clipboard',
                  });
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default WebScraperPage;