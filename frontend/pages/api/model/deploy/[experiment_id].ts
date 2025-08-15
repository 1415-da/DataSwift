import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { experiment_id } = req.query;
    
    if (!experiment_id || typeof experiment_id !== 'string') {
      return res.status(400).json({ error: 'experiment_id is required' });
    }

    // Forward the request to the backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';
    console.log('Deploy API - Backend URL being used:', backendUrl);
    console.log('Deploy API - Experiment ID:', experiment_id);
    const response = await fetch(`${backendUrl}/api/model/deploy/${experiment_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Deploy error:', error);
    return res.status(500).json({ error: 'Failed to deploy model' });
  }
}
