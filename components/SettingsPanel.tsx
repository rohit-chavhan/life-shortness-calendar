'use client';

import { useState } from 'react';
import { Person } from '@/lib/types';
import { getAge } from '@/lib/calculations';

interface SettingsPanelProps {
  person: Person;
  onUpdate: (person: Person) => void;
}

export default function SettingsPanel({ person, onUpdate }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(person);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsOpen(false);
  };

  const currentAge = getAge(formData);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: 'rgb(var(--text-secondary))' }}
        className="text-sm hover:opacity-80 transition-colors flex items-center gap-1"
      >
        <span>⚙️</span>
        <span>Edit Details</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 p-4"
            style={{ 
              background: 'rgb(var(--bg-panel))',
              border: '1px solid rgb(var(--border-panel))'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: 'rgb(var(--text-primary))' }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none"
                  style={{
                    background: 'rgb(var(--input-bg))',
                    borderColor: 'rgb(var(--input-border))',
                    color: 'rgb(var(--text-primary))',
                  }}
                  required
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: 'rgb(var(--text-primary))' }}
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none"
                  style={{
                    background: 'rgb(var(--input-bg))',
                    borderColor: 'rgb(var(--input-border))',
                    color: 'rgb(var(--text-primary))',
                  }}
                  required
                />
                <p className="mt-1 text-xs" style={{ color: 'rgb(var(--text-tertiary))' }}>
                  Current age: {currentAge} years
                </p>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: 'rgb(var(--text-primary))' }}
                >
                  Life Expectancy
                </label>
                <input
                  type="number"
                  min="1"
                  max="150"
                  value={formData.lifeExpectancy}
                  onChange={(e) =>
                    setFormData({ ...formData, lifeExpectancy: parseInt(e.target.value) || 73 })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none"
                  style={{
                    background: 'rgb(var(--input-bg))',
                    borderColor: 'rgb(var(--input-border))',
                    color: 'rgb(var(--text-primary))',
                  }}
                  required
                />
                <p className="mt-1 text-xs" style={{ color: 'rgb(var(--text-tertiary))' }}>
                  Average life expectancy (India: 73 years)
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-md font-medium transition-colors"
                  style={{ 
                    background: 'rgb(var(--number-primary))',
                    color: 'white'
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 rounded-md font-medium transition-colors"
                  style={{
                    background: 'rgb(var(--button-bg))',
                    color: 'rgb(var(--text-primary))'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
