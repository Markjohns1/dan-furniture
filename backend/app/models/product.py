"""
Dan Classic Furniture - Product & Category Models
"""
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    products = relationship("Product", back_populates="category")
    
    def __repr__(self):
        return f"<Category {self.name}>"


class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    compare_price = Column(Float, nullable=True)  # Original price for discounts
    
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    
    stock = Column(Integer, default=0)
    sku = Column(String(50), unique=True, nullable=True)
    
    # Physical details
    dimensions = Column(String(100), nullable=True)  # e.g., "120x80x45 cm"
    material = Column(String(100), nullable=True)  # e.g., "Leather", "Fabric"
    colors = Column(JSON, default=list)  # ["Brown", "Black", "Grey"]
    
    # Images stored as JSON array of paths
    images = Column(JSON, default=list)  # ["/uploads/img1.jpg", "/uploads/img2.jpg"]
    
    # Flags
    featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
    
    def __repr__(self):
        return f"<Product {self.name}>"
    
    @property
    def is_on_sale(self):
        return self.compare_price and self.compare_price > self.price
    
    @property
    def discount_percent(self):
        if self.is_on_sale:
            return int(((self.compare_price - self.price) / self.compare_price) * 100)
        return 0
