import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.product import Product, Category

def delete_category():
    db = SessionLocal()
    try:
        # 1. Find the Bedroom category
        category = db.query(Category).filter(Category.slug == "bedroom").first()
        if category:
            # 2. Delete products in this category
            products_deleted = db.query(Product).filter(Product.category_id == category.id).delete()
            print(f"[OK] Deleted {products_deleted} products from 'Bedroom Furniture' category.")
            
            # 3. Delete the category itself
            db.delete(category)
            db.commit()
            print("[OK] Deleted 'Bedroom Furniture' category.")
        else:
            print("[INFO] 'Bedroom Furniture' category not found.")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] {e}")
    finally:
        db.close()

if __name__ == "__main__":
    delete_category()
