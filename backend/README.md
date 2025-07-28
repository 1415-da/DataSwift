# DataSwift Backend

FastAPI backend for the DataSwift platform.

## Features

- RESTful API endpoints
- Data processing and analysis
- Machine learning model management
- User authentication
- Knowledge base management

## Deployment Options

### Option 1: Railway (Recommended)

Railway is a great platform for Python applications.

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize and deploy:
   ```bash
   railway init
   railway up
   ```

### Option 2: Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

### Option 3: Heroku

1. Install Heroku CLI
2. Create a `Procfile`:
   ```
   web: uvicorn app:app --host=0.0.0.0 --port=$PORT
   ```

3. Deploy:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

1. Connect your GitHub repository
2. Select Python as the runtime
3. Set build command: `pip install -r requirements.txt`
4. Set run command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

## Environment Variables

Set these environment variables in your deployment platform:

- `DATABASE_URL`: Your database connection string
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `SECRET_KEY`: A random secret for JWT tokens

## API Endpoints

- `GET /` - Health check
- `GET /health` - Service status
- `POST /api/data/upload` - Upload data files
- `POST /api/data/analyze` - Analyze datasets
- `POST /api/model/train` - Train ML models
- `POST /api/predict/inference` - Make predictions
- `GET /api/knowledge/articles` - Get knowledge articles

## Local Development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the development server:
   ```bash
   uvicorn app:app --reload
   ```

3. Access the API at http://localhost:8000

## CORS Configuration

The backend is configured to accept requests from:
- Vercel frontend domains
- Local development (localhost:3000)

Update the CORS origins in `app.py` for your production domains.

## Database

The application supports multiple database backends:
- PostgreSQL (recommended for production)
- SQLite (for development)
- MongoDB (for document storage)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License 