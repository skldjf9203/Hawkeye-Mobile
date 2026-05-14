import React from 'react';
import { Card } from '@/components/ui/core';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  color?: 'navy' | 'gold' | 'green' | 'red' | 'blue';
  className?: string;
}

export function DashboardCard({ title, value, icon, subtitle, color = 'navy', className }: DashboardCardProps) {
  const colorMap = {
    navy: 'bg-navy text-primary-foreground',
    gold: 'bg-gold text-navy',
    green: 'bg-emerald-500 text-white',
    red: 'bg-rose-500 text-white',
    blue: 'bg-sky-500 text-white',
  };

  return (
    <Card className={cn("relative overflow-hidden p-5 bg-white group", className)}>
      <div className="flex flex-col h-full">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4 block whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </span>
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-3xl font-display font-extrabold text-navy leading-none">
              {value}
            </span>
            {subtitle && (
              <span className="text-[10px] font-bold text-emerald-500 mt-2 uppercase tracking-wider">
                {subtitle}
              </span>
            )}
          </div>
          {icon && (
            <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", colorMap[color])}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function EmptyState({ message = "No data found" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl text-muted-foreground">?</span>
      </div>
      <h3 className="text-lg font-medium text-navy">{message}</h3>
      <p className="text-sm text-muted-foreground mt-1 italic">Try adjusting your filters or adding a new record.</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <div className="w-12 h-12 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
      <span className="mt-4 text-sm font-medium text-navy/40 uppercase tracking-widest">Loading...</span>
    </div>
  );
}
