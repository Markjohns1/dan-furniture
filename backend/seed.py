"""
Dan Classic Furniture - Database Seeder
Seeds the database with admin user, categories, and initial professional products.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, init_db
from app.models.user import User, UserRole
from app.models.product import Product, Category
from app.utils.auth import get_password_hash

def seed_database():
    """Seed the database with initial data"""
    init_db()
    db = SessionLocal()
    
    try:
        # 1. Create admin user if not exists
        admin = db.query(User).filter(User.email == "admin@danfurniture.co.ke").first()
        if not admin:
            admin = User(
                email="admin@danfurniture.co.ke",
                phone="254724426993",
                password_hash=get_password_hash("admin123"),
                full_name="Dan (Admin)",
                role=UserRole.ADMIN
            )
            db.add(admin)
            print("[OK] Admin user created")
        
        # 2. Create categories
        categories_data = [
            {"name": "Sofasets", "slug": "sofasets", "description": "Luxurious sofasets for your living room"},
            {"name": "Chairs", "slug": "chairs", "description": "Comfortable chairs for every room"},
            {"name": "Dining Sets", "slug": "dining-sets", "description": "Elegant dining sets for your home"},
            {"name": "Office Chairs", "slug": "office-chairs", "description": "Ergonomic office chairs for productivity"},
            {"name": "Home & Kitchen Appliances", "slug": "appliances", "description": "High-quality fridges, washers, and more"}
        ]
        
        for cat_data in categories_data:
            existing = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
            if not existing:
                category = Category(**cat_data)
                db.add(category)
                print(f"[OK] Category created: {cat_data['name']}")
        
        db.commit() # Commit categories first to get IDs

        # 3. Create professional sample products
        cat_sofas = db.query(Category).filter(Category.slug == "sofasets").first()
        cat_dining = db.query(Category).filter(Category.slug == "dining-sets").first()
        cat_office = db.query(Category).filter(Category.slug == "office-chairs").first()
        cat_chairs = db.query(Category).filter(Category.slug == "chairs").first()

        products_data = [
            {
                "name": "Royal Chesterfield Sofa",
                "description": "Handcrafted premium leather Chesterfield sofa with deep buttoning and mahogany legs. A truly timeless piece for your living room.",
                "price": 125000,
                "compare_price": 150000,
                "category_id": cat_sofas.id if cat_sofas else 1,
                "stock": 5,
                "sku": "SOF-CHEST-01",
                "dimensions": "220x95x75 cm",
                "material": "Top Grain Leather",
                "colors": ["Brown", "Black", "Burgundy"],
                "images": ["/uploads/products/sofa.png"],
                "featured": True
            },
            {
                "name": "Modern Mahogany Dining Set",
                "description": "Elegant 6-seater dining set made from solid mahogany. Includes 6 velvet-upholstered chairs for maximum comfort.",
                "price": 85000,
                "compare_price": 95000,
                "category_id": cat_dining.id if cat_dining else 3,
                "stock": 3,
                "sku": "DIN-MAHOG-01",
                "dimensions": "180x90x75 cm",
                "material": "Solid Mahogany",
                "colors": ["Walnut", "Dark Oak"],
                "images": ["/uploads/products/dining.png"],
                "featured": True
            },
            {
                "name": "ErgoPro Executive Chair",
                "description": "Professional executive chair with lumbar support, adjustable headrest, and breathable mesh back. Perfect for long working hours.",
                "price": 28000,
                "compare_price": 35000,
                "category_id": cat_office.id if cat_office else 4,
                "stock": 15,
                "sku": "OFF-ERGO-01",
                "dimensions": "Standard Adjustable",
                "material": "Nylon Mesh & Aluminum",
                "colors": ["Black", "Grey"],
                "images": ["/uploads/products/office.png"],
                "featured": False
            },
            {
                "name": "Azure Velvet Accent Chair",
                "description": "Stylish accent chair with deep blue velvet upholstery and brushed gold legs. Adds a pop of color and luxury to any corner.",
                "price": 18500,
                "compare_price": 22000,
                "category_id": cat_chairs.id if cat_chairs else 2,
                "stock": 10,
                "sku": "CHR-AZURE-01",
                "dimensions": "75x80x85 cm",
                "material": "Velvet & Steel",
                "colors": ["Blue", "Yellow", "Pink"],
                "images": ["/uploads/products/accent.png"],
                "featured": False
            }
        ]

        for p_data in products_data:
            existing = db.query(Product).filter(Product.sku == p_data["sku"]).first()
            if not existing:
                product = Product(**p_data)
                db.add(product)
                print(f"[OK] Product created: {p_data['name']}")
        
        db.commit()
        print("\nDatabase seeding complete!")
        
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
