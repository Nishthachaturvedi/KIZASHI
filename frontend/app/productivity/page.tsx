'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { AnalyticsChart } from '@/components/analytics-chart';
import { MetricCard } from '@/components/metric-card';

export default function ProductivityPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await apiClient.getProductivityMetrics(30);
        setMetrics(response);
      } catch (err) {
        console.error('Failed to fetch productivity data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sampleData = [
    { date: 'Mon', value: 65 },
    { date: 'Tue', value: 72 },
    { date: 'Wed', value: 68 },
    { date: 'Thu', value: 75 },
    { date: 'Fri', value: 82 },
    { date: 'Sat', value: 58 },
    { date: 'Sun', value: 70 },
  ];

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Productivity Analytics</h1>
          <p className="text-muted-foreground">Track your focus and productivity patterns</p>
        </div>

        <motion.div className="grid md:grid-cols-3 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <MetricCard
            label="Daily Average"
            value={(metrics?.daily_average || 0).toFixed(1)}
            unit="%"
            change={15}
            trend="up"
          />
          <MetricCard
            label="Focus Sessions"
            value={metrics?.focus_sessions || 0}
            unit="sessions"
            change={8}
            trend="up"
          />
          <MetricCard
            label="Break Time"
            value={metrics?.break_time || 0}
            unit="mins"
            change={-5}
            trend="stable"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <AnalyticsChart
          title="Weekly Productivity Trend"
          data={[
          { name: "Mon", score: 60 },
          { name: "Tue", score: 72 },
          { name: "Wed", score: 80 },
          { name: "Thu", score: 75 },
          { name: "Fri", score: 90 },
          { name: "Sat", score: 85 },
          { name: "Sun", score: 88 },
          ]}
          />
            type="area"
            color="oklch(0.55 0.22 257)"
          
        </motion.div>

        <motion.div className="glass glow p-6 space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold text-foreground">Key Insights</h2>
          <ul className="space-y-2 text-foreground/80">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Your peak productivity hours are between 10 AM and 12 PM</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>You maintain focus for an average of 45 minutes per session</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Taking regular breaks improves your overall productivity by 18%</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </main>
  );
}
