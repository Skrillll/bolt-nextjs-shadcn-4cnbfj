'use client';

import { useEffect } from 'react';
import { initializeFCM } from '@/lib/fcm';

export default function FCMInitializer() {
  useEffect(() => {
    initializeFCM();
  }, []);

  return null;
}