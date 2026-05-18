'use client';

import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  animated?: boolean;
}

export function MetricCard({
  label,
  value,
  unit = '',
  change,
  trend,
  icon,
  animated = true,
}: MetricCardProps) {
  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-accent';
    }
  };

  const variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className="glass glow p-4 space-y-2"
      variants={animated ? variants : undefined}
      initial={animated ? 'hidden' : 'show'}
      animate={animated ? 'show' : undefined}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        {icon && <div className="text-2xl text-primary">{icon}</div>}
      </div>

      {change !== undefined && (
        <div className={`text-xs font-medium ${getTrendColor(trend)}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {Math.abs(change)}% from last week
        </div>
      )}
    </motion.div>
  );
}
