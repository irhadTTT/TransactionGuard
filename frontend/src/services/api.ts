const API_URL = import.meta.env.VITE_API_URL;

export interface TransactionRequest {
  amount: number;
  distance_from_home: number;
  failed_attempts: number;
  country_changed: number;
  is_night: number;
}

export interface PredictionResponse {
  fraud_probability: number;
  risk_score: number;
  risk_level: string;
  decision: string;
  risk_factors: string[];
}

export async function predictTransaction(
  transaction: TransactionRequest
): Promise<PredictionResponse> {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  })

  if (!response.ok) {
    throw new Error("Failed to predict transaction");
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);

    return response.ok;
  } catch {
    return false;
  }
}
