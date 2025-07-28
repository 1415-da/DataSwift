import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Simulate user profile data
      const userProfile = {
        id: 'user_123',
        email: 'user@example.com',
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/150',
        role: 'data_scientist',
        preferences: {
          theme: 'dark',
          notifications: true,
          language: 'en',
        },
        stats: {
          datasetsUploaded: 15,
          modelsTrained: 8,
          predictionsMade: 1250,
          lastActive: new Date().toISOString(),
        },
        createdAt: '2024-01-01T00:00:00Z',
      };

      res.status(200).json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, preferences } = req.body;

      // Simulate profile update
      const updatedProfile = {
        id: 'user_123',
        name: name || 'John Doe',
        preferences: preferences || {},
        updatedAt: new Date().toISOString(),
      };

      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 