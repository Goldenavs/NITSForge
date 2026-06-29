import { FileText, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface ExamMaterialCardProps {
  title: string;
  onClick: () => void;
}

export function ExamMaterialCard({ title, onClick }: ExamMaterialCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="w-full bg-surface/60 backdrop-blur-md border border-borderline hover:border-primary/50 transition-all duration-300 group overflow-hidden relative cursor-pointer shadow-sm hover:shadow-primary/10 hover:-translate-y-1"
    >
      {/* Folder Tab Effect */}
      <div className="absolute top-0 left-0 w-1/3 h-1.5 bg-borderline group-hover:bg-primary/50 transition-colors" />
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <CardContent className="p-5 flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
          <FolderOpen className="w-6 h-6 group-hover:hidden" />
          <FileText className="w-6 h-6 hidden group-hover:block" />
        </div>
        
        <div className="flex flex-col flex-1">
          <h3 className="font-display font-bold text-text-main text-lg tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">PhilNITS Past Exam</p>
        </div>
        
        <div className="px-3 py-1 bg-surface-2 rounded-full border border-borderline text-[10px] uppercase font-orbitron tracking-widest text-text-muted group-hover:border-primary/30 group-hover:text-primary transition-colors">
          View
        </div>
      </CardContent>
    </Card>
  );
}
