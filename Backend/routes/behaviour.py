from fastapi import APIRouter
from database import behaviour_logs_collection, behaviour_collection
from datetime import datetime

router = APIRouter()
logs = []

@router.post("/behavior/logs")
def add_behavior_log(data: dict):
    """Save a behavior log entry"""
    log = {
        "user_email": data.get("user_email"),
        "category": data.get("category"),
        "duration": data.get("duration"),
        "notes": data.get("notes", ""),
        "timestamp": datetime.utcnow()
    }
    
    result = behaviour_logs_collection.insert_one(log)
    
    return {
        "success": True,
        "message": "Log added",
        "data": {
            "id": str(result.inserted_id),
            "timestamp": log["timestamp"].isoformat()
        }
    }


@router.get("/behavior/logs")
def get_behavior_logs(user_email: str = None, limit: int = 50, offset: int = 0):
    """Fetch behavior logs"""
    query = {}
    if user_email:
        query["user_email"] = user_email
    
    logs = list(
        behaviour_logs_collection.find(query)
        .skip(offset)
        .limit(limit)
        .sort("timestamp", -1)
    )
    
    # Convert ObjectId to string for JSON serialization
    for log in logs:
        log["_id"] = str(log["_id"])
        log["timestamp"] = log["timestamp"].isoformat()
    
    return {
        "success": True,
        "data": logs
    }


@router.post("/behavior/log")
def log_behavior_metrics(data: dict):
    """Save daily behavior metrics"""
    metrics = {
        "user_email": data.get("user_email"),
        "date": data.get("date", datetime.utcnow().date().isoformat()),
        
        # Productivity
        "study_hours": data.get("study_hours", 0),
        "focus_sessions": data.get("focus_sessions", 0),
        "tasks_completed": data.get("tasks_completed", 0),
        
        # Lifestyle
        "sleep_hours": data.get("sleep_hours", 0),
        "screen_time": data.get("screen_time", 0),
        "routine_score": data.get("routine_score", 0),
        
        # Mental State
        "mood": data.get("mood", 5),
        "stress": data.get("stress", 5),
        "motivation": data.get("motivation", 5),
        "energy": data.get("energy", 5),
        
        "timestamp": datetime.utcnow()
    }
    
    behaviour_collection.insert_one(metrics)
    
    return {
        "success": True,
        "message": "Behavior metrics saved"
    }


@router.get("/behavior/logs")
def get_logs(limit: int = 50, offset: int = 0):

    return {
        "data": logs[offset:offset+limit]
    }