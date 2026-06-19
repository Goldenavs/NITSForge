// src/components/dashboard/DashboardCharts.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
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

const CATEGORIES = [
  'Basic Theory of Information',
  'Computer Architecture',
  'Operating Systems',
  'Data Structures & Algorithms',
  'Databases',
  'Networking & Communication',
  'Information Security',
  'Software Engineering & Development',
  'Strategy',
  'Management'
];

export function CategoryRadar({ data }: { data: RadarData[] }) {
  const radarData = CATEGORIES.map(cat => {
    const existing = data?.find(d => d.subject === cat);
    return existing ? existing : { subject: cat, A: 0, fullMark: 100 };
  });

  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader className="pb-0">
        <CardTitle>Category Mastery</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="var(--color-borderline)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
            <Radar name="Accuracy" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-borderline)', borderRadius: '8px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}