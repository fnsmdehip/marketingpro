import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Content } from '@shared/schema';
import { useContentScheduler } from '@/hooks/use-content-scheduler';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  filteredPlatform: string;
}

// Platform colors and icons for visual distinctions
const platformColors: Record<string, string> = {
  twitter: 'bg-blue-500',
  instagram: 'bg-pink-500',
  linkedin: 'bg-blue-700',
  facebook: 'bg-blue-600',
  tiktok: 'bg-black',
  youtube: 'bg-red-600',
};

const platformIcons: Record<string, string> = {
  twitter: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
  instagram: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
  linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
  facebook: "https://cdn-icons-png.flaticon.com/512/174/174848.png",
  tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
  youtube: "https://cdn-icons-png.flaticon.com/512/174/174883.png",
};

export function CalendarView({ filteredPlatform }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { openScheduler, updateSchedulerContent } = useContentScheduler();
  
  // Fetch scheduled content for the month
  const { data: contentItems = [], isLoading } = useQuery<Content[]>({
    queryKey: ['/api/content'],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Filter content by platform if needed
  const filteredContent = filteredPlatform === 'all'
    ? contentItems
    : contentItems.filter(content => 
        content.platforms && content.platforms.includes(filteredPlatform)
      );
  
  // Date navigation functions
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Get days of current month for the calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create calendar rows with proper day alignment (starting on the correct weekday)
  const startWeekday = monthStart.getDay();
  
  // Generate a calendar grid
  const calendarRows = [];
  let days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startWeekday; i++) {
    days.push(<td key={`empty-${i}`} className="border p-1 h-24 xl:w-32 md:w-24 sm:w-16"></td>);
  }
  
  // Add cells for each day of the month
  for (const day of daysInMonth) {
    const formattedDate = format(day, 'yyyy-MM-dd');
    
    // Find content scheduled for this day
    const dayContent = filteredContent.filter(content => {
      const contentDate = new Date(content.scheduledAt || '');
      return isSameDay(contentDate, day);
    });
    
    // Add cell with appropriate content
    days.push(
      <td key={formattedDate} className="border p-1 h-24 xl:w-32 md:w-24 sm:w-16 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-between">
            <p className={`text-sm p-1 my-1 text-center ${!isSameMonth(day, currentMonth) ? 'text-gray-400' : ''}`}>
              {format(day, 'd')}
            </p>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // If selected day is in the past, don't allow scheduling
                if (day < today) return;
                
                // Set the date for the scheduler as ISO string
                const scheduleDate = new Date(day);
                scheduleDate.setHours(12, 0, 0, 0); // Default to noon
                
                updateSchedulerContent({
                  scheduledAt: scheduleDate
                });
                openScheduler();
              }}
            >
              <CalendarIcon className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="overflow-y-auto max-h-[88px] mt-1">
            {dayContent.map((content, idx) => (
              <div 
                key={idx} 
                className="text-xs mb-1 rounded truncate p-1 overflow-hidden cursor-pointer"
                style={{ 
                  backgroundColor: content.platforms && content.platforms.length > 0
                    ? platformColors[content.platforms[0] as keyof typeof platformColors] || 'bg-gray-200'
                    : 'bg-gray-200',
                  color: 'white'
                }}
                onClick={() => {
                  updateSchedulerContent({
                    id: content.id,
                    title: content.title,
                    body: content.body,
                    platforms: content.platforms,
                    scheduledAt: content.scheduledAt,
                    status: content.status,
                  });
                  openScheduler();
                }}
              >
                <div className="flex items-center">
                  {content.platforms && content.platforms.map((platform, i) => (
                    <img 
                      key={i}
                      src={platformIcons[platform as keyof typeof platformIcons]} 
                      alt={platform} 
                      className="h-3 w-3 rounded-full mr-1"
                    />
                  ))}
                  <span>{content.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </td>
    );
    
    // Start a new row if we've filled a week
    if (days.length === 7) {
      calendarRows.push(<tr key={`row-${calendarRows.length}`}>{days}</tr>);
      days = [];
    }
  }
  
  // Add empty cells for days after the last day of the month
  const remainingCells = 7 - days.length;
  if (remainingCells < 7) {
    for (let i = 0; i < remainingCells; i++) {
      days.push(<td key={`empty-end-${i}`} className="border p-1 h-24 xl:w-32 md:w-24 sm:w-16"></td>);
    }
    calendarRows.push(<tr key={`row-${calendarRows.length}`}>{days}</tr>);
  }
  
  return (
    <div className="bg-white rounded-md">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex space-x-4 items-center">
          <h3 className="text-lg font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(platformColors).map(([platform, color]) => (
            <div key={platform} className="flex items-center text-xs">
              <div className={`w-3 h-3 ${color} rounded-full mr-1`}></div>
              <span className="capitalize">{platform}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 border-r h-10 xl:w-32 md:w-24 sm:w-16 text-xs">Sunday</th>
              <th className="p-2 border-r h-10 xl:w-32 md:w-24 sm:w-16 text-xs">Monday</th>
              <th className="p-2 border-r h-10 xl:w-32 md:w-24 sm:w-16 text-xs">Tuesday</th>
              <th className="p-2 border-r h-10 xl:w-32 md:w-24 sm:w-16 text-xs">Wednesday</th>
              <th className="p-2 border-r h-10 xl:w-32 md:w-24 sm:w-16 text-xs">Thursday</th>
              <th className="p-2 border-r h-10 xl:w-32 md:w-24 sm:w-16 text-xs">Friday</th>
              <th className="p-2 border-r h-10 xl:w-32 md:w-24 sm:w-16 text-xs">Saturday</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  <div className="flex justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                </td>
              </tr>
            ) : (
              calendarRows
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}