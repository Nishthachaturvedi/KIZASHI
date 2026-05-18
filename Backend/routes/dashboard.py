from fastapi import APIRouter
from database import behaviour_collection

router = APIRouter()


@router.get("/dashboard")
def dashboard_summary(user_email: str = None):
    """Get dashboard summary for user"""
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
                "message": "No data found",
                "weekly_productivity": 0,
                "weekly_lifestyle": 0,
                "weekly_mental": 0,
                "overall_score": 0,
                "drift_score": 0,
                "risk": "Low"
            }
        }

    productivity_scores = []
    lifestyle_scores = []
    mental_scores = []

    for d in data:

        productivity = (
            float(d.get("study_hours", 0)) +
            float(d.get("focus_sessions", 0)) +
            float(d.get("tasks_completed", 0))
        ) / 3

        lifestyle = (
            float(d.get("sleep_hours", 0)) +
            float(d.get("screen_time", 0)) +
            float(d.get("routine_score", 0))
        ) / 3

        mental = (
            float(d.get("mood", 5)) +
            float(d.get("stress", 5)) +
            float(d.get("motivation", 5)) +
            float(d.get("energy", 5))
        ) / 4

        productivity_scores.append(productivity)
        lifestyle_scores.append(lifestyle)
        mental_scores.append(mental)

    avg_productivity = sum(productivity_scores) / len(productivity_scores)
    avg_lifestyle = sum(lifestyle_scores) / len(lifestyle_scores)
    avg_mental = sum(mental_scores) / len(mental_scores)

    overall_score = (
        avg_productivity +
        avg_lifestyle +
        avg_mental
    ) / 3

    drift_score = abs(
        productivity_scores[-1] -
        avg_productivity
    )

    risk = "Low"

    if drift_score > 2:
        risk = "High"

    elif drift_score > 1:
        risk = "Moderate"

    return {
        "success": True,
        "data": {
            "weekly_productivity":
            round(avg_productivity, 2),

            "weekly_lifestyle":
            round(avg_lifestyle, 2),

            "weekly_mental":
            round(avg_mental, 2),

            "overall_score":
            round(overall_score, 2),

            "drift_score":
            round(drift_score, 2),

            "risk": risk
        }
    }


@router.get("/dashboard/stability/{email}")
def stability_graph(email: str):

    data = list(
        behaviour_collection.find(
            {"user_email": email},
            {"_id": 0}
        )
    )

    result = []

    for d in data:

        overall_stability = (
            float(d.get("mood", 5)) +
            float(d.get("energy", 5)) +
            float(d.get("stress", 5))
        ) / 3

        result.append({
            "date": d.get("date"),
            "stability": round(overall_stability, 2)
        })

    return {
        "success": True,
        "data": result
    }


# Legacy endpoint for compatibility
@router.get("/dashboard/{email}")
def dashboard_summary_legacy(email: str):
    return dashboard_summary(user_email=email)
   
    

    result = []

    for d in data:

        productivity = (
            d["study_hours"] +
            d["focus_sessions"] +
            d["tasks_completed"]
        ) / 3

        lifestyle = (
            d["sleep_hours"] +
            d["screen_time"] +
            d["routine_score"]
        ) / 3

        mental = (
            d["mood"] +
            d["stress"] +
            d["motivation"] +
            d["energy"]
        ) / 4

        stability_score = (
            productivity +
            lifestyle +
            mental
        ) / 3

        result.append({

            "date": d["date"],

            "stability_score":
            round(stability_score, 2)
        })

    return result


@router.get("/dashboard/productivity-weekly/{email}")
def weekly_productivity(email: str):

    data = list(
        behaviour_collection.find(
            {"email": email},
            {"_id": 0}
        )
    )

    result = []

    week = 1

    for d in data:

        productivity_score = (
            d["study_hours"] +
            d["focus_sessions"] +
            d["tasks_completed"]
        ) / 3

        result.append({

            "week": f"Week {week}",

            "productivity_score":
            round(productivity_score, 2)
        })

        week += 1

    return result