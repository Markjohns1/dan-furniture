"""
Dan Classic Furniture - Force Seed Admin
Updates admin password to ensure it matches the current bcrypt version.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, init_db
from app.models.user import User, UserRole
from app.utils.auth import get_password_hash

def force_seed():
    init_db()
    db = SessionLocal()
    try:
        # Check admin
        admin = db.query(User).filter(User.email == "admin@danfurniture.co.ke").first()
        new_hash = get_password_hash("admin123")
        
        if admin:
            print("🔄 Updating existing admin password...")
            admin.password_hash = new_hash
        else:
            print("➕ Creating new admin user...")
            admin = User(
                email="admin@danfurniture.co.ke",
                phone="254700000000",
                password_hash=new_hash,
                full_name="Dan (Admin)",
                role=UserRole.ADMIN
            )
            db.add(admin)
        
        db.commit()
        print("✅ Admin user updated: admin@danfurniture.co.ke / admin123")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    force_seed()
