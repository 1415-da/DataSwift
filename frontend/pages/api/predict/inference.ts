import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { modelId, inputData } = req.body;

    if (!modelId || !inputData) {
      return res.status(400).json({ error: 'Model ID and input data are required' });
    }

    // For Vercel deployment, we'll simulate predictions
    // In production, you might want to use external ML services
    
    const predictionResult = {
      modelId: modelId,
      predictions: inputData.map((input: any, index: number) => ({
        id: index,
        predictedValue: Math.random() * 100,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        input: input,
      })),
      metadata: {
        modelType: 'regression',
        predictionTime: new Date().toISOString(),
        totalPredictions: inputData.length,
      },
    };

    res.status(200).json(predictionResult);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 