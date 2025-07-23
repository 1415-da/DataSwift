import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const comments = db.collection('comments');

  switch (req.method) {
    case 'GET': {
      const { id, targetType, targetId } = req.query;
      if (id) {
        const comment = await comments.findOne({ _id: new ObjectId(id as string) });
        return res.status(200).json(comment);
      } else if (targetType && targetId) {
        const targetComments = await comments.find({ targetType, targetId }).toArray();
        return res.status(200).json(targetComments);
      } else {
        const allComments = await comments.find({}).toArray();
        return res.status(200).json(allComments);
      }
    }
    case 'POST': {
      const { userId, targetType, targetId, content, reactions } = req.body;
      const result = await comments.insertOne({
        userId,
        targetType,
        targetId,
        content,
        timestamp: new Date(),
        reactions: reactions || [],
      });
      return res.status(201).json({ _id: result.insertedId });
    }
    case 'PUT': {
      const { id, ...update } = req.body;
      await comments.updateOne({ _id: new ObjectId(id) }, { $set: update });
      return res.status(200).json({ success: true });
    }
    case 'DELETE': {
      const { id } = req.body;
      await comments.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 