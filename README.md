# Synapse Medicare - Project Run Guide

This project consists of 4 main components:
1.  **JsBackend**: Node.js/Express Backend (Main API & Database).
2.  **PYBACK**: Python/FastAPI Backend (AI Analysis & Recommendations).
3.  **frontend**: React Frontend (Patient Portal).
4.  **Hospital**: React Frontend (Hospital/Doctor Portal).

## 🚀 Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)
*   MongoDB (Running locally or Atlas)

## 1. Start the Node.js Backend (Core API)
This must be running first.

```bash
cd JsBackend
# First time setup:
npm install
npm run seed  # (Optional) Populates DB with test data

# Run Server
npm start
```
*   **Port**: `5000`
*   **URL**: `http://localhost:5000`

## 2. Start the Python Backend (AI Services)
Handles Image Analysis, Chatbot, and Summarization.

```bash
cd PYBACK
# First time setup:
# python -m venv venv (Recommended)
# source venv/bin/activate (Mac/Linux) or venv\Scripts\activate (Windows)
pip install -r requirements.txt

# Run Server
uvicorn app:app --reload --port 8000
```
*   **Port**: `8000`
*   **URL**: `http://localhost:8000`

## 3. Start the Patient Frontend
The main interface for users/patients.

```bash
cd frontend
# First time setup:
npm install

# Run Dev Server
npm run dev
```
*   **Port**: `5173` (usually)
*   **URL**: `http://localhost:5173`

## 4. Start the Hospital Frontend
The interface for doctors and hospital admins.

```bash
cd Hospital
# First time setup:
npm install

# Run Dev Server
npm run dev
```
*   **Port**: `5174` (usually)
*   **URL**: `http://localhost:5174`

## 🔑 Key Accounts (from Seed Data)
If you ran `npm run seed` in `JsBackend`:

*   **Hospital Admin**: `hospital@example.com` / `Hospital@123`
*   **Doctor**: `priya@example.com` / `Doctor@123`
*   **Patient**: `alice@example.com` / `Patient@123`