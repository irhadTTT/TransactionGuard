# 🛡️ TransactionGuard

AI-powered fraud detection system that analyzes financial transactions and estimates their fraud risk using Machine Learning.

## Features

* 🤖 Machine Learning fraud detection
* 📊 Fraud probability & risk score
* ⚠️ LOW / MEDIUM / HIGH risk levels
* ⚡ FastAPI REST API
* ⚛️ React + TypeScript frontend
* 🎨 Tailwind CSS
* 🐳 Docker & Docker Compose
* ❤️ API health check

## How It Works

The user enters transaction details such as amount, distance from home, failed attempts, country change, and transaction time.

The data is sent to the FastAPI backend, where the trained ML model calculates the fraud probability and returns a risk assessment.

```text
React → FastAPI → ML Model → Risk Assessment
```

## Tech Stack

**Backend:** Python, FastAPI, Scikit-learn, Pandas, NumPy, Joblib

**Frontend:** React, TypeScript, Vite, Tailwind CSS

**DevOps:** Docker, Docker Compose

## Run with Docker

```bash
docker compose up --build
```

Frontend:

`http://localhost:5173`

API:

`http://localhost:8000`

Swagger:

`http://localhost:8000/docs`

## Project Goal

A practical portfolio project combining Machine Learning, backend API development, modern frontend development, and containerization.
