import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Simulate knowledge articles
      const articles = [
        {
          id: '1',
          title: 'Getting Started with DataSwift',
          content: 'Learn how to upload your first dataset and start your data science journey.',
          category: 'getting-started',
          tags: ['tutorial', 'beginner'],
          author: 'DataSwift Team',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Best Practices for Data Preprocessing',
          content: 'Essential techniques for cleaning and preparing your data for analysis.',
          category: 'data-preprocessing',
          tags: ['data-cleaning', 'preprocessing'],
          author: 'DataSwift Team',
          createdAt: '2024-01-20T14:30:00Z',
        },
        {
          id: '3',
          title: 'Understanding Model Performance Metrics',
          content: 'A comprehensive guide to evaluating your machine learning models.',
          category: 'model-evaluation',
          tags: ['metrics', 'evaluation'],
          author: 'DataSwift Team',
          createdAt: '2024-01-25T09:15:00Z',
        },
      ];

      res.status(200).json(articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, category, tags } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const newArticle = {
        id: Date.now().toString(),
        title,
        content,
        category: category || 'general',
        tags: tags || [],
        author: 'User',
        createdAt: new Date().toISOString(),
      };

      res.status(201).json(newArticle);
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 