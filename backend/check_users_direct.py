
import sqlite3

def check_users_sqlite():
    try:
        conn = sqlite3.connect('dan_furniture.db')
        cursor = conn.cursor()
        
        print("Checking users table...")
        cursor.execute("SELECT id, email, phone, role, full_name, password_hash FROM users")
        rows = cursor.fetchall()
        
        print(f"Total users: {len(rows)}")
        for row in rows:
            print(f"ID: {row[0]}, Email: '{row[1]}', Phone: '{row[2]}', Role: {row[3]}, Name: '{row[4]}'")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_users_sqlite()
