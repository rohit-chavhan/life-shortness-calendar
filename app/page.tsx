'use client';

import { useState } from 'react';
import { PersonType, PersonData, DeadlinesData, Deadline } from '@/lib/types';
import { DEFAULT_PEOPLE } from '@/lib/calculations';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { saveDeadlines, getInitialDeadlines } from '@/lib/storage';
import TopBar from '@/components/TopBar';
import FlippedLifeGrid from '@/components/FlippedLifeGrid';
import StatsPanel from '@/components/StatsPanel';

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<PersonType>('me');
  const [peopleData, setPeopleData, isClient] = useLocalStorage<PersonData>(
    'life-calendar-data',
    DEFAULT_PEOPLE
  );
  const [deadlinesData, setDeadlinesData] = useLocalStorage<DeadlinesData>(
    'life-calendar-deadlines',
    { me: [], dad: [], mom: [] }
  );

  const currentPerson = peopleData[selectedPerson];
  const currentDeadlines = deadlinesData[selectedPerson];

  const handleUpdatePerson = (updatedPerson: PersonData[PersonType]) => {
    setPeopleData({
      ...peopleData,
      [selectedPerson]: updatedPerson,
    });
  };

  const handleAddDeadline = (weekNumber: number, label: string) => {
    const updated = { ...deadlinesData };
    const existing = updated[selectedPerson].find(d => d.weekNumber === weekNumber);
    
    if (existing) {
      // Update existing deadline
      existing.label = label;
    } else {
      // Add new deadline
      updated[selectedPerson] = [...updated[selectedPerson], {
        weekNumber,
        label,
        createdAt: Date.now(),
      }];
    }
    
    setDeadlinesData(updated);
    saveDeadlines(updated);
  };

  const handleDeleteDeadline = (weekNumber: number) => {
    const updated = { ...deadlinesData };
    updated[selectedPerson] = updated[selectedPerson].filter(d => d.weekNumber !== weekNumber);
    setDeadlinesData(updated);
    saveDeadlines(updated);
  };

  const names = {
    me: peopleData.me.name,
    dad: peopleData.dad.name,
    mom: peopleData.mom.name,
  };

  if (!isClient) {
    return (
      <div 
        className="h-dvh flex items-center justify-center"
        style={{ 
          background: 'rgb(var(--bg-page))',
          color: 'rgb(var(--text-secondary))'
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <main 
      className="h-dvh overflow-hidden flex flex-col"
      style={{ 
        background: 'rgb(var(--bg-page))',
        color: 'rgb(var(--text-primary))'
      }}
    >
      {/* Top bar */}
      <TopBar
        selectedPerson={selectedPerson}
        onSelectPerson={setSelectedPerson}
        names={names}
        currentPerson={currentPerson}
        onUpdatePerson={handleUpdatePerson}
      />

      {/* Two column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Grid - 72% */}
        <div className="flex-[0.72]">
          <FlippedLifeGrid 
            person={currentPerson} 
            deadlines={currentDeadlines}
            onAddDeadline={handleAddDeadline}
            onDeleteDeadline={handleDeleteDeadline}
            key={selectedPerson} 
          />
        </div>

        {/* Stats panel - 28% */}
        <div 
          className="flex-[0.28]"
          style={{ borderLeft: '1px solid rgb(var(--border-panel))' }}
        >
          <StatsPanel
            person={currentPerson}
            personType={selectedPerson}
            dadData={peopleData.dad}
            momData={peopleData.mom}
            deadlines={currentDeadlines}
          />
        </div>
      </div>
    </main>
  );
}
