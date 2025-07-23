import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const articles = db.collection('knowledgeArticles');

  switch (req.method) {
    case 'GET': {
      const { id, authorId, tag } = req.query;
      if (id) {
        const article = await articles.findOne({ _id: new ObjectId(id as string) });
        return res.status(200).json(article);
      } else if (authorId) {
        const authorArticles = await articles.find({ authorId }).toArray();
        return res.status(200).json(authorArticles);
      } else if (tag) {
        const tagArticles = await articles.find({ tags: tag }).toArray();
        return res.status(200).json(tagArticles);
      } else {
        const allArticles = await articles.find({}).toArray();
        return res.status(200).json(allArticles);
      }
    }
    case 'POST': {
      const { title, body, authorId, tags, feedback } = req.body;
      const result = await articles.insertOne({
        title,
        body,
        authorId,
        tags: tags || [],
        createdAt: new Date(),
        views: 0,
        feedback: feedback || [],
      });
      return res.status(201).json({ _id: result.insertedId });
    }
    case 'PUT': {
      const { id, ...update } = req.body;
      await articles.updateOne({ _id: new ObjectId(id) }, { $set: update });
      return res.status(200).json({ success: true });
    }
    case 'DELETE': {
      const { id } = req.body;
      await articles.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 