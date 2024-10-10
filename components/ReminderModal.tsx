'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DatePicker } from './ui/date-picker';
import { useToast } from '@/hooks/use-toast';

interface ReminderModalProps {
  todoId: string;
}

export default function ReminderModal({ todoId }: ReminderModalProps) {
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [reminderTime, setReminderTime] = useState('');
  const { toast } = useToast();

  const setReminder = async () => {
    if (!reminderDate || !reminderTime) {
      toast({
        title: 'Error',
        description: 'Please select both date and time for the reminder',
        variant: 'destructive',
      });
      return;
    }

    const [hours, minutes] = reminderTime.split(':').map(Number);
    const reminderDateTime = new Date(reminderDate);
    reminderDateTime.setHours(hours, minutes);

    try {
      await updateDoc(doc(db, 'todos', todoId), {
        reminder: reminderDateTime.toISOString(),
      });
      toast({
        title: 'Success',
        description: 'Reminder set successfully',
      });
    } catch (error) {
      console.error('Error setting reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to set reminder',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Set Reminder</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Reminder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DatePicker
            date={reminderDate}
            setDate={setReminderDate}
            label="Reminder Date"
          />
          <Input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
          <Button onClick={setReminder}>Set Reminder</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}