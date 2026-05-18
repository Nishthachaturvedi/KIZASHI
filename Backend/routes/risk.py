from fastapi import APIRouter
from database import behaviour_collection

router = APIRouter()


@router.get("/analytics/risk")
def get_risk_assessment(user_email: str = None):
    """Get current risk assessment"""
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
            "data": {
                "risk_level": "Low",
                "burnout_probability": 0,
                "productivity_decline_probability": 0
            }
        }

    latest = data[-1]

    burnout_probability = 0
    productivity_decline_probability = 0

    # Stress Effect
    if float(latest.get("stress", 5)) > 7:
        burnout_probability += 35

    # Sleep Effect
    if float(latest.get("sleep_hours", 0)) < 6:
        burnout_probability += 25

    # Screen Time Effect
    if float(latest.get("screen_time", 0)) > 8:
        burnout_probability += 15

    # Productivity Check
    productivity = (
        float(latest.get("study_hours", 0)) +
        float(latest.get("focus_sessions", 0)) +
        float(latest.get("tasks_completed", 0))
    ) / 3

    if productivity < 4:
        productivity_decline_probability += 40

    # Motivation Check
    if float(latest.get("motivation", 5)) < 5:
        productivity_decline_probability += 30

    # Energy Check
    if float(latest.get("energy", 5)) < 5:
        burnout_probability += 20

    overall_risk = (
        burnout_probability +
        productivity_decline_probability
    ) / 2

    risk_level = "Low"

    if overall_risk > 70:
        risk_level = "High"

    elif overall_risk > 40:
        risk_level = "Moderate"

    return {
        "success": True,
        "data": {
            "risk_level": risk_level,
            "burnout_probability": round(burnout_probability, 2),
            "productivity_decline_probability": round(productivity_decline_probability, 2)
        }
    }


@router.get("/risk/{email}")
def risk_prediction(email: str):
    return get_risk_assessment(user_email=email)


@router.get("/risk/history/{email}")
def risk_history(email: str):

    data = list(
        behaviour_collection.find(
            {"user_email": email},
            {"_id": 0}
        )
    )

    result = []

    for d in data:

        risk = "Low"

        stress = float(d.get("stress", 5))
        
        if stress > 7:
            risk = "High"

        elif stress > 5:
            risk = "Moderate"

        result.append({

            "date": d.get("date"),

            "risk": risk
        })

    return {
        "success": True,
        "data": result
    }