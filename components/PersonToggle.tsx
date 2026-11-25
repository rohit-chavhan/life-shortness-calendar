'use client';

import { PersonType } from '@/lib/types';

interface PersonToggleProps {
  selected: PersonType;
  onSelect: (person: PersonType) => void;
  names: { me: string; dad: string; mom: string };
}

export default function PersonToggle({ selected, onSelect, names }: PersonToggleProps) {
  const tabs: { id: PersonType; label: string }[] = [
    { id: 'me', label: names.me },
    { id: 'dad', label: names.dad },
    { id: 'mom', label: names.mom },
  ];

  return (
    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`
            px-6 py-2 rounded-md font-medium transition-all
            ${
              selected === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
