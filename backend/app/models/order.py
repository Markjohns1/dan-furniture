"""
Dan Classic Furniture - Order Models
"""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, nullable=False, index=True)
    
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Customer details at time of order (in case they change later)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_email = Column(String(255), nullable=True)
    delivery_address = Column(Text, nullable=False)
    
    # Order details
    subtotal = Column(Float, nullable=False)
    delivery_fee = Column(Float, default=0)
    total = Column(Float, nullable=False)
    
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    customer = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    timeline = relationship("OrderTimeline", back_populates="order", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Order {self.order_number}>"


class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # Snapshot of product at time of order
    product_name = Column(String(255), nullable=False)
    product_price = Column(Float, nullable=False)
    product_image = Column(String(500), nullable=True)
    
    quantity = Column(Integer, nullable=False)
    color = Column(String(50), nullable=True)
    
    @property
    def line_total(self):
        return self.product_price * self.quantity
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class OrderTimeline(Base):
    __tablename__ = "order_timeline"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    
    status = Column(Enum(OrderStatus), nullable=False)
    note = Column(Text, nullable=True)
    created_by = Column(String(255), nullable=True)  # Admin who made the change
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    order = relationship("Order", back_populates="timeline")
