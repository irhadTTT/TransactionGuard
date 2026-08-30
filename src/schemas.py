from pydantic import BaseModel


class Transaction(BaseModel):
    amount: float
    distance_from_home: float
    failed_attempts: int
    country_changed: int
    is_night: int


class PredictionResponse(BaseModel):
    fraud_probability: float
    risk_score: float
    risk_level: str
    decision: str