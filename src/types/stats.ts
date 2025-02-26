export interface DailyStats {
  date: string;
  focusTime: number;
  breakTime: number;
  pomodorosCompleted: number;
  tasksCompleted: number;
}

// Remove the old UserStats interface and replace with just what we need
export interface UserStatsData {
  recentDays: DailyStats[];
}
