// src/components/landing/FAQSection.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "Is NITSForge completely free?",
    a: "Yes! The core engine and mock exams are entirely free. We believe every aspiring IT professional in the Philippines should have access to quality PhilNITS prep material."
  },
  {
    q: "Are these real PhilNITS FE questions?",
    a: "Our database is built from officially released ITPEC/PhilNITS Fundamentals of IT Engineers (FE) past examinations to ensure the highest fidelity."
  },
  {
    q: "How does the Forge AI Companion work?",
    a: "Forge uses Google's Gemini AI to dynamically explain incorrect answers, break down complex algorithms, and provide hints without giving away the answer immediately."
  },
  {
    q: "Can I use NITSForge on my phone?",
    a: "Absolutely. The platform is fully responsive so you can review mock exams and check your analytics on the go."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="py-24 px-6 lg:px-16 border-t border-borderline/30">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-main mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-text-muted">Everything you need to know about the platform.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-surface-2 border-primary/30' : 'bg-surface border-borderline hover:border-borderline/80'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`font-bold font-display ${isOpen ? 'text-primary' : 'text-text-main'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-text-muted text-sm leading-relaxed border-t border-borderline/50 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
