"""
Dan Classic Furniture - Products Router
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
import re

from app.database import get_db
from app.models.user import User
from app.models.product import Product, Category
from app.schemas.product import (
    ProductCreate, ProductUpdate, ProductResponse, ProductWithCategory,
    ProductListResponse, CategoryCreate, CategoryUpdate, CategoryResponse,
    CategoryWithCount
)
from app.utils.auth import get_admin_user, get_optional_user
from app.utils.uploads import save_multiple_files, delete_file

router = APIRouter(prefix="/products", tags=["Products"])
categories_router = APIRouter(prefix="/categories", tags=["Categories"])


# ============== Helper Functions ==============

def slugify(text: str) -> str:
    """Convert text to URL-safe slug"""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text


# ============== Category Endpoints ==============

@categories_router.get("", response_model=list[CategoryWithCount])
async def get_categories(db: Session = Depends(get_db)):
    """Get all categories with product counts"""
    categories = db.query(Category).all()
    result = []
    for cat in categories:
        count = db.query(Product).filter(
            Product.category_id == cat.id,
            Product.is_active == True
        ).count()
        result.append(CategoryWithCount(
            id=cat.id,
            name=cat.name,
            slug=cat.slug,
            description=cat.description,
            image=cat.image,
            created_at=cat.created_at,
            product_count=count
        ))
    return result


@categories_router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    """Get category by ID"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@categories_router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new category (Admin only)"""
    # Check if name exists
    if db.query(Category).filter(Category.name == category_data.name).first():
        raise HTTPException(status_code=400, detail="Category name already exists")
    
    slug = slugify(category_data.name)
    
    category = Category(
        name=category_data.name,
        slug=slug,
        description=category_data.description
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@categories_router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update a category (Admin only)"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if category_data.name:
        category.name = category_data.name
        category.slug = slugify(category_data.name)
    if category_data.description is not None:
        category.description = category_data.description
    if category_data.image is not None:
        category.image = category_data.image
    
    db.commit()
    db.refresh(category)
    return category


@categories_router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a category (Admin only)"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if category has products
    if db.query(Product).filter(Product.category_id == category_id).count() > 0:
        raise HTTPException(status_code=400, detail="Cannot delete category with products")
    
    db.delete(category)
    db.commit()


# ============== Product Endpoints ==============

@router.get("", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    material: Optional[str] = None,
    color: Optional[str] = None,
    featured: Optional[bool] = None,
    in_stock: Optional[bool] = None,
    search: Optional[str] = None,
    sort: Optional[str] = Query("newest", regex="^(newest|oldest|price_low|price_high|name)$"),
    db: Session = Depends(get_db)
):
    """Get products with filters and pagination"""
    query = db.query(Product).filter(Product.is_active == True)
    
    # Apply filters
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if material:
        query = query.filter(Product.material.ilike(f"%{material}%"))
    if color:
        query = query.filter(Product.colors.contains([color]))
    if featured is not None:
        query = query.filter(Product.featured == featured)
    if in_stock:
        query = query.filter(Product.stock > 0)
    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%")
            )
        )
    
    # Sorting
    if sort == "newest":
        query = query.order_by(Product.created_at.desc())
    elif sort == "oldest":
        query = query.order_by(Product.created_at.asc())
    elif sort == "price_low":
        query = query.order_by(Product.price.asc())
    elif sort == "price_high":
        query = query.order_by(Product.price.desc())
    elif sort == "name":
        query = query.order_by(Product.name.asc())
    
    # Pagination
    total = query.count()
    pages = (total + limit - 1) // limit
    products = query.offset((page - 1) * limit).limit(limit).all()
    
    # Include category info
    result = []
    for product in products:
        category = db.query(Category).filter(Category.id == product.category_id).first()
        result.append(ProductWithCategory(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            compare_price=product.compare_price,
            category_id=product.category_id,
            stock=product.stock,
            sku=product.sku,
            dimensions=product.dimensions,
            material=product.material,
            colors=product.colors or [],
            images=product.images or [],
            featured=product.featured,
            is_active=product.is_active,
            created_at=product.created_at,
            updated_at=product.updated_at,
            category=CategoryResponse(
                id=category.id,
                name=category.name,
                slug=category.slug,
                description=category.description,
                image=category.image,
                created_at=category.created_at
            ) if category else None
        ))
    
    return ProductListResponse(products=result, total=total, page=page, pages=pages)


