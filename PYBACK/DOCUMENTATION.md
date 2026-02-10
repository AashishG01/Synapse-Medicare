# Python Backend Documentation

**Stack**: Python + FastAPI  
**AI Tools**: LangChain, Groq (LLM), Tesseract (OCR), Scikit-Learn

---

## 🏗️ Architecture Overview

**Server -> FastAPI** (High performance, async)  
**LLM -> Groq API** (Llama 3 model)  
**Vision -> Tesseract OCR** (Image to Text)  
**Database -> None** (Stateless, processes data on the fly)

### Mental Model: The AI Pipeline
```text
Request (Image/Text)
   ↓
FastAPI Endpoint
   ↓
Preprocessing (OCR / Cleaning)
   ↓
Prompt Engineering (Instructions for AI)
   ↓
LLM Inference (Groq)
   ↓
Structured Response (JSON)
```

---

## 🚀 AI Features

### 1. Medical Report Analyzer (`/analyze`)
**Goal**: Extract data from a photo of a lab report and explain it simply.

**Algorithm**:
1.  **Input**: Receive Image URL.
2.  **Download**: Fetch image bytes.
3.  **OCR (Optical Character Recognition)**: Use `pytesseract` to read text from the image.
    *   *Result*: Raw string ("Hemoglobin: 12.5 g/dL...").
4.  **LLM Analysis**: Feed the raw text to Llama 3 with a specific prompt:
    > "You are a doctor. Analyze this text. identifying abnormal values and explaining them in simple terms."
5.  **Output**: Structured JSON with insights.

### 2. Smart Handoff Summarizer (`/smart-handoff-summary`)
**Goal**: Summarize multiple shift reports for the next doctor.

**Logic**:
*   Doctors write messy, scattered notes during shifts.
*   The API takes a **List of Notes**.
*   **LangChain**: Combines them and uses an LLM to generate a concise summary.
*   *Prompt*: "Summarize these patient events into a professional handover note."

### 3. Disease Prediction (Machine Learning)
**Goal**: Predict disease based on symptoms (Simple ML demo).
*   **Model**: Scikit-Learn (Linear Regression/Classification).
*   **Storage**: `model.pkl` (Serialized Python object).
*   **Process**:
    *   Input: `[fever, cough, fatigue]`
    *   Model: `predict([1, 1, 1])` -> "Flu"

---

## 🧠 Why FastAPI?

1.  **Speed**: It is incredibly fast (asynchronous).
2.  **Validation**: Uses `Pydantic` models (like Zod for Python) to strictly validate inputs.
    *   *Example*: If you send a number where a string is expected, FastAPI blocks it automatically.
3.  **Documentation**: Auto-generates Swagger UI (`/docs`).

---

## 🛠️ Key Libraries

*   **FastAPI**: The Web Framework.
*   **Uvicorn**: The Server (ASGI) that runs the app.
*   **Pillow (PIL)**: Image processing library.
*   **PyTesseract**: Wrapper for Google's Tesseract OCR engine.
*   **LangChain**: Framework for chaining LLM prompts and context.
*   **Requests**: To download images from URLs.
