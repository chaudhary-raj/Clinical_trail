# 🧬 Clinical Trial Management System (CTMS)

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-06b6d4?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-8b5cf6?style=for-the-badge)
![Node](https://img.shields.io/badge/node-18+-10b981?style=for-the-badge)
![React](https://img.shields.io/badge/react-18-61dafb?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-47a248?style=for-the-badge)

**A production-grade, full-stack web application for managing pharmaceutical clinical trials.**
Built with React, Node.js/Express, Passport.js JWT authentication, and MongoDB Atlas.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup & Installation](#-setup--installation)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Frontend Pages](#-frontend-pages)
- [Authentication Flow](#-authentication-flow)
- [Security Implementation](#-security-implementation)
- [Design System](#-design-system)
- [Technical Design Decisions](#-technical-design-decisions)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

The **Clinical Trial Management System (CTMS)** is a comprehensive web platform designed for pharmaceutical researchers and clinical trial coordinators to:

- **Register and authenticate** securely using JWT-based authentication
- **Create and manage** clinical trials with rich metadata (phase, sponsor, investigators, participants)
- **Track trial status** across the full lifecycle: Pending → Recruiting → Active → Completed
- **Search and filter** trials in real time with pagination
- **Visualise statistics** on a live dashboard with status breakdowns

The application follows a clean **REST API architecture** with a React SPA on the frontend and an Express server on the backend, both communicating over a well-defined API contract.

---

## ✨ Features

### 🔐 User Management
| Feature | Details |
|---------|---------|
| **Registration** | Full name, email, password with strength validation |
| **Login** | JWT issued on success, 7-day expiry |
| **Logout** | Stateless — client discards token |
| **Session Restore** | Token persisted in `localStorage`, restored on refresh |
| **Protected Routes** | Unauthenticated users redirected to `/login` |
| **Role System** | `researcher`, `admin`, `viewer` roles on user model |

### 🧪 Clinical Trial Management
| Feature | Details |
|---------|---------|
| **Create Trial** | Name, description, dates, status, phase, sponsor, PI, participant count |
| **List Trials** | Paginated table (10/page), sortable |
| **Search** | Full-text search across trial name and description (MongoDB text index) |
| **Filter by Status** | One-click filter tabs for all 6 statuses |
| **Edit Trial** | Pre-filled modal form, all fields editable |
| **Delete Trial** | Confirmation dialog before permanent deletion |
| **Detail View** | Dedicated page with all trial info, duration calculation |

### 📊 Dashboard
| Feature | Details |
|---------|---------|
| **Stats Cards** | Total, Recruiting, Active, Completed, Pending counts |
| **Status Breakdown** | Visual progress bars with percentages |
| **Recent Trials** | Last 5 trials with quick links |
| **Personalised Greeting** | Time-aware greeting with user name |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3 | Component-based UI framework |
| **React Router v6** | 6.24 | Client-side routing, protected routes |
| **Axios** | 1.7 | HTTP client with interceptors |
| **React Context API** | built-in | Global auth state management |
| **Vanilla CSS** | — | Custom dark glassmorphism design system |
| **Google Fonts (Inter)** | — | Modern typography |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 4.19 | HTTP server framework |
| **Passport.js** | 0.7 | Authentication middleware |
| **passport-jwt** | 4.0 | JWT strategy for Passport |
| **jsonwebtoken** | 9.0 | JWT signing and verification |
| **bcryptjs** | 2.4 | Password hashing (12 salt rounds) |
| **express-validator** | 7.1 | Request body validation |
| **express-rate-limit** | 7.3 | Rate limiting |
| **Helmet** | 7.1 | HTTP security headers |
| **CORS** | 2.8 | Cross-origin resource sharing |
| **Morgan** | 1.10 | HTTP request logger |
| **express-async-errors** | 3.1 | Async error propagation |

### Database & DevOps
| Technology | Version | Purpose |
|-----------|---------|---------|
| **MongoDB Atlas** | Cloud | Managed NoSQL database |
| **Mongoose** | 8.4 | ODM — schema validation, hooks, virtuals |
| **Nodemon** | 3.1 | Auto-restart server on file changes |
| **Concurrently** | 8.2 | Run multiple npm scripts in parallel |
| **dotenv** | 16.4 | Environment variable management |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              React SPA (port 3000)                  │   │
│   │                                                     │   │
│   │  ┌──────────┐  ┌────────────┐  ┌────────────────┐  │   │
│   │  │AuthContext│  │React Router│  │  Axios Instance │  │   │
│   │  │(JWT state)│  │(Protected) │  │(JWT interceptor)│  │   │
│   │  └──────────┘  └────────────┘  └────────────────┘  │   │
│   │                                                     │   │
│   │  Pages: Login │ Register │ Dashboard │ Trials │ Detail  │
│   └─────────────────────────────────────────────────────┘   │
│                          │  HTTPS                           │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Express API Server (port 5000)              │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐  │
│  │  Helmet  │  │   CORS   │  │Rate Limiter│  │  Morgan  │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Passport.js JWT Strategy                  │ │
│  │     (Extracts Bearer token → validates → req.user)     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────┐   ┌────────────────────────────┐  │
│  │    /api/auth        │   │       /api/trials          │  │
│  │  register  login    │   │  GET list  POST create     │  │
│  │  logout    me       │   │  GET :id   PUT :id         │  │
│  └─────────────────────┘   │  DELETE :id  GET stats     │  │
│                            └────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 Centralised Error Handler               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────┬───────────────────────────┘
                                  │ Mongoose ODM
┌─────────────────────────────────▼───────────────────────────┐
│                   MongoDB Atlas (Cloud)                      │
│                                                             │
│   Collection: users          Collection: trials             │
│   ┌─────────────────────┐    ┌─────────────────────────┐   │
│   │ name, email,        │    │ trialName, description,  │   │
│   │ password (hashed),  │    │ startDate, endDate,      │   │
│   │ role, lastLogin,    │    │ status, phase, sponsor,  │   │
│   │ isActive, timestamps│    │ PI, participants,         │   │
│   └─────────────────────┘    │ createdBy (ref User)     │   │
│                              └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
aditya/                                  ← Root workspace
│
├── 📄 package.json                      ← Root: concurrently dev scripts
├── 📄 .env.example                      ← Environment variable template
├── 📄 .gitignore                        ← Excludes node_modules, .env
├── 📄 start-dev.bat                     ← Windows one-click dev launcher
├── 📄 README.md                         ← This file
│
├── 🖥️  server/                          ← Node.js + Express backend
│   ├── 📄 server.js                     ← App entry point, middleware setup
│   ├── 📄 package.json                  ← Backend dependencies
│   ├── 📄 .env                          ← Environment variables (gitignored)
│   │
│   ├── 📁 config/
│   │   ├── 📄 db.js                     ← MongoDB Atlas connection
│   │   └── 📄 passport.js               ← Passport JWT strategy config
│   │
│   ├── 📁 models/
│   │   ├── 📄 User.js                   ← User schema + bcrypt pre-save hook
│   │   └── 📄 Trial.js                  ← Trial schema + text index + virtual
│   │
│   ├── 📁 controllers/
│   │   ├── 📄 authController.js         ← register / login / logout / getMe
│   │   └── 📄 trialController.js        ← CRUD + pagination + stats aggregation
│   │
│   ├── 📁 middleware/
│   │   ├── 📄 authMiddleware.js         ← Passport JWT auth guard
│   │   └── 📄 errorHandler.js           ← Centralised error formatter
│   │
│   └── 📁 routes/
│       ├── 📄 auth.js                   ← POST /register, /login, /logout, GET /me
│       └── 📄 trials.js                 ← GET, POST, PUT, DELETE /trials
│
└── 🌐 client/                           ← React SPA frontend
    ├── 📄 package.json                  ← Frontend deps + proxy to :5000
    │
    ├── 📁 public/
    │   └── 📄 index.html                ← HTML shell with SEO meta tags
    │
    └── 📁 src/
        ├── 📄 index.js                  ← React DOM entry point
        ├── 📄 App.js                    ← Router, route config, AppLayout
        ├── 📄 index.css                 ← Full design system (CSS variables, all components)
        ├── 📄 App.css                   ← Minimal (all styles in index.css)
        │
        ├── 📁 api/
        │   └── 📄 axiosInstance.js      ← Axios + JWT interceptor + 401 handler
        │
        ├── 📁 context/
        │   └── 📄 AuthContext.jsx       ← Global auth state, login/register/logout
        │
        ├── 📁 components/
        │   ├── 📄 Navbar.jsx            ← Top nav, avatar dropdown, mobile menu
        │   ├── 📄 ProtectedRoute.jsx    ← Redirect unauthenticated users
        │   ├── 📄 StatusBadge.jsx       ← Colour-coded trial status pill
        │   └── 📄 TrialModal.jsx        ← Create / Edit modal form
        │
        └── 📁 pages/
            ├── 📄 LoginPage.jsx         ← Login form with animated background
            ├── 📄 RegisterPage.jsx      ← Registration + password strength meter
            ├── 📄 DashboardPage.jsx     ← Stats cards + breakdown + recent trials
            ├── 📄 TrialsPage.jsx        ← Full trials list, search, filter, CRUD
            └── 📄 TrialDetailPage.jsx   ← Single trial detail + edit + delete
```

---

## ✅ Prerequisites

Before you begin, ensure you have:

- **Node.js** v18 or higher → [Download](https://nodejs.org/)
- **npm** v9 or higher (comes with Node.js)
- **MongoDB Atlas** account (free tier is sufficient) → [Sign up](https://cloud.mongodb.com/)
- **Git** (optional) → [Download](https://git-scm.com/)

---

## 🚀 Setup & Installation

### Step 1 — Get the Code

```bash
# Option A: Clone from Git
git clone <your-repo-url>
cd aditya

# Option B: Already downloaded — just navigate to the folder
cd C:\Users\darkp\Desktop\aditya
```

### Step 2 — Install All Dependencies

```bash
# Install root devDependencies (concurrently)
npm install

# Install backend dependencies
npm install --prefix server

# Install frontend dependencies  
npm install --prefix client
```

> 💡 Or run all three with: `npm run install-all`

### Step 3 — Configure MongoDB Atlas

#### A. Create a Cluster
1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Build a Database** → Select **Free (M0)** tier
3. Choose a cloud provider and region → Click **Create**

#### B. Create a Database User
1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Set **Username** and **Password** (save these!)
4. Under privileges, select **Read and write to any database**
5. Click **Add User**

#### C. Whitelist Your IP
1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. For development: click **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Click **Confirm**

#### D. Get Your Connection String
1. Go to **Database** → Click **Connect** on your cluster
2. Select **Drivers** → Choose **Node.js**
3. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 4 — Configure Environment Variables

Create `server/.env` (copy from `.env.example`):

```bash
cp .env.example server/.env
```

Edit `server/.env` and fill in your values:

```env
# ─── Database ──────────────────────────────────────────────
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/clinical_trials_db?retryWrites=true&w=majority

# ─── Auth ──────────────────────────────────────────────────
# Generate a secure secret:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_long_random_secret_string_here

JWT_EXPIRE=7d

# ─── Server ────────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ─── Client ────────────────────────────────────────────────
CLIENT_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env` to Git.** It is already listed in `.gitignore`.

---

## ▶️ Running the Application

### Option A — One-Click (Windows)

Double-click **`start-dev.bat`** in the project root. This opens two terminal windows:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:3000`

### Option B — Concurrent (from root)

```bash
npm run dev
```

This runs both servers simultaneously using `concurrently`.

### Option C — Separate Terminals

**Terminal 1 — Backend:**
```bash
cd server
npm run dev        # Uses nodemon for auto-reload
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start          # Opens browser automatically at localhost:3000
```

### Verify Everything is Working

| Check | URL | Expected |
|-------|-----|----------|
| Frontend | http://localhost:3000 | Login page loads |
| API Health | http://localhost:5000/api/health | `{ "success": true }` |
| Backend logs | Terminal 1 | `✅ MongoDB Connected: ...` |

---

## 📡 API Reference

All API endpoints are prefixed with `/api`. Protected routes require the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Authentication Endpoints

#### `POST /api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "password": "Secret123"
}
```

**Validation Rules:**
- `name`: 2–50 characters, required
- `email`: valid email format, required, must be unique
- `password`: min 6 characters, must contain at least one number

**Success Response `201`:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Dr. Jane Smith",
      "email": "jane@example.com",
      "role": "researcher"
    }
  }
}
```

**Error Responses:**
- `422` — Validation failed
- `409` — Email already exists

---

#### `POST /api/auth/login`
Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "Secret123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Dr. Jane Smith",
      "email": "jane@example.com",
      "role": "researcher",
      "lastLogin": "2024-08-21T17:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401` — Invalid email or password
- `403` — Account deactivated

---

#### `POST /api/auth/logout`
Logout the current user. *(Requires Auth)*

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

> Note: JWT is stateless — the token is discarded client-side. For production, implement a token blocklist.

---

#### `GET /api/auth/me`
Get the currently authenticated user's profile. *(Requires Auth)*

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Dr. Jane Smith",
      "email": "jane@example.com",
      "role": "researcher",
      "lastLogin": "2024-08-21T17:00:00.000Z",
      "createdAt": "2024-08-01T10:00:00.000Z"
    }
  }
}
```

---

### 🧪 Clinical Trial Endpoints

> All trial endpoints require `Authorization: Bearer <token>`

---

#### `GET /api/trials`
Get a paginated, filterable list of all clinical trials.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |
| `status` | string | — | Filter by status (e.g. `Active`) |
| `search` | string | — | Full-text search on name & description |
| `sortBy` | string | `createdAt` | Field to sort by |
| `order` | string | `desc` | Sort direction: `asc` or `desc` |

**Example Request:**
```
GET /api/trials?page=1&limit=10&status=Recruiting&search=BRCA
```

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "trials": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
        "trialName": "Phase III BRCA1 Inhibitor Study",
        "description": "A randomised controlled trial...",
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2026-01-15T00:00:00.000Z",
        "status": "Recruiting",
        "phase": "Phase III",
        "sponsor": "NIH",
        "principalInvestigator": "Dr. Jane Smith",
        "participantCount": 450,
        "createdBy": { "name": "Dr. Jane Smith", "email": "jane@example.com" },
        "createdAt": "2024-08-01T10:00:00.000Z",
        "durationDays": 731
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

#### `POST /api/trials`
Create a new clinical trial.

**Request Body:**
```json
{
  "trialName": "Phase III BRCA1 Inhibitor Study",
  "description": "A randomised controlled trial evaluating the efficacy...",
  "startDate": "2024-01-15",
  "endDate": "2026-01-15",
  "status": "Recruiting",
  "phase": "Phase III",
  "sponsor": "NIH",
  "principalInvestigator": "Dr. Jane Smith",
  "participantCount": 450
}
```

**Validation Rules:**
- `trialName`: 3–150 characters, required
- `description`: 10–2000 characters, required
- `startDate`: valid ISO date, required
- `endDate`: valid ISO date, must be after `startDate`, required
- `status`: one of the 6 valid statuses (optional, defaults to `Pending`)
- `participantCount`: non-negative integer (optional)

**Success Response `201`:**
```json
{
  "success": true,
  "message": "Clinical trial created successfully",
  "data": { "trial": { ... } }
}
```

---

#### `GET /api/trials/:id`
Get a single trial by its MongoDB ID.

**Success Response `200`:**
```json
{
  "success": true,
  "data": { "trial": { ... } }
}
```

**Error Response `404`:** Trial not found

---

#### `PUT /api/trials/:id`
Update an existing clinical trial. Same validation rules as POST.

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Clinical trial updated successfully",
  "data": { "trial": { ... } }
}
```

---

#### `DELETE /api/trials/:id`
Permanently delete a clinical trial.

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Clinical trial deleted successfully",
  "data": { "id": "64f1a2b3c4d5e6f7a8b9c0d2" }
}
```

---

#### `GET /api/trials/stats`
Get aggregate dashboard statistics.

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalTrials": 25,
    "statusBreakdown": [
      { "_id": "Recruiting", "count": 8, "totalParticipants": 1200 },
      { "_id": "Active",     "count": 6, "totalParticipants": 900  },
      { "_id": "Completed",  "count": 5, "totalParticipants": 750  },
      { "_id": "Pending",    "count": 4, "totalParticipants": 0    },
      { "_id": "Suspended",  "count": 2, "totalParticipants": 300  }
    ],
    "recentTrials": [ { ... }, { ... }, { ... } ]
  }
}
```

---

### Standard Error Response Format

All errors follow this consistent structure:

```json
{
  "success": false,
  "message": "Human-readable error description",
  "errors": [ ... ]      // only present on validation failures (422)
}
```

| HTTP Code | Meaning |
|-----------|---------|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (account deactivated) |
| `404` | Resource not found |
| `409` | Conflict (duplicate email) |
| `422` | Validation failed |
| `429` | Too many requests |
| `500` | Internal server error |

---

## 🗄 Database Schema

### Users Collection

```javascript
{
  _id:         ObjectId,           // Auto-generated
  name:        String,             // 2–50 chars, required
  email:       String,             // Unique, lowercase, required
  password:    String,             // bcrypt hash, select: false
  role:        String,             // 'researcher' | 'admin' | 'viewer'
  lastLogin:   Date,               // Updated on each login
  isActive:    Boolean,            // Default: true
  createdAt:   Date,               // Auto (timestamps: true)
  updatedAt:   Date                // Auto (timestamps: true)
}
```

**Indexes:** `email` (unique)

**Pre-save Hook:** Password automatically hashed with bcrypt (12 salt rounds) when `password` field is modified.

**Instance Methods:**
- `comparePassword(candidate)` — returns `Promise<boolean>`
- `toJSON()` — strips `password` and `__v` from serialised output

---

### Trials Collection

```javascript
{
  _id:                    ObjectId,   // Auto-generated
  trialName:              String,     // 3–150 chars, required
  description:            String,     // 10–2000 chars, required
  startDate:              Date,       // Required
  endDate:                Date,       // Required, must be > startDate
  status:                 String,     // Enum (see below), default: 'Pending'
  phase:                  String,     // 'Phase I'–'Phase IV' | 'N/A'
  sponsor:                String,     // Max 100 chars
  principalInvestigator:  String,     // Max 100 chars
  participantCount:       Number,     // Min 0, default 0
  createdBy:              ObjectId,   // Ref: User, required
  createdAt:              Date,       // Auto (timestamps: true)
  updatedAt:              Date        // Auto (timestamps: true)
}
```

**Virtual Fields:**
- `durationDays` — computed as `Math.ceil((endDate - startDate) / 86400000)`

**Indexes:**
- `{ status: 1 }` — for status filtering
- `{ createdBy: 1 }` — for user-scoped queries
- `{ trialName: 'text', description: 'text' }` — for full-text search

**Trial Status Values:**

| Status | Meaning |
|--------|---------|
| `Pending` | Trial registered, not yet started |
| `Recruiting` | Actively enrolling participants |
| `Active` | Trial ongoing, recruitment closed |
| `Completed` | Trial finished successfully |
| `Suspended` | Temporarily paused |
| `Terminated` | Permanently stopped early |

---

## 🖥 Frontend Pages

### `/login` — Login Page
- Animated background with floating colour orbs
- Email and password form with validation
- Password show/hide toggle
- Displays API error messages inline
- Redirects to intended page after login (via `location.state.from`)

### `/register` — Register Page
- Same animated background as login
- Full name, email, password, confirm password fields
- **Real-time password strength meter** (Weak → Fair → Good → Strong)
- Client-side validation before API call

### `/dashboard` — Dashboard *(Protected)*
- Personalised greeting based on time of day
- **5 stat cards**: Total, Recruiting, Active, Completed, Pending
- **Status breakdown** with animated progress bars
- **Recent Trials** table with links to detail pages
- Skeleton loading state while fetching

### `/trials` — Trials List *(Protected)*
- Full paginated table of all trials
- **Search bar** with full-text search
- **Status filter tabs** (All, Pending, Recruiting, Active, Completed, Suspended, Terminated)
- Edit (✎) and Delete (✕) action buttons per row
- **Create Trial** button opens modal
- Delete confirmation dialog before deletion
- Success/error toast banners

### `/trials/:id` — Trial Detail *(Protected)*
- Breadcrumb navigation
- Status badge + phase tag
- Key metrics bar: Start Date, End Date, Duration, Participants
- Full description
- Info grid: Sponsor, Principal Investigator, Phase, Status, Created By, Timestamps
- Edit and Delete buttons

---

## 🔒 Authentication Flow

```
1. User submits login form
        │
        ▼
2. POST /api/auth/login
   ├─ Validate email + password (express-validator)
   ├─ Find user by email (select +password)
   ├─ Compare with bcrypt.compare()
   └─ Generate JWT: jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' })
        │
        ▼
3. Token returned to client
   ├─ Stored in localStorage ('ctms_token')
   └─ User object stored in localStorage ('ctms_user')
        │
        ▼
4. Subsequent requests
   ├─ Axios interceptor reads token from localStorage
   ├─ Attaches: Authorization: Bearer <token>
   └─ Server validates via Passport JWT strategy
        │
        ▼
5. Passport JWT strategy
   ├─ ExtractJwt.fromAuthHeaderAsBearerToken()
   ├─ jwt.verify(token, JWT_SECRET)
   ├─ User.findById(jwt_payload.id)
   └─ Attaches user to req.user
        │
        ▼
6. On 401 response (expired/invalid token)
   ├─ Axios response interceptor fires
   ├─ Clears localStorage
   └─ Redirects to /login
```

---

## 🛡 Security Implementation

| Threat | Mitigation |
|--------|------------|
| Password exposure | bcrypt with 12 salt rounds; `select: false` in Mongoose schema |
| JWT tampering | Signed with `JWT_SECRET`; verified on every protected request |
| XSS | Helmet sets `Content-Security-Policy`, `X-Content-Type-Options` headers |
| Clickjacking | Helmet sets `X-Frame-Options: DENY` |
| Brute-force login | Rate limiter: 20 requests per 15 min on `/api/auth/*` |
| API abuse | Rate limiter: 100 requests per 15 min globally |
| CORS | Restricted to `CLIENT_URL` origin only |
| NoSQL injection | Mongoose schema typing + express-validator sanitisation |
| Sensitive errors | Stack traces hidden in production (`NODE_ENV=production`) |
| Duplicate accounts | Unique index on `email` + duplicate key error handling |

---

## 🎨 Design System

The UI is built with a **dark glassmorphism** design language defined entirely in `client/src/index.css`.

### Colour Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#060b18` | Page background |
| `--bg-surface` | `#0d1526` | Card surfaces |
| `--bg-glass` | `rgba(13,21,38,0.7)` | Glassmorphism cards |
| `--cyan` | `#06b6d4` | Primary accent, links, active states |
| `--violet` | `#8b5cf6` | Secondary accent, phase tags |
| `--emerald` | `#10b981` | Success, Recruiting status |
| `--amber` | `#f59e0b` | Warning, Suspended status |
| `--rose` | `#ef4444` | Danger, Terminated status |

### Typography
- **Font**: Inter (Google Fonts) — weights 300, 400, 500, 600, 700, 800
- **Base**: 15px body, 0.82rem labels, 2rem page titles

### Component Design
- **Cards**: `backdrop-filter: blur(16px)` + `rgba` background = glassmorphism
- **Buttons**: Gradient primary, ghost secondary, danger variant
- **Inputs**: Focus glow with `box-shadow: 0 0 0 3px rgba(cyan, 0.12)`
- **Animations**: `fadeInDown`, `authCardIn` (spring), `cardIn`, `shimmer` (skeleton)
- **Responsive**: Mobile-first, breakpoints at 768px and 480px

---

## 🤔 Technical Design Decisions

### Why JWT over Sessions?
Stateless JWTs are ideal for SPA + REST API architecture. There is no server-side session store, making the backend horizontally scalable from day one. The token is validated on every request without a DB lookup (Passport strategy handles this).

### Why Passport.js?
The strategy pattern allows adding OAuth2 providers (Google, GitHub, ORCID) in the future by simply registering a new strategy — without touching existing auth routes or middleware.

### Why MongoDB + Mongoose?
Clinical trial data has variable metadata (some trials have sponsor info, some don't) — MongoDB's flexible schema accommodates this naturally. Mongoose adds schema contracts, validation hooks, and virtuals on top. Atlas provides managed backups, monitoring, and global distribution.

### Why React Context over Redux?
Auth state (user + token) is global but simple — two values and three actions. Context + useCallback provides the same functionality with zero boilerplate. If the app grows to require complex global state (e.g. caching trial data, offline support), Zustand or Redux Toolkit can be introduced.

### Why express-validator?
It integrates cleanly with Express's middleware chain and allows validation rules to live next to route definitions — easy to review and maintain. It prevents relying solely on Mongoose validation (which would only catch errors at the DB layer).

### Why a Proxy in client/package.json?
The `"proxy": "http://localhost:5000"` setting in CRA's `package.json` means all `axios.get('/api/...')` calls from the React dev server are forwarded to Express. This eliminates CORS issues in development without any configuration changes.

---

## 🔧 Troubleshooting

### `MongoDB connection failed`
- Check your `MONGO_URI` in `server/.env` — ensure username/password are URL-encoded if they contain special characters
- Verify your IP is whitelisted in Atlas → **Network Access**
- Test connection string directly in MongoDB Compass

### `Port 5000 is already in use`
```bash
# Windows — find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### `Cannot GET /api/...` from browser
- Make sure the backend server is running (`node server.js` in `/server`)
- Check port — default is 5000. Visit: http://localhost:5000/api/health

### `401 Unauthorized on all API calls`
- Token may have expired (7-day default). Log out and log back in.
- Ensure `JWT_SECRET` in `server/.env` hasn't changed since tokens were issued.

### React app shows blank page
- Check browser console for errors
- Ensure `client/node_modules` exists (run `npm install --prefix client`)
- Verify `client/src/index.js` exists and imports `App.js`

### `react-scripts: command not found`
Dependencies not installed. Run:
```bash
npm install --prefix client
```

---

## 📄 License

MIT © 2024 Clinical Trials Corp

---

<div align="center">

Built with ❤️ using React, Express, Passport.js, and MongoDB Atlas

</div>
