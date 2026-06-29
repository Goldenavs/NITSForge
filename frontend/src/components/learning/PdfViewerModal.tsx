import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckSquare, Download, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: {
    id: string;
    title: string;
    qUrl: string;
    aUrl: string;
  } | null;
}

export function PdfViewerModal({ isOpen, onClose, exam }: PdfViewerModalProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'answers'>('questions');

  if (!isOpen || !exam) return null;

  const currentUrl = activeTab === 'questions' ? exam.qUrl : exam.aUrl;
  const hasAnswers = Boolean(exam.aUrl);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative flex flex-col w-full h-full max-w-6xl bg-surface-1 border border-borderline/50 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-borderline/50 bg-surface-2/30 backdrop-blur-md gap-4">
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-main font-display leading-none">{exam.title}</h2>
                <p className="text-xs text-text-muted mt-1">PhilNITS Past Examination</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6 w-full sm:w-auto">
              {/* Tabs */}
              <div className="flex p-1 bg-surface-3/30 rounded-lg flex-1 sm:flex-none">
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'questions' 
                      ? 'bg-surface-1 text-primary shadow-sm' 
                      : 'text-text-muted hover:text-text-main hover:bg-surface-2/50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Questions
                </button>
                <button
                  onClick={() => setActiveTab('answers')}
                  disabled={!hasAnswers}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    !hasAnswers ? 'opacity-50 cursor-not-allowed' :
                    activeTab === 'answers' 
                      ? 'bg-surface-1 text-primary shadow-sm' 
                      : 'text-text-muted hover:text-text-main hover:bg-surface-2/50'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Answers
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pl-2 sm:pl-6 border-l border-borderline/50">
                <a href={currentUrl} download target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-text-muted hover:text-text-main hover:bg-surface-2/50">
                    <Download className="w-4 h-4" />
                  </Button>
                </a>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-text-muted hover:text-text-main hover:bg-surface-2/50">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="h-9 w-9 text-text-muted hover:text-error hover:bg-error/10 ml-1"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* PDF Viewer Body */}
          <div className="flex-1 w-full bg-surface-2/10 relative">
            {!currentUrl ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>No document available for this tab.</p>
              </div>
            ) : (
              <object
                data={`${currentUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted p-8 text-center gap-4">
                  <p>Your browser does not support inline PDFs.</p>
                  <a href={currentUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary">Download PDF</Button>
                  </a>
                </div>
              </object>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
