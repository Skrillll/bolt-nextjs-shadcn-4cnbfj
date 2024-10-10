import { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
  );

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    await setDoc(doc(db, 'users', state as string), { googleCalendarToken: tokens }, { merge: true });

    res.redirect('/calendar-connected');
  } catch (error) {
    console.error('Error getting Google Calendar tokens:', error);
    res.status(500).json({ error: 'Failed to connect Google Calendar' });
  }
}