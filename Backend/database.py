from pymongo import MongoClient
import os
client = MongoClient(os.getenv("mongodb+srv://kizashi:kizashi2026@cluster0.agln8yx.mongodb.net/?appName=Cluster0"))

db = client["kizashi"]

# Collections
users_collection = db["users"]
behaviour_collection = db["behaviour"]  # Daily behavior metrics
behaviour_logs_collection = db["behaviour_logs"]  # Individual behavior logs