'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { AnalyticsChart } from '@/components/analytics-chart';
import { MetricCard } from '@/components/metric-card';

export default function LifestylePage() {
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
        const response = await apiClient.getLifestyleMetrics(30);
        setMetrics(response);
      } catch (err) {
        console.error('Failed to fetch lifestyle data:', err);
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
    { date: 'Mon', value: 7.2 },
    { date: 'Tue', value: 7.5 },
    { date: 'Wed', value: 7.3 },
    { date: 'Thu', value: 7.8 },
    { date: 'Fri', value: 8.1 },
    { date: 'Sat', value: 6.9 },
    { date: 'Sun', value: 7.4 },
  ];

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Lifestyle Metrics</h1>
          <p className="text-muted-foreground">Monitor your health and wellness habits</p>
        </div>

        <motion.div className="grid md:grid-cols-4 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <MetricCard
            label="Sleep Hours"
            value={metrics?.sleep_hours || 0}
            unit="hrs"
            change={10}
            trend="up"
          />
          <MetricCard
            label="Exercise"
            value={metrics?.exercise_minutes || 0}
            unit="mins"
            change={20}
            trend="up"
          />
          <MetricCard
            label="Water Intake"
            value={metrics?.water_intake || 0}
            unit="L"
            change={5}
            trend="up"
          />
          <MetricCard
            label="Nutrition Score"
            value={(metrics?.nutrition_score || 0).toFixed(1)}
            unit="/10"
            change={8}
            trend="up"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <AnalyticsChart
  title="Lifestyle Metrics"
  data={[
    { name: "Mon", score: 50 },
    { name: "Tue", score: 65 },
    { name: "Wed", score: 70 },
    { name: "Thu", score: 90 },
    { name: "Fri", score: 85 },
    { name: "Sat", score: 75 },
    { name: "Sun", score: 95 },
  ]}
/>
        </motion.div>

        <motion.div className="grid lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass glow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Sleep Quality</h2>
            <p className="text-muted-foreground">You&apos;re sleeping 7.4 hours per night on average, which is optimal for most adults.</p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-primary to-accent" initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ delay: 0.5 }} />
            </div>
            <p className="text-sm text-muted-foreground">85% of recommended sleep</p>
          </div>

          <div className="glass glow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Activity Level</h2>
            <p className="text-muted-foreground">You&apos;re exercising 45 minutes per day, exceeding the recommended 30 minutes.</p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-accent to-primary" initial={{ width: 0 }} animate={{ width: '95%' }} transition={{ delay: 0.5 }} />
            </div>
            <p className="text-sm text-muted-foreground">95% of recommended activity</p>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
