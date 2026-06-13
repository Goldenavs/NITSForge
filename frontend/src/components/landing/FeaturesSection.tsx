// src/components/landing/FeaturesSection.tsx
import { motion, type Variants } from 'framer-motion';
import { Target, Zap, Trophy, Sparkles } from 'lucide-react';

const features = [
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: "Full Mock Exams",
    desc: "Experience the real PhilNITS FE pressure with timed, syllabus-accurate mock exams."
  },
  {
    icon: <Zap className="w-6 h-6 text-accent" />,
    title: "Deep Analytics",
    desc: "Radar charts map out your strengths and weaknesses across all 8 major domains."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    title: "Forge AI Companion",
    desc: "Stuck? Get immediate, contextual hints and explanations from our dedicated AI tutor."
  },
  {
    icon: <Trophy className="w-6 h-6 text-green-500" />,
    title: "Gamified Learning",
    desc: "Earn XP, unlock badges, and maintain streaks to keep your motivation sky-high."
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 lg:px-16 border-t border-borderline/30 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-text-main mb-4">
            Everything you need. <br className="hidden lg:block" />
            <span className="text-text-muted">Nothing you don't.</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full" />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feat, i) => (
            <motion.div 
              key={i}
              variants={cardVariants}
              className="group bg-surface-2/40 hover:bg-surface border border-borderline hover:border-primary/50 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-surface border border-borderline flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-text-main mb-2 group-hover:text-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    {feat.desc}
                  </p>
                  
                  {/* Placeholder for Spot Illustration */}
                  <div className="w-full aspect-square max-w-[200px] mx-auto bg-background/50 border border-dashed border-borderline rounded-xl flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-[10px] font-orbitron font-bold text-text-muted/60 uppercase tracking-widest">
                        Spot Art Placeholder
                      </p>
                      <p className="text-[10px] text-text-muted/40 mt-1">400x400 px</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
