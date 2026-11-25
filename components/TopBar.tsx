'use client';

import { PersonType, Person } from '@/lib/types';
import ThemeToggle from './ThemeToggle';
import SettingsPanel from './SettingsPanel';

interface TopBarProps {
  selectedPerson: PersonType;
  onSelectPerson: (person: PersonType) => void;
  names: { me: string; dad: string; mom: string };
  currentPerson: Person;
  onUpdatePerson: (person: Person) => void;
}

export default function TopBar({
  selectedPerson,
  onSelectPerson,
  names,
  currentPerson,
  onUpdatePerson,
}: TopBarProps) {
  const tabs: { id: PersonType; label: string }[] = [
    { id: 'me', label: names.me },
    { id: 'dad', label: names.dad },
    { id: 'mom', label: names.mom },
  ];

  return (
    <div 
      className="h-14 flex items-center justify-between px-6"
      style={{ borderBottom: '1px solid rgb(var(--border-panel))' }}
    >
      {/* Title */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
          Life in Weeks
        </h1>
      </div>

      {/* Person tabs - centered */}
      <div 
        className="flex gap-1 rounded-lg p-1"
        style={{ background: 'rgb(var(--bg-panel-alt))' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectPerson(tab.id)}
            className="px-6 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{
              background: selectedPerson === tab.id ? 'rgb(var(--bg-panel))' : 'transparent',
              color: selectedPerson === tab.id ? 'rgb(var(--text-primary))' : 'rgb(var(--text-secondary))',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        <SettingsPanel person={currentPerson} onUpdate={onUpdatePerson} />
        <ThemeToggle />
      </div>
    </div>
  );
}
