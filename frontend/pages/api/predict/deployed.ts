import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/predict/deployed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Deployed models error:', error);
    return res.status(500).json({ error: 'Failed to get deployed models' });
  }
} 