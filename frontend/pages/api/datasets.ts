import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { ObjectId } from 'mongodb';

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
      const { userId, name, sourceType, fileUrl, schema, status, edaReportIds } = req.body;
      const result = await datasets.insertOne({
        userId,
        name,
        sourceType,
        fileUrl,
        schema,
        uploadTimestamp: new Date(),
        status,
        edaReportIds: edaReportIds || [],
      });
      return res.status(201).json({ _id: result.insertedId });
    }
    case 'PUT': {
      const { id, ...update } = req.body;
      await datasets.updateOne({ _id: new ObjectId(id) }, { $set: update });
      return res.status(200).json({ success: true });
    }
    case 'DELETE': {
      const { id } = req.body;
      await datasets.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 