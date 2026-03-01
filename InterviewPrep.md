# Synapse Medicare — Complete Interview Preparation Guide

---

## 📋 Table of Contents

1. [Project Overview & Elevator Pitch](#1-project-overview--elevator-pitch)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack Deep-Dive](#3-tech-stack-deep-dive)
4. [Database Design & Schemas](#4-database-design--schemas)
5. [All APIs — Complete Reference](#5-all-apis--complete-reference)
6. [Authentication & Security](#6-authentication--security)
7. [Algorithms & Core Logic](#7-algorithms--core-logic)
8. [AI/ML Pipeline (Python Backend)](#8-aiml-pipeline-python-backend)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Design Patterns Used](#10-design-patterns-used)
11. [Probable Interview Questions & Answers](#11-probable-interview-questions--answers)

---

## 1. Project Overview & Elevator Pitch

> **Synapse Medicare** is a full-stack healthcare management platform that connects **Patients**, **Doctors**, and **Hospital Admins** through a microservices architecture. It features AI-powered medical report analysis, chatbot consultations, disease detection, diet planning, geo-spatial blood donor search, real-time bed management, and smart nursing handoff summarization.

### Key Stats to Mention
- **4 independently deployable services** (Microservices)
- **5 MongoDB collections** with geo-spatial indexing
- **7 AI-powered endpoints** via Python/FastAPI
- **Role-Based Access Control (RBAC)** with 4 user roles
- **14+ patient-facing features** on the frontend

---

## 2. System Architecture

### High-Level Architecture Diagram
```
┌─────────────────────┐     ┌──────────────────────┐
│  Patient Frontend   │     │  Hospital Frontend    │
│  (React + Vite)     │     │  (React + Vite)       │
│  Port: 5173         │     │  Port: 5174           │
└────────┬────────────┘     └────────┬──────────────┘
         │                           │
         └─────────┬─────────────────┘
                   ▼
         ┌─────────────────────┐
         │   Node.js Backend   │ ◄── Main API Gateway
         │   (Express)         │     Handles Auth, CRUD, File Upload
         │   Port: 5000        │     Acts as PROXY for AI calls
         └────────┬────────────┘
                  │
         ┌────────┼────────────┐
         ▼        ▼            ▼
    ┌─────────┐ ┌──────────┐ ┌────────────────┐
    │ MongoDB │ │Cloudinary│ │ Python Backend  │
    │(Database│ │ (CDN/    │ │ (FastAPI + AI)  │
    │  Atlas) │ │  Images) │ │ Port: 8000      │
    └─────────┘ └──────────┘ └────────────────┘
                                    │
                              ┌─────┼─────┐
                              ▼     ▼     ▼
                           Groq  Tesseract Scikit-
                           (LLM)  (OCR)    Learn
```

### Communication Pattern
- **Frontend → Node.js**: REST API via `fetch()`/`axios` with JWT in `Authorization` header
- **Node.js → Python**: HTTP Proxy via `axios` (Proxy/Gateway Pattern)
- **Node.js → MongoDB**: Mongoose ODM
- **Node.js → Cloudinary**: SDK for image/file uploads
- **Python → Groq API**: LangChain `ChatOpenAI` wrapper

### Why This Architecture?
> "We chose a **polyglot microservices** approach because the AI/ML ecosystem is strongest in Python, while Node.js excels at I/O-heavy API servers. The Node.js backend acts as an **API Gateway**, shielding the Python service from direct client access and handling authentication centrally."

---

## 3. Tech Stack Deep-Dive

### Node.js Backend (JsBackend)
| Library | Purpose | Why This Choice |
|---------|---------|-----------------|
| **Express** | Web framework | Industry standard, minimal, flexible |
| **Mongoose** | MongoDB ODM | Schema validation, middleware hooks, populate() |
| **bcryptjs** | Password hashing | Salted hashing, timing-attack safe |
| **jsonwebtoken** | JWT auth | Stateless authentication, scalable |
| **Zod** | Input validation | TypeScript-first, composable schemas |
| **Multer** | File uploads | Multipart form-data handling |
| **Cloudinary** | Image CDN | Cloud storage, image transformations |
| **Helmet** | Security headers | XSS, clickjacking, MIME-sniffing protection |
| **express-rate-limit** | Rate limiting | DDoS/brute-force prevention |
| **Axios** | HTTP client | Proxy requests to Python backend |
| **cookie-parser** | Cookie parsing | Session management support |
| **cors** | CORS config | Cross-origin requests from frontends |

### Python Backend (PYBACK)
| Library | Purpose | Why This Choice |
|---------|---------|-----------------|
| **FastAPI** | Web framework | Async, auto-docs (Swagger), Pydantic validation |
| **Uvicorn** | ASGI server | High-performance async server |
| **LangChain** | LLM orchestration | Memory management, prompt chaining |
| **Groq API** | LLM inference | Fast inference on Llama 3.3-70B |
| **pytesseract** | OCR | Extract text from medical report images |
| **Pillow (PIL)** | Image processing | Open/manipulate images before OCR |
| **scikit-learn** | ML models | Health scheme recommendation (classification) |
| **joblib** | Model serialization | Save/load trained ML models (.pkl) |
| **BeautifulSoup** | Web scraping | Scrape health news/myths |
| **pandas** | Data manipulation | Feature engineering for ML input |

### Frontend (Both Patient & Hospital)
| Library | Purpose |
|---------|---------|
| **React 18** | UI library (component-based) |
| **Vite** | Build tool (fast HMR) |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Shadcn UI** | Copy-paste component library |
| **React Router DOM** | Client-side routing |
| **Framer Motion** | Animations |
| **Lucide React** | Icon library |
| **Axios** | HTTP client |

---

## 4. Database Design & Schemas

### Entity Relationship Diagram
```
┌──────────────┐       ┌──────────────┐
│     User     │       │   Hospital   │
│──────────────│       │──────────────│
│ _id          │◄──────│ admin (ref)  │
│ fullName     │       │ name         │
│ email (uniq) │       │ beds {       │
│ password     │       │   icu        │
│ role (enum)  │       │   general    │
│ bloodGroup   │       │   emergency  │
│ location     │       │ }            │
│   (GeoJSON)  │       └──────────────┘
│ address      │
│ phone        │
└──────┬───────┘
       │
       │ 1:1
       ▼
┌──────────────┐       ┌──────────────────┐
│    Doctor    │       │   Appointment    │
│──────────────│       │──────────────────│
│ _id          │◄──────│ doctor (ref)     │
│ user (ref)   │       │ patientName      │
│ name         │       │ phone            │
│ specialization       │ date / time      │
│ qualifications       │ status (enum)    │
│ experienceYears      │ type             │
│ hospital (ref)│      │ notes            │
│ availableSlots│      │ user (ref, opt)  │
│ profileImage │       └──────────────────┘
└──────────────┘
                       ┌──────────────────┐
                       │  HealthReport    │
                       │──────────────────│
                       │ patient (ref)    │
                       │ reportName       │
                       │ fileUrl          │
                       │ fileType         │
                       │ uploadedAt       │
                       └──────────────────┘
```

### Schema Details & Design Decisions

#### User Schema (Central Entity)
```javascript
{
  fullName: String,        // indexed for search optimization
  email: String,           // unique + lowercase + regex validated
  password: String,        // select: false (NEVER sent in responses)
  role: Enum["PATIENT", "DOCTOR", "HOSPITAL_ADMIN", "ADMIN"],
  bloodGroup: Enum["A+","A-","B+","B-","AB+","AB-","O+","O-"],
  location: {
    type: "Point",
    coordinates: [Number]  // [longitude, latitude] — GeoJSON format
  },
  address: { street, city, state, postalCode }
}
```

**Key Design Decisions:**
- `password: { select: false }` — Mongoose will NEVER include password in query results unless explicitly `.select('+password')`
- `location: "2dsphere" index` — enables MongoDB geo-spatial queries (`$near`, `$geoWithin`)
- GeoJSON uses `[longitude, latitude]` order (NOT lat,lng) — common interview gotcha!
- `pre('save')` hook auto-hashes password using bcrypt with salt rounds = 10
- Instance method `isPasswordCorrect()` uses `bcrypt.compare()` for constant-time comparison

#### Doctor Schema (Extended Profile)
- **Uses `user` ref to User** — Separation of concerns (auth data vs. professional data)
- `hospital` ref points to a User with `HOSPITAL_ADMIN` role — denotes which hospital the doctor belongs to
- `availableSlots: [Date]` — array of available appointment date-times

#### Hospital Schema (Bed Management)
```javascript
beds: {
  icu: { total: Number, occupied: Number },
  general: { total: Number, occupied: Number },
  emergency: { total: Number, occupied: Number }
}
```
- Uses **embedded sub-documents** (not refs) because bed data is always accessed with hospital
- Boundary validation: `occupied` cannot exceed `total` or go below 0

#### Appointment Schema
- `status: Enum["scheduled", "completed", "cancelled"]` — state machine
- `user` field is optional (`default: null`) to support **guest checkout** (booking without login)
- `doctor` ref enables `.populate('doctor', 'name specialization')` for joined queries

---

## 5. All APIs — Complete Reference

### A. Authentication APIs (Node.js)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register/user` | Public | Register a new patient |
| POST | `/api/v1/auth/register/hospital` | Public | Register hospital admin + create Hospital profile |
| POST | `/api/v1/auth/register/doctor` | Public | Register doctor (creates User + Doctor profile) |
| POST | `/api/v1/auth/login` | Public | Login any user type, returns JWT |

**Register User Flow:**
1. Validate `fullName`, `email`, `password` are present
2. Check if email already exists → 400 error if duplicate
3. `User.create()` triggers `pre('save')` hook → bcrypt hashes password
4. Generate JWT with `{ id, role }` payload, 30-day expiry
5. Return `{ token, role }`

**Register Hospital Flow (Important — 2-step creation):**
1. Create User with `role: HOSPITAL_ADMIN`
2. **Also** create Hospital document linked via `admin: user._id`
3. Return JWT

**Register Doctor Flow (3-way creation):**
1. Create User with `role: DOCTOR`
2. Create Doctor profile with `user: userId`, `hospital: hospitalId`
3. Return JWT

**Login Flow:**
1. Find user by email with `.select('+password')` (override `select: false`)
2. Use `user.isPasswordCorrect(password)` → `bcrypt.compare()`
3. Generate and return JWT

### B. Doctor APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/doctors` | Public | List all doctors (with hospital name populated) |
| GET | `/api/v1/doctors/:id` | Public | Get single doctor details |
| PUT | `/api/v1/doctors/profile` | Doctor only | Update own profile |

### C. Appointment APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/appointments` | Public | Book appointment (guest-friendly) |
| GET | `/api/v1/appointments` | Protected | Get my appointments (RBAC-aware) |

**RBAC-aware GET Logic (Important!):**
```
if (user.role === 'DOCTOR') → find doctor profile → get appointments for that doctor
if (user.role === 'PATIENT') → get appointments where user === logged-in user
```

### D. Blood Donor API (Geo-spatial)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/donors?lng=X&lat=Y&bloodGroup=A+` | Public | Find nearby donors |

**Algorithm:** MongoDB `$near` with `$maxDistance: 10000` (10km radius)

### E. Hospital Management APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| PATCH | `/api/v1/hospitals/beds` | Hospital Admin | Increment/decrement bed occupancy |
| POST | `/api/v1/hospitals/handoff-summary` | Public | AI-powered nursing handoff summary |

### F. Report Analysis API

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/reports/analyze` | Protected | Upload medical report → AI analysis |

**Flow:** Multer receives file → saved to `uploads/` → file path sent to Python `/analyze` → returns AI insights

### G. Python AI APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | AI Doctor Chatbot (session-based, with memory) |
| POST | `/disease-detection` | Symptom-based disease prediction |
| POST | `/diet-plan` | AI-generated 7-day Indian diet plan |
| POST | `/analyze` | OCR + AI medical report analysis |
| GET | `/scrape` | Web scrape health news from MedicalNewsToday |
| POST | `/recommend` | ML-based health scheme recommendation |
| POST | `/simplify-consent` | Simplify medical consent forms |
| POST | `/smart-handoff-summary` | Summarize nursing shift handoff notes |

---

## 6. Authentication & Security

### JWT Implementation
```
Token Generation:  jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' })
Token Extraction:  Authorization: Bearer <token>
Token Verification: jwt.verify(token, JWT_SECRET) → { id, role }
```

### Auth Middleware (`protect`)
1. Extract token from `Authorization: Bearer <token>` header
2. `jwt.verify()` decodes token
3. `User.findById(decoded.id).select('-password')` attaches user to `req.user`
4. If token invalid/expired → 401 Unauthorized

### RBAC Middleware (`authorize`)
```javascript
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) → 403 Forbidden
  next();
};
// Usage: authorize("HOSPITAL_ADMIN") — only hospital admins can update beds
```

### Security Stack (app.js)
| Middleware | Protection |
|-----------|-----------|
| `helmet()` | Sets security HTTP headers (X-XSS-Protection, X-Frame-Options, etc.) |
| `cors({ origin, credentials })` | Restricts cross-origin access |
| `express.json({ limit: '16kb' })` | Prevents payload-based DoS attacks |
| `rateLimit({ windowMs: 15min, max: 100 })` | 100 requests per 15 minutes per IP |
| `cookieParser` | Parses cookies for potential session use |
| Password: `select: false` | Passwords never leak in API responses |
| bcrypt salt rounds: 10 | ~10 hashes/sec, resistant to brute force |

### Graceful Shutdown
```javascript
process.on("unhandledRejection", (err) => {
  server.close(() => process.exit(1)); // Close connections before dying
});
```

---

## 7. Algorithms & Core Logic

### A. Geo-Spatial Blood Donor Search
**Problem:** Find blood donors of a specific group within 10km of a location.

**Algorithm:** MongoDB `$near` operator with `2dsphere` index.

```javascript
// donor.service.js
User.find({
  bloodGroup: "A+",
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: 10000 // meters (10km)
    }
  }
}).select("fullName bloodGroup");
```

**How it works internally:**
1. MongoDB uses a **2dsphere index** (based on S2 geometry library)
2. It converts coordinates to S2 cell IDs for efficient spatial lookup
3. Results are **automatically sorted by distance** (nearest first)
4. Time complexity: O(log n) for indexed queries vs O(n) for full scan

**Key Interview Points:**
- GeoJSON requires `[longitude, latitude]` order (NOT lat,lng!)
- `2dsphere` supports Earth-like spherical geometry
- `$near` requires an index; `$geoNear` is the aggregation pipeline equivalent
- `$maxDistance` is in **meters** for GeoJSON, vs **radians** for legacy coordinates

### B. Password Hashing (bcrypt)
```javascript
// Pre-save hook
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Skip if not changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

**Algorithm:** bcrypt uses the Blowfish cipher with iterative key expansion.
- **Salt rounds: 10** → 2^10 = 1024 iterations
- Each hash takes ~100ms → makes brute force infeasible
- Salt is embedded IN the hash string → no separate salt storage needed
- `bcrypt.compare()` is constant-time → prevents timing attacks

### C. Bed Management (Atomic Update with Boundary Validation)
```javascript
// hospital.controller.js
const increment = type === "inc" ? 1 : -1;
const nextOccupied = currentOccupied + increment;

if (nextOccupied < 0 || nextOccupied > total) {
  throw new ApiError(400, "Occupied beds cannot exceed available capacity");
}

hospital.beds[category].occupied = nextOccupied;
await hospital.save();
```

**Pattern:** Read-Modify-Write with boundary validation
- **Race condition risk:** Two concurrent requests could both read same value
- **Production fix:** Use MongoDB `$inc` with `$max/$min` constraints, or optimistic concurrency control

### D. AI Response JSON Extraction
**Problem:** LLMs return markdown-wrapped JSON. We need clean JSON.

```python
# Pattern used across all AI endpoints
start_index = response_content.find("{")
end_index = response_content.rfind("}")
clean_json = response_content[start_index:end_index + 1]
parsed_response = json.loads(clean_json)
```

**Why `find("{")` and `rfind("}")`?**
- `find()` gets the FIRST `{` (skips any preamble text)
- `rfind()` gets the LAST `}` (handles nested objects correctly)
- This is a robust pattern for extracting JSON from LLM responses

### E. asyncHandler Pattern (Error Propagation)
```javascript
export const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};
```
- Wraps async route handlers to auto-catch errors
- Passes errors to Express's `next()` → Global error handler
- Eliminates repetitive `try/catch` in every controller
- **Key insight:** `Promise.resolve()` ensures even sync errors are caught

### F. Validate Middleware (Zod Integration)
```javascript
export const validate = (schema) => (req, res, next) => {
  schema.parse({ body: req.body, query: req.query, params: req.params });
  next();
};
```
- Higher-order function returning middleware
- Validates `body`, `query`, AND `params` simultaneously
- Zod's `.parse()` throws `ZodError` on failure → caught by error handler
- Error messages include field path: `"body.email: Invalid email address"`

---

## 8. AI/ML Pipeline (Python Backend)

### Architecture: Stateless AI Service
```
Request → FastAPI → Preprocessing → Prompt Engineering → LLM → Structured JSON
```

### AI Endpoint Deep-Dives

#### 1. `/chat` — Medical Chatbot (Conversational Memory)
**Key Concept:** Session-based conversation with LangChain's `ConversationBufferMemory`.

```python
session_memory = {}  # In-memory dict: session_id → memory

if session_id not in session_memory:
    session_memory[session_id] = ConversationBufferMemory()

conversation = ConversationChain(llm=llm, memory=memory)
response = conversation.invoke(input=doctor_prompt)
```

**How ConversationBufferMemory works:**
- Stores the FULL conversation history (human + AI messages)
- On each call, the ENTIRE history is sent to the LLM as context
- **Trade-off:** Accurate context but grows linearly → token limit risk
- **Alternatives:** `ConversationSummaryMemory` (summarizes old messages), `ConversationBufferWindowMemory` (sliding window)

**Interview Point:** This is stored in-process memory (`dict`). It's lost on server restart. Production would use Redis or a database-backed memory store.

#### 2. `/disease-detection` — Symptom Analysis
**Input:** `{ main_symptom, duration, severity, additional_symptoms }`
**Output:** JSON with `possible_conditions[]` and `recommended_doctors[]`
- Uses few-shot prompting (provides example JSON in the prompt)
- Forces JSON-only output via explicit instructions
- Parses with `find("{")` / `rfind("}")` pattern

#### 3. `/diet-plan` — 7-Day Diet Plan Generator
- **Domain-specific prompt:** Explicitly requests Indian foods
- Returns raw text (not JSON) — displayed as-is on frontend
- Includes dietary restrictions handling

#### 4. `/analyze` — Medical Report OCR + AI Analysis
**Pipeline:**
1. **Download** image from Cloudinary URL via `requests.get()`
2. **OCR:** `pytesseract.image_to_string(image)` — Tesseract extracts text
3. **AI Analysis:** Extracted text fed to LLM with medical context prompt
4. **Output:** `{ extracted_text, medical_insights: { key_terms, possible_conditions, advice } }`

**Tesseract OCR Algorithm (Interview Deep-Dive):**
- Uses LSTM-based text recognition
- Process: Binarization → Line detection → Word segmentation → Character recognition
- Works best with clear, high-contrast images

#### 5. `/recommend` — ML Health Scheme Recommendation
**This is the only TRUE Machine Learning endpoint** (others use LLMs).

```python
model = joblib.load("health_scheme_recommender.pkl")
label_encoders = joblib.load("label_encoders.pkl")

# Feature engineering
input_data["Employment Type"] = label_encoders["Employment Type"].transform([data])
scheme_index = model.predict(input_data)[0]
scheme = label_encoders["Recommended Scheme"].inverse_transform([scheme_index])[0]
```

**ML Pipeline:**
1. **Training** (model.py): LinearRegression trained on sample data
2. **Label Encoding:** Categorical features (Employment Type, Bank Account, Socio-Economic Status) converted to numbers
3. **Prediction:** Model outputs scheme index → inverse-transformed to scheme name
4. **Serialization:** `joblib` saves model as `.pkl` file

#### 6. `/simplify-consent` — Consent Form Simplifier
- Converts complex medical/legal jargon to layperson language
- Uses Pydantic `response_model` for validated output
- Returns array of `{ title, text }` objects

#### 7. `/smart-handoff-summary` — Nursing Handoff Summarizer
- Takes array of shift report strings
- Joins with `---` separator
- LLM generates organized summary (by patient / by urgency)

#### 8. `/scrape` — Health News Scraper
```python
def scrape_myths():
    response = requests.get('https://www.medicalnewstoday.com/')
    soup = BeautifulSoup(response.content, 'html.parser')
    myth_links = soup.find_all('a', class_='css-xqmvw1 css-i4o77u')
```
- Uses `requests` + `BeautifulSoup` for web scraping
- Targets specific CSS classes from MedicalNewsToday
- Stores in global `scraped_data` list (refreshed on each call)

---

## 9. Frontend Architecture

### Patient Frontend (14 Routes)
| Route | Component | Feature |
|-------|-----------|---------|
| `/` | `Landing` | Role selection (Patient / Hospital) |
| `/login` | `Login` | Patient login |
| `/register` | `Register` | Patient registration |
| `/dashboard` | `Dashboard` | Feature grid with cards |
| `/disease-detection` | `DiseaseDetection` | Symptom-based AI diagnosis |
| `/chatbot` | `Chatbot` | AI doctor chat |
| `/insurance` | `HealthInsurance` | Insurance information |
| `/diet` | `DietPlanForm` | AI diet plan generator |
| `/hospital-beds` | `HospitalBeds` | View bed availability |
| `/consent-simplifier` | `ConsentSimplifier` | AI consent form simplifier |
| `/report` | `MedicalReport` | Upload & analyze medical reports |
| `/track` | `TrackPeriod` | Menstrual cycle tracker |
| `/blood-donor` | `BloodDonor` | Geo-spatial donor search |
| `/recommend` | `RecommendHealthInsurance` | ML scheme recommendation |

### Hospital Frontend (6 Routes)
| Route | Component | Feature |
|-------|-----------|---------|
| `/login` | `Login` | Hospital admin login |
| `/register` | `Register` | Hospital admin registration |
| `/` | `Dashboard` | Hospital overview stats |
| `/beds` | `BedManagement` | ICU/General/Emergency bed control |
| `/verify` | `DoctorDashboard` | Doctor management |
| `/patients` | `PatientList` | Patient listing |
| `/appointments` | `AppointmentList` | Appointment management |
| `/handoff` | `Handoff` | AI nursing handoff summarizer |

### Key Frontend Patterns

**1. Auth Flow (localStorage-based)**
```
Login → POST /api/v1/auth/login → { token, role } → localStorage.setItem('token', token) → navigate('/dashboard')
```

**2. Protected API Calls**
```javascript
fetch('/api/v1/appointments', {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})
```

**3. Global Back Button (Conditional Rendering)**
```jsx
// Shows on all pages EXCEPT landing, login, register
return !['/', '/login', '/register'].includes(location.pathname) ? <BackButton /> : null;
```

**4. Theme Provider (Dark/Light Mode)**
- Uses React Context API
- Persists preference in `localStorage` via `storageKey`

**5. AuthContext (Hospital Frontend)**
- Wraps entire app in `AuthProvider`
- Provides auth state to all components via `useContext`

**6. Layout Component (Hospital)**
- `<Layout>` wraps authenticated pages
- Contains `<Sidebar>` for navigation
- Non-auth pages (Login, Register) render WITHOUT Layout

**7. Animated Page Transitions**
```jsx
<AnimatePresence mode="wait">
  <Routes>...</Routes>
</AnimatePresence>
```
- Framer Motion's `AnimatePresence` enables enter/exit animations on route changes

---

## 10. Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| **MVC** | JsBackend (Models → Controllers → Routes) | Separation of concerns |
| **Repository/Service Layer** | `donor.service.js`, `ai.service.js` | Encapsulates data access logic |
| **Proxy/Gateway** | Node.js forwarding to Python | Single entry point, centralized auth |
| **Middleware Chain** | Express middleware stack | Composable request processing |
| **Higher-Order Function** | `asyncHandler`, `validate`, `authorize` | Reusable decorators |
| **Factory Pattern** | `generateToken()` | Encapsulates JWT creation |
| **Observer Pattern** | Mongoose `pre('save')` hooks | Auto-trigger on data events |
| **Singleton** | `session_memory = {}` in Python | Single memory store per process |
| **Strategy Pattern** | RBAC in `getAppointments()` | Different behavior per user role |
| **Composition** | Shadcn UI components | Build complex UIs from small parts |
| **Provider Pattern** | React's ThemeProvider, AuthProvider | Dependency injection via context |

---

## 11. Probable Interview Questions & Answers

### Architecture & System Design

**Q1: Walk me through the architecture of this project.**
> "It's a polyglot microservices system with 4 components. The Node.js Express backend acts as the central API gateway handling authentication, CRUD, and file uploads. It proxies AI-related requests to a Python FastAPI service that runs LLM inference, OCR, and ML models. Two React+Vite SPAs serve as patient and hospital portals respectively. All services communicate via REST APIs, with MongoDB as the primary datastore and Cloudinary for media storage."

**Q2: Why did you use two separate backends instead of one?**
> "Python has a stronger ML/AI ecosystem — libraries like LangChain, pytesseract, scikit-learn. Node.js excels at I/O-heavy API serving. By separating them, each service can be scaled independently. The Node.js gateway also centralizes authentication, so the Python service doesn't need to handle JWT verification."

**Q3: What would you change for production scale?**
> "1) Replace in-memory chatbot sessions with Redis. 2) Add message queues (RabbitMQ/SQS) for async AI operations. 3) Implement database connection pooling. 4) Add API versioning strategy. 5) Use MongoDB transactions for multi-document operations (e.g., registering a doctor). 6) Add request correlation IDs for distributed tracing. 7) Containerize with Docker and orchestrate with Kubernetes."

**Q4: How does the proxy pattern work in your project?**
> "When a user uploads a medical report, the frontend sends it to Node.js. Node.js uploads to Cloudinary, gets a public URL, then forwards that URL to the Python `/analyze` endpoint via an HTTP POST (using axios). Python downloads the image, runs OCR + AI analysis, and returns results to Node.js, which sends them back to the client. The client never directly communicates with Python."

### Database & Data Modeling

**Q5: Why MongoDB instead of PostgreSQL?**
> "Three reasons: 1) Built-in GeoJSON support with 2dsphere indexes for donor search. 2) Flexible schema suits our evolving healthcare requirements. 3) The embedded document pattern (bed counts inside hospital) avoids JOINs for frequently co-accessed data. However, for strict relational integrity (e.g., financial transactions), I'd choose PostgreSQL."

**Q6: Explain your GeoJSON implementation.**
> "We store user locations as GeoJSON Points with [longitude, latitude] coordinates. We create a 2dsphere index on the location field. For donor search, we use MongoDB's `$near` operator with `$maxDistance: 10000` (10km in meters). Results are automatically sorted by proximity. The 2dsphere index uses S2 cell decomposition for O(log n) spatial queries."

**Q7: Why separate User and Doctor schemas?**
> "Separation of concerns. The User schema handles authentication (email, password, role). The Doctor schema stores professional data (specialization, qualifications, slots). A Doctor IS a User (has login credentials) but HAS extra profile data. This keeps the auth table clean and allows a user to potentially have multiple profile types in the future."

**Q8: What's `select: false` on the password field?**
> "It tells Mongoose to NEVER include the password field in query results by default. When we need the password for login verification, we explicitly override with `.select('+password')`. This prevents accidentally leaking passwords in API responses."

### Authentication & Security

**Q9: Explain your JWT flow end-to-end.**
> "On login, the server validates credentials via bcrypt.compare(), then signs a JWT containing `{ id, role }` with a secret key and 30-day expiry. The frontend stores this token in localStorage. For protected routes, the frontend sends it as `Authorization: Bearer <token>`. The `protect` middleware extracts the token, verifies it with `jwt.verify()`, finds the user by decoded ID, and attaches the user object to `req.user`."

**Q10: What are the security vulnerabilities in your current implementation?**
> "1) JWT stored in localStorage is vulnerable to XSS attacks — httpOnly cookies would be safer. 2) No CSRF protection (though tokens mitigate this somewhat). 3) No token revocation mechanism — compromised tokens remain valid for 30 days. 4) Rate limiter is IP-based, which can be bypassed with proxies. 5) The Python CORS allows all origins (`*`), which should be restricted. 6) No input sanitization against NoSQL injection. 7) Bed update has a race condition without atomic operations."

**Q11: How does RBAC work in your system?**
> "We have a higher-order middleware function `authorize(...roles)`. It takes allowed role strings, returns a middleware that checks if `req.user.role` is in the allowed list. For example, `authorize('HOSPITAL_ADMIN')` protects the bed update endpoint. The `protect` middleware must run first to attach `req.user`."

**Q12: Why bcrypt over SHA-256 for passwords?**
> "SHA-256 is a general-purpose hash — fast by design. An attacker can compute billions of SHA-256 hashes/second. bcrypt is intentionally SLOW (adaptive cost factor). With salt rounds=10, each hash takes ~100ms, making brute force infeasible. bcrypt also automatically handles salt generation and embeds the salt in the hash string."

### AI/ML Deep-Dive

**Q13: How does ConversationBufferMemory work in LangChain?**
> "It stores the full conversation as alternating Human/AI messages. On each new message, LangChain prepends the ENTIRE history to the prompt, giving the LLM full context. The trade-off is that it grows linearly — for long conversations, you'd switch to `ConversationSummaryMemory` which uses an LLM to condense old messages, or `ConversationBufferWindowMemory` which keeps only the last K exchanges."

**Q14: What's the difference between using Groq's API vs OpenAI's?**
> "Groq provides an OpenAI-compatible API (`/openai/v1/`), so LangChain's `ChatOpenAI` works with just a different `base_url`. Groq's advantage is speed — it uses custom LPU (Language Processing Unit) hardware for faster inference. We use Llama 3.3-70B, which is open-source, vs OpenAI's proprietary models."

**Q15: What is OCR and how does Tesseract work?**
> "OCR (Optical Character Recognition) converts images of text into machine-readable text. Tesseract uses an LSTM neural network: 1) Binarize image (black/white). 2) Detect text lines. 3) Segment into words. 4) Recognize characters via LSTM. 5) Apply language model for correction. We use it to extract lab values from photographed medical reports."

**Q16: Explain your ML model for health scheme recommendation.**
> "It's a scikit-learn classification model serialized with joblib. Input features: age, income, employment type, bank account status, socio-economic status, family size. Categorical features are label-encoded (string → number). The model predicts a scheme index, which is inverse-transformed to the scheme name. The model is pre-trained and loaded at server startup — no training happens at runtime."

**Q17: How do you handle unreliable LLM JSON output?**
> "LLMs often wrap JSON in markdown code blocks or add preamble text. We use a robust extraction pattern: `find('{')` gets the first opening brace, `rfind('}')` gets the last closing brace, and we slice the string between them. We then `json.loads()` the extracted string. If parsing fails, we return a 500 error with a descriptive message."

### Frontend Questions

**Q18: Why two separate frontends instead of one with role-based views?**
> "Separation of deployment. The patient portal and hospital dashboard have completely different UIs, feature sets, and user flows. Separate apps mean: independent deployments, different caching strategies, smaller bundle sizes per app, and clearer codebase boundaries. They share the same backend API."

**Q19: What is Shadcn UI and why did you choose it over Material UI?**
> "Shadcn is a 'copy-paste' component library — you copy component source code into your project. Unlike MUI where components live in node_modules, Shadcn components are in `components/ui/` and fully customizable. This gives total control over styling and behavior without fighting a library's opinions."

**Q20: How does the animated page transition work?**
> "We wrap `<Routes>` with Framer Motion's `<AnimatePresence mode='wait'>`. The `mode='wait'` ensures the exiting page completes its animation before the entering page starts. Each page component can define `initial`, `animate`, and `exit` motion props for custom enter/exit effects."

### Code Quality & Patterns

**Q21: What is the asyncHandler pattern and why is it needed?**
> "Express doesn't natively handle async errors. If an async route handler throws, Express silently hangs. `asyncHandler` wraps any async function, catches rejected promises, and forwards errors to `next()`, which triggers the global error handler. It eliminates repetitive try/catch blocks in every controller."

**Q22: Walk me through a request from frontend to database and back.**
> "1) React form submit → axios POST to `/api/v1/appointments`. 2) Express receives → runs through middleware chain: helmet, cors, json parser, rate limiter. 3) Router matches → `appointment.routes.js`. 4) Controller `createAppointment` validates input. 5) Mongoose `Appointment.create()` writes to MongoDB. 6) Response JSON sent back. 7) React state updates, UI re-renders."

**Q23: Explain the validate middleware with Zod.**
> "It's a higher-order function that takes a Zod schema and returns Express middleware. The middleware calls `schema.parse()` on `{ body, query, params }`. If validation fails, Zod throws a `ZodError` with an array of issues. We map these to human-readable messages and throw an `ApiError(400)`. The global error handler formats and sends the response."

**Q24: What's the difference between `populate()` and a SQL JOIN?**
> "Both resolve references. `populate()` makes a SECOND query to MongoDB to resolve ObjectId references — it's essentially an application-level JOIN. SQL JOINs happen at the database level in a single query, which is more efficient. For performance-critical cases, you'd use MongoDB's `$lookup` aggregation stage instead of `populate()`."

### Scenario-Based Questions

**Q25: A user reports that the chatbot loses context after a few hours. Why?**
> "The session memory is stored in a Python dictionary (`session_memory = {}`), which lives in-process memory. If the FastAPI server restarts (due to deployment, crash, or auto-scaling), all memory is lost. Fix: Use Redis or MongoDB to persist conversation history with session IDs."

**Q26: Two hospital admins update beds simultaneously. What happens?**
> "Race condition. Both read `occupied: 5`. Both calculate `nextOccupied: 6`. Both write `6`. One update is lost. Fix: Use MongoDB's `$inc` operator for atomic increments, or implement optimistic concurrency control with version fields (`__v`)."

**Q27: How would you add real-time bed updates to the frontend?**
> "Use WebSockets (Socket.IO). When a bed count changes, the server emits an event. All connected hospital dashboards receive the update and re-render. For simpler needs, Server-Sent Events (SSE) or polling every 30 seconds would work."

**Q28: The medical report analysis is slow (10+ seconds). How would you optimize?**
> "1) Make it asynchronous — return a job ID immediately, process in background with a queue (Bull/Celery). 2) Cache results by file hash. 3) Use a lighter OCR model for initial triage. 4) Resize/compress images before OCR. 5) Batch multiple reports."

**Q29: How would you implement appointment slot collision detection?**
> "Before creating an appointment, query: `Appointment.findOne({ doctor: doctorId, date, time, status: 'scheduled' })`. If found, reject with 409 Conflict. For robustness, use a unique compound index on `{ doctor, date, time }` to enforce at the database level."

**Q30: How would you handle file uploads to Cloudinary securely?**
> "Currently, files are saved to `uploads/` directory via Multer, then the local path is sent to Python. For production: 1) Use Multer with Cloudinary storage engine (upload directly). 2) Set file size limits. 3) Validate MIME types (only images). 4) Scan for malware. 5) Generate signed upload URLs for direct client-to-Cloudinary uploads."

### Behavioral / "Why" Questions

**Q31: What was the hardest technical challenge?**
> "Getting reliable JSON output from the LLM. Initially, responses contained markdown formatting, extra text, or malformed JSON. I solved this with strict prompt engineering (few-shot examples, explicit JSON-only instructions) combined with the `find('{')`/`rfind('}')` extraction pattern and graceful error handling for parse failures."

**Q32: If you had to rebuild this from scratch, what would you do differently?**
> "1) Use TypeScript for the Node.js backend for type safety. 2) Implement a proper API gateway (Kong/AWS API Gateway) instead of manual proxying. 3) Use httpOnly cookies for JWT storage. 4) Add comprehensive test coverage (unit + integration). 5) Use Docker Compose for local development. 6) Implement proper logging (Winston/Pino) and monitoring (Prometheus). 7) Use MongoDB transactions for multi-document writes."

**Q33: How do you ensure data consistency between User and Doctor creation?**
> "Currently, both are created sequentially. If Doctor creation fails after User creation, we have an orphaned User. The fix is to use MongoDB sessions/transactions: wrap both operations in a `session.startTransaction()` block. If any step fails, `session.abortTransaction()` rolls back all changes."

### Quick-Fire Concepts

**Q34: What is CORS and why do you need it?**
> "Cross-Origin Resource Sharing. Browsers block requests from a different origin (domain:port). Since our frontend (port 5173) calls our backend (port 5000), we need CORS headers to permit this. The `cors` middleware sets `Access-Control-Allow-Origin` and related headers."

**Q35: What does `Helmet` do?**
> "Sets security-related HTTP headers: `X-Content-Type-Options: nosniff` (prevents MIME sniffing), `X-Frame-Options: DENY` (prevents clickjacking), `X-XSS-Protection` (enables browser XSS filter), `Strict-Transport-Security` (forces HTTPS), and more."

**Q36: What is rate limiting and how is it configured?**
> "It limits the number of requests a client can make in a time window. We allow 100 requests per 15 minutes per IP. This prevents DDoS attacks, brute-force login attempts, and API abuse. We use `express-rate-limit` which tracks request counts in memory."

**Q37: Explain the difference between `PUT` and `PATCH`.**
> "PUT replaces the entire resource. PATCH partially updates it. Our bed update uses PATCH because we're only changing `occupied` count, not the entire hospital document. Our doctor profile update uses PUT because it might update multiple fields."

**Q38: What is the seed file and why do you need it?**
> "It pre-populates the database with test data: a hospital admin, 3 patients with blood groups and geo-locations, and 3 doctors with specializations. It's essential for development/demo. It deletes all existing data first (`deleteMany`) to ensure a clean state."

**Q39: What is Pydantic and how does FastAPI use it?**
> "Pydantic is a data validation library. FastAPI uses Pydantic models (like `BaseModel`) to automatically validate request bodies. If a request doesn't match the model's types/constraints, FastAPI returns a 422 Unprocessable Entity with detailed error messages. It's similar to Zod in the JS ecosystem."

**Q40: What is the difference between `find()` and `findOne()` in Mongoose?**
> "findOne() returns a single document (or null). find() returns an array of documents (or empty array). findOne() is used when you expect a unique result (e.g., by email). find() is for listing/searching multiple documents."

### Advanced Questions

**Q41: How does the LangChain ConversationChain work under the hood?**
> "It combines a prompt template, LLM, and memory. On each invocation: 1) Memory retrieves past conversation. 2) The template formats: system prompt + history + current input. 3) LLM generates response. 4) Memory stores both input and output. The chain orchestrates these steps automatically."

**Q42: What is `joblib.load()` and how does model serialization work?**
> "joblib serializes Python objects to binary files (.pkl). `joblib.dump(model, 'file.pkl')` saves the trained model's learned parameters (weights, coefficients). `joblib.load('file.pkl')` reconstructs the object in memory. This avoids retraining on every server start. It's like saving a game — you preserve the state."

**Q43: What is Label Encoding and when should you NOT use it?**
> "Label encoding maps categories to integers (e.g., 'Employed'→0, 'Self-Employed'→1). The problem: it implies ordering (0 < 1 < 2), which is misleading for nominal data. For tree-based models this is fine, but for linear models, One-Hot Encoding is preferred to avoid false ordinal relationships."

**Q44: How would you deploy this system?**
> "Docker containers for each service. CI/CD pipeline with GitHub Actions. MongoDB Atlas for managed database. Vercel for frontends. Railway/Render/AWS ECS for backends. Environment variables via secrets manager. Health check endpoints for monitoring. Blue-green deployment for zero-downtime updates."

**Q45: What is the significance of `"type": "module"` in package.json?**
> "It enables ES Module syntax (`import/export`) instead of CommonJS (`require/module.exports`). Without it, Node.js defaults to CommonJS. With it, you can use `import express from 'express'` directly. Files must use `.js` extension in imports."

---

## 12. Quick Reference Cheat Sheet

### Environment Variables
| Variable | Service | Purpose |
|----------|---------|---------|
| `MONGO_URI` | JsBackend | MongoDB connection string |
| `JWT_SECRET` | JsBackend | JWT signing secret |
| `CORS_ORIGIN` | JsBackend | Allowed frontend origins |
| `PYTHON_BACKEND_URL` | JsBackend | Python service URL (http://localhost:8000) |
| `CLOUDINARY_CLOUD_NAME` | JsBackend | Cloudinary config |
| `CLOUDINARY_API_KEY` | JsBackend | Cloudinary config |
| `CLOUDINARY_API_SECRET` | JsBackend | Cloudinary config |
| `GROQ_API_KEY` | PYBACK | Groq API key for LLM access |

### Default Test Accounts (Seed Data)
| Role | Email | Password |
|------|-------|----------|
| Hospital Admin | hospital@example.com | Hospital@123 |
| Doctor | priya@example.com | Doctor@123 |
| Patient | alice@example.com | Patient@123 |

### Port Map
| Service | Port |
|---------|------|
| Node.js Backend | 5000 |
| Python Backend | 8000 |
| Patient Frontend | 5173 |
| Hospital Frontend | 5174 |

---

> **Final Tip:** When discussing this project in an interview, lead with the PROBLEM it solves (healthcare accessibility), then the ARCHITECTURE decisions (why polyglot microservices), then demonstrate DEPTH by discussing specific algorithms (geo-spatial, bcrypt, OCR pipeline). Always mention what you'd improve for production — it shows senior-level thinking.
