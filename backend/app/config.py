"""
Dan Classic Furniture - Backend Configuration
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dan_furniture.db")
    
    # WhatsApp
    WHATSAPP_NUMBER: str = os.getenv("WHATSAPP_NUMBER", "254700000000")
    
    # Upload
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "5"))
    ALLOWED_EXTENSIONS: list = os.getenv("ALLOWED_EXTENSIONS", "jpg,jpeg,png,webp").split(",")
    UPLOAD_DIR: str = "uploads"
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

settings = Settings()
