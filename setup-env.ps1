# DataSwift Environment Setup Script
# This script helps you set up the necessary environment variables for local development

Write-Host "Setting up DataSwift environment variables..." -ForegroundColor Green

# Create .env.local file in frontend directory
$envContent = @"
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/dataswift

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional - for Google and GitHub login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
"@

$envContent | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
Write-Host "Created frontend\.env.local" -ForegroundColor Yellow

# Create .env file in backend directory
$backendEnvContent = @"
MONGODB_URI=mongodb://localhost:27017/dataswift
"@

$backendEnvContent | Out-File -FilePath "backend\.env" -Encoding UTF8
Write-Host "Created backend\.env" -ForegroundColor Yellow

Write-Host "`nEnvironment files created successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start MongoDB (if not using Docker): mongod" -ForegroundColor White
Write-Host "2. Or use Docker: docker-compose up mongodb" -ForegroundColor White
Write-Host "3. Start the backend: cd backend && python app.py" -ForegroundColor White
Write-Host "4. Start the frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "`nNote: Update the OAuth provider credentials in .env.local if you want to use Google/GitHub login" -ForegroundColor Yellow 