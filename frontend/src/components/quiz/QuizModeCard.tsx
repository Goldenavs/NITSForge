// src/components/quiz/QuizModeCard.tsx
import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface QuizModeCardProps {
  title: string;
  description: string;
  icon: any;
  tags: string[];
  colorClass: string;
  isPopular?: boolean;
  configType?: 'count' | 'topic' | 'date' | 'none';
  onStart: (config?: any) => void;
  actionText?: string;
}

export function QuizModeCard({ title, description, icon: Icon, tags, colorClass, isPopular, configType = 'none', onStart, actionText = "Start Quiz" }: QuizModeCardProps) {
  const [questionCount, setQuestionCount] = useState(30);

  const handleStart = () => {
    const config: any = {};
    if (configType === 'count') config.questionCount = questionCount;
    onStart(config);
  };

  return (
    <div className="block h-full group">
      <Card className="relative h-full overflow-hidden bg-surface/85 backdrop-blur-sm border border-borderline/60 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col">
        
        {/* Popular / Recommended Tag */}
        {isPopular && (
          <div className="absolute top-0 right-0 z-20">
            <span className="bg-primary text-surface text-[9px] font-orbitron uppercase tracking-widest py-1.5 px-3 rounded-bl-xl font-bold shadow-sm">
              Recommended
            </span>
          </div>
        )}

        {/* Added slightly more top padding for extra breathing room */}
        <CardContent className="p-6 pt-7 flex flex-col flex-1 relative z-10">
          
          {/* Icon Container 
              FIX: Added `mt-1` (top margin) and `self-start` to prevent flex stretching and top-clipping 
          */}
          <div className={`w-12 h-12 mt-1 self-start rounded-2xl border ${colorClass} bg-surface-2/60 backdrop-blur-sm flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0`}>
            <Icon className="w-6 h-6" strokeWidth={1.5} />
          </div>
          
          {/* Text Content */}
          <h3 className="text-xl sm:text-2xl font-display font-bold text-text-main mb-2 leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-text-muted mb-6 leading-relaxed flex-1">
            {description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto mb-5">
            {tags.map((tag) => (
              <Badge key={tag} className="bg-surface-2/80 text-text-muted border-borderline/50 font-orbitron text-[9px] tracking-wider uppercase">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Inline Controls */}
          <div className="flex flex-col gap-3">
            {configType === 'count' && (
              <div className="flex bg-surface-2 p-1 rounded-lg border border-borderline/50">
                {[10, 20, 30].map(num => (
                  <button 
                    key={num}
                    onClick={() => setQuestionCount(num)}
                    className={`flex-1 py-1.5 text-xs font-orbitron font-bold rounded-md transition-all ${questionCount === num ? 'bg-primary text-surface shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-surface'}`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            )}

            {configType === 'topic' && (
              <Button variant="outline" className="w-full text-xs py-2 h-auto font-orbitron border-dashed text-text-muted hover:text-text-main" onClick={() => {}}>
                Configure Topics...
              </Button>
            )}
            
            {configType === 'date' && (
              <Button variant="outline" className="w-full text-xs py-2 h-auto font-orbitron border-dashed text-text-muted hover:text-text-main" onClick={() => {}}>
                Select Exam Dates...
              </Button>
            )}

            <Button 
              variant="outline" 
              className={`w-full font-orbitron uppercase tracking-widest text-xs py-4 transition-all duration-300 ${colorClass.split(' ')[0]} border-borderline hover:bg-primary hover:text-surface hover:border-primary hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)]`}
              onClick={handleStart}
            >
              {actionText}
            </Button>
          </div>
        </CardContent>

        {/* Subtle Ambient Glow on Hover */}
        <div className={`absolute -right-8 -bottom-8 w-40 h-40 ${colorClass.split(' ')[0]} opacity-[0.02] blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity duration-500`} />
      </Card>
    </div>
  );
}