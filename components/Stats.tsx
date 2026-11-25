'use client';

import { Stats as StatsType } from '@/lib/types';

interface StatsProps {
  stats: StatsType;
}

export default function Stats({ stats }: StatsProps) {
  const statItems = [
    {
      label: 'Weeks Lived',
      value: stats.weeksLived.toLocaleString(),
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Weeks Remaining',
      value: stats.weeksRemaining.toLocaleString(),
      color: 'text-gray-600 dark:text-gray-400',
    },
    {
      label: 'Life Lived',
      value: `${stats.percentLived.toFixed(1)}%`,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Years Remaining',
      value: stats.yearsRemaining.toString(),
      color: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className={`text-2xl md:text-3xl font-bold ${item.color} mb-1`}>
            {item.value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
