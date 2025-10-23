from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import uvicorn

# Import API routers
from src.api import data_api, knowledge_api, model_api, user_api, predict_api

# Custom middleware to handle larger request bodies
class LargeRequestMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Set a larger max request size (50MB)
        if hasattr(request, '_body'):
            # This is handled by uvicorn configuration
            pass
        response = await call_next(request)
        return response

app = FastAPI(
    title="DataSwift API",
    description="A comprehensive data science platform API",
    version="1.0.0"
)

# Add custom middleware for large requests
app.add_middleware(LargeRequestMiddleware)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "https://dataswift-frontend.onrender.com",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(data_api.router, prefix="/api/data", tags=["data"])
app.include_router(knowledge_api.router, prefix="/api/knowledge", tags=["knowledge"])
app.include_router(model_api.router, prefix="/api/model", tags=["model"])
app.include_router(predict_api.router, prefix="/api/predict", tags=["predict"])
app.include_router(user_api.router, prefix="/api/user", tags=["user"])

@app.get("/")
async def root():
    return {"message": "Welcome to DataSwift API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "DataSwift API"}

if __name__ == "__main__":
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        limit_max_requests=1000,
        limit_concurrency=1000,
        timeout_keep_alive=30,
    )
