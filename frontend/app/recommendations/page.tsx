'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  action_items: string[];
}

export default function RecommendationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await apiClient.getRecommendations();
        setRecommendations(response.data || []);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
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

  const sampleRecommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Increase Daily Exercise',
      description: 'You average 30 minutes of exercise daily. Increasing to 45 minutes could improve your productivity by 15%.',
      priority: 'high',
      category: 'Health',
      action_items: [
        'Add a 15-minute evening walk',
        'Try a new workout routine',
        'Set a daily exercise reminder',
      ],
    },
    {
      id: '2',
      title: 'Optimize Sleep Schedule',
      description: 'Your sleep quality dips on weekends. Maintaining a consistent sleep schedule would help.',
      priority: 'high',
      category: 'Sleep',
      action_items: [
        'Keep consistent bedtime on weekends',
        'Reduce screen time 1 hour before bed',
        'Create a relaxing bedtime routine',
      ],
    },
    {
      id: '3',
      title: 'Stress Management',
      description: 'Your stress levels increase on Thursdays. Try meditation or breathing exercises.',
      priority: 'medium',
      category: 'Mental Health',
      action_items: [
        'Start a 10-minute daily meditation',
        'Practice deep breathing techniques',
        'Consider a wellness app',
      ],
    },
    {
      id: '4',
      title: 'Hydration Improvement',
      description: 'Increase water intake by 2 glasses per day to boost energy and focus.',
      priority: 'low',
      category: 'Lifestyle',
      action_items: [
        'Drink water with every meal',
        'Set hourly water reminders',
        'Track water intake daily',
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'medium':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      default:
        return 'bg-green-500/10 border-green-500/20 text-green-400';
    }
  };

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
    <main className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Personalized Recommendations</h1>
          <p className="text-muted-foreground">Based on your behavioral patterns and health data</p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          {(recommendations.length > 0 ? recommendations : sampleRecommendations).map((rec, idx) => (
            <motion.div
              key={rec.id}
              className="glass glow p-6 space-y-4"
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">{rec.title}</h2>
                  <p className="text-muted-foreground">{rec.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(rec.priority)} whitespace-nowrap`}>
                  {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Action Items:</p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {rec.action_items.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-2 p-2 rounded-lg bg-white/5 text-sm text-foreground/80"
                    >
                      <span className="text-primary">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 px-4 py-2 rounded-lg font-medium glass-sm hover:opacity-80 transition">
                  Learn More
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition">
                  Take Action
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
