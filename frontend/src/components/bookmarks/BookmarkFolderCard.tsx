// src/components/bookmarks/BookmarkFolderCard.tsx
import { motion, type Variants } from 'framer-motion';
import { Folder, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';

interface BookmarkFolderCardProps {
  folder: {
    id: string;
    title: string;
    count: number;
    colorClass: string;
    bgClass: string;
  };
  fadeUpVariant: Variants;
}

export function BookmarkFolderCard({ folder, fadeUpVariant }: BookmarkFolderCardProps) {
  return (
    <motion.div variants={fadeUpVariant} className="h-full">
      <Link to={`/bookmarks/${folder.id}`}>
        <Card className="h-full bg-surface/85 backdrop-blur-md border border-borderline/60 hover:border-primary/40 hover:bg-surface transition-all duration-300 group cursor-pointer overflow-hidden relative">
          
          {/* Subtle colored top edge */}
          <div className={`absolute top-0 left-0 w-full h-1 ${folder.bgClass.split('/')[0]} opacity-50`} />

          <div className="p-5 flex flex-col h-full relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${folder.bgClass}`}>
                <Folder className={`w-6 h-6 ${folder.colorClass}`} fill="currentColor" fillOpacity={0.2} />
              </div>
              <button className="text-text-muted hover:text-text-main p-1 rounded-md transition-colors" onClick={(e) => e.preventDefault()}>
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-auto">
              <h3 className="font-display font-bold text-lg text-text-main leading-none pt-1 mb-2 group-hover:text-primary transition-colors">
                {folder.title}
              </h3>
              <p className="text-xs font-orbitron text-text-muted uppercase tracking-widest font-bold leading-none pt-0.5">
                {folder.count} Items
              </p>
            </div>
          </div>
          
          {/* Background Glow */}
          <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none ${folder.bgClass.split('/')[0]}`} />
        </Card>
      </Link>
    </motion.div>
  );
}