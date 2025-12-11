"""
Dan Classic Furniture - Dashboard & Analytics Router
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import Optional

from app.database import get_db
from app.models.user import User, UserRole
from app.models.product import Product, Category
from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.order import DashboardStats, RevenueByCategory, TopProduct
from app.schemas.user import UserResponse, UserListResponse
from app.utils.auth import get_admin_user

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=now.weekday())
    month_start = today_start.replace(day=1)
    
    # Product stats
    total_products = db.query(Product).filter(Product.is_active == True).count()
    low_stock_count = db.query(Product).filter(
        Product.is_active == True,
        Product.stock < 5
    ).count()
    
    # Order stats
    total_orders = db.query(Order).count()
    orders_today = db.query(Order).filter(Order.created_at >= today_start).count()
    orders_this_week = db.query(Order).filter(Order.created_at >= week_start).count()
    orders_this_month = db.query(Order).filter(Order.created_at >= month_start).count()
    pending_orders = db.query(Order).filter(Order.status == OrderStatus.PENDING).count()
    
    # Revenue stats (only from delivered/confirmed orders)
    completed_statuses = [OrderStatus.CONFIRMED, OrderStatus.DELIVERED]
    
    revenue_today = db.query(func.sum(Order.total)).filter(
        Order.created_at >= today_start,
        Order.status.in_(completed_statuses)
    ).scalar() or 0
    
    revenue_this_week = db.query(func.sum(Order.total)).filter(
        Order.created_at >= week_start,
        Order.status.in_(completed_statuses)
    ).scalar() or 0
    
    revenue_this_month = db.query(func.sum(Order.total)).filter(
        Order.created_at >= month_start,
        Order.status.in_(completed_statuses)
    ).scalar() or 0
    
    # Customer stats
    total_customers = db.query(User).filter(User.role == UserRole.CUSTOMER).count()
    
    return DashboardStats(
        total_products=total_products,
        total_orders=total_orders,
        orders_today=orders_today,
        orders_this_week=orders_this_week,
        orders_this_month=orders_this_month,
        revenue_today=float(revenue_today),
        revenue_this_week=float(revenue_this_week),
        revenue_this_month=float(revenue_this_month),
        total_customers=total_customers,
        low_stock_count=low_stock_count,
        pending_orders=pending_orders
    )


@router.get("/analytics/revenue-by-category", response_model=list[RevenueByCategory])
async def get_revenue_by_category(
    days: int = Query(30, ge=1, le=365),
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get revenue breakdown by category"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    results = db.query(
        Category.name,
        func.sum(OrderItem.product_price * OrderItem.quantity).label('revenue'),
        func.count(OrderItem.id).label('order_count')
    ).join(
        Product, Product.category_id == Category.id
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).join(
        Order, Order.id == OrderItem.order_id
    ).filter(
        Order.created_at >= start_date,
        Order.status.in_([OrderStatus.CONFIRMED, OrderStatus.DELIVERED])
    ).group_by(Category.name).all()
    
    return [
        RevenueByCategory(
            category_name=r[0],
            revenue=float(r[1] or 0),
            order_count=r[2]
        )
        for r in results
    ]


@router.get("/analytics/top-products", response_model=list[TopProduct])
async def get_top_products(
    limit: int = Query(10, ge=1, le=50),
    days: int = Query(30, ge=1, le=365),
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get best-selling products"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    results = db.query(
        Product.id,
        Product.name,
        Product.images,
        func.sum(OrderItem.quantity).label('total_sold'),
        func.sum(OrderItem.product_price * OrderItem.quantity).label('revenue')
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).join(
        Order, Order.id == OrderItem.order_id
    ).filter(
        Order.created_at >= start_date,
        Order.status.in_([OrderStatus.CONFIRMED, OrderStatus.DELIVERED])
    ).group_by(
        Product.id, Product.name, Product.images
    ).order_by(desc('total_sold')).limit(limit).all()
    
    return [
        TopProduct(
            id=r[0],
            name=r[1],
            image=r[2][0] if r[2] else None,
            total_sold=r[3] or 0,
            revenue=float(r[4] or 0)
        )
        for r in results
    ]


@router.get("/analytics/low-stock", response_model=list)
async def get_low_stock_products(
    threshold: int = Query(5, ge=1),
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get products with low stock"""
    products = db.query(Product).filter(
        Product.is_active == True,
        Product.stock <= threshold
    ).order_by(Product.stock.asc()).all()
    
    return [
        {
            "id": p.id,
            "name": p.name,
            "stock": p.stock,
            "image": p.images[0] if p.images else None
        }
        for p in products
    ]


@router.get("/analytics/recent-orders")
async def get_recent_orders(
    limit: int = Query(10, ge=1, le=50),
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get recent orders"""
    orders = db.query(Order).order_by(desc(Order.created_at)).limit(limit).all()
    
    return [
        {
            "id": o.id,
            "order_number": o.order_number,
            "customer_name": o.customer_name,
            "total": o.total,
            "status": o.status.value,
            "created_at": o.created_at.isoformat(),
            "items_count": len(o.items)
        }
        for o in orders
    ]


# ============== Customer Management ==============

@router.get("/customers", response_model=UserListResponse)
async def get_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all customers"""
    
    query = db.query(User).filter(User.role == UserRole.CUSTOMER)
    
    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%")) |
            (User.phone.ilike(f"%{search}%"))
        )
    
    total = query.count()
    pages = (total + limit - 1) // limit
    users = query.order_by(desc(User.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    return UserListResponse(users=users, total=total, page=page, pages=pages)


@router.get("/customers/{customer_id}")
async def get_customer_details(
    customer_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get customer details with order history"""
    customer = db.query(User).filter(
        User.id == customer_id,
        User.role == UserRole.CUSTOMER
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    orders = db.query(Order).filter(
        Order.customer_id == customer_id
    ).order_by(desc(Order.created_at)).all()
    
    total_spent = db.query(func.sum(Order.total)).filter(
        Order.customer_id == customer_id,
        Order.status.in_([OrderStatus.CONFIRMED, OrderStatus.DELIVERED])
    ).scalar() or 0
    
    return {
        "customer": UserResponse.model_validate(customer),
        "total_orders": len(orders),
        "total_spent": float(total_spent),
        "recent_orders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "total": o.total,
                "status": o.status.value,
                "created_at": o.created_at.isoformat()
            }
            for o in orders[:10]
        ]
    }


