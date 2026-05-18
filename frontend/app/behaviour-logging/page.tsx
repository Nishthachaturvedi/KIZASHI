'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

const BEHAVIOR_CATEGORIES = [
  "Study Hours",
  "Focus Sessions",
  "Tasks Planned/Completed",
  "Sleep Hours",
  "Screen Time",
  "Routine Score",
  "Mood",
  "Stress Level",
  "Motivation",
  "Energy"
]

interface LogEntry {
  id: string;
  category: string;
  duration: number;
  timestamp: string;
  notes?: string;
}

export default function BehaviorLoggingPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchLogs = async () => {
      try {
        const response = await apiClient.getBehaviorLogs();
        setLogs(response.data || []);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!category || !duration) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.createBehaviorLog(category, parseInt(duration), notes);
      setSuccess('Behavior logged successfully!');
      setCategory('');
      setDuration('');
      setNotes('');

      // Refresh logs
      const response = await apiClient.getBehaviorLogs();
      setLogs(response.data || []);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log behavior');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent mx-auto animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Behavior Logging</h1>
          <p className="text-muted-foreground">Track your daily behaviors and patterns</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <motion.div
            className="lg:col-span-1 glass glow p-6 space-y-4 h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold text-foreground">Log Behavior</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={submitting}
                 className="w-full px-3 py-2 bg-[#1f1631] text-white border border-gray-600 rounded"
                >
                  <option value="" className="bg-[#1f1631] text-white">
                  Select category
                  </option>
                  {BEHAVIOR_CATEGORIES.map((cat) => (
                    <option
                   key={cat}
                   value={cat}
                   className="bg-[#1f1631] text-white"
>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                {["Study Hours", "Focus Sessions", "Sleep Hours", "Screen Time"].includes(category) && (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-foreground">
      Duration (hours/minutes)
    </label>

    <input
      type="number"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      className="w-full px-3 py-2 bg-[#1f1631] text-white border border-gray-600 rounded"
      placeholder="Enter time"
    />
  </div>
)}

{["Mood", "Stress Level", "Motivation", "Energy", "Routine Score"].includes(category) && (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-foreground">
      Scale (1-10)
    </label>

    <input
      type="number"
      min="1"
      max="10"
      className="w-full px-3 py-2 bg-[#1f1631] text-white border border-gray-600 rounded"
      placeholder="Enter scale"
    />
  </div>
)}

{category === "Tasks Planned/Completed" && (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-foreground">
      Tasks Completed
    </label>

    <input
      type="text"
      className="w-full px-3 py-2 bg-[#1f1631] text-white border border-gray-600 rounded"
      placeholder="Example: 3/5"
    />
  </div>
)}
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 glass-sm outline-none rounded disabled:opacity-50"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 glass-sm outline-none rounded resize-none disabled:opacity-50"
                  placeholder="Add any notes..."
                  rows={3}
                />
              </div>

              {error && (
                <motion.div
                  className="p-2 rounded text-sm bg-destructive/10 border border-destructive/20 text-destructive"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="p-2 rounded text-sm bg-green-500/10 border border-green-500/20 text-green-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {success}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 rounded-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition"
              >
                {submitting ? 'Logging...' : 'Log Behavior'}
              </button>
            </form>
          </motion.div>

          {/* Recent Logs */}
          <motion.div
            className="lg:col-span-2 glass glow p-6 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold text-foreground">Recent Logs</h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, idx) => (
                  <motion.div
                    key={log.id}
                    className="glass-sm p-4 flex items-between justify-between hover:opacity-80 transition"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{log.category}</p>
                      <p className="text-sm text-muted-foreground">{log.duration} minutes</p>
                      {log.notes && <p className="text-xs text-foreground/60">{log.notes}</p>}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No logs yet. Start logging your behaviors!</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
