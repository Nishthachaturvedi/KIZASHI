from fastapi import APIRouter
from database import behaviour_collection

router = APIRouter()


@router.get("/analytics/drift")
def get_drift_analysis(user_email: str = None):
    """Get current drift analysis"""
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
                "drift_score": 0,
                "risk": "Low"
            }
        }

    productivity_scores = []

    for d in data:

        score = (
            float(d.get("study_hours", 0)) +
            float(d.get("focus_sessions", 0)) +
            float(d.get("tasks_completed", 0))
        ) / 3

        productivity_scores.append(score)

    average = sum(productivity_scores) / len(productivity_scores)

    current = productivity_scores[-1]

    drift_score = abs(current - average)

    risk = "Low"

    if drift_score > 2:
        risk = "High"

    elif drift_score > 1:
        risk = "Moderate"

    return {
        "success": True,
        "data": {
            "drift_score": round(drift_score, 2),
            "risk": risk
        }
    }


@router.get("/drift/current/{email}")
def current_drift(email: str):
    return get_drift_analysis(user_email=email)


@router.get("/drift/weekly/{email}")
def weekly_drift(email: str):

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
                "weekly_average_drift": 0
            }
        }

    productivity_scores = []

    for d in data:

        score = (
            float(d.get("study_hours", 0)) +
            float(d.get("focus_sessions", 0)) +
            float(d.get("tasks_completed", 0))
        ) / 3

        productivity_scores.append(score)

    average = sum(productivity_scores) / len(productivity_scores)

    drift_values = []

    for score in productivity_scores:

        drift = abs(score - average)

        drift_values.append(drift)

    weekly_average_drift = (
        sum(drift_values) / len(drift_values)
    )

    return {
        "success": True,
        "data": {
            "weekly_average_drift": round(weekly_average_drift, 2)
        }
    }


@router.get("/drift/peak/{email}")
def peak_drift(email: str):

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
                "message": "No data"
            }
        }

    productivity_scores = []

    for d in data:

        score = (
            float(d.get("study_hours", 0)) +
            float(d.get("focus_sessions", 0)) +
            float(d.get("tasks_completed", 0))
        ) / 3

        productivity_scores.append(score)

    average = sum(productivity_scores) / len(productivity_scores)

    peak_score = 0
    peak_date = ""

    for d in data:

        current = (
            float(d.get("study_hours", 0)) +
            float(d.get("focus_sessions", 0)) +
            float(d.get("tasks_completed", 0))
        ) / 3

        drift = abs(current - average)

        if drift > peak_score:

            peak_score = drift
            peak_date = d.get("date")

    return {
        "success": True,
        "data": {
            "date": peak_date,
            "peak_drift_score": round(peak_score, 2)
        }
    }


@router.get("/drift/volatility/{email}")
def volatility_graph(email: str):

    data = list(
        behaviour_collection.find(
            {"user_email": email},
            {"_id": 0}
        )
    )

    if not data:
        return {
            "success": True,
            "data": []
        }

    productivity_scores = []

    for d in data:

        score = (
            float(d.get("study_hours", 0)) +
            float(d.get("focus_sessions", 0)) +
            float(d.get("tasks_completed", 0))
        ) / 3

        productivity_scores.append(score)

    average = sum(productivity_scores) / len(productivity_scores)

    result = []

    for d in data:

        current = (
            float(d.get("study_hours", 0)) +
            float(d.get("focus_sessions", 0)) +
            float(d.get("tasks_completed", 0))
        ) / 3

        volatility = abs(current - average)

        result.append({

            "date": d.get("date"),

            "volatility_score":
            round(volatility, 2)
        })

    return {
        "success": True,
        "data": result
    }