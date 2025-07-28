#!/bin/bash

echo "🚀 DataSwift Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Frontend deployment
echo "📦 Deploying Frontend to Vercel..."
cd frontend

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

cd ..

# Backend deployment options
echo ""
echo "🔧 Backend Deployment Options:"
echo "1. Railway (Recommended)"
echo "2. Render"
echo "3. Heroku"
echo "4. Skip backend deployment"

read -p "Choose backend deployment option (1-4): " backend_choice

case $backend_choice in
    1)
        echo "🚂 Deploying Backend to Railway..."
        cd backend
        
        # Check if Railway CLI is installed
        if ! command -v railway &> /dev/null; then
            echo "📥 Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        
        railway login
        railway init
        railway up
        cd ..
        ;;
    2)
        echo "🌐 Deploying Backend to Render..."
        echo "Please visit https://render.com and create a new Web Service"
        echo "Connect your GitHub repository and configure:"
        echo "- Build Command: pip install -r requirements.txt"
        echo "- Start Command: uvicorn app:app --host 0.0.0.0 --port \$PORT"
        ;;
    3)
        echo "🦊 Deploying Backend to Heroku..."
        cd backend
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo "📥 Please install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        heroku create dataswift-backend-$(date +%s)
        git add .
        git commit -m "Deploy to Heroku"
        git push heroku main
        cd ..
        ;;
    4)
        echo "⏭️  Skipping backend deployment"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in your deployment platform"
echo "2. Configure CORS settings in backend/app.py"
echo "3. Set up a database (PostgreSQL recommended)"
echo "4. Test your application"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md" 