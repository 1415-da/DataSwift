import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const users = db.collection('users');

  switch (req.method) {
    case 'GET': {
      // Get user by id or all users
      const { id } = req.query;
      if (id) {
        const user = await users.findOne({ _id: new ObjectId(id as string) });
        return res.status(200).json(user);
      } else {
        const allUsers = await users.find({}).toArray();
        return res.status(200).json(allUsers);
      }
    }
    case 'POST': {
      // Create new user
      const { name, email, passwordHash, avatarUrl, category } = req.body;
      const result = await users.insertOne({
        name,
        email,
        passwordHash,
        avatarUrl,
        category,
        createdAt: new Date(),
        lastLogin: null,
      });
      return res.status(201).json({ _id: result.insertedId });
    }
    case 'PUT': {
      // Update user
      const { id, ...update } = req.body;
      await users.updateOne({ _id: new ObjectId(id) }, { $set: update });
      return res.status(200).json({ success: true });
    }
    case 'DELETE': {
      // Delete user
      const { id } = req.body;
      await users.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 