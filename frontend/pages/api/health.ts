import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'healthy',
      service: 'DataSwift API',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 