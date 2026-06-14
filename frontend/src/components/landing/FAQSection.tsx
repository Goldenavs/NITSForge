import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, MessageCircleQuestion } from 'lucide-react';

const faqCategories: Record<string, {q: string, a: string}[]> = {
  "General": [
    {
      q: "Is NITSForge completely free?",
      a: "Yes! The core engine and mock exams are entirely free. We believe every aspiring IT professional in the Philippines should have access to quality PhilNITS prep material without paywalls."
    },
    {
      q: "What exactly is the PhilNITS FE exam?",
      a: "The Fundamentals of IT Engineers (FE) is an internationally recognized certification exam that tests foundational IT knowledge, data structures, algorithms, and project management skills."
    },
    {
      q: "Do I need to create an account to practice?",
      a: "While you can browse some features as a guest, creating a free account allows you to save your progress, unlock the Adaptive Engine, track analytics, and earn XP on the leaderboard."
    }
  ],
  "Exams & Content": [
    {
      q: "Are these real PhilNITS FE questions?",
      a: "Yes! Our massive database is meticulously built directly from officially released ITPEC/PhilNITS past examinations to ensure the highest possible fidelity and accuracy."
    },
    {
      q: "Does the platform cover both Morning and Afternoon sessions?",
      a: "Currently, NITSForge focuses heavily on mastering the Morning Session (multiple-choice theory, math, and concepts). Afternoon session logic and programming simulators are planned for future updates!"
    },
    {
      q: "Can I take a timed mock exam?",
      a: "Absolutely. The platform features a Full Mock Exam mode that strictly enforces the actual 150-minute time limit, allowing you to build real exam stamina."
    }
  ],
  "Tech & AI": [
    {
      q: "How does the Forge AI Companion work?",
      a: "Forge acts as your personal tutor. It uses Google's advanced Gemini AI to dynamically explain incorrect answers, break down complex math, and provide Socratic hints without just giving you the answer."
    },
    {
      q: "Can I use NITSForge on my smartphone?",
      a: "Definitely. The platform is built on a responsive React architecture, meaning you can comfortably review flashcards and mock exams while commuting on your phone."
    },
    {
      q: "Is my personal data secure?",
      a: "Yes. NITSForge runs on a highly secure Supabase edge architecture utilizing strict Row Level Security (RLS) policies. Your data, analytics, and history are completely private."
    }
  ]
};

const categoryNames = Object.keys(faqCategories);

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>(categoryNames[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const activeFaqs = faqCategories[activeCategory];

  return (
    <section id="faqs" className="py-24 px-6 lg:px-16 border-t border-borderline/30 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
            <MessageCircleQuestion className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-text-main mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-text-muted">Everything you need to know about the Forge.</p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categoryNames.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(0); // auto-open first item on switch
                }}
                className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive ? 'text-background' : 'text-text-muted hover:text-text-main hover:bg-surface-2'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="faq-active-tab"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {activeFaqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <motion.div 
                    key={i}
                    className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-surface-2 border-primary/30 shadow-md' : 'bg-surface border-borderline hover:border-borderline/80'}`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className={`font-bold font-display text-base md:text-lg pr-8 ${isOpen ? 'text-primary' : 'text-text-main'}`}>
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-5 h-5 shrink-0 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-5 text-text-muted text-sm md:text-base leading-relaxed border-t border-borderline/50 pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Contact Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-surface-2/40 backdrop-blur-sm border border-borderline hover:border-primary/50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 transition-all duration-300 group"
        >
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-text-main group-hover:text-primary transition-colors">
              Still have questions?
            </h3>
            <p className="text-sm md:text-base text-text-muted mt-2">
              Our support team is here to help you conquer the FE exams.
            </p>
          </div>
          <a 
            href="mailto:support.nitsforge@gmail.com" 
            className="shrink-0 inline-flex items-center gap-3 px-6 py-3 bg-surface border border-borderline group-hover:border-primary/50 text-text-main font-bold rounded-xl hover:bg-primary hover:text-background hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            support.nitsforge@gmail.com
          </a>
        </motion.div>

      </div>
    </section>
  );
}
