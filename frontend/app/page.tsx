'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        className="max-w-2xl text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            KIZASHI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Advanced Behavioral Analytics Platform
          </p>
        </motion.div>

        <motion.p variants={itemVariants} className="text-lg text-foreground/80 leading-relaxed">
          Transform your health data into actionable insights. KIZASHI combines behavioral analysis, productivity tracking, and mental wellness assessment to provide a complete picture of your wellbeing.
        </motion.p>

        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4 py-8">
          {[
            { title: 'Behavioral Tracking', desc: 'Monitor daily behaviors and patterns' },
            { title: 'Analytics Engine', desc: 'AI-powered insights and predictions' },
            { title: 'Wellness Insights', desc: 'Holistic health recommendations' },
          ].map((feature, i) => (
            <div key={i} className="glass glow p-4 text-left">
              <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          {isAuthenticated ? (
            <Link href="/dashboard" className="glass-sm px-8 py-3 rounded-lg font-semibold text-center bg-primary text-primary-foreground hover:opacity-90 transition">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="glass-sm px-8 py-3 rounded-lg font-semibold text-center text-foreground hover:opacity-90 transition">
                Log In
              </Link>
              <Link href="/register" className="glass-sm px-8 py-3 rounded-lg font-semibold text-center bg-primary text-primary-foreground hover:opacity-90 transition">
                Get Started
              </Link>
            </>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="pt-8 text-xs text-muted-foreground border-t border-border">
          <p>Secure. Private. Powered by Advanced AI Analytics.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
