# DataSwift Frontend

A modern data science platform built with Next.js and TypeScript.

## Features

- 📊 Data Upload and Analysis
- 🤖 Machine Learning Model Training
- 📈 Interactive Visualizations
- 📚 Knowledge Hub
- 🔐 Authentication
- 🎨 Modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example file:
   ```bash
   cp env.example .env.local
   ```

4. Fill in your environment variables in `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

### Automatic Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

### Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Environment Variables

Set these environment variables in your Vercel dashboard:

- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: A random secret for NextAuth
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### Build Configuration

The project is configured for Vercel deployment with:

- Next.js 15
- TypeScript
- Tailwind CSS
- API routes for backend functionality
- Optimized build settings

## Project Structure

```
frontend/
├── app/                    # Next.js 13+ app directory
├── components/             # Reusable UI components
├── pages/                  # Pages and API routes
├── lib/                    # Utility functions
├── styles/                 # Global styles
└── public/                 # Static assets
```

## API Routes

The application includes API routes for:

- `/api/data/upload` - File upload handling
- `/api/data/analyze` - Data analysis
- `/api/model/train` - Model training
- `/api/predict/inference` - Model predictions
- `/api/knowledge/articles` - Knowledge base

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License 