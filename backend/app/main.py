"""
Dan Classic Furniture - FastAPI Main Application
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os

from app.config import settings
from app.database import init_db
from app.routers import auth, products, orders, dashboard
from app.routers.products import categories_router

# Create FastAPI app
app = FastAPI(
    title="Dan Classic Furniture API",
    description="E-commerce management system for Dan Classic Furniture - Sofasets & Chairs",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if not exists
os.makedirs("uploads", exist_ok=True)
os.makedirs("uploads/products", exist_ok=True)
os.makedirs("uploads/categories", exist_ok=True)

# Serve static files (uploads)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(categories_router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


@app.on_event("startup")
async def startup():
    """Initialize database on startup"""
    init_db()
    print("✅ Database initialized")
    print("🚀 Dan Classic Furniture API is running!")
    print(f"📖 API Documentation: http://localhost:8000/docs")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Dan Classic Furniture API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/api/config")
async def get_config():
    """Get public configuration (WhatsApp number, etc.)"""
    return {
        "whatsapp_number": settings.WHATSAPP_NUMBER,
        "currency": "KSh",
        "store_name": "Dan Classic Furniture"
    }


# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again."}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
