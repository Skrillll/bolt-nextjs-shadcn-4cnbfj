'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DatePicker } from './ui/date-picker';
import { Switch } from './ui/switch';
import { useToast } from '@/hooks/use-toast';
import { RecurrencePattern } from '@/types/todo';

export default function AddTodo() {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>({
    frequency: 'daily',
    interval: 1,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'todos'), {
        title,
        description,
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp(),
        priority,
        dueDate,
        category,
        labels,
        subTasks: [],
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : null,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(undefined);
      setCategory('');
      setLabels([]);
      setIsRecurring(false);
      setRecurrencePattern({ frequency: 'daily', interval: 1 });
      toast({
        title: 'Success',
        description: 'Todo added successfully',
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to add todo',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
      <DatePicker
        date={dueDate}
        setDate={setDueDate}
        label="Due Date"
      />
      <Input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />
      <Input
        type="text"
        value={labels.join(', ')}
        onChange={(e) => setLabels(e.target.value.split(',').map(label => label.trim()))}
        placeholder="Labels (comma-separated)"
      />
      <div className="flex items-center space-x-2">
        <Switch
          checked={isRecurring}
          onCheckedChange={setIsRecurring}
          id="recurring-task"
        />
        <label htmlFor="recurring-task">Recurring Task</label>
      </div>
      {isRecurring && (
        <div className="space-y-2">
          <Select
            value={recurrencePattern.frequency}
            onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') =>
              setRecurrencePattern({ ...recurrencePattern, frequency: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={recurrencePattern.interval}
            onChange={(e) =>
              setRecurrencePattern({ ...recurrencePattern, interval: parseInt(e.target.value) })
            }
            placeholder="Interval"
            min="1"
          />
          {/* Add more fields for specific recurrence patterns (e.g., days of week for weekly) */}
        </div>
      )}
      <Button type="submit">Add Todo</Button>
    </form>
  );
}