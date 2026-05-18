'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { MetricCard } from '@/components/metric-card';
import { AnalyticsChart } from '@/components/analytics-chart';

interface DashboardMetrics {
  productivity: number;
  wellness: number;
  mental_health: number;
  recent_logs: number;
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [productivity, lifestyle, mentalHealth] = await Promise.all([
          apiClient.getProductivityMetrics(7),
          apiClient.getLifestyleMetrics(7),
          apiClient.getMentalHealthMetrics(7),
        ]);

        // Extract metrics from responses
        setMetrics({
          productivity: (productivity as any)?.daily_average || 0,
          wellness: (lifestyle as any)?.nutrition_score || 0,
          mental_health: (mentalHealth as any)?.mood_score || 0,
          recent_logs: 12,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent mx-auto animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Your behavioral analytics at a glance</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
          >
            {error}
          </motion.div>
        )}

        {/* Key Metrics */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
          {metrics && (
            <>
              <MetricCard
                label="Productivity"
                value={metrics.productivity.toFixed(1)}
                unit="%"
                change={12}
                trend="up"
              />
              <MetricCard
                label="Wellness Score"
                value={metrics.wellness.toFixed(0)}
                change={5}
                trend="up"
              />
              <MetricCard
                label="Mental Health"
                value={metrics.mental_health.toFixed(1)}
                unit="/10"
                change={8}
                trend="up"
              />
              <MetricCard
                label="Recent Logs"
                value={metrics.recent_logs}
                unit="entries"
              />
            </>
          )}
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
          <AnalyticsChart
  title="Productivity Trend"
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
          
          <AnalyticsChart
  title="Wellness Metrics"
  data={[
    { name: "Mon", score: 40 },
    { name: "Tue", score: 55 },
    { name: "Wed", score: 70 },
    { name: "Thu", score: 65 },
    { name: "Fri", score: 85 },
    { name: "Sat", score: 78 },
    { name: "Sun", score: 92 },
  ]}
/>
            type="line"
            color="oklch(0.52 0.18 47)"
        
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="glass glow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: 'Log Behavior', href: '/behaviour-logging' },
              { title: 'View Analytics', href: '/productivity' },
              { title: 'Health Insights', href: '/mental-health' },
              { title: 'Get Recommendations', href: '/recommendations' },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="glass-sm p-4 text-center rounded-lg hover:opacity-80 transition font-medium text-foreground"
              >
                {action.title}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
