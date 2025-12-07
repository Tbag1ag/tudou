export interface Habit {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO Date string YYYY-MM-DD
  link?: string;
  icon?: string;
  category?: string;
}

export interface DayStats {
  date: string;
  total: number;
  completed: number;
}