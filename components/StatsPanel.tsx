'use client';

import { Person, PersonType, Deadline } from '@/lib/types';
import { calculateAdditionalStats, calculateTimeWithParents, getWeeksLived } from '@/lib/calculations';
import TimeCalculator from './TimeCalculator';

interface StatsPanelProps {
  person: Person;
  personType: PersonType;
  dadData: Person;
  momData: Person;
  deadlines: Deadline[];
}

export default function StatsPanel({ person, personType, dadData, momData, deadlines }: StatsPanelProps) {
  const stats = calculateAdditionalStats(person);
  const isMe = personType === 'me';
  const weeksLived = getWeeksLived(person);

  // Get upcoming deadlines
  const upcomingDeadlines = (deadlines || [])
    .filter(d => d.weekNumber >= weeksLived)
    .sort((a, b) => a.weekNumber - b.weekNumber);
  
  const nextDeadline = upcomingDeadlines[0];
  const displayDeadlines = upcomingDeadlines.slice(0, 4);
  const moreCount = Math.max(0, upcomingDeadlines.length - 4);

  const formatWeeksAway = (weekNumber: number) => {
    const weeksAway = weekNumber - weeksLived;
    if (weeksAway === 0) return 'this week';
    if (weeksAway === 1) return '1 week away';
    if (weeksAway < 8) return `${weeksAway} weeks away`;
    const months = Math.round(weeksAway / 4.33);
    if (months === 1) return '1 month away';
    return `${months} months away`;
  };

  return (
    <div 
      className="h-full flex flex-col p-5 overflow-hidden"
      style={{ background: 'rgba(var(--bg-panel) / 0.5)' }}
    >
      {/* Huge weeks remaining */}
      <div className="mb-4">
        <div 
          className="text-6xl font-bold mb-1"
          style={{ color: 'rgb(var(--number-primary))' }}
        >
          {stats.weeksRemaining.toLocaleString()}
        </div>
        <div className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          weeks left
        </div>
      </div>

      {/* Next deadline on Me tab */}
      {isMe && nextDeadline && (
        <div 
          className="mb-4 px-3 py-2 rounded"
          style={{ 
            background: 'rgb(var(--bg-panel-alt))',
            border: '1px solid rgb(var(--number-secondary))'
          }}
        >
          <div className="text-sm font-medium" style={{ color: 'rgb(var(--number-secondary))' }}>
            Next: {nextDeadline.label} in {formatWeeksAway(nextDeadline.weekNumber).replace(' away', '')}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-4">
        <div 
          className="h-2 rounded-full overflow-hidden mb-2"
          style={{ background: 'rgb(var(--border-subtle))' }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{ 
              width: `${stats.percentLived}%`,
              background: 'rgb(var(--number-secondary))'
            }}
          />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>
          <span>{stats.weeksLived.toLocaleString()} weeks lived</span>
          <span>{stats.yearsRemaining.toFixed(1)} years left</span>
        </div>
      </div>

      {/* Additional stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Days left</span>
          <span className="text-lg font-semibold" style={{ color: 'rgb(var(--number-secondary))' }}>
            {stats.daysLeft.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Waking hours left</span>
          <span className="text-lg font-semibold" style={{ color: 'rgb(var(--number-secondary))' }}>
            {stats.wakingHoursLeft.toLocaleString()}
          </span>
        </div>
        
        {stats.weeksUntil30 !== null && (
          <div className="flex justify-between items-baseline">
            <span className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Weeks until 30</span>
            <span className="text-lg font-semibold" style={{ color: 'rgb(var(--number-secondary))' }}>
              {stats.weeksUntil30.toLocaleString()}
            </span>
          </div>
        )}
        {stats.weeksUntil40 !== null && (
          <div className="flex justify-between items-baseline">
            <span className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Weeks until 40</span>
            <span className="text-lg font-semibold" style={{ color: 'rgb(var(--number-secondary))' }}>
              {stats.weeksUntil40.toLocaleString()}
            </span>
          </div>
        )}
        {stats.weeksUntil50 !== null && (
          <div className="flex justify-between items-baseline">
            <span className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Weeks until 50</span>
            <span className="text-lg font-semibold" style={{ color: 'rgb(var(--number-secondary))' }}>
              {stats.weeksUntil50.toLocaleString()}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-baseline">
          <span className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Weeks left this year</span>
          <span className="text-lg font-semibold" style={{ color: 'rgb(var(--number-secondary))' }}>
            {stats.weeksLeftThisYear}
          </span>
        </div>
      </div>

      {/* Time with Parents */}
      {isMe && (
        <div className="mb-3">
          <TimeCalculator dadData={dadData} momData={momData} defaultOpen={false} />
        </div>
      )}
      {!isMe && (
        <div className="mb-3">
          <TimeCalculator dadData={dadData} momData={momData} defaultOpen={true} />
        </div>
      )}

      {/* Deadlines Section */}
      <div className="mb-3 pt-3" style={{ borderTop: '1px solid rgb(var(--border-subtle))' }}>
        <div className="text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-secondary))' }}>
          🎯 Deadlines
        </div>
        {upcomingDeadlines.length === 0 ? (
          <div className="text-xs italic" style={{ color: 'rgb(var(--text-tertiary))' }}>
            No deadlines yet. Click an orange box to set one.
          </div>
        ) : (
          <div className="space-y-1.5">
            {displayDeadlines.map((deadline) => (
              <div key={deadline.weekNumber} className="text-xs flex justify-between">
                <span style={{ color: 'rgb(var(--text-primary))' }} className="truncate flex-1 mr-2">
                  {deadline.label}
                </span>
                <span style={{ color: 'rgb(var(--text-tertiary))' }} className="whitespace-nowrap">
                  {formatWeeksAway(deadline.weekNumber)}
                </span>
              </div>
            ))}
            {moreCount > 0 && (
              <div className="text-xs" style={{ color: 'rgb(var(--text-tertiary))' }}>
                +{moreCount} more
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quote at the bottom */}
      <div className="mt-auto">
        <p className="text-sm italic leading-relaxed mb-3" style={{ color: 'rgb(var(--text-secondary))' }}>
          Deadlines make you act. Nothing makes you call your parents. Choose this week on purpose.
        </p>
        <p className="text-xs" style={{ color: 'rgb(var(--text-tertiary))' }}>
          Inspired by{' '}
          <a
            href="https://waitbutwhy.com/2014/05/life-weeks.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
            style={{ color: 'rgb(var(--text-secondary))' }}
          >
            Tim Urban
          </a>
        </p>
      </div>
    </div>
  );
}
