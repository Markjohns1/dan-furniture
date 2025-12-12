
import urllib.request
import json
import urllib.error

BASE_URL = "http://localhost:8000"

def register_user(email, password, phone):
    url = f"{BASE_URL}/auth/register"
    data = {
        "email": email,
        "password": password,
        "full_name": "Test User",
        "phone": phone,
        "address": "123 Test St"
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Register Status: {response.status}")
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Register Failed: {e.code} {e.read().decode()}")
        return None

def login_user(email, password):
    url = f"{BASE_URL}/auth/login"
    data = {
        "email": email,
        "password": password
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Login Status: {response.status}")
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Login Failed: {e.code} {e.read().decode()}")
        return None

def get_me(token):
    url = f"{BASE_URL}/auth/me"
    req = urllib.request.Request(
        url,
        headers={'Authorization': f'Bearer {token}'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Get Me Status: {response.status}")
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Get Me Failed: {e.code} {e.read().decode()}")
        return None

def main():
    import time
    # Unique email/phone
    ts = int(time.time())
    email = f"test{ts}@example.com"
    phone = f"07{ts}"[:10]
    
    print(f"Testing with {email} / {phone}")
    
    # 1. Register
    reg_res = register_user(email, "password123", phone)
    if not reg_res:
        print("Stopping due to registration failure")
        return

    # 2. Login
    login_res = login_user(email, "password123")
    if not login_res:
        print("Stopping due to login failure")
        return
        
    token = login_res.get("access_token")
    if not token:
        print("No access token found")
        return
        
    # 3. Get Me
    me_res = get_me(token)
    if me_res:
        print("Success! User flow verified.")
        print(me_res)

if __name__ == "__main__":
    main()
