import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div 
      className={cn("bento-card p-4 flex flex-col justify-between transition-all", className)} 
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gold',
  size?: 'sm' | 'md' | 'lg' | 'icon'
}) {
  const variants = {
    primary: "bg-navy text-primary-foreground hover:opacity-90 shadow-[0_10px_15px_-3px_rgba(0,31,63,0.3)] font-semibold",
    secondary: "bg-muted text-foreground hover:bg-border",
    outline: "bg-transparent border border-border hover:bg-muted text-foreground font-medium",
    ghost: "bg-transparent hover:bg-muted text-muted-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90 shadow-[0_10px_15px_-3px_rgba(239,68,68,0.3)]",
    gold: "bg-gold text-navy hover:opacity-90 shadow-[0_10px_15px_-3px_rgba(212,175,55,0.3)] font-bold uppercase tracking-wider"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base font-bold",
    icon: "p-2.5"
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )} 
      {...props} 
    />
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={cn(
        "w-full px-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label 
      className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block", className)} 
      {...props} 
    />
  );
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select 
      className={cn(
        "w-full px-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all appearance-none",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
