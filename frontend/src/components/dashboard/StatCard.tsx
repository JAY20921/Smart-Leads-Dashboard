import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'brand';
}

const colorMap = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   icon: 'text-blue-600 dark:text-blue-400',   ring: 'bg-blue-100 dark:bg-blue-900/40'   },
  green:  { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400', ring: 'bg-green-100 dark:bg-green-900/40' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: 'text-yellow-600 dark:text-yellow-400', ring: 'bg-yellow-100 dark:bg-yellow-900/40' },
  red:    { bg: 'bg-red-50 dark:bg-red-900/20',     icon: 'text-red-600 dark:text-red-400',     ring: 'bg-red-100 dark:bg-red-900/40'     },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', ring: 'bg-purple-100 dark:bg-purple-900/40' },
  brand:  { bg: 'bg-brand-50 dark:bg-brand-900/20', icon: 'text-brand-600 dark:text-brand-400', ring: 'bg-brand-100 dark:bg-brand-900/40' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'brand',
}) => {
  const colors = colorMap[color];

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up' ? 'text-green-600 dark:text-green-400' :
    trend === 'down' ? 'text-red-500 dark:text-red-400' :
    'text-gray-400';

  return (
    <div className={cn('card p-5 hover:shadow-md transition-shadow duration-200', colors.bg)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1.5 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', trendColor)}>
              <TrendIcon size={13} />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl flex-shrink-0', colors.ring)}>
          <span className={colors.icon}>{icon}</span>
        </div>
      </div>
    </div>
  );
};
