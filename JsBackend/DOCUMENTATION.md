# JsBackend Documentation

**Stack**: Node.js + Express + MongoDB (Mongoose)  
**Tools**: Postman, Cloudinary, JWT, Bcrypt

---

## 🏗️ Architecture Overview

**Backend -> Node.js + Express**  
**Database -> MongoDB** (NoSQL, flexible schema)  
**Validation -> Zod** (Input validation)  
**Auth -> JWT** (Stateless authentication)

### Mental Model: Request Flow
```text
Client (Frontend)
   ↓
Request (POST /login)
   ↓
server.js (Entry Point)
   ↓
app.js (Middleware + Routes)
   ↓
Router (auth.routes.js)
   ↓
Validation Middleware (Zod)
   ↓
Controller (auth.controller.js)
   ↓
Service/Model (User.js) -> MongoDB
   ↓
Response (JSON)
```

---

## 🚀 API Features

1.  **Authentication**: Register/Login for Patients, Doctors, and Hospitals.
2.  **Geo-spatial Search**: Find Blood Donors near a location.
3.  **Appointments**: Book and manage doctor appointments.
4.  **Medical Reports**: Upload records and analyze them via Python AI.
5.  **Hospital Management**: Manage beds, doctors, and handoffs.

---

## 🗄️ Database Design (Schema)

We use Mongoose schemas to define strict rules for our data.

### 1. User Schema (Patients/Admins)
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  password: String, // Hashed
  role: Enum ["PATIENT", "DOCTOR", "HOSPITAL_ADMIN", "ADMIN"],
  bloodGroup: String, // For donors
  location: { 
     type: "Point", 
     coordinates: [Longitude, Latitude] 
  }
}
```

### 2. Doctor Schema
```javascript
{
  user: ObjectId (Ref: User), // Links to login credentials
  name: String,
  specialization: String,
  hospital: ObjectId (Ref: User), // Links to Hospital Admin
  availableSlots: [Date]
}
```

### 3. Appointment Schema
```javascript
{
  patientName: String,
  doctor: ObjectId (Ref: Doctor),
  date: Date,
  status: Enum ["scheduled", "completed", "cancelled"]
}
```

### ❓ Why this Design?
*   **Separation of User & Doctor**: A Doctor *is a* User (can login), but has extra profile data (specialization). This keeps the Auth table clean.
*   **Geo-JSON Location**: MongoDB supports geospatial queries natively. storing coordinates as `[lng, lat]` allows us to find "nearest donors" instantly.
*   **Refs (ObjectId)**: like Foreign Keys in SQL. Allows us to `populate()` data (e.g., "Get Appointment and show me the Doctor's name").

---

## 🔐 Authentication & Security

### Why JWT (JSON Web Token)?
HTTP is stateless. The server forgets you after every request.
**JWT acts as a digital ID card.**
1.  **Login**: You give password -> Server gives Token.
2.  **Access**: You show Token -> Server lets you in.

### The Auth Flow
```text
Client (Login)
   ↓
Server verifies Password (bcrypt compare)
   ↓
Server signs JWT (with userId + role)
   ↓
Client saves Token (localStorage)
   ↓
Client requests Protected Route (/appointments)
   ↓
Auth Middleware verifies Token
   ↓
Access Granted
```

---

## 🌍 Geo-Spatial Search (Blood Donors)

**Problem**: How to find donors within 10km?  
**Solution**: MongoDB `$near` operator.

**Algorithm**:
1.  Frontend gets user's GPS Lat/Lng.
2.  Request: `GET /donors?lat=12.9&lng=77.5`.
3.  Backend Code:
    ```javascript
    User.find({
      role: "PATIENT",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 10000 // 10km
        }
      }
    })
    ```
4.  **Result**: Sorted list of nearest donors.

---

## 🔄 AI Integration (Proxy Pattern)

**Goal**: Analyze Medical Reports.
**Challenge**: The AI models are in Python, but our main API is Node.js.

**Solution**: Node.js acts as a **Proxy**.
1.  **Upload**: Frontend sends file to Node.js.
2.  **Store**: Node.js uploads to **Cloudinary** -> gets a public URL.
3.  **Forward**: Node.js sends the *Image URL* to the Python Service (`/analyze`).
4.  **Response**: Python analyzes and returns text -> Node.js sends to Client.

```text
Frontend  ->  [Node.js API]  ->  Cloudinary
                    ↓
              [Python AI Service]
                    ↓
Frontend  <-  [Node.js API]
```

---

## 🛠️ Key Libraries

*   **Express**: Web Framework.
*   **Mongoose**: MongoDB ODM.
*   **Bcryptjs**: Password Hashing (Security).
*   **JsonWebToken**: Auth Tokens.
*   **Multer**: Handling File Uploads.
*   **Axios**: Making HTTP requests to Python service.
*   **Zod**: Validating incoming data structure.
