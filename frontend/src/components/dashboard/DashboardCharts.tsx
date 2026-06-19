// src/components/dashboard/DashboardCharts.tsx
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import { List, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

export interface AccuracyData {
  session: string;
  score: number;
}

export interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

export function AccuracyChart({ data }: { data: AccuracyData[] }) {
  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Accuracy Trends</CardTitle>
        <Badge variant="outline">Last {data.length} Sessions</Badge>
      </CardHeader>
      <CardContent className="flex-1 pt-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-borderline)" vertical={false} />
            <XAxis dataKey="session" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-borderline)', borderRadius: '12px', color: 'var(--color-text-main)' }}
              itemStyle={{ color: 'var(--color-primary)' }}
            />
            <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={3} dot={{ fill: 'var(--color-surface)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-accent)' }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_MAP = [
  { full: 'Basic Theory of Information', short: 'Theory', color: 'bg-blue-500', text: 'text-blue-500' },
  { full: 'Computer Architecture', short: 'Arch', color: 'bg-emerald-500', text: 'text-emerald-500' },
  { full: 'Operating Systems', short: 'OS', color: 'bg-indigo-500', text: 'text-indigo-500' },
  { full: 'Data Structures & Algorithms', short: 'DS & Algo', color: 'bg-amber-500', text: 'text-amber-500' },
  { full: 'Databases', short: 'DB', color: 'bg-cyan-500', text: 'text-cyan-500' },
  { full: 'Networking & Communication', short: 'Network', color: 'bg-rose-500', text: 'text-rose-500' },
  { full: 'Information Security', short: 'Security', color: 'bg-purple-500', text: 'text-purple-500' },
  { full: 'Software Engineering & Development', short: 'Soft Eng', color: 'bg-fuchsia-500', text: 'text-fuchsia-500' },
  { full: 'Strategy', short: 'Strategy', color: 'bg-teal-500', text: 'text-teal-500' },
  { full: 'Management', short: 'Management', color: 'bg-orange-500', text: 'text-orange-500' }
];

export function CategoryRadar({ data }: { data: any[] }) {
  const [showList, setShowList] = useState(false);

  const radarData = CATEGORY_MAP.map(cat => {
    const existing = data?.find(d => d.subject === cat.full);
    return {
      subject: cat.short,
      fullSubject: cat.full,
      color: cat.color,
      textColor: cat.text,
      A: existing ? existing.A : 0,
      attempted: existing ? (existing.attempted || 0) : 0,
      correct: existing ? (existing.correct || 0) : 0,
      fullMark: 100
    };
  });

  return (
    <Card className="flex flex-col h-[400px] perspective-1000">
      <CardHeader className="pb-0 flex flex-row items-center justify-between z-10">
        <CardTitle>Category Mastery</CardTitle>
        <button 
          onClick={() => setShowList(!showList)}
          className="p-1.5 rounded-md text-text-muted hover:text-text-main hover:bg-surface-2 transition-colors cursor-pointer"
          title={showList ? "View Radar Chart" : "View Detailed Progress"}
        >
          {showList ? <PieChart className="w-4 h-4 sm:w-5 sm:h-5" /> : <List className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </CardHeader>
      <CardContent className="flex-1 relative min-h-0 pt-4" style={{ perspective: 1000 }}>
        <AnimatePresence initial={false} mode="wait">
          {!showList ? (
            <motion.div
              key="radar"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center pt-4"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="var(--color-borderline)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                  <Radar name="Accuracy" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-borderline)', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full overflow-y-auto pr-3 scrollbar-hide flex flex-col gap-5 pt-4 pb-4 px-6"
            >
              {radarData.map(item => (
                <div key={item.fullSubject} className="flex flex-col gap-1.5 w-full">
                  <div className="flex justify-between text-xs font-medium font-body items-end">
                    <div className="flex flex-col">
                      <span className="text-text-main truncate max-w-[200px]" title={item.fullSubject}>
                        {item.fullSubject}
                      </span>
                      <span className="text-text-muted/60 text-[10px] uppercase tracking-wider">
                        {item.correct} / {item.attempted} Correct
                      </span>
                    </div>
                    <span className={`${item.textColor} font-bold`}>{item.A}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden shadow-inner border border-borderline/30">
                    <div className={`h-full ${item.color} transition-all duration-1000 ease-out`} style={{ width: `${item.A}%` }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}