# Hospital Frontend Documentation

**Stack**: React + Vite + TypeScript  
**Role**: Admin Dashboard for Doctors & Hospital Staff

---

## 🏗️ Architecture Overview

Similar to the Patient Frontend, but focused on **Data Density** and **Management**.
*   **Tables**: For listing patients/doctors.
*   **Charts**: For bed occupancy.
*   **Forms**: For editing profiles/handoffs.

---

## 🚀 Key Features

### 1. Hospital Dashboard
**Goal**: At-a-glance view of hospital status.
**Implementation**:
*   Fetches multiple data points: Bed counts, Doctor Availability, Recent Admissions.
*   Visualizes data using basic UI cards (numbers/stats).

### 2. Smart Handoff System
**Problem**: Doctors change shifts and lose context.
**Solution**: AI Summarization.
**Flow**:
1.  Doctor inputs raw notes into a text area.
2.  Frontend sends text to Node.js (`/api/v1/hospitals/handoff-summary`).
3.  Node.js proxies to Python LLM.
4.  **Result**: A clean, structured summary appears, ready to be saved/printed.

### 3. Bed Management
**Logic**:
*   **Visualization**: Progress bars showing occupancy (e.g., ICU: 80% Full).
*   **Update**: Admin can manually update numbers via API.

### 4. Doctor Management
**Feature**: Register new doctors.
**Flow**:
*   Form collects: Name, Specialization, Schedule.
*   API: `POST /api/v1/auth/register/doctor`.
*   *Note*: This automatically creates a User account AND a Doctor Profile in the backend.

---

## 🧠 Mental Model: Complex State

In the **Handoff** feature, we handle:
1.  **Input State**: What the doctor is typing.
2.  **Loading State**: While AI is thinking (Show Spinner).
3.  **Error State**: If Python server is down.
4.  **Success State**: Displaying the AI result.

```javascript
const [notes, setNotes] = useState("");
const [summary, setSummary] = useState(null);
const [loading, setLoading] = useState(false);

async function generate() {
   setLoading(true);
   try {
     const res = await api.post('/handoff', { notes });
     setSummary(res.data);
   } finally {
     setLoading(false);
   }
}
```

---

## 🛠️ Tools & Libraries

*   **Recharts**: (If used) for graphing bed data.
*   **React Hook Form**: For managing complex hospital forms.
*   **Sonner/Toast**: For "Success" notifications after updates.
