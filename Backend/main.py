
from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.behaviour import router as behaviour_router
from routes.analytics import router as analytics_router
from routes.ml import router as ml_router
from routes.dashboard import router as dashboard_router
from routes.drift import router as drift_router
from routes.recommendations import router as recommendations_router
from routes.risk import router as risk_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://kizashi-sigma.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(risk_router)
app.include_router(drift_router)
app.include_router(recommendations_router)
app.include_router(dashboard_router)
app.include_router(auth_router)
app.include_router(behaviour_router)
app.include_router(analytics_router)
app.include_router(ml_router)


@app.get("/")
def home():
    return {
        "message": "KIZASHI Backend Running"
    }