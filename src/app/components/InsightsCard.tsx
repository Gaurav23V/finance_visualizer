'use client';

import * as React from 'react';
import { Insight, InsightType } from '@/lib/utils/insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightsCardProps {
  insights: Insight[];
}

const insightConfig: {
  [key in InsightType]: { icon: React.ElementType; color: string };
} = {
  warning: { icon: AlertCircle, color: 'text-red-500' },
  success: { icon: CheckCircle2, color: 'text-green-500' },
  info: { icon: Info, color: 'text-blue-500' },
};

export function InsightsCard({ insights }: InsightsCardProps) {
  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent className='h-[400px] flex items-center justify-center'>
          <p className='text-muted-foreground'>
            No insights to display for this period.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {insights.slice(0, 5).map((insight, index) => {
          const { icon: Icon, color } = insightConfig[insight.type];
          return (
            <div key={index} className='flex items-start space-x-3'>
              <Icon className={cn('mt-1 h-5 w-5 flex-shrink-0', color)} />
              <div className='flex-1'>
                <p className='font-semibold'>{insight.title}</p>
                <p className='text-sm text-muted-foreground'>
                  {insight.description}
                </p>
              </div>
              <ChevronRight className='h-5 w-5 text-muted-foreground self-center' />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
