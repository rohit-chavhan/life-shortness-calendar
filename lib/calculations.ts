import { Person, WeekInfo, Stats } from './types';

const WEEKS_PER_YEAR = 52;

// SINGLE SOURCE OF TRUTH for weeks lived
export function getWeeksLived(person: Person): number {
  if (!person || !person.dateOfBirth) {
    console.error('Invalid person object:', person);
    return 0;
  }
  
  const birthDate = new Date(person.dateOfBirth);
  
  // Validate the date
  if (isNaN(birthDate.getTime())) {
    console.error('Invalid date of birth:', person.dateOfBirth);
    return 0;
  }
  
  const today = new Date();
  
  // Calculate full years completed
  let fullYears = today.getFullYear() - birthDate.getFullYear();
  
  // Check if birthday has occurred this year
  const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
  // Handle Feb 29 birthdays in non-leap years
  if (birthDate.getMonth() === 1 && birthDate.getDate() === 29) {
    const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (!isLeapYear(today.getFullYear())) {
      birthdayThisYear.setDate(28);
    }
  }
  
  if (today < birthdayThisYear) {
    fullYears--;
  }
  
  // Calculate days since last birthday
  const lastBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (today < lastBirthday) {
    lastBirthday.setFullYear(lastBirthday.getFullYear() - 1);
  }
  
  // Handle Feb 29 for last birthday
  if (birthDate.getMonth() === 1 && birthDate.getDate() === 29) {
    const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (!isLeapYear(lastBirthday.getFullYear())) {
      lastBirthday.setDate(28);
    }
  }
  
  const daysSinceBirthday = Math.floor((today.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate weeks lived
  const weeksThisYear = Math.min(51, Math.floor(daysSinceBirthday / 7));
  const weeksLived = fullYears * WEEKS_PER_YEAR + weeksThisYear;
  
  return weeksLived;
}

export function getAge(person: Person): number {
  const birthDate = new Date(person.dateOfBirth);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
  // Handle Feb 29 birthdays
  if (birthDate.getMonth() === 1 && birthDate.getDate() === 29) {
    const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (!isLeapYear(today.getFullYear())) {
      birthdayThisYear.setDate(28);
    }
  }
  
  if (today < birthdayThisYear) {
    age--;
  }
  
  return age;
}

export function calculateStats(person: Person): Stats {
  const totalWeeks = person.lifeExpectancy * WEEKS_PER_YEAR;
  const weeksLived = getWeeksLived(person);
  const weeksRemaining = totalWeeks - weeksLived;
  const percentLived = (weeksLived / totalWeeks) * 100;
  const age = getAge(person);
  const yearsRemaining = weeksRemaining / WEEKS_PER_YEAR;

  return {
    weeksLived,
    weeksRemaining,
    percentLived,
    yearsRemaining,
    totalWeeks,
    age,
  };
}

export function generateWeekData(person: Person): WeekInfo[] {
  const weeks: WeekInfo[] = [];
  const totalWeeks = person.lifeExpectancy * WEEKS_PER_YEAR;
  const weeksLived = getWeeksLived(person);
  const birthDate = new Date(person.dateOfBirth);
  const birthYear = birthDate.getFullYear();

  for (let i = 0; i < totalWeeks; i++) {
    const age = Math.floor(i / WEEKS_PER_YEAR);
    const weekInYear = i % WEEKS_PER_YEAR;
    const year = birthYear + age;
    
    weeks.push({
      weekNumber: i,
      age,
      year,
      isLived: i < weeksLived,
      isCurrent: i === weeksLived,
    });
  }

  // Validation check
  const filledCells = weeks.filter(w => w.isLived).length;
  if (filledCells !== weeksLived) {
    console.error(`VALIDATION ERROR: Filled cells (${filledCells}) != weeksLived (${weeksLived})`);
  }

  return weeks;
}

export function calculateAdditionalStats(person: Person) {
  const stats = calculateStats(person);
  const weeksLived = getWeeksLived(person);
  
  // Weeks left until next birthday (current year column)
  const currentYearWeek = weeksLived % WEEKS_PER_YEAR;
  const weeksLeftThisYear = WEEKS_PER_YEAR - currentYearWeek;
  
  // Days and waking hours
  const daysLeft = Math.floor(stats.weeksRemaining * 7);
  const wakingHoursLeft = Math.floor(daysLeft * 16); // 16 waking hours per day
  
  // Calculate weeks until milestone ages
  const age = stats.age;
  const weeksUntil30 = age < 30 ? (30 - age) * WEEKS_PER_YEAR - currentYearWeek : null;
  const weeksUntil40 = age < 40 ? (40 - age) * WEEKS_PER_YEAR - currentYearWeek : null;
  const weeksUntil50 = age < 50 ? (50 - age) * WEEKS_PER_YEAR - currentYearWeek : null;
  
  return {
    ...stats,
    daysLeft,
    wakingHoursLeft,
    weeksLeftThisYear,
    weeksUntil30,
    weeksUntil40,
    weeksUntil50,
  };
}

export function calculateTimeWithParents(
  person: Person,
  daysPerYear: number
): { days: number; months: number } {
  const weeksLived = getWeeksLived(person);
  const totalWeeks = person.lifeExpectancy * WEEKS_PER_YEAR;
  const weeksRemaining = totalWeeks - weeksLived;
  const yearsRemaining = weeksRemaining / WEEKS_PER_YEAR;
  const days = Math.round(yearsRemaining * daysPerYear);
  const months = days / 30.44; // Average days per month
  return { days: Math.max(0, days), months: Math.max(0, months) };
}

export const DEFAULT_PEOPLE = {
  me: {
    name: 'Me',
    dateOfBirth: '2002-11-03',
    lifeExpectancy: 73,
  },
  dad: {
    name: 'Dad',
    dateOfBirth: '1973-08-20',
    lifeExpectancy: 73,
  },
  mom: {
    name: 'Mom',
    dateOfBirth: '1977-12-25',
    lifeExpectancy: 73,
  },
};

// Storage version for migrations
export const STORAGE_VERSION = 2;
