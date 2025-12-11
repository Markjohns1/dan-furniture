"""
Dan Classic Furniture - Orders Router
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
from datetime import datetime
import uuid

from app.database import get_db
from app.models.user import User, UserRole
from app.models.product import Product
from app.models.order import Order, OrderItem, OrderTimeline, OrderStatus
from app.schemas.order import (
    OrderCreate, OrderUpdate, OrderStatusUpdate, OrderResponse, 
    OrderWithTimeline, OrderListResponse
)
from app.utils.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/orders", tags=["Orders"])


def generate_order_number() -> str:
    """Generate unique order number"""
    return f"DCF-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order"""
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")
    
    # Validate and calculate totals
    subtotal = 0
    order_items = []
    
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient stock for {product.name}. Available: {product.stock}"
            )
        
        line_total = product.price * item.quantity
        subtotal += line_total
        
        order_items.append({
            "product": product,
            "quantity": item.quantity,
            "color": item.color
        })
    
    # Create order
    order = Order(
        order_number=generate_order_number(),
        customer_id=current_user.id,
        customer_name=current_user.full_name,
        customer_phone=current_user.phone,
        customer_email=current_user.email,
        delivery_address=order_data.delivery_address,
        subtotal=subtotal,
        delivery_fee=0,  # Can be configured later
        total=subtotal,
        status=OrderStatus.PENDING,
        notes=order_data.notes
    )
    db.add(order)
    db.flush()  # Get order ID
    
    # Create order items and update stock
    for item_data in order_items:
        product = item_data["product"]
        
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            product_price=product.price,
            product_image=product.images[0] if product.images else None,
            quantity=item_data["quantity"],
            color=item_data["color"]
        )
        db.add(order_item)
        
        # Reduce stock
        product.stock -= item_data["quantity"]
    
    # Create initial timeline entry
    timeline = OrderTimeline(
        order_id=order.id,
        status=OrderStatus.PENDING,
        note="Order placed",
        created_by=current_user.full_name
    )
    db.add(timeline)
    
    db.commit()
    db.refresh(order)
    
    return order


@router.get("", response_model=OrderListResponse)
async def get_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    status: Optional[OrderStatus] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get orders (customers see their own, admins see all)"""
    if current_user.role == UserRole.ADMIN:
        query = db.query(Order)
    else:
        query = db.query(Order).filter(Order.customer_id == current_user.id)
    
    # Apply filters
    if status:
        query = query.filter(Order.status == status)
    if search:
        query = query.filter(
            (Order.order_number.ilike(f"%{search}%")) |
            (Order.customer_name.ilike(f"%{search}%")) |
            (Order.customer_phone.ilike(f"%{search}%"))
        )
    
    # Order by newest first
    query = query.order_by(desc(Order.created_at))
    
    # Pagination
    total = query.count()
    pages = (total + limit - 1) // limit
    orders = query.offset((page - 1) * limit).limit(limit).all()
    
    return OrderListResponse(orders=orders, total=total, page=page, pages=pages)


@router.get("/{order_id}", response_model=OrderWithTimeline)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order details with timeline"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check access (customer can only see their own orders)
    if current_user.role != UserRole.ADMIN and order.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return order


@router.put("/{order_id}/status", response_model=OrderWithTimeline)
async def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update order status (Admin only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    old_status = order.status
    order.status = status_data.status
    
    # Create timeline entry
    timeline = OrderTimeline(
        order_id=order.id,
        status=status_data.status,
        note=status_data.note or f"Status changed from {old_status.value} to {status_data.status.value}",
        created_by=admin.full_name
    )
    db.add(timeline)
    
    # If cancelled, restore stock
    if status_data.status == OrderStatus.CANCELLED and old_status != OrderStatus.CANCELLED:
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                product.stock += item.quantity
    
    db.commit()
    db.refresh(order)
    
    return order


@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    order_data: OrderUpdate,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update order details (Admin only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order_data.notes is not None:
        order.notes = order_data.notes
    if order_data.delivery_address:
        order.delivery_address = order_data.delivery_address
    
    db.commit()
    db.refresh(order)
    
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel an order (only if pending)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check access
    if current_user.role != UserRole.ADMIN and order.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Only pending orders can be cancelled by customers
    if current_user.role != UserRole.ADMIN and order.status != OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Only pending orders can be cancelled")
    
    # Restore stock
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock += item.quantity
    
    order.status = OrderStatus.CANCELLED
    
    # Create timeline entry
    timeline = OrderTimeline(
        order_id=order.id,
        status=OrderStatus.CANCELLED,
        note="Order cancelled",
        created_by=current_user.full_name
    )
    db.add(timeline)
    
    db.commit()