@router.get("/featured", response_model=list[ProductWithCategory])
async def get_featured_products(
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Get featured products"""
    products = db.query(Product).filter(
        Product.is_active == True,
        Product.featured == True
    ).order_by(Product.created_at.desc()).limit(limit).all()
    
    result = []
    for product in products:
        category = db.query(Category).filter(Category.id == product.category_id).first()
        result.append(ProductWithCategory(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            compare_price=product.compare_price,
            category_id=product.category_id,
            stock=product.stock,
            sku=product.sku,
            dimensions=product.dimensions,
            material=product.material,
            colors=product.colors or [],
            images=product.images or [],
            featured=product.featured,
            is_active=product.is_active,
            created_at=product.created_at,
            updated_at=product.updated_at,
            category=CategoryResponse(
                id=category.id,
                name=category.name,
                slug=category.slug,
                description=category.description,
                image=category.image,
                created_at=category.created_at
            ) if category else None
        ))
    return result


@router.get("/new-arrivals", response_model=list[ProductWithCategory])
async def get_new_arrivals(
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Get newest products"""
    products = db.query(Product).filter(
        Product.is_active == True
    ).order_by(Product.created_at.desc()).limit(limit).all()
    
    result = []
    for product in products:
        category = db.query(Category).filter(Category.id == product.category_id).first()
        result.append(ProductWithCategory(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            compare_price=product.compare_price,
            category_id=product.category_id,
            stock=product.stock,
            sku=product.sku,
            dimensions=product.dimensions,
            material=product.material,
            colors=product.colors or [],
            images=product.images or [],
            featured=product.featured,
            is_active=product.is_active,
            created_at=product.created_at,
            updated_at=product.updated_at,
            category=CategoryResponse(
                id=category.id,
                name=category.name,
                slug=category.slug,
                description=category.description,
                image=category.image,
                created_at=category.created_at
            ) if category else None
        ))
    return result


@router.get("/{product_id}", response_model=ProductWithCategory)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    category = db.query(Category).filter(Category.id == product.category_id).first()
    
    return ProductWithCategory(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price,
        compare_price=product.compare_price,
        category_id=product.category_id,
        stock=product.stock,
        sku=product.sku,
        dimensions=product.dimensions,
        material=product.material,
        colors=product.colors or [],
        images=product.images or [],
        featured=product.featured,
        is_active=product.is_active,
        created_at=product.created_at,
        updated_at=product.updated_at,
        category=CategoryResponse(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            image=category.image,
            created_at=category.created_at
        ) if category else None
    )


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new product (Admin only)"""
    # Verify category exists
    if not db.query(Category).filter(Category.id == product_data.category_id).first():
        raise HTTPException(status_code=400, detail="Category not found")
    
    product = Product(
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        compare_price=product_data.compare_price,
        category_id=product_data.category_id,
        stock=product_data.stock,
        sku=product_data.sku,
        dimensions=product_data.dimensions,
        material=product_data.material,
        colors=product_data.colors,
        images=product_data.images,
        featured=product_data.featured
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.post("/{product_id}/images", response_model=ProductResponse)
async def upload_product_images(
    product_id: int,
    files: list[UploadFile] = File(...),
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Upload images for a product (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Save uploaded files
    new_paths = await save_multiple_files(files, f"products/{product_id}")
    
    # Add to existing images
    current_images = product.images or []
    product.images = current_images + new_paths
    
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update a product (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update fields
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a product (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Delete associated images
    for image_path in (product.images or []):
        delete_file(image_path)
    
    db.delete(product)
    db.commit()
