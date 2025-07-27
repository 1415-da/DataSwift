import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

// Function to get current user from session
async function getCurrentUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return null;
  }
  return {
    id: session.user.email, // Use email as user ID
    name: session.user.name || session.user.email?.split('@')[0] || 'Unknown User',
    email: session.user.email
  };
}

// Function to create activity with real user data
async function createActivity(userId: string, userName: string, actionType: string, context: string, details: any = {}) {
  const db = await getDb();
  const activities = db.collection('activities');
  
  const activity = {
    userId,
    userName, // Add real user name
    actionType,
    context,
    timestamp: new Date(), // Use current timestamp
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
  const activities = db.collection('activities');

  switch (req.method) {
    case 'GET': {
      const { id, userId, actionType, populate } = req.query;
      
      // Get current user
      const currentUser = await getCurrentUser(req, res);
      
      // Populate sample data if requested or if database is empty
      if (populate === 'true' || (await activities.countDocuments()) === 0) {
        try {
          // Check if we already have sample data by looking for a specific activity
          const existingSample = await activities.findOne({ 
            userId: 'demo_user', 
            actionType: 'data_upload',
            'details.dataset_name': 'customer_data.csv'
          });
          
          if (!existingSample) {
            // Create sample activities with demo user
            const sampleActivities = [
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'data_upload',
                context: 'Dataset Uploaded',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                details: {
                  dataset_name: 'customer_data.csv',
                  file_size: '2.5 MB',
                  rows_processed: 15000,
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'eda_analysis',
                context: 'EDA Analysis Completed',
                timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
                details: {
                  dataset_name: 'customer_data',
                  duration: '3 minutes',
                  rows_processed: 15000,
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'model_training',
                context: 'Model Training Started',
                timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
                details: {
                  model_name: 'Random Forest',
                  dataset_name: 'customer_data',
                  status: 'in_progress'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'model_training',
                context: 'Model Training Completed',
                timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000), // 21 hours ago
                details: {
                  model_name: 'Random Forest',
                  accuracy: 0.95,
                  duration: '45 minutes',
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'model_deployment',
                context: 'Model Deployed',
                timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
                details: {
                  model_name: 'Random Forest',
                  accuracy: 0.95,
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'model_testing',
                context: 'Model Testing',
                timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000), // 19 hours ago
                details: {
                  model_name: 'Random Forest',
                  accuracy: 0.93,
                  rows_processed: 5000,
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'data_export',
                context: 'Report Exported',
                timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
                details: {
                  dataset_name: 'customer_data',
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'settings_change',
                context: 'Settings Updated',
                timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000), // 17 hours ago
                details: {
                  setting_type: 'notifications',
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'data_upload',
                context: 'Dataset Upload Failed',
                timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
                details: {
                  dataset_name: 'large_dataset.csv',
                  file_size: '150 MB',
                  error: 'File size exceeds limit',
                  status: 'failed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'user_activity',
                context: 'Login Activity',
                timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000), // 15 hours ago
                details: {
                  device: 'new device',
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'data_upload',
                context: 'Dataset Uploaded',
                timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
                details: {
                  dataset_name: 'sales_data.csv',
                  file_size: '1.8 MB',
                  rows_processed: 12000,
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'eda_analysis',
                context: 'EDA Analysis Completed',
                timestamp: new Date(Date.now() - 13 * 60 * 60 * 1000), // 13 hours ago
                details: {
                  dataset_name: 'sales_data',
                  duration: '2 minutes',
                  rows_processed: 12000,
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'model_training',
                context: 'Model Training Started',
                timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
                details: {
                  model_name: 'XGBoost',
                  dataset_name: 'sales_data',
                  status: 'in_progress'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'model_training',
                context: 'Model Training Completed',
                timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
                details: {
                  model_name: 'XGBoost',
                  accuracy: 0.92,
                  duration: '30 minutes',
                  status: 'completed'
                }
              },
              {
                userId: 'demo_user',
                userName: 'Demo User',
                actionType: 'model_deployment',
                context: 'Model Deployed',
                timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
                details: {
                  model_name: 'XGBoost',
                  accuracy: 0.92,
                  status: 'completed'
                }
              }
            ];
            
            await activities.insertMany(sampleActivities);
            console.log('Sample activities data populated');
          } else {
            console.log('Sample activities already exist, skipping population');
          }
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
        // If user is logged in, show their activities + demo activities
        // If not logged in, show only demo activities
        let query = {};
        if (currentUser) {
          query = { $or: [{ userId: currentUser.id }, { userId: 'demo_user' }] };
        } else {
          query = { userId: 'demo_user' };
        }
        
        const allActivities = await activities.find(query).sort({ timestamp: -1 }).toArray();
        return res.status(200).json(allActivities);
      }
    }
    case 'POST': {
      const currentUser = await getCurrentUser(req, res);
      if (!currentUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const { actionType, context, details } = req.body;
      
      // Create activity with real user data
      const activity = await createActivity(
        currentUser.id,
        currentUser.name,
        actionType,
        context,
        details
      );
      
      return res.status(201).json(activity);
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