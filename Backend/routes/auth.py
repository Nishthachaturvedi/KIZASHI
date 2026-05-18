from fastapi import APIRouter, HTTPException
from database import users_collection
import jwt
from datetime import datetime, timedelta
import hashlib

router = APIRouter()

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(email: str, user_id: str):
    payload = {
        "email": email,
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=30)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

@router.post("/register")
def register(data: dict):
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        raise HTTPException(status_code=400, detail="Missing required fields")

    existing = users_collection.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(password)
    user_id = str(users_collection.count_documents({})) + "_" + email
    
    user = {
        "user_id": user_id,
        "name": name,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    users_collection.insert_one(user)
    
    access_token = create_access_token(email, user_id)
    
    return {
        "success": True,
        "message": "User registered successfully",
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }
    }


@router.post("/login")
def login(data: dict):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing email or password")

    user = users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    hashed_password = hash_password(password)
    if user["password"] != hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(email, user["user_id"])
    
    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user["user_id"],
                "name": user["name"],
                "email": user["email"],
                "created_at": user["created_at"].isoformat()
            }
        }
    }


@router.get("/user/profile")
def get_user_profile(email: str):
    user = users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "success": True,
        "data": {
            "user": {
                "id": user["user_id"],
                "name": user["name"],
                "email": user["email"],
                "created_at": user["created_at"].isoformat()
            }
        }
    }