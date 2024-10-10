'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export default function CalendarIntegration() {
  const [user] = useAuthState(auth);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const checkCalendarConnection = async () => {
    if (!user) return;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    setIsConnected(!!userData?.googleCalendarToken);
  };

  const connectGoogleCalendar = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/auth/google/url?userId=${user.uid}`);
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect Google Calendar',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Calendar Integration</h3>
      {isConnected ? (
        <p>Google Calendar is connected</p>
      ) : (
        <Button onClick={connectGoogleCalendar}>Connect Google Calendar</Button>
      )}
    </div>
  );
}