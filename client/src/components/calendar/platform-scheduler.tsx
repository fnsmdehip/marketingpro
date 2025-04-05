import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useContentScheduler } from '@/hooks/use-content-scheduler';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Calendar, Clock, Users, TrendingUp } from 'lucide-react';

interface PlatformSchedulerProps {
  platform: string;
}

// Platform-specific optimal posting times based on research
const platformSchedules: Record<string, { times: string[], best: string[], audience: string, info: string }> = {
  twitter: {
    times: ['7:00 AM', '12:00 PM', '5:00 PM', '10:00 PM'],
    best: ['12:00 PM', '5:00 PM'],
    audience: 'Professionals, News Followers, Tech Enthusiasts',
    info: 'B2B content performs best on weekdays, while engagement peaks during lunch and commute times.'
  },
  instagram: {
    times: ['11:00 AM', '2:00 PM', '7:00 PM', '9:00 PM'],
    best: ['2:00 PM', '7:00 PM'],
    audience: 'Millennials, Gen Z, Visual Content Consumers',
    info: 'Engagement is highest throughout the week in the late afternoon and evening when people take breaks.'
  },
  linkedin: {
    times: ['8:00 AM', '10:00 AM', '12:00 PM', '5:00 PM'],
    best: ['10:00 AM', '12:00 PM'],
    audience: 'Professionals, B2B Decision Makers, Career Focused',
    info: 'Content published during business hours on weekdays receives the highest engagement, with Tuesday through Thursday being optimal.'
  },
  facebook: {
    times: ['9:00 AM', '1:00 PM', '3:00 PM', '8:00 PM'],
    best: ['1:00 PM', '3:00 PM'],
    audience: 'General Audience, Wide Age Range',
    info: 'Engagement is highest mid-week during lunch hours and late afternoon when people are taking breaks.'
  },
  tiktok: {
    times: ['10:00 AM', '2:00 PM', '6:00 PM', '9:00 PM'],
    best: ['6:00 PM', '9:00 PM'],
    audience: 'Gen Z, Young Millennials, Trend Followers',
    info: 'Content performs best outside of school and work hours, with peak engagement in the evenings.'
  },
  youtube: {
    times: ['11:00 AM', '2:00 PM', '7:00 PM', '10:00 PM'],
    best: ['7:00 PM', '10:00 PM'],
    audience: 'Wide Age Range, Content Seekers',
    info: 'Optimal posting time is Thursday and Friday evenings and on weekends when viewers have leisure time.'
  }
};

const platformIcons: Record<string, string> = {
  twitter: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
  instagram: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
  linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
  facebook: "https://cdn-icons-png.flaticon.com/512/174/174848.png",
  tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
  youtube: "https://cdn-icons-png.flaticon.com/512/174/174883.png",
};

export function PlatformScheduler({ platform }: PlatformSchedulerProps) {
  const { openScheduler, updateSchedulerContent } = useContentScheduler();
  const scheduleData = platformSchedules[platform] || {
    times: [],
    best: [],
    audience: '',
    info: 'No data available for this platform.'
  };
  
  // Query for analytics (in a real application, this would fetch platform-specific data)
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: [`/api/analytics/platform/${platform}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: false, // Disabled until we have a real API
  });
  
  const handleScheduleAtTime = (time: string) => {
    // Create a date for today with the specified time
    const [hour, minute] = time.split(':').map(part => parseInt(part.replace(/[^\d]/g, '')));
    const ampm = time.includes('PM');
    
    const scheduleDate = new Date();
    scheduleDate.setHours(
      ampm ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour),
      minute,
      0,
      0
    );
    
    // If the time is already passed for today, schedule for tomorrow
    if (scheduleDate < new Date()) {
      scheduleDate.setDate(scheduleDate.getDate() + 1);
    }
    
    // Open scheduler with the predetermined time
    updateSchedulerContent({
      scheduledAt: scheduleDate,
      platforms: [platform]
    });
    openScheduler();
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-4">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <img 
              src={platformIcons[platform]} 
              alt={platform} 
              className="h-6 w-6 mr-2" 
            />
            <CardTitle className="capitalize">{platform} Optimal Scheduling</CardTitle>
          </div>
          <CardDescription>
            Schedule content at peak engagement times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {scheduleData.times.map((time, index) => (
              <Button 
                key={index}
                variant={scheduleData.best.includes(time) ? "default" : "outline"}
                className={scheduleData.best.includes(time) ? "border-2 border-primary" : ""}
                onClick={() => handleScheduleAtTime(time)}
              >
                <Clock className="mr-2 h-4 w-4" />
                {time}
                {scheduleData.best.includes(time) && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full">
                    Best
                  </span>
                )}
              </Button>
            ))}
          </div>
          
          <div className="mt-6 flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-primary-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-medium">Recommended Days</h4>
              <p className="text-xs text-gray-500 mt-1">
                {platform === 'twitter' && 'Monday through Thursday, avoiding weekends'}
                {platform === 'instagram' && 'Tuesday through Friday, with Wednesday being optimal'}
                {platform === 'linkedin' && 'Tuesday, Wednesday, Thursday for highest engagement'}
                {platform === 'facebook' && 'Wednesday to Friday, with Thursday peak engagement'}
                {platform === 'tiktok' && 'Tuesday through Saturday, best on Friday evening'}
                {platform === 'youtube' && 'Thursday through Sunday, optimal on Saturday'}
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex items-start space-x-3">
            <Users className="h-5 w-5 text-primary-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-medium">Target Audience</h4>
              <p className="text-xs text-gray-500 mt-1">{scheduleData.audience}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-start space-x-3">
            <TrendingUp className="h-5 w-5 text-primary-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-medium">Engagement Insight</h4>
              <p className="text-xs text-gray-500 mt-1">{scheduleData.info}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
          <CardDescription>
            Performance metrics for your {platform} content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* This would typically display real analytics data */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Engagement by Time of Day</h4>
              <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Analytics data will appear here when you connect your {platform} account
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Connect Account
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Best Performing Content Types</h4>
              <div className="grid grid-cols-3 gap-2">
                {platform === 'twitter' && (
                  <>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">1</div>
                      <div className="text-xs">Threads</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">2</div>
                      <div className="text-xs">Polls</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">3</div>
                      <div className="text-xs">Images</div>
                    </div>
                  </>
                )}
                
                {platform === 'instagram' && (
                  <>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">1</div>
                      <div className="text-xs">Reels</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">2</div>
                      <div className="text-xs">Carousels</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">3</div>
                      <div className="text-xs">Stories</div>
                    </div>
                  </>
                )}
                
                {platform === 'linkedin' && (
                  <>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">1</div>
                      <div className="text-xs">Documents</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">2</div>
                      <div className="text-xs">Text</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">3</div>
                      <div className="text-xs">Articles</div>
                    </div>
                  </>
                )}
                
                {platform === 'facebook' && (
                  <>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">1</div>
                      <div className="text-xs">Videos</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">2</div>
                      <div className="text-xs">Images</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">3</div>
                      <div className="text-xs">Links</div>
                    </div>
                  </>
                )}
                
                {platform === 'tiktok' && (
                  <>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">1</div>
                      <div className="text-xs">Trends</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">2</div>
                      <div className="text-xs">Effects</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">3</div>
                      <div className="text-xs">Duets</div>
                    </div>
                  </>
                )}
                
                {platform === 'youtube' && (
                  <>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">1</div>
                      <div className="text-xs">How-tos</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">2</div>
                      <div className="text-xs">Reviews</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-lg font-semibold">3</div>
                      <div className="text-xs">Shorts</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}