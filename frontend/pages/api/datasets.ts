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
  const datasets = db.collection('datasets');

  switch (req.method) {
    case 'GET': {
      const { id, userId } = req.query;
      if (id) {
        const dataset = await datasets.findOne({ _id: new ObjectId(id as string) });
        return res.status(200).json(dataset);
      } else if (userId) {
        const userDatasets = await datasets.find({ userId }).toArray();
        return res.status(200).json(userDatasets);
      } else {
        const allDatasets = await datasets.find({}).toArray();
        return res.status(200).json(allDatasets);
      }
    }
    case 'POST': {
      const currentUser = await getCurrentUser(req, res);
      if (!currentUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, sourceType, fileUrl, schema, status, edaReportIds } = req.body;
      const result = await datasets.insertOne({
        userId: currentUser.id,
        name,
        sourceType,
        fileUrl,
        schema,
        uploadTimestamp: new Date(),
        status,
        edaReportIds: edaReportIds || [],
      });

      // Log activity
      await createActivity(
        currentUser.id,
        currentUser.name,
        'data_upload',
        'Dataset Uploaded',
        {
          dataset_name: name,
          file_size: schema?.fileSize || 'Unknown',
          rows_processed: schema?.rowCount || 0,
          status: status || 'completed'
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
      await datasets.updateOne({ _id: new ObjectId(id) }, { $set: update });

      // Log activity
      await createActivity(
        currentUser.id,
        currentUser.name,
        'data_update',
        'Dataset Updated',
        {
          dataset_id: id,
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
      const dataset = await datasets.findOne({ _id: new ObjectId(id) });
      await datasets.deleteOne({ _id: new ObjectId(id) });

      // Log activity
      await createActivity(
        currentUser.id,
        currentUser.name,
        'data_delete',
        'Dataset Deleted',
        {
          dataset_name: dataset?.name || 'Unknown',
          dataset_id: id,
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