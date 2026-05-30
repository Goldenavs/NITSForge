// src/pages/Dashboard.tsx
import { Flame, Trophy, Target, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function Dashboard() {
  return (
    <div className="animate-page-entry flex flex-col gap-6 w-full max-w-6xl mx-auto pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
        <div>
          <Badge variant="primary" className="mb-2">Level 4: Specialist</Badge>
          <h1 className="text-3xl font-bold text-text-main font-display tracking-tight">Welcome back, Engineer.</h1>
          <p className="text-text-muted mt-1">Your FE Exam is in 42 days. Keep up the momentum.</p>
        </div>
        <Button size="lg" className="gap-2">
          <Play className="w-5 h-5 fill-current" />
          Continue Practice
        </Button>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
              <Flame className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Current Streak</p>
              <h2 className="text-3xl font-bold text-text-main font-display">12 Days</h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
              <Target className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Overall Accuracy</p>
              <h2 className="text-3xl font-bold text-text-main font-display">78%</h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20 text-green-500">
              <Trophy className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Total XP</p>
              <h2 className="text-3xl font-bold text-text-main font-display">4,250</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts/Progress */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="h-96 flex flex-col">
            <CardHeader>
              <CardTitle>Category Mastery</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center border-t border-borderline bg-surface-2/20">
              <p className="text-text-muted italic">[ Radar Chart Placeholder ]</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recommended Actions */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Daily Challenge</CardTitle>
                <Badge variant="warning">New</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted mb-6">
                10 curated questions to test your knowledge across all subjects. Refreshes in 14 hours.
              </p>
              <Button className="w-full">Start Challenge</Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}