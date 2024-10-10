import { RecurrencePattern, Todo } from '@/types/todo';
import { addDays, addWeeks, addMonths, addYears, isBefore } from 'date-fns';

export function getNextOccurrence(todo: Todo): Date | null {
  if (!todo.isRecurring || !todo.recurrencePattern || !todo.dueDate) {
    return null;
  }

  const { frequency, interval, endDate } = todo.recurrencePattern;
  let nextDate = new Date(todo.dueDate);

  switch (frequency) {
    case 'daily':
      nextDate = addDays(nextDate, interval);
      break;
    case 'weekly':
      nextDate = addWeeks(nextDate, interval);
      break;
    case 'monthly':
      nextDate = addMonths(nextDate, interval);
      break;
    case 'yearly':
      nextDate = addYears(nextDate, interval);
      break;
  }

  if (endDate && isBefore(endDate, nextDate)) {
    return null;
  }

  return nextDate;
}

export function generateRecurringTasks(todo: Todo, until: Date): Todo[] {
  const recurringTasks: Todo[] = [];
  let currentDate = new Date(todo.dueDate!);

  while (isBefore(currentDate, until)) {
    const newTodo: Todo = {
      ...todo,
      id: `${todo.id}-${currentDate.getTime()}`,
      dueDate: new Date(currentDate),
      completed: false,
    };
    recurringTasks.push(newTodo);

    const nextDate = getNextOccurrence(newTodo);
    if (!nextDate) break;
    currentDate = nextDate;
  }

  return recurringTasks;
}