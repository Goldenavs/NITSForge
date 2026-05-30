// src/components/ui/Button.tsx
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    // Base styles: Premium font, centering, and satisfying click-scale physics
    const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100";
    
    // Theme-aware variants
    const variants = {
      primary: "bg-primary text-surface hover:bg-primary-dark shadow-sm shadow-primary/25",
      secondary: "bg-surface-2 text-text-main hover:bg-borderline border border-transparent",
      ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-surface-2",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/25",
      outline: "bg-transparent text-text-main border-2 border-borderline hover:border-text-muted",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';