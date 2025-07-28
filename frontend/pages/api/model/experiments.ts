import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

  try {
    switch (req.method) {
      case 'GET': {
        const { user_id, dataset_id } = req.query;
        
        if (!user_id) {
          return res.status(400).json({ error: 'user_id is required' });
        }

        const queryParams = new URLSearchParams();
        queryParams.append('user_id', user_id as string);
        if (dataset_id) {
          queryParams.append('dataset_id', dataset_id as string);
        }

        const response = await fetch(`${backendUrl}/api/model/experiments?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        return res.status(response.status).json(data);
      }

      case 'POST': {
        const response = await fetch(`${backendUrl}/api/model/experiments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        });

        const data = await response.json();
        return res.status(response.status).json(data);
      }

      case 'DELETE': {
        const { experiment_id } = req.query;
        
        if (!experiment_id) {
          return res.status(400).json({ error: 'experiment_id is required' });
        }

        const response = await fetch(`${backendUrl}/api/model/experiments/${experiment_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        return res.status(response.status).json(data);
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Model experiments error:', error);
    return res.status(500).json({ error: 'Failed to handle model experiments' });
  }
} 