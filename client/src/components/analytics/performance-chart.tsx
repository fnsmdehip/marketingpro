import { useEffect, useState } from 'react';
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

type PerformanceChartProps = {
  dateRange: '7d' | '30d' | '90d' | '1y' | 'all';
  metricType: 'impressions' | 'engagement' | 'clicks' | 'conversions';
  platformFilter: string;
};

export function PerformanceChart({ 
  dateRange, 
  metricType, 
  platformFilter 
}: PerformanceChartProps) {
  const [data, setData] = useState<any[]>([]);
  
  // Generate mock data based on the inputs
  useEffect(() => {
    const generateDates = () => {
      const dates = [];
      const today = new Date();
      let daysToGenerate = 30;
      
      switch (dateRange) {
        case '7d':
          daysToGenerate = 7;
          break;
        case '30d':
          daysToGenerate = 30;
          break;
        case '90d':
          daysToGenerate = 90;
          break;
        case '1y':
          daysToGenerate = 365;
          break;
        case 'all':
          daysToGenerate = 365 * 2;
          break;
      }
      
      for (let i = daysToGenerate - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(date);
      }
      return dates;
    };
    
    const generateValue = (baseline: number, variance: number) => {
      return Math.floor(baseline + (Math.random() * variance * 2) - variance);
    };
    
    // Set different baselines for different metrics
    let baseline = 1000;
    let variance = 200;
    
    switch (metricType) {
      case 'impressions':
        baseline = 5000;
        variance = 1000;
        break;
      case 'engagement':
        baseline = 500;
        variance = 100;
        break;
      case 'clicks':
        baseline = 200;
        variance = 50;
        break;
      case 'conversions':
        baseline = 50;
        variance = 10;
        break;
    }
    
    // Adjust for platform if specific platform selected
    if (platformFilter !== 'all') {
      const platformMultipliers: Record<string, number> = {
        twitter: 0.8,
        instagram: 1.2,
        linkedin: 0.7,
        facebook: 0.9,
        tiktok: 1.4
      };
      
      const multiplier = platformMultipliers[platformFilter] || 1;
      baseline = Math.floor(baseline * multiplier);
      variance = Math.floor(variance * multiplier);
    }
    
    const dates = generateDates();
    
    // Generate the data points
    const newData = dates.map((date, index) => {
      // Add a trend factor to make the data look more realistic
      const trendFactor = 1 + (index / dates.length) * 0.5; // 50% growth over the period
      
      // For weekday variation
      const dayOfWeek = date.getDay();
      const weekdayFactor = [0.7, 0.9, 1.1, 1.2, 1.1, 0.8, 0.6][dayOfWeek]; // Weekend dip
      
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      // Platform-specific data
      const platforms: Record<string, number> = {
        twitter: generateValue(baseline * 0.8 * trendFactor * weekdayFactor, variance),
        instagram: generateValue(baseline * 1.2 * trendFactor * weekdayFactor, variance),
        linkedin: generateValue(baseline * 0.7 * trendFactor * weekdayFactor, variance),
        facebook: generateValue(baseline * 0.9 * trendFactor * weekdayFactor, variance),
        tiktok: generateValue(baseline * 1.4 * trendFactor * weekdayFactor, variance)
      };
      
      if (platformFilter === 'all') {
        return {
          date: formattedDate,
          twitter: platforms.twitter,
          instagram: platforms.instagram,
          linkedin: platforms.linkedin,
          facebook: platforms.facebook,
          tiktok: platforms.tiktok,
          total: Object.values(platforms).reduce((a, b) => a + b, 0)
        };
      } else {
        return {
          date: formattedDate,
          value: platforms[platformFilter] || 0
        };
      }
    });
    
    setData(newData);
  }, [dateRange, metricType, platformFilter]);
  
  // Color scheme for platforms
  const colors = {
    twitter: '#1DA1F2',
    instagram: '#E1306C',
    linkedin: '#0077B5',
    facebook: '#4267B2',
    tiktok: '#000000',
    total: '#8884d8',
    value: '#82ca9d'
  };
  
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toString();
    }
  };
  
  const formatTooltipValue = (value: any, name: string) => {
    const formattedValue = formatValue(value);
    const formattedName = name === 'value' 
      ? platformFilter.charAt(0).toUpperCase() + platformFilter.slice(1) 
      : name.charAt(0).toUpperCase() + name.slice(1);
    
    return [formattedValue, formattedName];
  };
  
  // Determine what lines to show based on the platform filter
  const renderLines = () => {
    if (platformFilter === 'all') {
      return (
        <>
          <Area 
            type="monotone" 
            dataKey="twitter" 
            stroke={colors.twitter} 
            fill={colors.twitter} 
            fillOpacity={0.2}
            stackId="1"
          />
          <Area 
            type="monotone" 
            dataKey="instagram" 
            stroke={colors.instagram} 
            fill={colors.instagram} 
            fillOpacity={0.2}
            stackId="1"
          />
          <Area 
            type="monotone" 
            dataKey="linkedin" 
            stroke={colors.linkedin} 
            fill={colors.linkedin} 
            fillOpacity={0.2}
            stackId="1"
          />
          <Area 
            type="monotone" 
            dataKey="facebook" 
            stroke={colors.facebook} 
            fill={colors.facebook} 
            fillOpacity={0.2}
            stackId="1"
          />
          <Area 
            type="monotone" 
            dataKey="tiktok" 
            stroke={colors.tiktok} 
            fill={colors.tiktok} 
            fillOpacity={0.2}
            stackId="1"
          />
        </>
      );
    } else {
      return (
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={colors[platformFilter as keyof typeof colors] || colors.value} 
          fill={colors[platformFilter as keyof typeof colors] || colors.value} 
          fillOpacity={0.2}
        />
      );
    }
  };
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            // Only show a portion of dates to avoid overcrowding
            interval={Math.max(1, Math.floor(data.length / 10))}
          />
          <YAxis 
            tickFormatter={formatValue}
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip 
            formatter={formatTooltipValue}
            contentStyle={{ 
              borderRadius: '6px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          {renderLines()}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}