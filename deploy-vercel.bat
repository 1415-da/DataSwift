@echo off
echo 🚀 DataSwift Full Vercel Deployment
echo ====================================

REM Check if we're in the right directory
if not exist "frontend\package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

REM Navigate to frontend directory
cd frontend

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📥 Installing Vercel CLI...
    npm install -g vercel
)

REM Check if environment file exists
if not exist ".env.local" (
    echo 📝 Creating environment file...
    copy env.example .env.local
    echo ⚠️  Please edit .env.local with your environment variables before deploying
    echo    Required variables:
    echo    - NEXTAUTH_URL
    echo    - NEXTAUTH_SECRET
    echo    - GOOGLE_CLIENT_ID
    echo    - GOOGLE_CLIENT_SECRET
    echo    - DATABASE_URL
    echo    - OPENAI_API_KEY
    pause
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building project...
npm run build

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

cd ..

echo.
echo ✅ Deployment completed!
echo.
echo 📋 Next steps:
echo 1. Set up environment variables in Vercel dashboard
echo 2. Configure your database (Supabase, PlanetScale, etc.)
echo 3. Set up authentication providers (Google, GitHub, etc.)
echo 4. Test your application
echo.
echo 🌐 Your application will be available at:
echo    https://your-app.vercel.app
echo.
echo 📚 For detailed instructions, see DEPLOYMENT.md
echo 📖 For API documentation, see frontend/API_DOCUMENTATION.md
pause 