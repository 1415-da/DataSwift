import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const activities = db.collection('activities');

  switch (req.method) {
    case 'GET': {
      const { id, userId, actionType } = req.query;
      if (id) {
        const activity = await activities.findOne({ _id: new ObjectId(id as string) });
        return res.status(200).json(activity);
      } else if (userId) {
        const userActivities = await activities.find({ userId }).toArray();
        return res.status(200).json(userActivities);
      } else if (actionType) {
        const typeActivities = await activities.find({ actionType }).toArray();
        return res.status(200).json(typeActivities);
      } else {
        const allActivities = await activities.find({}).toArray();
        return res.status(200).json(allActivities);
      }
    }
    case 'POST': {
      const { userId, actionType, context, timestamp, details } = req.body;
      const result = await activities.insertOne({
        userId,
        actionType,
        context,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        details: details || {},
      });
      return res.status(201).json({ _id: result.insertedId });
    }
    case 'PUT': {
      const { id, ...update } = req.body;
      await activities.updateOne({ _id: new ObjectId(id) }, { $set: update });
      return res.status(200).json({ success: true });
    }
    case 'DELETE': {
      const { id } = req.body;
      await activities.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 