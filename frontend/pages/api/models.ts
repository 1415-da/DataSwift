import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const models = db.collection('models');

  switch (req.method) {
    case 'GET': {
      const { id, userId, datasetId } = req.query;
      if (id) {
        const model = await models.findOne({ _id: new ObjectId(id as string) });
        return res.status(200).json(model);
      } else if (userId) {
        const userModels = await models.find({ userId }).toArray();
        return res.status(200).json(userModels);
      } else if (datasetId) {
        const datasetModels = await models.find({ datasetId }).toArray();
        return res.status(200).json(datasetModels);
      } else {
        const allModels = await models.find({}).toArray();
        return res.status(200).json(allModels);
      }
    }
    case 'POST': {
      const { userId, datasetId, config, metrics, resultSummary, modelRecommendation } = req.body;
      const result = await models.insertOne({
        userId,
        datasetId,
        config,
        metrics,
        resultSummary,
        modelRecommendation,
        createdAt: new Date(),
      });
      return res.status(201).json({ _id: result.insertedId });
    }
    case 'PUT': {
      const { id, ...update } = req.body;
      await models.updateOne({ _id: new ObjectId(id) }, { $set: update });
      return res.status(200).json({ success: true });
    }
    case 'DELETE': {
      const { id } = req.body;
      await models.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 