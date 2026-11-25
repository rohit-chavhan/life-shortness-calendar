'use client';

import { useEffect, useRef, useState } from 'react';
import { Person, Deadline } from '@/lib/types';
import { generateWeekData } from '@/lib/calculations';

interface FlippedLifeGridProps {
  person: Person;
  deadlines: Deadline[];
  onAddDeadline: (weekNumber: number, label: string) => void;
  onDeleteDeadline: (weekNumber: number) => void;
}

export default function FlippedLifeGrid({ person, deadlines, onAddDeadline, onDeleteDeadline }: FlippedLifeGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = useState(14);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState({ age: 0, year: 0, week: 0, x: 0, y: 0, label: '', date: '' });
  const [showPopover, setShowPopover] = useState(false);
  const [popoverData, setPopoverData] = useState({ weekNumber: 0, x: 0, y: 0, existingLabel: '' });
  const [deadlineLabel, setDeadlineLabel] = useState('');

  // Safety check
  if (!person || !person.dateOfBirth || !person.lifeExpectancy) {
    return (
      <div className="relative h-full w-full overflow-hidden p-4 flex items-center justify-center">
        <div style={{ color: 'rgb(var(--text-secondary))' }}>Loading...</div>
      </div>
    );
  }

  const weeks = generateWeekData(person);
  const WEEKS_PER_YEAR = 52;
  const YEARS = person.lifeExpectancy;
  const GAP = 2;
  const DECADE_GAP = 8;

  useEffect(() => {
    const calculateBoxSize = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const availableWidth = container.clientWidth - 60;
      const availableHeight = container.clientHeight - 70; // More space for legend
      
      const decades = Math.floor(YEARS / 10);
      const totalDecadeGaps = decades * DECADE_GAP;
      const totalNormalGaps = (YEARS - 1) * GAP - decades * GAP;
      const totalHorizontalGaps = totalDecadeGaps + totalNormalGaps;
      
      const totalVerticalGaps = (WEEKS_PER_YEAR - 1) * GAP;
      
      const widthPerBox = (availableWidth - totalHorizontalGaps) / YEARS;
      const heightPerBox = (availableHeight - totalVerticalGaps) / WEEKS_PER_YEAR;
      
      const size = Math.floor(Math.min(widthPerBox, heightPerBox, 16));
      setBoxSize(size);
    };

    calculateBoxSize();
    window.addEventListener('resize', calculateBoxSize);
    return () => window.removeEventListener('resize', calculateBoxSize);
  }, [YEARS, WEEKS_PER_YEAR]);

  // Calculate approximate date for a week
  const getApproximateDate = (weekNumber: number) => {
    const birthDate = new Date(person.dateOfBirth);
    const weeksFromBirth = weekNumber;
    const daysFromBirth = weeksFromBirth * 7;
    const targetDate = new Date(birthDate);
    targetDate.setDate(targetDate.getDate() + daysFromBirth);
    
    const month = targetDate.toLocaleDateString('en-US', { month: 'short' });
    const year = targetDate.getFullYear();
    return `~${month} ${year}`;
  };

  const handleMouseEnter = (week: ReturnType<typeof generateWeekData>[0], e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const deadline = deadlines?.find(d => d.weekNumber === week.weekNumber);
    setTooltipData({
      age: week.age,
      year: week.year,
      week: week.weekNumber % WEEKS_PER_YEAR + 1,
      x: rect.left + rect.width / 2,
      y: rect.top,
      label: deadline?.label || '',
      date: getApproximateDate(week.weekNumber),
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleBoxClick = (week: ReturnType<typeof generateWeekData>[0], e: React.MouseEvent) => {
    // Only allow clicking on remaining weeks (not lived, not current)
    const hasDeadline = deadlines?.some(d => d.weekNumber === week.weekNumber);
    if ((!week.isLived && !week.isCurrent) || hasDeadline) {
      const rect = e.currentTarget.getBoundingClientRect();
      const deadline = deadlines?.find(d => d.weekNumber === week.weekNumber);
      setPopoverData({
        weekNumber: week.weekNumber,
        x: rect.left + rect.width / 2,
        y: rect.bottom + 5,
        existingLabel: deadline?.label || '',
      });
      setDeadlineLabel(deadline?.label || '');
      setShowPopover(true);
      setShowTooltip(false);
    }
  };

  const handleSaveDeadline = () => {
    if (deadlineLabel.trim()) {
      onAddDeadline(popoverData.weekNumber, deadlineLabel.trim().slice(0, 40));
    }
    setShowPopover(false);
    setDeadlineLabel('');
  };

  const handleDeleteDeadline = () => {
    onDeleteDeadline(popoverData.weekNumber);
    setShowPopover(false);
    setDeadlineLabel('');
  };

  const handleCancelDeadline = () => {
    setShowPopover(false);
    setDeadlineLabel('');
  };

  const grid: (typeof weeks)[][] = Array.from({ length: YEARS }, (_, yearIndex) => {
    return Array.from({ length: WEEKS_PER_YEAR }, (_, weekIndex) => {
      const weekNumber = yearIndex * WEEKS_PER_YEAR + weekIndex;
      return weeks[weekNumber] || weeks[weeks.length - 1];
    });
  });

  const getColumnGap = (yearIndex: number) => {
    return (yearIndex + 1) % 10 === 0 && yearIndex < YEARS - 1 ? DECADE_GAP : GAP;
  };

  const gridWidth = YEARS * boxSize + (YEARS - 1) * GAP + Math.floor(YEARS / 10) * (DECADE_GAP - GAP);
  const gridHeight = WEEKS_PER_YEAR * boxSize + (WEEKS_PER_YEAR - 1) * GAP;

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden p-4 flex flex-col items-center justify-center">
      <div className="flex items-center mb-2 relative" style={{ width: `${gridWidth + 32}px` }}>
        {Array.from({ length: Math.ceil(YEARS / 10) }, (_, i) => {
          const decade = i * 10;
          const leftOffset = i === 0 ? 0 : i * 10 * (boxSize + GAP) + (i - 1) * DECADE_GAP + DECADE_GAP;
          return (
            <div
              key={decade}
              className="text-xs absolute"
              style={{ 
                left: `${leftOffset + 32}px`,
                color: 'rgb(var(--text-tertiary))'
              }}
            >
              {decade}
            </div>
          );
        })}
      </div>

      <div className="relative" style={{ width: `${gridWidth + 32}px`, height: `${gridHeight}px` }}>
        <div className="flex gap-0 h-full" style={{ paddingLeft: '32px' }}>
          {grid.map((column, yearIndex) => (
            <div
              key={yearIndex}
              className="flex flex-col gap-0"
              style={{ marginRight: `${getColumnGap(yearIndex)}px` }}
            >
              {column.map((week) => {
                const isLived = week.isLived;
                const isCurrent = week.isCurrent;
                const isRemaining = !isLived && !isCurrent;
                const hasDeadline = deadlines?.some(d => d.weekNumber === week.weekNumber) || false;

                const getBackgroundColor = () => {
                  if (isLived) return 'rgb(var(--week-lived))';
                  if (isRemaining) return 'rgb(var(--week-remaining))';
                  return 'transparent';
                };

                return (
                  <div
                    key={week.weekNumber}
                    onMouseEnter={(e) => handleMouseEnter(week, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => handleBoxClick(week, e)}
                    className={`transition-all relative ${isCurrent ? 'week-current' : ''} ${!isLived && !isCurrent ? 'cursor-pointer hover:opacity-80' : ''}`}
                    style={{
                      width: `${boxSize}px`,
                      height: `${boxSize}px`,
                      marginBottom: `${GAP}px`,
                      borderRadius: '2px',
                      backgroundColor: getBackgroundColor(),
                      boxShadow: isCurrent ? '0 0 0 2px rgb(var(--week-current-ring))' : undefined,
                      animation: isCurrent ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : undefined,
                    }}
                  >
                    {hasDeadline && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            border: '1px solid rgb(var(--text-primary))',
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Life expectancy line */}
        <div
          className="absolute top-0 w-px"
          style={{
            background: 'rgb(var(--line-expectancy))',
            left: `${32 + person.lifeExpectancy * (boxSize + GAP) + Math.floor(person.lifeExpectancy / 10) * (DECADE_GAP - GAP)}px`,
            height: `${gridHeight}px`,
          }}
        >
          <div
            className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium"
            style={{ color: 'rgb(var(--line-expectancy))' }}
          >
            {person.lifeExpectancy}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 text-xs flex items-center gap-4" style={{ color: 'rgb(var(--text-tertiary))' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgb(var(--week-lived))', borderRadius: '2px' }} />
          <span>lived</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgb(var(--week-remaining))', borderRadius: '2px' }} />
          <span>left</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: '12px', height: '12px', border: '2px solid rgb(var(--week-current-ring))', borderRadius: '2px' }} />
          <span>this week</span>
        </div>
        <span>|</span>
        <span>each box = 1 week, each column = 1 year</span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed z-50 px-3 py-2 text-xs rounded shadow-lg pointer-events-none"
          style={{
            background: 'rgb(var(--bg-panel))',
            color: 'rgb(var(--text-primary))',
            border: '1px solid rgb(var(--border-panel))',
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y - 50}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {tooltipData.label ? (
            <div className="font-medium mb-1">{tooltipData.label}</div>
          ) : null}
          <div>Age {tooltipData.age} • {tooltipData.date}</div>
        </div>
      )}

      {/* Deadline Popover */}
      {showPopover && (
        <div
          className="fixed z-50 p-3 rounded shadow-xl"
          style={{
            background: 'rgb(var(--bg-panel))',
            border: '1px solid rgb(var(--border-panel))',
            left: `${popoverData.x}px`,
            top: `${popoverData.y}px`,
            transform: 'translateX(-50%)',
            minWidth: '250px',
          }}
        >
          <input
            type="text"
            maxLength={40}
            value={deadlineLabel}
            onChange={(e) => setDeadlineLabel(e.target.value)}
            placeholder="Deadline label (max 40 chars)"
            className="w-full px-2 py-1.5 text-sm border rounded mb-2 focus:outline-none focus:ring-1"
            style={{
              background: 'rgb(var(--input-bg))',
              borderColor: 'rgb(var(--input-border))',
              color: 'rgb(var(--text-primary))',
            }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveDeadline();
              if (e.key === 'Escape') handleCancelDeadline();
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveDeadline}
              className="flex-1 px-3 py-1.5 text-sm rounded font-medium transition-colors"
              style={{
                background: 'rgb(var(--number-secondary))',
                color: 'rgb(var(--bg-page))',
              }}
            >
              Save
            </button>
            {popoverData.existingLabel && (
              <button
                onClick={handleDeleteDeadline}
                className="px-3 py-1.5 text-sm rounded transition-colors"
                style={{
                  background: 'rgb(var(--button-bg))',
                  color: 'rgb(var(--line-expectancy))',
                }}
              >
                Delete
              </button>
            )}
            <button
              onClick={handleCancelDeadline}
              className="px-3 py-1.5 text-sm rounded transition-colors"
              style={{
                background: 'rgb(var(--button-bg))',
                color: 'rgb(var(--text-secondary))',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
