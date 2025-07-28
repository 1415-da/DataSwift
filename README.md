# DataSwift - Full-Stack Data Science Platform

A modern, full-stack data science platform built with Next.js and deployed entirely on Vercel.

## 🚀 Features

- **📊 Data Management**: Upload, analyze, and process datasets
- **🤖 Machine Learning**: Train, evaluate, and deploy ML models
- **📈 Visualizations**: Interactive charts and data insights
- **📚 Knowledge Hub**: Articles, tutorials, and best practices
- **🔐 Authentication**: Secure user management with NextAuth.js
- **🎨 Modern UI**: Beautiful interface with Tailwind CSS
- **⚡ Serverless**: Full-stack deployment on Vercel

## 🏗️ Architecture

DataSwift is a **monorepo** with everything deployed on Vercel:

- **Frontend**: Next.js 15 with React 19
- **Backend**: Serverless API routes within Next.js
- **Database**: External service (Supabase, PlanetScale, etc.)
- **Authentication**: NextAuth.js with multiple providers
- **Styling**: Tailwind CSS with shadcn/ui components

## 🚀 Quick Deploy

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/dataswift)

### Option 2: Manual Deploy

```bash
# Clone the repository
git clone https://github.com/your-username/dataswift.git
cd dataswift

# Run deployment script
./deploy-vercel.sh  # Linux/Mac
# OR
deploy-vercel.bat   # Windows
```

### Option 3: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account
- Database service (Supabase, PlanetScale, etc.)

## 🔧 Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# Authentication
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=your-database-url

# AI Features
OPENAI_API_KEY=your-openai-api-key
```

## 📁 Project Structure

```
DataSwift/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── pages/              # Pages and API routes
│   │   └── api/            # Serverless API routes
│   ├── lib/                # Utility functions
│   └── styles/             # Global styles
├── backend/                 # Legacy backend (optional)
├── deploy-vercel.sh        # Linux/Mac deployment script
├── deploy-vercel.bat       # Windows deployment script
└── DEPLOYMENT.md           # Detailed deployment guide
```

## 🔌 API Endpoints

All backend functionality is implemented as serverless API routes:

- `GET /api/health` - Health check
- `POST /api/data/upload` - File upload
- `POST /api/data/analyze` - Data analysis
- `POST /api/data/process` - Data processing
- `POST /api/model/train` - Model training
- `POST /api/model/evaluate` - Model evaluation
- `POST /api/predict/inference` - Predictions
- `GET /api/knowledge/articles` - Knowledge base
- `GET /api/user/profile` - User profile

See [API Documentation](frontend/API_DOCUMENTATION.md) for detailed specs.

## 🎯 Key Benefits

### **Full Vercel Deployment**
- ✅ Single deployment for frontend and backend
- ✅ Automatic scaling and global CDN
- ✅ Zero server management
- ✅ Built-in analytics and monitoring

### **Modern Tech Stack**
- ✅ Next.js 15 with App Router
- ✅ React 19 with Server Components
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ NextAuth.js for authentication

### **Developer Experience**
- ✅ Hot reloading in development
- ✅ TypeScript support
- ✅ ESLint and Prettier
- ✅ Comprehensive documentation

## 🚀 Performance

- **⚡ Fast Loading**: Optimized with Next.js
- **🌍 Global CDN**: Vercel's edge network
- **📱 Responsive**: Works on all devices
- **🔍 SEO Optimized**: Server-side rendering
- **♿ Accessible**: WCAG compliant

## 💰 Cost Effective

- **Free Tier**: 100GB bandwidth/month
- **Pay-as-you-go**: Only pay for what you use
- **No hidden costs**: Transparent pricing
- **Automatic scaling**: Handle traffic spikes

## 🔒 Security

- **HTTPS**: Automatic SSL certificates
- **Authentication**: Secure user management
- **CORS**: Proper cross-origin handling
- **Environment Variables**: Secure secrets management

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [API Documentation](frontend/API_DOCUMENTATION.md) - API reference
- [Frontend README](frontend/README.md) - Frontend-specific guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](DEPLOYMENT.md)
- 🐛 [Issues](https://github.com/your-username/dataswift/issues)
- 💬 [Discussions](https://github.com/your-username/dataswift/discussions)

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for the amazing platform
- [Next.js](https://nextjs.org) for the framework
- [Tailwind CSS](https://tailwindcss.com) for styling
- [shadcn/ui](https://ui.shadcn.com) for components

---

**Made with ❤️ for the data science community**
