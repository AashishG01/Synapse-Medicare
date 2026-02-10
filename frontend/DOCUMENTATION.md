# Patient Frontend Documentation

**Stack**: React + Vite + TypeScript  
**Styling**: Tailwind CSS + Shadcn UI  
**Routing**: React Router DOM

---

## 🏗️ Architecture Overview

**Single Page Application (SPA)**: The browser loads one HTML file, and React handles all UI updates dynamically without reloading.

### Directory Structure (Mental Model)
*   **`components/`**: Reusable blocks (Button, Card) and Feature Components (Chatbot, Report).
*   **`pages/`**: Full screens (Landing, Dashboard).
*   **`App.tsx`**: The Traffic Controller (Router).
*   **`main.tsx`**: The Entry Point (Mounts React to DOM).

---

## 🚀 Key Features & Implementation

### 1. Unified Landing Page
**Logic**: The entry point `/` helps users identity themselves.
*   **Component**: `Landing.tsx`.
*   **Flow**:
    *   *Patient* -> Internal Route (`/login`).
    *   *Hospital* -> External Link (`http://localhost:5174`).

### 2. Authentication (Login/Register)
**Flow**:
1.  User enters credentials.
2.  `fetch()` POST request to Node.js backend.
3.  **Success**: Receive `token` (JWT).
4.  **Storage**: `localStorage.setItem('token', ...)`
5.  **Redirect**: `navigate('/dashboard')`.

### 3. Dashboard
**Design**: Grid layout of cards.
**Navigation**: Clicking a card uses `<Link to="/path">`.
**Animation**: using `framer-motion` for smooth entry effects.

### 4. Appointment Booking
**The "Smart" Form**:
*   **Dynamic Data**: Fetches list of Doctors from Backend API on load.
*   **State**: React `useState` tracks Form Inputs.
*   **Submission**: POSTs data to `/api/v1/appointments`.

### 5. Medical Reports
**Integration**:
1.  User selects file.
2.  Frontend creates `FormData`.
3.  Sends to Node.js `/api/v1/reports/analyze`.
4.  Displays the JSON response (AI insights) nicely using Tailwind cards.

---

## 🎨 UI/UX Philosophy

**Shadcn UI**: We use "copy-paste" components.
*   *Why?* Total control. Unlike Bootstrap/MUI where components are hidden in `node_modules`, here the code lives in `components/ui`. We can tweak it endlessly.

**Tailwind CSS**: Utility-first.
*   Instead of writing CSS files (`.btn { color: red }`), we write `<button class="text-red-500">`. Faster development.

---

## 🛣️ Routing Logic (App.tsx)

```javascript
<Routes>
  <Route path="/" element={<Landing />} />          // Public
  <Route path="/login" element={<Login />} />       // Public
  <Route path="/dashboard" element={<Dashboard />} /> // Protected (Conceptually)
</Routes>
```
*   **Back Button**: A global `BackButton` component checks the current path. If not on home/login, it shows up.

---

## 🛠️ Key Libraries

*   **React Router DOM**: Navigation.
*   **Lucide React**: Beautiful icons.
*   **Framer Motion**: Animations.
*   **Axios / Fetch**: API calls.
*   **Zod**: Form validation (optional but good practice).
