import { PersonData, DeadlinesData } from './types';
import { DEFAULT_PEOPLE, STORAGE_VERSION } from './calculations';

const STORAGE_KEY = 'life-calendar-data';
const VERSION_KEY = 'life-calendar-version';
const DEADLINES_KEY = 'life-calendar-deadlines';
const DEADLINES_VERSION_KEY = 'life-calendar-deadlines-version';
const DEADLINES_VERSION = 1;

export function saveToLocalStorage(data: PersonData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION.toString());
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage(): PersonData | null {
  if (typeof window === 'undefined') return null;
  try {
    const version = localStorage.getItem(VERSION_KEY);
    const currentVersion = STORAGE_VERSION.toString();
    
    // If version mismatch or no version, reset to defaults
    if (version !== currentVersion) {
      console.log('Storage version mismatch, resetting to defaults');
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, currentVersion);
      return null;
    }
    
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
}

export function getInitialData(): PersonData {
  return loadFromLocalStorage() || DEFAULT_PEOPLE;
}

export function saveDeadlines(data: DeadlinesData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEADLINES_KEY, JSON.stringify(data));
    localStorage.setItem(DEADLINES_VERSION_KEY, DEADLINES_VERSION.toString());
  } catch (error) {
    console.error('Failed to save deadlines:', error);
  }
}

export function loadDeadlines(): DeadlinesData | null {
  if (typeof window === 'undefined') return null;
  try {
    const version = localStorage.getItem(DEADLINES_VERSION_KEY);
    const currentVersion = DEADLINES_VERSION.toString();
    
    if (version !== currentVersion) {
      console.log('Deadlines version mismatch, resetting');
      localStorage.removeItem(DEADLINES_KEY);
      localStorage.setItem(DEADLINES_VERSION_KEY, currentVersion);
      return null;
    }
    
    const data = localStorage.getItem(DEADLINES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load deadlines:', error);
  }
  return null;
}

export function getInitialDeadlines(): DeadlinesData {
  return loadDeadlines() || { me: [], dad: [], mom: [] };
}
