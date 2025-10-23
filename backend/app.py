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
        # Note: Actual max request size is typically enforced by the ASGI server (uvicorn/gunicorn)
        # Keep this middleware as a placeholder for any request preprocessing if needed.
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(data_api.router, prefix="/data", tags=["data"])
app.include_router(knowledge_api.router, prefix="/knowledge", tags=["knowledge"])
app.include_router(model_api.router, prefix="/model", tags=["model"])
app.include_router(user_api.router, prefix="/users", tags=["users"])
app.include_router(predict_api.router, prefix="/predict", tags=["predict"])


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
