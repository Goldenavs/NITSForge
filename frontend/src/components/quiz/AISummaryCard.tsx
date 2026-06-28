// src/components/quiz/AISummaryCard.tsx
import { useState } from 'react';
import { Bot, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useQuizStore } from '../../store/useQuizStore';
import { supabase } from '../../services/supabase';

export function AISummaryCard() {
  const { questions, score, selectedAnswers } = useQuizStore();
  const [debrief, setDebrief] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch('http://localhost:5000/api/ai/debrief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          score,
          total: questions.length,
          questions,
          selectedAnswers
        })
      });

      if (!res.ok) throw new Error("Failed to fetch debrief");
      const data = await res.json();
      setDebrief(data.debrief);
    } catch (error) {
      console.error(error);
      setDebrief("Failed to generate debrief. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden bg-surface/85 backdrop-blur-md border border-amber-500/30 shadow-lg group">
      {/* Flash Gradient Edge */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-orange-500" />
      
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
        
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
          <Bot className="w-6 h-6 text-amber-500" />
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-display font-bold text-lg sm:text-xl text-text-main leading-none pt-1">
              Flash Debrief
            </h3>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-orbitron tracking-widest text-[9px] uppercase">
              Gemini AI
            </Badge>
          </div>
          
          {!debrief && !isLoading ? (
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-text-muted leading-relaxed">
                Want a personalized breakdown of your performance? Deploy Gemini Flash for an instant debrief.
              </p>
              <Button 
                variant="outline" 
                onClick={handleGenerate}
                className="shrink-0 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
              >
                Generate Debrief
              </Button>
            </div>
          ) : isLoading ? (
            <div className="mt-4 flex items-center gap-2 text-amber-500 text-sm animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing performance data...
            </div>
          ) : (
            <div className="text-sm text-text-main leading-relaxed">
              <MarkdownRenderer>{debrief || ""}</MarkdownRenderer>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}