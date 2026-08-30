import { useEffect, useState } from "react";
import {
  checkHealth,
  predictTransaction,
  type PredictionResponse,
} from "./services/api";

interface TransactionForm {
  amount: string;
  distance_from_home: string;
  failed_attempts: string;
  country_changed: number;
  is_night: number;
}

function App() {
  const [form, setForm] = useState<TransactionForm>({
    amount: "",
    distance_from_home: "",
    failed_attempts: "",
    country_changed: 0,
    is_night: 0,
  });

  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    checkHealth()
      .then((data) => {
        setApiOnline(data);
      })
      .catch(() => {
        setError("Failed to load health endpoint");
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "country_changed" || name === "is_night"
          ? Number(value)
          : value,
    }));
  };

  const handleCheckTransaction = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await predictTransaction({
        amount: Number(form.amount),
        distance_from_home: Number(form.distance_from_home),
        failed_attempts: Number(form.failed_attempts),
        country_changed: form.country_changed,
        is_night: form.is_night,
      });

      setResult(data);
    } catch (error) {
      setError("Unable to analyze transaction.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskStyle = () => {
    if (!result) {
      return "";
    }

    switch (result.risk_level) {
      case "HIGH":
        return "border-red-500/30 bg-red-500/10";

      case "MEDIUM":
        return "border-yellow-500/30 bg-yellow-500/10";

      default:
        return "border-green-500/30 bg-green-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
              TG
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                TransactionGuard
              </h1>

              <p className="text-sm text-slate-400">
                AI-powered transaction fraud detection
              </p>
            </div>

            <div
              className={`ml-auto flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                apiOnline
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  apiOnline
                    ? "animate-pulse bg-green-500"
                    : "bg-red-500"
                }`}
              />

              {apiOnline ? "API Online" : "API Offline"}
            </div>

          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* Transaction Form */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Analyze Transaction
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Enter transaction details to calculate fraud risk.
              </p>
            </div>

            <div className="space-y-5">

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="e.g. 250"
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Distance */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Distance from home
                </label>

                <input
                  type="number"
                  name="distance_from_home"
                  value={form.distance_from_home}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Failed Attempts */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Failed attempts
                </label>

                <input
                  type="number"
                  name="failed_attempts"
                  value={form.failed_attempts}
                  onChange={handleChange}
                  placeholder="e.g. 0"
                  min="0"
                  step="1"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Country Changed */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Country changed
                </label>

                <select
                  name="country_changed"
                  value={form.country_changed}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>

              {/* Transaction at Night */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Transaction at night
                </label>

                <select
                  name="is_night"
                  value={form.is_night}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={handleCheckTransaction}
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Check Transaction"}
              </button>

            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

          </section>

          {/* Risk Assessment */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Risk Assessment
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                ML model prediction
              </p>
            </div>

            {!result ? (
              <div className="flex min-h-[400px] items-center justify-center text-center">

                <div>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-2xl">
                    ?
                  </div>

                  <p className="text-slate-400">
                    Submit a transaction to see the risk assessment.
                  </p>
                </div>

              </div>
            ) : (
              <div className="space-y-6">

                {/* Risk Level */}
                <div
                  className={`rounded-xl border p-6 ${getRiskStyle()}`}
                >
                  <p className="text-sm text-slate-400">
                    Risk Level
                  </p>

                  <h3 className="mt-2 text-4xl font-bold">
                    {result.risk_level}
                  </h3>

                  <p className="mt-2 font-medium">
                    {result.decision}
                  </p>
                </div>

                {/* Fraud Probability */}
                <div>
                  <div className="mb-2 flex justify-between">

                    <span className="text-sm text-slate-400">
                      Fraud Probability
                    </span>

                    <span className="font-semibold">
                      {(result.fraud_probability * 100).toFixed(2)}%
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{
                        width: `${result.fraud_probability * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Risk Score */}
                <div className="rounded-xl bg-slate-800/50 p-5">

                  <div className="flex items-center justify-between">

                    <span className="text-slate-400">
                      Risk Score
                    </span>

                    <span className="text-2xl font-bold">
                      {result.risk_score.toFixed(2)}
                    </span>

                  </div>

                </div>

                {/* Decision */}
                <div className="border-t border-slate-800 pt-5">

                  <p className="text-sm text-slate-400">
                    Recommended Action
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {result.decision}
                  </p>

                </div>

              </div>
            )}

          </section>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-slate-500">
          TransactionGuard • Machine Learning Fraud Detection
        </footer>

      </div>
    </div>
  );
}

export default App;