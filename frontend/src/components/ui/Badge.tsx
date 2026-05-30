// src/components/ui/Badge.tsx
import { type HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors";
    
    // We use the CSS variables mapped in our theme engine
    const variants = {
      primary: "bg-primary/15 text-primary border border-primary/20",
      secondary: "bg-surface-2 text-text-muted border border-borderline",
      success: "bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20",
      warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20", // Great for XP/Streaks
      danger: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20",
      outline: "text-text-muted border border-borderline",
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';