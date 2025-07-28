#!/bin/bash

echo "🚀 DataSwift Full Vercel Deployment"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if environment file exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment file..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your environment variables before deploying"
    echo "   Required variables:"
    echo "   - NEXTAUTH_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - GOOGLE_CLIENT_ID"
    echo "   - GOOGLE_CLIENT_SECRET"
    echo "   - DATABASE_URL"
    echo "   - OPENAI_API_KEY"
    read -p "Press Enter after editing .env.local..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

cd ..

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your database (Supabase, PlanetScale, etc.)"
echo "3. Set up authentication providers (Google, GitHub, etc.)"
echo "4. Test your application"
echo ""
echo "🌐 Your application will be available at:"
echo "   https://your-app.vercel.app"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "📖 For API documentation, see frontend/API_DOCUMENTATION.md" 