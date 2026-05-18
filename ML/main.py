from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib

app = FastAPI()

# 🔹 Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Load data
df = pd.read_csv("kizashi_dataset.csv")
df['date'] = pd.to_datetime(df['date'])

# 🔹 Load model
model = joblib.load("kizashi_model.pkl")
features = joblib.load("features.pkl")


# 🔥 CORE FUNCTION
def predict_behavior(input_data, user_history_df, model, feature_list):

    # 🔹 Validation
    required_fields = [
        "user_id", "date", "study_hours", "screen_time",
        "focus_sessions", "mood_score", "stress_level",
        "sleep_hours", "tasks_completed", "tasks_planned"
    ]

    for field in required_fields:
        if field not in input_data:
            return {"error": f"Missing field: {field}"}

    # Convert input
    new_df = pd.DataFrame([input_data])

    # Merge with history
    df_all = pd.concat([user_history_df, new_df], ignore_index=True)

    df_all['date'] = pd.to_datetime(df_all['date'])
    df_all = df_all.sort_values(by=['user_id', 'date'])

    # 🔹 Feature Engineering
    df_all['completion_rate'] = df_all['tasks_completed'] / df_all['tasks_planned']
    df_all['avg_session_duration'] = (df_all['study_hours'] * 60) / df_all['focus_sessions']
    df_all['focus_density'] = df_all['focus_sessions'] / df_all['study_hours'].replace(0, 1)

    # 🔹 Baseline (rolling)
    df_all['baseline_study'] = df_all.groupby('user_id')['study_hours'].transform(
        lambda x: x.rolling(7, min_periods=1).mean()
    )

    df_all['baseline_screen'] = df_all.groupby('user_id')['screen_time'].transform(
        lambda x: x.rolling(7, min_periods=1).mean()
    )

    df_all['baseline_mood'] = df_all.groupby('user_id')['mood_score'].transform(
        lambda x: x.rolling(7, min_periods=1).mean()
    )

    # 🔹 Drift
    df_all['drift_study'] = df_all['study_hours'] - df_all['baseline_study']
    df_all['drift_screen'] = df_all['screen_time'] - df_all['baseline_screen']
    df_all['drift_mood'] = df_all['mood_score'] - df_all['baseline_mood']

    # 🔹 Normalize
    df_all['abs_drift_study'] = (df_all['drift_study'] / (df_all['baseline_study'] + 1e-5)).abs()
    df_all['abs_drift_screen'] = (df_all['drift_screen'] / (df_all['baseline_screen'] + 1e-5)).abs()
    df_all['abs_drift_mood'] = (df_all['drift_mood'] / (df_all['baseline_mood'] + 1e-5)).abs()

    # 🔹 BDI
    df_all['BDI'] = (
        0.4 * df_all['abs_drift_study'] +
        0.3 * df_all['abs_drift_screen'] +
        0.3 * df_all['abs_drift_mood']
    )

    # 🔹 Risk
    def risk_level(bdi):
        if bdi < 0.2:
            return "Low"
        elif bdi < 0.5:
            return "Moderate"
        else:
            return "High"

    df_all['risk_level'] = df_all['BDI'].apply(risk_level)

    # 🔹 Insight
    def generate_insight(row):
        if row['drift_study'] < -1:
            return "Your study time has dropped below your normal pattern."
        elif row['drift_screen'] > 1:
            return "Your screen time is higher than usual."
        elif row['drift_mood'] < -1:
            return "Your mood is declining."
        else:
            return "Your behavior is stable."

    df_all['insight'] = df_all.apply(generate_insight, axis=1)

    # 🔥 NEW: Recommendation (actionable)
    def generate_recommendation(row):
        suggestions = []

        if row['drift_study'] < -1:
            gap = round(abs(row['drift_study']), 1)
            suggestions.append(f"Increase study time by ~{gap} hours to reach your baseline.")

        if row['drift_screen'] > 1:
            gap = round(row['drift_screen'], 1)
            suggestions.append(f"Reduce screen time by ~{gap} hours.")

        if row['drift_mood'] < -1:
            suggestions.append("Take breaks or reduce workload to improve mood.")

        if not suggestions:
            return "You are on track. Maintain your current routine."

        return " | ".join(suggestions)

    df_all['recommendation'] = df_all.apply(generate_recommendation, axis=1)

    # Latest row
    latest = df_all.iloc[-1]

    # 🔹 ML Prediction
    ml_input = [latest[feature] for feature in feature_list]
    ml_prediction = model.predict([ml_input])[0]

    # 🔹 Final Output
    return {
        "BDI": round(latest['BDI'], 3),
        "risk_level": latest['risk_level'],
        "ml_prediction": ml_prediction,
        "insight": latest['insight'],
        "recommendation": latest['recommendation']
    }


# 🔥 API
@app.post("/predict")
def predict(data: dict):
    return predict_behavior(data, df, model, features)


# 🔹 Health check
@app.get("/")
def home():
    return {"message": "KIZASHI API is running"}