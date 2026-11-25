'use client';

import { useState } from 'react';
import { WeekInfo } from '@/lib/types';

interface WeekBoxProps {
  week: WeekInfo;
}

export default function WeekBox({ week }: WeekBoxProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          w-2 h-2 md:w-3 md:h-3 border transition-all
          ${
            week.isLived
              ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500'
              : 'bg-transparent border-gray-300 dark:border-gray-600'
          }
          ${
            week.isCurrent
              ? 'ring-2 ring-yellow-400 dark:ring-yellow-500 ring-offset-1 animate-pulse'
              : ''
          }
          hover:scale-125 hover:z-10
        `}
      />
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap z-20 pointer-events-none shadow-lg">
          Age {week.age} • {week.year}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
}
