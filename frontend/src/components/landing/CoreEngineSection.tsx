import { motion } from 'framer-motion';
import { Database, Cpu, BrainCircuit, MonitorSmartphone, Server } from 'lucide-react';

const Node = ({ icon, label, color, bg, border, glow, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
    className="flex flex-col items-center z-10"
  >
    <div className={`relative w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl border flex items-center justify-center backdrop-blur-md transition-all duration-300 ${bg} ${border} ${glow}`}>
      <div className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full transition-transform duration-300 transform group-hover/node:scale-110 ${color}`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 px-3 py-1 rounded-full bg-surface-2 border border-borderline text-[10px] md:text-xs font-orbitron font-bold tracking-wider uppercase text-text-main shadow-md transition-colors group-hover/node:border-primary/50">
      {label}
    </div>
  </motion.div>
);

export function CoreEngineSection() {
  return (
    <section id="core-engine" className="py-24 px-6 lg:px-16 bg-surface-2/30 relative border-t border-borderline/30 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <Cpu className="w-4 h-4 text-accent mr-2" />
            <span className="text-xs font-bold font-orbitron tracking-widest text-accent uppercase">Under the Hood</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-text-main mb-4">
            Powered by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Core Engine</span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            A massive database of official past PhilNITS FE exam questions, meticulously categorized and continuously fed into our adaptive testing algorithm.
          </p>
        </motion.div>

        {/* The Animated Flowchart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="w-full h-80 md:h-[400px] bg-surface/50 backdrop-blur-sm border border-borderline rounded-3xl shadow-2xl relative group overflow-x-auto overflow-y-hidden custom-scrollbar"
        >
          {/* Scrollable container for mobile to prevent overlap */}
          <div className="min-w-[700px] w-full h-full relative">
            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] rounded-3xl pointer-events-none" />

            {/* SVG Connecting Lines & Particles */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base Dashed Line */}
              <line x1="15%" y1="50%" x2="85%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 6" className="opacity-50" />

              {/* Auto Particles Left to Center */}
              {[0, 1.5, 3].map((delay, i) => (
                <motion.circle
                  key={`left-${i}`}
                  cx="0" cy="50%" r="4" fill="var(--color-accent)"
                  filter="url(#glow)"
                  animate={{ cx: ["15%", "50%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay }}
                />
              ))}

              {/* Auto Particles Center to Right */}
              {[0, 1, 2].map((delay, i) => (
                <motion.circle
                  key={`right-${i}`}
                  cx="0" cy="50%" r="4" fill="var(--color-primary)"
                  filter="url(#glow)"
                  animate={{ cx: ["50%", "85%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay }}
                />
              ))}

            </svg>

            {/* Architecture Nodes */}
            <div className="absolute inset-0">
              {/* Node 1: Vault */}
              <div className="absolute left-[15%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group/node">
                <Node
                  delay={0.2}
                  icon={<Database />}
                  label="The Vault"
                  color="text-accent"
                  bg="bg-accent/5 group-hover/node:bg-accent/20"
                  border="border-accent/30 group-hover/node:border-accent/80"
                  glow="shadow-[0_0_40px_-10px_var(--color-accent)] group-hover/node:shadow-[0_0_60px_0px_var(--color-accent)]"
                />
              </div>

              {/* Node 2: Forge Engine */}
              <div className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group/node">
                <Node
                  delay={0.4}
                  icon={<BrainCircuit />}
                  label="Adaptive Engine"
                  color="text-primary"
                  bg="bg-primary/10 group-hover/node:bg-primary/30"
                  border="border-primary/40 group-hover/node:border-primary/80"
                  glow="shadow-[0_0_60px_-10px_var(--color-primary)] group-hover/node:shadow-[0_0_80px_0px_var(--color-primary)]"
                />
              </div>

              {/* Node 3: Interface */}
              <div className="absolute left-[85%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group/node cursor-default">
                <Node
                  delay={0.6}
                  icon={<MonitorSmartphone />}
                  label="The Interface"
                  color="text-green-500"
                  bg="bg-green-500/5 group-hover/node:bg-green-500/20"
                  border="border-green-500/30 group-hover/node:border-green-500/80"
                  glow="shadow-[0_0_40px_-10px_rgb(34_197_94)] group-hover/node:shadow-[0_0_60px_0px_rgb(34_197_94)]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Engine Stats / Sub-features */}
        <div className="flex flex-col md:flex-row w-full gap-4 mt-8 md:h-[320px]">
          {[
            {
              icon: <Server className="w-5 h-5 text-accent" />,
              title: "1000+ Questions",
              desc: "Sourced from real ITPEC/PhilNITS exams from 2010 to present.",
              extra: "Our vault is constantly updated and tagged by domain (Hardware, Software, Math, etc.), ensuring you never run out of syllabus-accurate practice material."
            },
            {
              icon: <BrainCircuit className="w-5 h-5 text-primary" />,
              title: "Adaptive Spacing",
              desc: "The engine remembers your mistakes and re-tests weak points.",
              extra: "Using spaced repetition algorithms, it calculates the exact moment you're about to forget a concept and intercepts it to solidify your long-term memory."
            },
            {
              icon: <Cpu className="w-5 h-5 text-green-500" />,
              title: "Zero Lag",
              desc: "Built on a modern React + Supabase edge architecture.",
              extra: "Exam sessions run instantaneously in your browser with background sync. Say goodbye to loading spinners between questions."
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="group relative flex flex-col items-center justify-center text-center p-6 bg-surface-2/20 hover:bg-surface border border-borderline hover:border-primary/40 rounded-3xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex-1 md:hover:flex-[2.2] overflow-hidden min-h-[250px] md:min-h-0"
            >
              <div className="flex flex-col md:flex-row items-center justify-center w-full h-full">
                {/* Left: Original Info */}
                <div className="flex flex-col items-center justify-center w-full md:group-hover:w-1/2 transition-all duration-500 shrink-0 h-full">
                  <div className="w-12 h-12 shrink-0 mx-auto bg-surface border border-borderline rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_-5px_var(--color-primary)]">
                    {stat.icon}
                  </div>
                  <h4 className="font-bold text-text-main mb-2 group-hover:text-primary transition-colors duration-300">{stat.title}</h4>
                  <p className="text-sm text-text-muted leading-relaxed max-w-[200px] transition-all duration-500">{stat.desc}</p>
                </div>

                {/* Right: Extra Info (Desktop horizontal, Mobile vertical) */}
                <div className="flex flex-col justify-center overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 w-full max-h-0 group-hover:max-h-[200px] md:w-0 md:max-h-full md:h-full md:group-hover:w-1/2">
                  <div className="md:min-w-[220px] md:pl-6 md:border-l border-t md:border-t-0 border-borderline/50 pt-4 mt-4 md:mt-0 md:pt-0 text-sm text-text-muted/80 leading-relaxed text-center md:text-left">
                    {stat.extra}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
