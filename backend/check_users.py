
from app.database import SessionLocal
from app.models.user import User

def check_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Total users: {len(users)}")
        for user in users:
            print(f"ID: {user.id}, Email: '{user.email}', Phone: '{user.phone}', Role: {user.role}, Name: '{user.full_name}'")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()
