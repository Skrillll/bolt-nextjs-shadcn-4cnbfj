export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category?: string;
  labels: string[];
  subTasks: SubTask[];
  collaborators: string[];
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  dayOfMonth?: number;
  monthOfYear?: number;
}