import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { datasetPath, modelType, parameters } = req.body;

    if (!datasetPath || !modelType) {
      return res.status(400).json({ error: 'Dataset path and model type are required' });
    }

    // For Vercel deployment, we'll simulate model training
    // In production, you might want to use external ML services
    
    const trainingResult = {
      modelId: `model_${Date.now()}`,
      modelType: modelType,
      status: 'completed',
      accuracy: Math.random() * 0.3 + 0.7, // 70-100% accuracy
      precision: Math.random() * 0.2 + 0.8,
      recall: Math.random() * 0.2 + 0.8,
      f1Score: Math.random() * 0.2 + 0.8,
      trainingTime: Math.floor(Math.random() * 300) + 60, // 1-6 minutes
      parameters: parameters || {},
      createdAt: new Date().toISOString(),
      datasetPath: datasetPath,
    };

    res.status(200).json(trainingResult);
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 