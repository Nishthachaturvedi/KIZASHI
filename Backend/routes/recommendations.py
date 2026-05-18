from fastapi import APIRouter
from database import behaviour_collection
import uuid

router = APIRouter()


def create_recommendation(title: str, description: str, priority: str, category: str, action_items: list) -> dict:
    """Helper to create a structured recommendation"""
    return {
        "id": str(uuid.uuid4()),
        "title": title,
        "description": description,
        "priority": priority,
        "category": category,
        "action_items": action_items
    }


@router.get("/analytics/recommendations")
def get_recommendations(user_email: str = None):
    """Get recommendations for user"""
    if not user_email:
        return {"success": False, "error": "user_email required"}

    data = list(
        behaviour_collection.find(
            {"user_email": user_email},
            {"_id": 0}
        )
    )

    if not data:
        return {
            "success": True,
            "data": []
        }

    latest = data[-1]
    recommendations = []

    # Sleep Recommendation
    if float(latest.get("sleep_hours", 0)) < 6:
        recommendations.append(
            create_recommendation(
                title="Improve Sleep Duration",
                description="Your current sleep duration is below the recommended 6-8 hours. Increasing sleep can significantly improve your mental health and productivity.",
                priority="high",
                category="Sleep",
                action_items=[
                    "Go to bed 30 minutes earlier",
                    "Create a bedtime routine",
                    "Reduce screen time before sleep",
                    "Keep bedroom cool and dark"
                ]
            )
        )

    # Screen Time Recommendation
    if float(latest.get("screen_time", 0)) > 8:
        recommendations.append(
            create_recommendation(
                title="Reduce Screen Time",
                description="Your screen time exceeds 8 hours daily. This can impact your mental stability and focus. Consider taking regular breaks.",
                priority="high",
                category="Lifestyle",
                action_items=[
                    "Take 5-minute breaks every 30 minutes",
                    "Use the 20-20-20 rule (look 20 feet away every 20 minutes)",
                    "Schedule screen-free time",
                    "Practice outdoor activities"
                ]
            )
        )

    # Stress Recommendation
    if float(latest.get("stress", 5)) > 7:
        recommendations.append(
            create_recommendation(
                title="Stress Management",
                description="High stress levels detected. Implementing relaxation and meditation activities can help manage stress and improve overall well-being.",
                priority="high",
                category="Mental Health",
                action_items=[
                    "Start a 10-minute daily meditation",
                    "Practice deep breathing exercises",
                    "Try progressive muscle relaxation",
                    "Consider mindfulness apps"
                ]
            )
        )

    # Motivation Recommendation
    if float(latest.get("motivation", 5)) < 5:
        recommendations.append(
            create_recommendation(
                title="Boost Motivation",
                description="Your motivation levels are dropping. Breaking down tasks into smaller, manageable goals can help restore motivation.",
                priority="medium",
                category="Productivity",
                action_items=[
                    "Break large tasks into smaller steps",
                    "Set clear, achievable goals",
                    "Celebrate small wins",
                    "Find accountability partners"
                ]
            )
        )

    # Productivity Recommendation
    productivity = (
        float(latest.get("study_hours", 0)) +
        float(latest.get("focus_sessions", 0)) +
        float(latest.get("tasks_completed", 0))
    ) / 3

    if productivity < 4:
        recommendations.append(
            create_recommendation(
                title="Enhance Productivity",
                description="Your productivity metrics are declining. Structured focus sessions can help you regain momentum and accomplish more.",
                priority="high",
                category="Productivity",
                action_items=[
                    "Try the Pomodoro technique",
                    "Create a dedicated workspace",
                    "Eliminate distractions",
                    "Schedule focus time blocks"
                ]
            )
        )

    # Energy Recommendation
    if float(latest.get("energy", 5)) < 4:
        recommendations.append(
            create_recommendation(
                title="Increase Energy Levels",
                description="Low energy levels can impact your overall performance. Regular exercise and proper hydration can boost your energy.",
                priority="medium",
                category="Health",
                action_items=[
                    "Get 30 minutes of exercise daily",
                    "Drink more water throughout the day",
                    "Eat balanced meals",
                    "Take short power naps if needed"
                ]
            )
        )

    if not recommendations:
        recommendations.append(
            create_recommendation(
                title="Maintain Current Patterns",
                description="Your behavioral patterns look stable and healthy. Continue with your current routines to maintain well-being.",
                priority="low",
                category="General",
                action_items=[
                    "Continue current exercise routine",
                    "Maintain consistent sleep schedule",
                    "Keep stress management practices",
                    "Monitor metrics regularly"
                ]
            )
        )

    return {
        "success": True,
        "data": recommendations
    }


@router.get("/recommendations/{email}")
def recommendations_legacy(email: str):
    return get_recommendations(user_email=email)


@router.get("/recommendations/focus/{email}")
def focus_recommendation(email: str):

    data = list(
        behaviour_collection.find(
            {"user_email": email},
            {"_id": 0}
        )
    )

    if not data:
        return {
            "success": True,
            "data": {
                "focus_recommendation": "No data available."
            }
        }

    latest = data[-1]

    if float(latest.get("focus_sessions", 0)) < 3:

        return {
            "focus_recommendation":
            "Try shorter but more frequent focus sessions."
        }

    return {
        "focus_recommendation":
        "Your focus consistency looks good."
    }


@router.get("/recommendations/lifestyle/{email}")
def lifestyle_recommendation(email: str):

    data = list(
        behaviour_collection.find(
            {"user_email": email},
            {"_id": 0}
        )
    )

    if not data:
        return {
            "lifestyle_recommendation":
            "No data available."
        }

    latest = data[-1]

    if float(latest.get("sleep_hours", 0)) < 6:

        return {
            "lifestyle_recommendation":
            "Maintain a fixed sleep cycle for better stability."
        }

    return {
        "lifestyle_recommendation":
        "Your lifestyle consistency looks balanced."
    }


@router.get("/recommendations/mental/{email}")
def mental_recommendation(email: str):

    data = list(
        behaviour_collection.find(
            {"user_email": email},
            {"_id": 0}
        )
    )

    if not data:
        return {
            "mental_health_recommendation":
            "No data available."
        }

    latest = data[-1]

    if float(latest.get("stress", 5)) > 7:

        return {
            "mental_health_recommendation":
            "Stress levels are increasing. Take proper recovery breaks."
        }

    return {
        "mental_health_recommendation":
        "Mental state appears stable."
    }