import { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleAuthUrl } from '@/lib/calendar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }

  try {
    const url = await getGoogleAuthUrl(userId as string);
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    res.status(500).json({ error: 'Failed to generate Google auth URL' });
  }
}