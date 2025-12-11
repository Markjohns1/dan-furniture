"""
Dan Classic Furniture - Database Seeder
Run this to seed the database with initial categories and an admin user.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, init_db
from app.models.user import User, UserRole
from app.models.product import Category
from app.utils.auth import get_password_hash


def seed_database():
    """Seed the database with initial data"""
    init_db()
    db = SessionLocal()
    
    try:
        # Create admin user if not exists
        admin = db.query(User).filter(User.email == "admin@danfurniture.co.ke").first()
        if not admin:
            admin = User(
                email="admin@danfurniture.co.ke",
                phone="254700000000",
                password_hash=get_password_hash("admin123"),
                full_name="Dan (Admin)",
                role=UserRole.ADMIN
            )
            db.add(admin)
            print("✅ Admin user created: admin@danfurniture.co.ke / admin123")
        else:
            print("ℹ️  Admin user already exists")
        
        # Create categories
        categories_data = [
            {"name": "Sofasets", "slug": "sofasets", "description": "Luxurious sofasets for your living room"},
            {"name": "Chairs", "slug": "chairs", "description": "Comfortable chairs for every room"},
            {"name": "Dining Sets", "slug": "dining-sets", "description": "Elegant dining sets for your home"},
            {"name": "Office Chairs", "slug": "office-chairs", "description": "Ergonomic office chairs for productivity"}
        ]
        
        for cat_data in categories_data:
            existing = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
            if not existing:
                category = Category(**cat_data)
                db.add(category)
                print(f"✅ Category created: {cat_data['name']}")
            else:
                print(f"ℹ️  Category already exists: {cat_data['name']}")
        
        db.commit()
        print("\n🎉 Database seeding complete!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
