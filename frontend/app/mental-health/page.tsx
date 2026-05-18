'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { AnalyticsChart } from '@/components/analytics-chart';
import { MetricCard } from '@/components/metric-card';

export default function MentalHealthPage() {
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
        const response = await apiClient.getMentalHealthMetrics(30);
        setMetrics(response);
      } catch (err) {
        console.error('Failed to fetch mental health data:', err);
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
    { date: 'Mon', value: 6.8 },
    { date: 'Tue', value: 7.2 },
    { date: 'Wed', value: 6.5 },
    { date: 'Thu', value: 7.5 },
    { date: 'Fri', value: 8.1 },
    { date: 'Sat', value: 7.9 },
    { date: 'Sun', value: 7.3 },
  ];

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Mental Health Analytics</h1>
          <p className="text-muted-foreground">Track your mood, stress, and anxiety levels</p>
        </div>

        <motion.div className="grid md:grid-cols-3 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <MetricCard
            label="Mood Score"
            value={(metrics?.mood_score || 0).toFixed(1)}
            unit="/10"
            change={12}
            trend="up"
          />
          <MetricCard
            label="Stress Level"
            value={(metrics?.stress_level || 0).toFixed(1)}
            unit="/10"
            change={-15}
            trend="down"
          />
          <MetricCard
            label="Anxiety Level"
            value={(metrics?.anxiety_level || 0).toFixed(1)}
            unit="/10"
            change={-8}
            trend="down"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <AnalyticsChart
  title="Weekly Mood Trend"
  data={[
    { name: "Mon", score: 8 },
    { name: "Tue", score: 6 },
    { name: "Wed", score: 9 },
    { name: "Thu", score: 7 },
    { name: "Fri", score: 8 },
    { name: "Sat", score: 5 },
    { name: "Sun", score: 9 },
  ]}
/>
        </motion.div>

        <motion.div className="grid lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass glow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Current Status</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground">Mood</span>
                  <span className="text-sm text-accent font-medium">7.5/10</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-accent" initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ delay: 0.5 }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground">Stress</span>
                  <span className="text-sm text-destructive font-medium">3.2/10</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-destructive" initial={{ width: 0 }} animate={{ width: '32%' }} transition={{ delay: 0.5 }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground">Anxiety</span>
                  <span className="text-sm text-orange-400 font-medium">2.8/10</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-orange-400" initial={{ width: 0 }} animate={{ width: '28%' }} transition={{ delay: 0.5 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass glow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Recommendations</h2>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Continue your meditation practice—it&apos;s helping reduce stress</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Your mood improves significantly after exercise—maintain it</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Try journaling before bed to improve sleep quality</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Take short breaks every hour to prevent anxiety buildup</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
