// src/components/ui/Card.tsx
import { type HTMLAttributes, forwardRef } from 'react';

// The main container (Glassmorphic & Theme Aware)
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-surface/80 backdrop-blur-md border border-borderline rounded-2xl shadow-sm overflow-hidden transition-colors duration-300 ${className}`}
      {...props}
    />
  )
);
Card.displayName = 'Card';

// The Header Section
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-6 flex flex-col space-y-1.5 ${className}`} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

// The Standardized Title
export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => (
    <h3 ref={ref} className={`text-xl font-bold font-display tracking-tight text-text-main ${className}`} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

// The Body Content
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 text-text-main ${className}`} {...props} />
  )
);
CardContent.displayName = 'CardContent';