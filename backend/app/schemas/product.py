"""
Dan Classic Furniture - Product Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ============== Category Schemas ==============

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    slug: str
    image: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class CategoryWithCount(CategoryResponse):
    product_count: int = 0


# ============== Product Schemas ==============

class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    compare_price: Optional[float] = None
    category_id: int
    stock: int = Field(default=0, ge=0)
    sku: Optional[str] = None
    dimensions: Optional[str] = None
    material: Optional[str] = None
    colors: list[str] = []
    featured: bool = False


class ProductCreate(ProductBase):
    images: list[str] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    compare_price: Optional[float] = None
    category_id: Optional[int] = None
    stock: Optional[int] = None
    sku: Optional[str] = None
    dimensions: Optional[str] = None
    material: Optional[str] = None
    colors: Optional[list[str]] = None
    images: Optional[list[str]] = None
    featured: Optional[bool] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    images: list[str] = []
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProductWithCategory(ProductResponse):
    category: CategoryResponse


class ProductListResponse(BaseModel):
    products: list[ProductWithCategory]
    total: int
    page: int
    pages: int


# ============== Filter Schemas ==============

class ProductFilter(BaseModel):
    category_id: Optional[int] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    material: Optional[str] = None
    color: Optional[str] = None
    featured: Optional[bool] = None
    in_stock: Optional[bool] = None
    search: Optional[str] = None
