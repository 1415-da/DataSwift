import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

// Function to get current user from session
async function getCurrentUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return null;
  }
  return {
    id: session.user.email,
    name: session.user.name || session.user.email?.split('@')[0] || 'Unknown User',
    email: session.user.email
  };
}

// Function to create activity
async function createActivity(userId: string, userName: string, actionType: string, context: string, details: any = {}) {
  const db = await getDb();
  const activities = db.collection('activities');
  
  const activity = {
    userId,
    userName,
    actionType,
    context,
    timestamp: new Date(),
    details: {
      ...details,
      status: details.status || 'completed'
    }
  };
  
  const result = await activities.insertOne(activity);
  return { ...activity, _id: result.insertedId };
}

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
      const currentUser = await getCurrentUser(req, res);
      if (!currentUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { datasetId, config, metrics, resultSummary, modelRecommendation } = req.body;
      const result = await models.insertOne({
        userId: currentUser.id,
        datasetId,
        config,
        metrics,
        resultSummary,
        modelRecommendation,
        createdAt: new Date(),
      });

      // Log activity
      await createActivity(
        currentUser.id,
        currentUser.name,
        'model_training',
        'Model Training Completed',
        {
          model_name: config?.algorithm || 'Unknown Model',
          dataset_id: datasetId,
          accuracy: metrics?.accuracy || 0,
          duration: config?.duration || 'Unknown',
          status: 'completed'
        }
      );

      return res.status(201).json({ _id: result.insertedId });
    }
    case 'PUT': {
      const currentUser = await getCurrentUser(req, res);
      if (!currentUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id, ...update } = req.body;
      await models.updateOne({ _id: new ObjectId(id) }, { $set: update });

      // Log activity
      await createActivity(
        currentUser.id,
        currentUser.name,
        'model_update',
        'Model Updated',
        {
          model_id: id,
          updates: Object.keys(update),
          status: 'completed'
        }
      );

      return res.status(200).json({ success: true });
    }
    case 'DELETE': {
      const currentUser = await getCurrentUser(req, res);
      if (!currentUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.body;
      const model = await models.findOne({ _id: new ObjectId(id) });
      await models.deleteOne({ _id: new ObjectId(id) });

      // Log activity
      await createActivity(
        currentUser.id,
        currentUser.name,
        'model_delete',
        'Model Deleted',
        {
          model_name: model?.config?.algorithm || 'Unknown Model',
          model_id: id,
          status: 'completed'
        }
      );

      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 