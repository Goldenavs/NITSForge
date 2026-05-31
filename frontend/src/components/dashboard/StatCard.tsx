// src/components/dashboard/StatCard.tsx
import { Card, CardContent } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  colorClass: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, colorClass }: StatCardProps) {
  return (
    /* Glass Effect: Added bg-surface/40 and backdrop-blur-md */
    <Card className="overflow-hidden bg-surface/85 backdrop-blur-sm border border-borderline/60 group hover:border-primary/40 transition-all duration-300 shadow-sm">
      <CardContent className="p-5 sm:p-6 flex items-center gap-4 relative">
        
        {/* Vertically centered icon container */}
        <div className={`p-3.5 rounded-2xl border ${colorClass} bg-surface-2/60 backdrop-blur-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-xs font-bold font-display text-text-muted uppercase tracking-widest leading-none mb-1.5">{title}</p>
          
          {/* Fix alignment: flex container with items-baseline & leading-none prevents top-clipping */}
          <div className="flex items-baseline flex-wrap gap-1.5 content-center">
            <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-text-main tracking-tight leading-none pt-1">
              {value}
            </h2>
            {trendValue && (
              <span className={`text-[10px] sm:text-xs font-orbitron font-bold leading-none ${
                trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-text-muted'
              }`}>
                {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '■'} {trendValue}
              </span>
            )}
          </div>
          
          <p className="text-[11px] sm:text-xs text-text-muted mt-1.5 leading-none truncate">{subtitle}</p>
        </div>

        {/* Dynamic Glow Layer */}
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-current opacity-[0.03] blur-2xl rounded-full pointer-events-none" />
      </CardContent>
    </Card>
  );
}