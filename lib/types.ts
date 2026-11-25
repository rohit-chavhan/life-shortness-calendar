export type PersonType = 'me' | 'dad' | 'mom';

export interface Person {
  name: string;
  dateOfBirth: string; // ISO date string YYYY-MM-DD
  lifeExpectancy: number;
}

export interface PersonData {
  me: Person;
  dad: Person;
  mom: Person;
}

export interface WeekInfo {
  weekNumber: number;
  age: number;
  year: number;
  isLived: boolean;
  isCurrent: boolean;
}

export interface Stats {
  weeksLived: number;
  weeksRemaining: number;
  percentLived: number;
  yearsRemaining: number;
  totalWeeks: number;
  age: number;
}

export interface Deadline {
  weekNumber: number;
  label: string;
  createdAt: number;
}

export interface DeadlinesData {
  me: Deadline[];
  dad: Deadline[];
  mom: Deadline[];
}
