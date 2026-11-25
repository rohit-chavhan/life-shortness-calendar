'use client';

import { Person } from '@/lib/types';
import { generateWeekData } from '@/lib/calculations';
import WeekBox from './WeekBox';

interface LifeGridProps {
  person: Person;
}

export default function LifeGrid({ person }: LifeGridProps) {
  const weeks = generateWeekData(person);
  const WEEKS_PER_ROW = 52;
  const rows = Math.ceil(weeks.length / WEEKS_PER_ROW);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
      <div className="min-w-fit">
        {Array.from({ length: rows }, (_, rowIndex) => {
          const startWeek = rowIndex * WEEKS_PER_ROW;
          const endWeek = Math.min(startWeek + WEEKS_PER_ROW, weeks.length);
          const rowWeeks = weeks.slice(startWeek, endWeek);
          const age = rowIndex;

          return (
            <div key={rowIndex} className="flex items-center gap-1 md:gap-2 mb-1">
              {/* Age label every 5 years */}
              <div className="w-8 md:w-10 text-xs text-gray-500 dark:text-gray-400 text-right">
                {age % 5 === 0 ? age : ''}
              </div>

              {/* Week boxes */}
              <div className="flex gap-0.5 md:gap-1">
                {rowWeeks.map((week) => (
                  <WeekBox key={week.weekNumber} week={week} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 border border-blue-600 dark:border-blue-500" />
          <span>Lived</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-transparent border border-gray-300 dark:border-gray-600" />
          <span>Remaining</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 border border-blue-600 dark:border-blue-500 ring-2 ring-yellow-400 dark:ring-yellow-500 ring-offset-1" />
          <span>Current Week</span>
        </div>
      </div>
    </div>
  );
}
