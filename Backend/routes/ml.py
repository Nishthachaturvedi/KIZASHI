from fastapi import APIRouter
from database import behaviour_collection

router = APIRouter()


@router.get("/bdi/{email}")
def calculate_bdi(email: str):

    data = list(
        behaviour_collection.find({"email": email})
    )

    if len(data) < 2:
        return {
            "BDI": 0,
            "risk": "Low"
        }

    latest = data[-1]

    avg_productivity = sum(
        (
            x["study_hours"] +
            x["focus_sessions"] +
            x["tasks_completed"]
        ) / 3
        for x in data
    ) / len(data)

    current_productivity = (
        latest["study_hours"] +
        latest["focus_sessions"] +
        latest["tasks_completed"]
    ) / 3

    drift = abs(
        current_productivity -
        avg_productivity
    )

    risk = "Low"

    if drift > 2:
        risk = "High"

    elif drift > 1:
        risk = "Moderate"

    return {
        "BDI": round(drift, 2),
        "risk": risk
    }