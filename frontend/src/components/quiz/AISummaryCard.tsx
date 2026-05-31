// src/components/quiz/AISummaryCard.tsx
import { Zap } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function AISummaryCard() {
  return (
    <Card className="relative overflow-hidden bg-surface/85 backdrop-blur-md border border-amber-500/30 shadow-lg group">
      {/* Flash Gradient Edge */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-orange-500" />
      
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
        
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
          <Zap className="w-6 h-6 text-amber-500 fill-amber-500/20" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-display font-bold text-lg sm:text-xl text-text-main leading-none pt-1">
              Flash Debrief
            </h3>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-orbitron tracking-widest text-[9px] uppercase">
              Gemini AI
            </Badge>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            "Solid performance. You nailed the Data Structures questions with 100% accuracy. However, you missed 2 questions on IPv4 Subnetting. Review the difference between CIDR notation and default class masks before your next drill."
          </p>
        </div>

      </CardContent>
    </Card>
  );
}