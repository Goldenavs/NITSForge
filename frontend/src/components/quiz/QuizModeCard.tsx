// src/components/quiz/QuizModeCard.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useQuizStore } from '../../store/useQuizStore';

interface QuizModeCardProps {
  modeId: string;
  title: string;
  description: string;
  icon: any;
  tags: string[];
  colorClass: string;
  isPopular?: boolean;
  isIntimidating?: boolean;
  configType?: 'count' | 'topic' | 'date' | 'none';
  onStart: (config?: any) => void;
  onConfigure?: (type: 'topic' | 'date') => void;
  actionText?: string;
}

export function QuizModeCard({ modeId, title, description, icon: Icon, tags, colorClass, isPopular, isIntimidating, configType = 'none', onStart, onConfigure, actionText = "Start Quiz" }: QuizModeCardProps) {
  const { status, mode: activeMode, questions } = useQuizStore();
  const isActive = status === 'in-progress' && activeMode === modeId;
  
  const [questionCount, setQuestionCount] = useState(30);

  // Sync the local state with the active session if this card represents the active mode
  useEffect(() => {
    if (isActive && questions.length > 0) {
      setQuestionCount(questions.length);
    }
  }, [isActive, questions.length]);

  const handleStart = () => {
    const config: any = {};
    if (configType === 'count') config.questionCount = questionCount;
    onStart(config);
  };

  return (
    <div className="block h-full group relative">
      <style>{`
        @keyframes shineOneWay {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .group:hover .shine-one-way {
          animation: shineOneWay 1s ease-out forwards;
        }
        @keyframes warningStripes {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
        .warning-border {
          background-image: linear-gradient(
            45deg,
            rgba(220, 38, 38, 0.45) 25%,
            transparent 25%,
            transparent 50%,
            rgba(220, 38, 38, 0.45) 50%,
            rgba(220, 38, 38, 0.45) 75%,
            transparent 75%,
            transparent
          );
          background-size: 40px 40px;
          animation: warningStripes 1.5s linear infinite;
        }
      `}</style>

      <Card className={`relative h-full overflow-hidden bg-surface/85 backdrop-blur-sm transition-all duration-300 flex flex-col shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 ${isIntimidating ? 'border-2 border-red-900/50 hover:border-red-600/80 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:bg-red-950/10' : 'border border-borderline/60 hover:border-primary/40'}`}>

        {/* Shine Effect (One Way) */}
        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] z-20 pointer-events-none shine-one-way" />
        
        {/* Intimidating Warning Strip */}
        {isIntimidating && (
          <div className="absolute top-0 left-0 w-full h-1.5 warning-border z-20 opacity-70 group-hover:opacity-100 transition-opacity" />
        )}

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
          <div className="flex flex-col gap-3 relative z-30">
            {configType === 'count' && (
              <div className="flex bg-surface-2 p-1 rounded-lg border border-borderline/50 relative">
                {[10, 20, 30].map(num => (
                  <button
                    key={num}
                    onClick={() => !isActive && setQuestionCount(num)}
                    disabled={isActive}
                    className={`flex-1 py-1.5 text-xs font-orbitron font-bold rounded-md transition-colors relative z-10 ${isActive ? 'opacity-50 cursor-not-allowed' : ''} ${questionCount === num ? 'text-surface' : 'text-text-muted hover:text-text-main'}`}
                  >
                    {questionCount === num && (
                      <motion.div
                        layoutId={`activePill-${title.replace(/\s+/g, '')}`}
                        className="absolute inset-0 bg-primary rounded-md shadow-sm -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    {num} Qs
                  </button>
                ))}
              </div>
            )}

            {configType === 'topic' && (
              <Button 
                variant="outline" 
                className={`w-full text-xs py-2 h-auto font-orbitron border-dashed ${isActive ? 'opacity-50 cursor-not-allowed' : 'text-text-muted hover:text-text-main'}`} 
                onClick={() => !isActive && onConfigure?.('topic')}
                disabled={isActive}
              >
                Configure Topics...
              </Button>
            )}

            {configType === 'date' && (
              <Button 
                variant="outline" 
                className={`w-full text-xs py-2 h-auto font-orbitron border-dashed ${isActive ? 'opacity-50 cursor-not-allowed' : 'text-text-muted hover:text-text-main'}`} 
                onClick={() => !isActive && onConfigure?.('date')}
                disabled={isActive}
              >
                Select Exam Dates...
              </Button>
            )}

            {/* Start / Configure Button */}
            <Button
              variant={isActive ? "primary" : "outline"}
              onClick={handleStart}
              className={`w-full font-orbitron uppercase tracking-widest text-xs py-4 transition-all duration-300 ${isActive ? '' : colorClass.split(' ')[0]} border-borderline ${!isActive && 'hover:bg-primary hover:text-surface hover:border-primary hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)]'}`}
            >
              {isActive ? "Resume Session" : actionText}
            </Button>
          </div>
        </CardContent>

        {/* Subtle Ambient Glow on Hover */}
        <div className={`absolute -right-8 -bottom-8 w-40 h-40 ${colorClass.split(' ')[0]} opacity-[0.02] blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity duration-500`} />
      </Card>
    </div>
  );
}