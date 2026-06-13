// src/components/landing/CoreEngineSection.tsx
import { motion } from 'framer-motion';
import { Database, Cpu, BrainCircuit } from 'lucide-react';

export function CoreEngineSection() {
  return (
    <section id="core-engine" className="py-24 px-6 lg:px-16 bg-surface-2/30 relative border-t border-borderline/30">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl mb-6">
            <Database className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-text-main mb-4">
            Powered by the <span className="text-accent">Core Engine</span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            A massive database of official past PhilNITS FE exam questions, meticulously categorized and continuously fed into our adaptive testing algorithm.
          </p>
        </motion.div>

        {/* The Big Flowchart Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="w-full aspect-[4/3] md:aspect-[3/2] lg:aspect-[12/8] bg-surface border border-borderline rounded-3xl shadow-2xl overflow-hidden relative group"
        >
          {/* Decorative subtle background grid */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <Cpu className="w-12 h-12 text-text-muted/30 mb-4 group-hover:text-accent group-hover:scale-110 transition-all duration-500" />
            <p className="font-orbitron font-bold text-text-muted/60 tracking-widest uppercase mb-2">
              [ Flowchart / Diagram Placeholder ]
            </p>
            <p className="text-sm text-text-muted/40 max-w-md">
              Draw a cool Canva diagram showing how questions flow from the database to the adaptive engine to the user.
              <br />
              Recommended Size: 1200x800 px
            </p>
          </div>
        </motion.div>

        {/* Engine Stats / Sub-features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: <Database />, title: "1000+ Questions", desc: "Sourced from real ITPEC/PhilNITS exams from 2010 to present." },
            { icon: <BrainCircuit />, title: "Adaptive Spacing", desc: "The engine remembers your mistakes and re-tests weak points." },
            { icon: <Cpu />, title: "Zero Lag", desc: "Built on a modern React + Supabase edge architecture." }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-10 h-10 mx-auto bg-borderline/50 rounded-lg flex items-center justify-center text-text-main mb-4">
                {stat.icon}
              </div>
              <h4 className="font-bold text-text-main mb-2">{stat.title}</h4>
              <p className="text-sm text-text-muted">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
