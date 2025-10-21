# DataSwift - Full-Stack Data Science Platform

A modern, full-stack data science platform built with Next.js frontend and FastAPI backend.

## 🚀 Features

- **📊 Data Management**: Upload, analyze, and process datasets
- **🤖 Machine Learning**: Train, evaluate, and deploy ML models
- **📈 Visualizations**: Interactive charts and data insights
- **📚 Knowledge Hub**: Articles, tutorials, and best practices
- **🔐 Authentication**: Secure user management with NextAuth.js
- **🎨 Modern UI**: Beautiful interface with Tailwind CSS

## 🏗️ Architecture

DataSwift is a **monorepo** with separate frontend and backend:

- **Frontend**: Next.js 15 with React 19
- **Backend**: FastAPI with Python
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with multiple providers
- **Styling**: Tailwind CSS with shadcn/ui components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+ (Python 3.13 compatible)
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/dataswift.git
cd dataswift

# Install dependencies
pnpm install
pnpm install:backend
```

### Starting the Project

#### Option 1: Manual Start (Recommended for Development)

```bash
# Terminal 1: Start Backend
cd backend
source .venv/bin/activate
MONGO_URL="mongodb://localhost:27017" DATABASE_NAME="dataswift" python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Start Frontend
cd frontend
pnpm dev
```

#### Option 2: Using Docker Compose (Full Stack)

```bash
# Start all services (MongoDB + Backend + Frontend)
docker compose up
```

#### Option 3: Using Root Scripts

```bash
# Start frontend only
pnpm dev

# Start backend only
pnpm dev:backend
```

### Access the Application

- **Frontend**: http://localhost:3000 (or 3001 if 3000 is busy)
- **Backend API**: http://localhost:8000
- **API Health Check**: http://localhost:8000/health

### Environment Setup

#### Backend Environment Variables

The backend uses these environment variables (set them when starting):

```bash
MONGO_URL="mongodb://localhost:27017"  # MongoDB connection (optional - falls back to in-memory)
DATABASE_NAME="dataswift"              # Database name
```

#### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (optional - uses in-memory storage by default)
DATABASE_URL=your-mongodb-url

# AI Features (optional)
OPENAI_API_KEY=your-openai-api-key
```

### Troubleshooting

#### Common Issues

1. **Port 8000 already in use**: Kill existing processes with `lsof -ti:8000 | xargs kill -9`
2. **Port 3000 already in use**: Next.js will automatically use port 3001
3. **MongoDB connection failed**: Backend falls back to in-memory storage (works fine for development)
4. **Python dependencies issues**: Ensure you're using Python 3.11+ and have activated the virtual environment

#### Development Notes

- **Backend**: Runs on port 8000 with auto-reload enabled
- **Frontend**: Runs on port 3000 (or 3001) with hot reloading
- **Database**: MongoDB is optional - backend works with in-memory storage
- **API Proxy**: Frontend proxies `/api/*` requests to backend automatically

## 📁 Project Structure

```
DataSwift/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── pages/              # Pages and API routes
│   ├── lib/                # Utility functions
│   └── styles/             # Global styles
├── backend/                 # FastAPI application
│   ├── src/                # Source code
│   │   ├── api/            # API routes
│   │   ├── models/         # Data models
│   │   └── services/       # Business logic
│   └── requirements.txt    # Python dependencies
└── package.json            # Root package.json
```

## 🔌 API Endpoints

### Data Management
- `POST /api/data/upload` - Upload datasets (CSV, Excel, JSON)
- `GET /api/data/list` - List all datasets with metadata
- `GET /api/data/analyze?dataset_id=...` - Analyze dataset (EDA)
- `POST /api/data/clean?dataset_id=...&method=auto` - Clean dataset
- `GET /api/data/export?dataset_id=...` - Export dataset (CSV/Excel/JSON)
- `DELETE /api/data/delete?dataset_id=...` - Delete dataset

### Machine Learning
- `POST /api/model/train` - Train models
- `POST /api/model/evaluate` - Evaluate models
- `POST /api/predict/inference` - Make predictions

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### System
- `GET /health` - Health check endpoint

## 🎯 Key Features

### **Data Science Workflow**
- ✅ Data upload and validation
- ✅ Exploratory data analysis (EDA)
- ✅ Automated insights and visualizations
- ✅ Data preprocessing and cleaning
- ✅ Model training and evaluation

### **Modern Tech Stack**
- ✅ Next.js 15 with App Router
- ✅ React 19 with Server Components
- ✅ FastAPI with Python
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
- **🔄 Real-time Updates**: WebSocket support
- **📱 Responsive**: Works on all devices
- **🔍 SEO Optimized**: Server-side rendering
- **♿ Accessible**: WCAG compliant

## 🔒 Security

- **HTTPS**: Automatic SSL certificates
- **Authentication**: Secure user management
- **CORS**: Proper cross-origin handling
- **Environment Variables**: Secure secrets management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/your-username/dataswift/issues)
- 💬 [Discussions](https://github.com/your-username/dataswift/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the framework
- [FastAPI](https://fastapi.tiangolo.com) for the backend
- [Tailwind CSS](https://tailwindcss.com) for styling
- [shadcn/ui](https://ui.shadcn.com) for components

---

**Made with ❤️ for the data science community**
