import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebase';

export const initializeFCM = async () => {
  try {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
      console.log('FCM Token:', token);
      
      onMessage(messaging, (payload) => {
        console.log('Received foreground message:', payload);
        // Handle the message and show a notification if needed
      });

      return token;
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.error('Error initializing FCM:', error);
  }
};