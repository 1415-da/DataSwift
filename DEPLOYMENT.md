# DataSwift Deployment Guide

This guide will help you deploy DataSwift entirely on Vercel.

## Architecture Overview

DataSwift is a full-stack application deployed on Vercel:
- **Frontend**: Next.js application with React components
- **Backend**: Serverless API routes within the Next.js application
- **Database**: External database service (Supabase, PlanetScale, etc.)

## Frontend Deployment (Vercel)

### Step 1: Prepare the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env.local
   ```

### Step 2: Deploy to Vercel

#### Option A: Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js
6. Set environment variables in Vercel dashboard:
   - `NEXTAUTH_URL`: Your Vercel URL
   - `NEXTAUTH_SECRET`: Generate a random secret
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

#### Option B: Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

## Backend (Serverless API Routes)

The backend functionality is implemented as serverless API routes within the Next.js application:

### API Routes Included

- `/api/health` - Health check endpoint
- `/api/data/upload` - File upload handling
- `/api/data/analyze` - Data analysis
- `/api/data/process` - Data processing operations
- `/api/model/train` - Model training
- `/api/model/evaluate` - Model evaluation
- `/api/predict/inference` - Model predictions
- `/api/knowledge/articles` - Knowledge base management
- `/api/user/profile` - User profile management

### Benefits of Serverless Backend

- **No separate deployment**: Everything runs on Vercel
- **Automatic scaling**: Vercel handles traffic spikes
- **Cost effective**: Pay only for what you use
- **Global distribution**: API routes run on edge network
- **Easy maintenance**: Single codebase and deployment

## Environment Variables

### Frontend (.env.local)

```env
NEXTAUTH_URL=https://your-frontend.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Backend (API Routes)

```env
DATABASE_URL=your-database-url
OPENAI_API_KEY=your-openai-api-key
NEXTAUTH_SECRET=your-nextauth-secret
```

## Database Setup

### Option 1: Railway PostgreSQL

1. Create a new PostgreSQL database in Railway
2. Copy the connection string to your backend environment variables

### Option 2: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get the connection string from Settings > Database
4. Add to your backend environment variables

### Option 3: PlanetScale

1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get the connection string
4. Add to your backend environment variables

## CORS Configuration

Since both frontend and backend are on Vercel, CORS is automatically handled. The API routes are part of the same Next.js application, so no additional CORS configuration is needed.

## Domain Configuration

### Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Add your custom domain
3. Update environment variables with the new domain
4. Update CORS origins in backend

## Monitoring and Analytics

### Vercel Analytics

1. Enable Vercel Analytics in your project settings
2. Add the analytics script to your app

### Error Tracking

1. Set up Sentry for error tracking
2. Add Sentry SDK to both frontend and backend

## SSL/HTTPS

Vercel automatically provides SSL certificates. For the backend:
- Railway: Automatic SSL
- Render: Automatic SSL
- Heroku: Automatic SSL

## Performance Optimization

### Frontend

1. Enable Next.js optimizations in `next.config.mjs`
2. Use Image component for optimized images
3. Implement proper caching strategies

### Backend

1. Use connection pooling for database
2. Implement caching with Redis (optional)
3. Use CDN for static assets

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version and dependencies
2. **API Errors**: Verify environment variables and CORS settings
3. **Database Connection**: Ensure database URL is correct
4. **Authentication**: Check OAuth configuration

### Debugging

1. Check Vercel function logs
2. Monitor backend application logs
3. Use browser developer tools for frontend issues

## Security Considerations

1. Use environment variables for secrets
2. Enable HTTPS everywhere
3. Implement proper authentication
4. Validate all user inputs
5. Use rate limiting on API endpoints

## Cost Optimization

### Vercel

- Free tier: 100GB bandwidth/month
- Pro plan: $20/month for more features

### Backend Platforms

- Railway: Free tier available
- Render: Free tier available
- Heroku: Free tier discontinued, paid plans start at $7/month

## Support

For deployment issues:
1. Check platform documentation
2. Review application logs
3. Test locally first
4. Use platform-specific debugging tools

## Next Steps

After deployment:
1. Set up monitoring and alerts
2. Configure backup strategies
3. Implement CI/CD pipelines
4. Set up staging environment
5. Plan for scaling 