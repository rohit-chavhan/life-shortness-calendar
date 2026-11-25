'use client';

import { useState } from 'react';
import { Person } from '@/lib/types';
import { calculateTimeWithParents } from '@/lib/calculations';

interface TimeCalculatorProps {
  dadData: Person;
  momData: Person;
  defaultOpen?: boolean;
}

export default function TimeCalculator({ dadData, momData, defaultOpen = false }: TimeCalculatorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [daysPerYear, setDaysPerYear] = useState(10);

  const dadTime = calculateTimeWithParents(dadData, daysPerYear);
  const momTime = calculateTimeWithParents(momData, daysPerYear);

  return (
    <div className="pt-3" style={{ borderTop: '1px solid rgb(var(--border-subtle))' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm transition-colors flex items-center gap-2 w-full"
        style={{ color: 'rgb(var(--text-secondary))' }}
      >
        <span>⏰</span>
        <span>Time with Parents</span>
        <span className="ml-auto text-xs">{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs whitespace-nowrap" style={{ color: 'rgb(var(--text-secondary))' }}>
              Days/year:
            </label>
            <input
              type="number"
              min="0"
              max="365"
              value={daysPerYear}
              onChange={(e) => setDaysPerYear(parseInt(e.target.value) || 0)}
              className="flex-1 px-2 py-1 text-sm border rounded focus:ring-1 focus:outline-none"
              style={{
                background: 'rgb(var(--input-bg))',
                borderColor: 'rgb(var(--input-border))',
                color: 'rgb(var(--text-primary))',
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div 
              className="rounded p-2"
              style={{ background: 'rgb(var(--bg-panel-alt))' }}
            >
              <div className="text-xs mb-0.5" style={{ color: 'rgb(var(--text-secondary))' }}>
                {dadData.name}
              </div>
              <div className="text-lg font-bold" style={{ color: 'rgb(var(--number-primary))' }}>
                {dadTime.days.toLocaleString()}
              </div>
              <div className="text-xs leading-tight" style={{ color: 'rgb(var(--text-tertiary))' }}>
                about {dadTime.months.toFixed(1)} months of days, in total
              </div>
            </div>

            <div 
              className="rounded p-2"
              style={{ background: 'rgb(var(--bg-panel-alt))' }}
            >
              <div className="text-xs mb-0.5" style={{ color: 'rgb(var(--text-secondary))' }}>
                {momData.name}
              </div>
              <div className="text-lg font-bold" style={{ color: 'rgb(var(--number-primary))' }}>
                {momTime.days.toLocaleString()}
              </div>
              <div className="text-xs leading-tight" style={{ color: 'rgb(var(--text-tertiary))' }}>
                about {momTime.months.toFixed(1)} months of days, in total
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
