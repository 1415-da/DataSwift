import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { experiment_id, task } = req.body;
    
    if (!experiment_id) {
      return res.status(400).json({ error: 'experiment_id is required' });
    }

    // Forward the request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/predict/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ experiment_id, task }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Deploy error:', error);
    return res.status(500).json({ error: 'Failed to deploy model' });
  }
} 