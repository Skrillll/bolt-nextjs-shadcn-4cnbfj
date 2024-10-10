'use client';

import { useState } from 'react';
import { signInWithPopup, signInWithRedirect, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        // Fallback to redirect-based sign-in
        await signInWithRedirect(auth, new GoogleAuthProvider());
      } else {
        console.error('Error signing in with Google', error);
        toast({
          title: 'Error',
          description: 'Failed to sign in with Google',
          variant: 'destructive',
        });
      }
    }
  };

  // ... rest of the component remains the same
}