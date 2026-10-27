from fastapi import FastAPI
import joblib
from pathlib import Path
from .schemas import Transaction, PredictionResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TransactionGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

model = joblib.load(MODEL_DIR / "fraud_model.pkl")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")


@app.get("/")
def root():
    return {
        "message": "TransactionGuard API is running"
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(transaction: Transaction):

    data = [[
        transaction.amount,
        transaction.distance_from_home,
        transaction.failed_attempts,
        transaction.country_changed,
        transaction.is_night
    ]]

    data_scaled = scaler.transform(data)

    probability = model.predict_proba(data_scaled)[0][1]

    risk_factors = []

    if transaction.amount >= 1000:
        risk_factors.append("High transaction amount")

    if transaction.distance_from_home >= 50:
        risk_factors.append("Unusual distance from home")

    if transaction.failed_attempts >= 2:
        risk_factors.append("Multiple failed attempts")

    if transaction.country_changed == 1:
        risk_factors.append("Transaction from a different country")

    if transaction.is_night == 1:
        risk_factors.append("Transaction during nighttime")

    risk_score = probability * 100

    if probability < 0.30:
        risk_level = "LOW"
        decision = "APPROVE"

    elif probability < 0.70:
        risk_level = "MEDIUM"
        decision = "REVIEW"

    else:
        risk_level = "HIGH"
        decision = "BLOCK"

    return {
        "fraud_probability": probability,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "decision": decision,
        "risk_factors": risk_factors
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}