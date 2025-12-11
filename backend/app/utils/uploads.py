"""
Dan Classic Furniture - File Upload Utilities
"""
import os
import uuid
import aiofiles
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from PIL import Image
from io import BytesIO

from app.config import settings


def get_upload_path() -> Path:
    """Get the upload directory path"""
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(exist_ok=True)
    return upload_path


def validate_image(file: UploadFile) -> None:
    """Validate uploaded image file"""
    # Check extension
    if file.filename:
        ext = file.filename.split(".")[-1].lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type not allowed. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
    
    # Check content type
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )


async def save_upload_file(file: UploadFile, subfolder: str = "products") -> str:
    """Save uploaded file and return the path"""
    validate_image(file)
    
    # Read file content
    content = await file.read()
    
    # Check file size
    if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE_MB}MB"
        )
    
    # Create subfolder
    upload_path = get_upload_path() / subfolder
    upload_path.mkdir(exist_ok=True)
    
    # Generate unique filename
    ext = file.filename.split(".")[-1].lower() if file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = upload_path / filename
    
    # Optimize image before saving
    try:
        image = Image.open(BytesIO(content))
        
        # Convert to RGB if necessary (for PNG transparency)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        
        # Resize if too large (max 1200px width)
        max_width = 1200
        if image.width > max_width:
            ratio = max_width / image.width
            new_height = int(image.height * ratio)
            image = image.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Save optimized image
        image.save(str(file_path), "JPEG", quality=85, optimize=True)
    except Exception:
        # If image processing fails, save original
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)
    
    return f"/uploads/{subfolder}/{filename}"


async def save_multiple_files(files: list[UploadFile], subfolder: str = "products") -> list[str]:
    """Save multiple uploaded files"""
    paths = []
    for file in files:
        if file.filename:  # Skip empty files
            path = await save_upload_file(file, subfolder)
            paths.append(path)
    return paths


def delete_file(file_path: str) -> bool:
    """Delete a file from uploads"""
    try:
        # Remove leading slash and construct full path
        relative_path = file_path.lstrip("/")
        full_path = Path(relative_path)
        if full_path.exists():
            full_path.unlink()
            return True
    except Exception:
        pass
    return False
