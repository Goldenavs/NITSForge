import { FileText, ExternalLink, Download } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface ExamMaterialCardProps {
  title: string;
  questionsUrl: string;
  answersUrl: string;
}

export function ExamMaterialCard({ title, questionsUrl, answersUrl }: ExamMaterialCardProps) {
  return (
    <Card className="w-full shrink-0 sm:w-[280px] bg-surface/80 backdrop-blur-sm border border-borderline hover:border-primary/50 transition-all duration-300 group overflow-hidden relative">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <CardContent className="p-5 flex flex-col h-full relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-text-main text-lg tracking-tight">
            {title}
          </h3>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <a
            href={questionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-surface-2 border border-borderline hover:border-primary/50 hover:bg-primary/5 text-text-muted hover:text-primary transition-all group/btn"
          >
            <span className="font-orbitron text-[10px] tracking-widest font-bold uppercase">Questions PDF</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover/btn:opacity-100 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-all" />
          </a>
          <a
            href={answersUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-surface-2 border border-borderline hover:border-accent/50 hover:bg-accent/5 text-text-muted hover:text-accent transition-all group/btn"
          >
            <span className="font-orbitron text-[10px] tracking-widest font-bold uppercase">Answers PDF</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover/btn:opacity-100 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-all" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
