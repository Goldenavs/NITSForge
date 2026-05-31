// src/components/dashboard/AIWeeklyReport.tsx
import { Sparkles, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export function AIWeeklyReport() {
  return (
    /* Responsive Glassmorphic Premium Panel */
    <Card className="relative overflow-hidden bg-surface/40 backdrop-blur-md border border-primary/30 shadow-md">
      <div className="absolute top-0 left-0 w-1 lg:w-1.5 h-full bg-gradient-to-b from-primary to-accent" />
      
      {/* Mobile Priority: flex-col items-stretch -> lg:flex-row items-center */}
      <CardContent className="p-5 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-5 lg:gap-6 items-stretch lg:items-center">
        
        <div className="flex items-center gap-4 lg:gap-6 flex-1">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Flex alignment layout to prevent title elements from clashing vertically */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3 className="font-display font-bold text-base sm:text-lg text-text-main leading-none pt-0.5">
                Forge Weekly Debrief
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-orbitron font-bold bg-surface-2 border border-borderline text-text-muted uppercase tracking-widest leading-none">
                Week of May 24
              </span>
            </div>
            <p className="text-text-muted leading-relaxed text-xs sm:text-sm">
              "You've shown exceptional consistency this week, raising your overall accuracy by 4%[cite: 3]. Your grasp of <strong className="text-primary font-medium">Data Structures</strong> is rock solid, but you are consistently struggling with Subnetting in the <strong className="text-primary font-medium">Networking</strong> category[cite: 3]. Let's run a targeted drill today to patch that gap."[cite: 3]
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
          <Button className="w-full lg:w-auto font-orbitron tracking-wider text-xs py-3">
            Generate Study Plan <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}