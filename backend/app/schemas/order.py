"""
Dan Classic Furniture - Order Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.order import OrderStatus


# ============== Order Item Schemas ==============

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)
    color: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_price: float
    product_image: Optional[str] = None
    quantity: int
    color: Optional[str] = None
    
    class Config:
        from_attributes = True


# ============== Order Timeline Schemas ==============

class OrderTimelineResponse(BaseModel):
    id: int
    status: OrderStatus
    note: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============== Order Schemas ==============

class OrderCreate(BaseModel):
    items: list[OrderItemCreate]
    delivery_address: str = Field(..., min_length=10)
    notes: Optional[str] = None


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    notes: Optional[str] = None
    delivery_address: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    note: Optional[str] = None


class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_id: int
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    delivery_address: str
    subtotal: float
    delivery_fee: float
    total: float
    status: OrderStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse] = []
    
    class Config:
        from_attributes = True


class OrderWithTimeline(OrderResponse):
    timeline: list[OrderTimelineResponse] = []


class OrderListResponse(BaseModel):
    orders: list[OrderResponse]
    total: int
    page: int
    pages: int


# ============== Dashboard Stats Schemas ==============

class DashboardStats(BaseModel):
    total_products: int
    total_orders: int
    orders_today: int
    orders_this_week: int
    orders_this_month: int
    revenue_today: float
    revenue_this_week: float
    revenue_this_month: float
    total_customers: int
    low_stock_count: int
    pending_orders: int


class RevenueByCategory(BaseModel):
    category_name: str
    revenue: float
    order_count: int


class TopProduct(BaseModel):
    id: int
    name: str
    image: Optional[str]
    total_sold: int
    revenue: float
