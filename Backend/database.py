from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["kizashi"]

# Collections
users_collection = db["users"]
behaviour_collection = db["behaviour"]  # Daily behavior metrics
behaviour_logs_collection = db["behaviour_logs"]  # Individual behavior logs