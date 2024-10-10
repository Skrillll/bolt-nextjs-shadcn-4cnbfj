'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '@/lib/firebase';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AISuggestions() {
  const [user] = useAuthState(auth);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const generateTaskSuggestions = httpsCallable(functions, 'generateTaskSuggestions');
      const result = await generateTaskSuggestions({ userId: user.uid });
      setSuggestions((result.data as any).suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate task suggestions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button onClick={generateSuggestions} disabled={loading}>
        {loading ? 'Generating...' : 'Get AI Suggestions'}
      </Button>
      {suggestions.length > 0 && (
        <ul className="mt-2 space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="bg-secondary p-2 rounded">
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}