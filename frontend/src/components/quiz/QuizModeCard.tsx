// src/components/quiz/QuizModeCard.tsx
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface QuizModeCardProps {
  title: string;
  description: string;
  icon: any;
  tags: string[];
  colorClass: string;
  path: string;
  isPopular?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function QuizModeCard({ title, description, icon: Icon, tags, colorClass, path, isPopular, onClick }: QuizModeCardProps) {
  return (
    <Link to={path} className="block group h-full" onClick={onClick}>
      <Card className="relative h-full overflow-hidden bg-surface/85 backdrop-blur-sm border border-borderline/60 group-hover:border-primary/40 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 flex flex-col">
        
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
          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.map((tag) => (
              <Badge key={tag} className="bg-surface-2/80 text-text-muted border-borderline/50 font-orbitron text-[9px] tracking-wider uppercase">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        {/* Subtle Ambient Glow on Hover */}
        <div className={`absolute -right-8 -bottom-8 w-40 h-40 ${colorClass.split(' ')[0]} opacity-[0.02] blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity duration-500`} />
      </Card>
    </Link>
  );
}