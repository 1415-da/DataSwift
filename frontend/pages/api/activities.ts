import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { ObjectId } from 'mongodb';

// Sample activities data for demonstration
const sampleActivities = [
  {
    userId: 'user_001',
    actionType: 'data_upload',
    context: 'Dataset Uploaded',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    details: {
      dataset_name: 'customer_data.csv',
      file_size: '2.5 MB',
      rows_processed: 15000,
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'eda_analysis',
    context: 'EDA Analysis Completed',
    timestamp: new Date('2024-01-15T11:15:00Z'),
    details: {
      dataset_name: 'customer_data',
      duration: '3 minutes',
      rows_processed: 15000,
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'model_training',
    context: 'Model Training Started',
    timestamp: new Date('2024-01-15T12:00:00Z'),
    details: {
      model_name: 'Random Forest',
      dataset_name: 'customer_data',
      status: 'in_progress'
    }
  },
  {
    userId: 'user_001',
    actionType: 'model_training',
    context: 'Model Training Completed',
    timestamp: new Date('2024-01-15T12:45:00Z'),
    details: {
      model_name: 'Random Forest',
      accuracy: 0.95,
      duration: '45 minutes',
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'model_deployment',
    context: 'Model Deployed',
    timestamp: new Date('2024-01-15T13:00:00Z'),
    details: {
      model_name: 'Random Forest',
      accuracy: 0.95,
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'model_testing',
    context: 'Model Testing',
    timestamp: new Date('2024-01-15T14:30:00Z'),
    details: {
      model_name: 'Random Forest',
      accuracy: 0.93,
      rows_processed: 5000,
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'data_export',
    context: 'Report Exported',
    timestamp: new Date('2024-01-15T15:00:00Z'),
    details: {
      dataset_name: 'customer_data',
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'settings_change',
    context: 'Settings Updated',
    timestamp: new Date('2024-01-15T16:00:00Z'),
    details: {
      setting_type: 'notifications',
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'data_upload',
    context: 'Dataset Upload Failed',
    timestamp: new Date('2024-01-14T09:00:00Z'),
    details: {
      dataset_name: 'large_dataset.csv',
      file_size: '150 MB',
      error: 'File size exceeds limit',
      status: 'failed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'user_activity',
    context: 'Login Activity',
    timestamp: new Date('2024-01-14T08:30:00Z'),
    details: {
      device: 'new device',
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'data_upload',
    context: 'Dataset Uploaded',
    timestamp: new Date('2024-01-14T07:15:00Z'),
    details: {
      dataset_name: 'sales_data.csv',
      file_size: '1.8 MB',
      rows_processed: 12000,
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'eda_analysis',
    context: 'EDA Analysis Completed',
    timestamp: new Date('2024-01-14T06:45:00Z'),
    details: {
      dataset_name: 'sales_data',
      duration: '2 minutes',
      rows_processed: 12000,
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'model_training',
    context: 'Model Training Started',
    timestamp: new Date('2024-01-14T06:00:00Z'),
    details: {
      model_name: 'XGBoost',
      dataset_name: 'sales_data',
      status: 'in_progress'
    }
  },
  {
    userId: 'user_001',
    actionType: 'model_training',
    context: 'Model Training Completed',
    timestamp: new Date('2024-01-14T05:15:00Z'),
    details: {
      model_name: 'XGBoost',
      accuracy: 0.92,
      duration: '30 minutes',
      status: 'completed'
    }
  },
  {
    userId: 'user_001',
    actionType: 'model_deployment',
    context: 'Model Deployed',
    timestamp: new Date('2024-01-14T04:30:00Z'),
    details: {
      model_name: 'XGBoost',
      accuracy: 0.92,
      status: 'completed'
    }
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const activities = db.collection('activities');

  switch (req.method) {
    case 'GET': {
      const { id, userId, actionType, populate } = req.query;
      
      // Populate sample data if requested or if database is empty
      if (populate === 'true' || (await activities.countDocuments()) === 0) {
        try {
          await activities.insertMany(sampleActivities);
          console.log('Sample activities data populated');
        } catch (error) {
          console.log('Activities already exist or error occurred:', error);
        }
      }
      
      if (id) {
        const activity = await activities.findOne({ _id: new ObjectId(id as string) });
        return res.status(200).json(activity);
      } else if (userId) {
        const userActivities = await activities.find({ userId }).sort({ timestamp: -1 }).toArray();
        return res.status(200).json(userActivities);
      } else if (actionType) {
        const typeActivities = await activities.find({ actionType }).sort({ timestamp: -1 }).toArray();
        return res.status(200).json(typeActivities);
      } else {
        const allActivities = await activities.find({}).sort({ timestamp: -1 }).toArray();
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