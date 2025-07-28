# DataSwift API Documentation

This document describes all the API endpoints available in the DataSwift application, deployed on Vercel as serverless functions.

## Base URL

All API endpoints are relative to your Vercel deployment URL:
```
https://your-app.vercel.app/api
```

## Authentication

Most endpoints require authentication. Include the session token in your requests.

## Endpoints

### Health Check

**GET** `/api/health`

Returns the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "service": "DataSwift API",
  "timestamp": "2024-01-15T10:00:00Z",
  "environment": "production"
}
```

### Data Management

#### Upload Data

**POST** `/api/data/upload`

Upload a data file for processing.

**Request:**
- Content-Type: `multipart/form-data`
- Body: File upload

**Response:**
```json
{
  "message": "File uploaded successfully",
  "filename": "dataset.csv",
  "size": 1024000,
  "path": "/tmp/uploads/dataset.csv"
}
```

#### Analyze Data

**POST** `/api/data/analyze`

Analyze uploaded data and generate insights.

**Request:**
```json
{
  "filePath": "/path/to/file.csv",
  "analysisType": "basic"
}
```

**Response:**
```json
{
  "filename": "dataset.csv",
  "analysisType": "basic",
  "summary": {
    "rows": 5000,
    "columns": 8,
    "missingValues": 45,
    "duplicates": 12
  },
  "columns": [
    {
      "name": "Column 1",
      "type": "numeric",
      "missing": 0
    }
  ],
  "insights": [
    "Data appears to be well-structured",
    "No significant outliers detected"
  ],
  "timestamp": "2024-01-15T10:00:00Z"
}
```

#### Process Data

**POST** `/api/data/process`

Process data with various operations.

**Request:**
```json
{
  "data": [...],
  "operation": "clean"
}
```

**Operations:**
- `clean`: Data cleaning
- `transform`: Data transformation
- `validate`: Data validation

**Response:**
```json
{
  "success": true,
  "result": {
    "operation": "data_cleaning",
    "originalRows": 1000,
    "cleanedRows": 900,
    "missingValues": 50,
    "duplicates": 20
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### Model Management

#### Train Model

**POST** `/api/model/train`

Train a machine learning model.

**Request:**
```json
{
  "datasetPath": "/path/to/dataset.csv",
  "modelType": "regression",
  "parameters": {
    "learning_rate": 0.01,
    "max_depth": 6
  }
}
```

**Response:**
```json
{
  "modelId": "model_1705315200000",
  "modelType": "regression",
  "status": "completed",
  "accuracy": 0.85,
  "precision": 0.82,
  "recall": 0.88,
  "f1Score": 0.85,
  "trainingTime": 180,
  "parameters": {
    "learning_rate": 0.01,
    "max_depth": 6
  },
  "createdAt": "2024-01-15T10:00:00Z",
  "datasetPath": "/path/to/dataset.csv"
}
```

#### Evaluate Model

**POST** `/api/model/evaluate`

Evaluate a trained model.

**Request:**
```json
{
  "modelId": "model_1705315200000",
  "testData": [...],
  "metrics": ["accuracy", "precision", "recall"]
}
```

**Response:**
```json
{
  "modelId": "model_1705315200000",
  "evaluationMetrics": {
    "accuracy": 0.85,
    "precision": 0.82,
    "recall": 0.88,
    "f1Score": 0.85,
    "auc": 0.92
  },
  "confusionMatrix": {
    "truePositives": 85,
    "trueNegatives": 90,
    "falsePositives": 10,
    "falseNegatives": 15
  },
  "testDataSize": 200,
  "evaluationTime": "2024-01-15T10:00:00Z",
  "recommendations": [
    "Model performs well on the test set",
    "Consider feature engineering for better performance"
  ]
}
```

### Predictions

#### Make Predictions

**POST** `/api/predict/inference`

Make predictions using a trained model.

**Request:**
```json
{
  "modelId": "model_1705315200000",
  "inputData": [
    {"feature1": 1.5, "feature2": 2.3},
    {"feature1": 2.1, "feature2": 1.8}
  ]
}
```

**Response:**
```json
{
  "modelId": "model_1705315200000",
  "predictions": [
    {
      "id": 0,
      "predictedValue": 45.67,
      "confidence": 0.92,
      "input": {"feature1": 1.5, "feature2": 2.3}
    },
    {
      "id": 1,
      "predictedValue": 52.34,
      "confidence": 0.88,
      "input": {"feature1": 2.1, "feature2": 1.8}
    }
  ],
  "metadata": {
    "modelType": "regression",
    "predictionTime": "2024-01-15T10:00:00Z",
    "totalPredictions": 2
  }
}
```

### Knowledge Base

#### Get Articles

**GET** `/api/knowledge/articles`

Retrieve knowledge base articles.

**Response:**
```json
[
  {
    "id": "1",
    "title": "Getting Started with DataSwift",
    "content": "Learn how to upload your first dataset...",
    "category": "getting-started",
    "tags": ["tutorial", "beginner"],
    "author": "DataSwift Team",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

#### Create Article

**POST** `/api/knowledge/articles`

Create a new knowledge base article.

**Request:**
```json
{
  "title": "New Article",
  "content": "Article content...",
  "category": "tutorial",
  "tags": ["guide", "advanced"]
}
```

**Response:**
```json
{
  "id": "1705315200000",
  "title": "New Article",
  "content": "Article content...",
  "category": "tutorial",
  "tags": ["guide", "advanced"],
  "author": "User",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### User Management

#### Get User Profile

**GET** `/api/user/profile`

Retrieve user profile information.

**Response:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://via.placeholder.com/150",
  "role": "data_scientist",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en"
  },
  "stats": {
    "datasetsUploaded": 15,
    "modelsTrained": 8,
    "predictionsMade": 1250,
    "lastActive": "2024-01-15T10:00:00Z"
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Update User Profile

**PUT** `/api/user/profile`

Update user profile information.

**Request:**
```json
{
  "name": "John Smith",
  "preferences": {
    "theme": "light",
    "notifications": false
  }
}
```

**Response:**
```json
{
  "id": "user_123",
  "name": "John Smith",
  "preferences": {
    "theme": "light",
    "notifications": false
  },
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

API endpoints are subject to rate limiting:
- 100 requests per minute per IP
- 1000 requests per hour per user

## CORS

The API supports CORS for the following origins:
- Your Vercel deployment domain
- `http://localhost:3000` (development)

## Authentication

Most endpoints require authentication via NextAuth.js. Include the session token in your requests.

## File Upload Limits

- Maximum file size: 10MB
- Supported formats: CSV, JSON, Excel
- Files are temporarily stored and processed

## Model Training Limits

- Maximum training time: 30 minutes
- Maximum dataset size: 100MB
- Supported algorithms: Regression, Classification, Clustering

## Support

For API support:
1. Check the error response for details
2. Verify your authentication
3. Ensure your request format is correct
4. Contact support if issues persist 