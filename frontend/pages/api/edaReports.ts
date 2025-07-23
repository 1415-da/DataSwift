import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const edaReports = db.collection('edaReports');

  switch (req.method) {
    case 'GET': {
      const { id, datasetId, userId } = req.query;
      if (id) {
        const report = await edaReports.findOne({ _id: new ObjectId(id as string) });
        return res.status(200).json(report);
      } else if (datasetId) {
        const reports = await edaReports.find({ datasetId }).toArray();
        return res.status(200).json(reports);
      } else if (userId) {
        const reports = await edaReports.find({ userId }).toArray();
        return res.status(200).json(reports);
      } else {
        const allReports = await edaReports.find({}).toArray();
        return res.status(200).json(allReports);
      }
    }
    case 'POST': {
      const { datasetId, userId, summaryStats, chartUrls, downloadableReportUrl } = req.body;
      const result = await edaReports.insertOne({
        datasetId,
        userId,
        summaryStats,
        chartUrls: chartUrls || [],
        downloadableReportUrl,
        createdAt: new Date(),
      });
      return res.status(201).json({ _id: result.insertedId });
    }
    case 'PUT': {
      const { id, ...update } = req.body;
      await edaReports.updateOne({ _id: new ObjectId(id) }, { $set: update });
      return res.status(200).json({ success: true });
    }
    case 'DELETE': {
      const { id } = req.body;
      await edaReports.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 