import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Processing prediction request...');
    
    // Parse the multipart form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    console.log('Parsed fields:', fields);
    console.log('Parsed files:', files);
    
    const model_id = fields.model_id?.[0];
    const file = files.file?.[0];
    
    console.log('Model ID:', model_id);
    console.log('File:', file);
    
    if (!model_id) {
      console.error('Missing model_id');
      return res.status(400).json({ error: 'model_id is required' });
    }
    
    if (!file) {
      console.error('Missing file');
      return res.status(400).json({ error: 'file is required' });
    }

    // Forward the request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    console.log('Backend URL:', backendUrl);
    
    // Create multipart form data manually for Node.js
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2);
    const fileContent = fs.readFileSync(file.filepath);
    
    const formData = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="model_id"`,
      '',
      model_id,
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${file.originalFilename || 'test_file.csv'}"`,
      'Content-Type: text/csv',
      '',
      fileContent,
      `--${boundary}--`
    ].join('\r\n');

    console.log('Sending request to backend...');
    const response = await fetch(`${backendUrl}/api/predict/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: formData,
    });

    console.log('Backend response status:', response.status);
    console.log('Backend response ok:', response.ok);

    const data = await response.json();
    console.log('Backend response data:', data);
    
    // Clean up the temporary file
    fs.unlinkSync(file.filepath);
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Predict error:', error);
    return res.status(500).json({ error: 'Failed to make prediction', details: error instanceof Error ? error.message : 'Unknown error' });
  }
} 