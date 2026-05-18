from fastapi import APIRouter
from database import behaviour_collection

router = APIRouter()


# ==============================
# PRODUCTIVITY ANALYTICS
# ==============================

@router.get("/analytics/productivity")
def productivity(days: int = 7):

    return {
        "daily_average": 78,
        "focus_sessions": 12,
        "break_time": 45,

        "chart_data": [
            {"date": "Mon", "value": 60},
            {"date": "Tue", "value": 72},
            {"date": "Wed", "value": 80},
            {"date": "Thu", "value": 75},
            {"date": "Fri", "value": 90},
            {"date": "Sat", "value": 85},
            {"date": "Sun", "value": 88}
        ]
    }


# ==============================
# LIFESTYLE ANALYTICS
# ==============================

@router.get("/analytics/lifestyle")
def lifestyle(days: int = 7):

    return {
        "sleep_average": 7.5,
        "water_intake": 3,
        "exercise_minutes": 45,

        "chart_data": [
            {"date": "Mon", "sleep": 7, "water": 2},
            {"date": "Tue", "sleep": 8, "water": 3},
            {"date": "Wed", "sleep": 6, "water": 2},
            {"date": "Thu", "sleep": 7.5, "water": 4},
            {"date": "Fri", "sleep": 8, "water": 3},
            {"date": "Sat", "sleep": 9, "water": 5},
            {"date": "Sun", "sleep": 8, "water": 4}
        ]
    }


# ==============================
# MENTAL HEALTH ANALYTICS
# ==============================

@router.get("/analytics/mental-health")
def mental_health(days: int = 7):

    return {
        "mood_score": 8.2,
        "stress_level": 4.1,
        "anxiety_level": 3.2,

        "chart_data": [
            {"date": "Mon", "mood": 7},
            {"date": "Tue", "mood": 8},
            {"date": "Wed", "mood": 9},
            {"date": "Thu", "mood": 8},
            {"date": "Fri", "mood": 7},
            {"date": "Sat", "mood": 9},
            {"date": "Sun", "mood": 10}
        ]
    }


# ==============================
# DASHBOARD SUMMARY
# ==============================

@router.get("/dashboard")
def dashboard_summary():

    return {
        "success": True,

        "data": {

            "productivity": {
                "daily_average": 78,
                "focus_sessions": 12,
                "break_time": 45
            },

            "lifestyle": {
                "sleep_average": 7.5,
                "water_intake": 3,
                "exercise_minutes": 45
            },

            "mental_health": {
                "mood_score": 8.2,
                "stress_level": 4.1,
                "anxiety_level": 3.2
            }

        }
    }


# ==============================
# WEEKLY SUMMARY
# ==============================

@router.get("/analytics/weekly-summary")
def weekly_summary():

    return {
        "average_productivity": 78,
        "average_lifestyle": 82,
        "average_mental_state": 85,
        "overall_performance": 81.6
    }


# ==============================
# BEHAVIOUR INSIGHTS
# ==============================

@router.get("/analytics/insights")
def insights():

    return {
        "insights": [
            "Your productivity is highest on Friday.",
            "Your sleep pattern improved this week.",
            "Stress levels are decreasing gradually.",
            "You perform better after 7+ hours of sleep."
        ]
    }


# ==============================
# USER BEHAVIOUR LOGS
# ==============================

@router.get("/analytics/logs")
def get_logs(email: str):

    logs = list(
        behaviour_collection.find(
            {"email": email},
            {"_id": 0}
        )
    )

    return {
        "success": True,
        "logs": logs
    }