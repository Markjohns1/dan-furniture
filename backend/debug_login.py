
import urllib.request
import json
import urllib.error
import time

BASE_URL = "http://localhost:8000/api"

def login_and_get_me():
    # 1. Login
    url = f"{BASE_URL}/auth/login"
    # Use the existing user from check_users
    data = {"email": "elizabeth@gmail.com", "password": "password123"} 
    
    print(f"Logging in as {data['email']}...")
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print("Login Success")
            access_token = res_data['access_token']
            
            # 2. Get Me
            print("Calling /me endpoint...")
            me_req = urllib.request.Request(
                f"{BASE_URL}/auth/me",
                headers={'Authorization': f'Bearer {access_token}'}
            )
            with urllib.request.urlopen(me_req) as me_res:
                print("Get Me Success:", me_res.status)
                print(me_res.read().decode())
                
    except urllib.error.HTTPError as e:
        print(f"Failed: {e.code}")
        print(e.read().decode())

if __name__ == "__main__":
    login_and_get_me()
