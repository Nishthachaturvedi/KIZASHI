from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client["kizashi"]
# Collections
users_collection = db["users"]
behaviour_collection = db["behaviour"]  # Daily behavior metrics
behaviour_logs_collection = db["behaviour_logs"]  # Individual behavior logs