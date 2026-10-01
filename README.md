# VisionGuard AI — AI-Powered Safety Control Center

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-emerald.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x%20%7C%20Vite-sky.svg)](https://vitejs.dev/)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Gemini%20Vision%20%7C%20Edge%20CV-violet.svg)](https://ai.google.dev/)
[![Safety Standard](https://img.shields.io/badge/Compliance-OSHA%201926%20%7C%20ISO%2045001-amber.svg)](https://www.osha.gov/)

**VisionGuard AI** is a production-style Computer Vision and Visual Intelligence platform engineered to detect safety hazards, anomalies, PPE non-compliance, and catastrophic risks in real-time across high-risk industrial environments such as construction sites, scaffolding matrices, heavy machinery yards, and electrical infrastructure.

---

## 1. Project Overview

Safety supervisors and site managers face the impossible challenge of manually auditing dynamic, hazardous environments across sprawling facilities. **VisionGuard AI** transforms passive camera feeds, mobile photographs, and drone surveillance footage into an automated, closed-loop safety management workflow:

```
OPTICAL INPUT (Camera / Image / Video)
        ↓
COMPUTER VISION INFERENCE (Spatial Bounding & Pose)
        ↓
HAZARD & ANOMALY CLASSIFICATION
        ↓
DETERMINISTIC MULTI-FACTOR RISK SCORING
        ↓
REAL-TIME CRITICAL ALERT (🚨 Web Audio Chime)
        ↓
HIGH-RES EVIDENCE CAPTURE
        ↓
INCIDENT DISPATCH & CORRECTIVE ACTION
        ↓
DATABASE PERSISTENCE & DASHBOARD TELEMETRY
        ↓
REGULATORY COMPLIANCE REPORT (OSHA 1926/1910 / ISO 45001)
```

---

## 2. Problem Statement

* **Human Visual Fatigue & Blindspots:** Safety officers cannot oversee multiple multi-level work zones simultaneously.
* **Delayed Incident Response:** Falling object hazards, missing scaffold lock pins, and unlatched harnesses often remain unnoticed until an accident occurs.
* **Disconnected Systems:** Traditional CCTV systems record video passively without extracting actionable hazard intelligence or dispatching corrective tickets.

---

## 3. The Solution

VisionGuard AI provides an **Industrial Safety Operations Platform** integrating:
1. **Live Camera & CCTV Processing:** Ingests live browser webcams (`navigator.mediaDevices.getUserMedia`) and RTSP streams at 30+ FPS.
2. **Explainable AI (XAI):** Grounds every detection with visual evidence descriptions, risk explanations, and mapped OSHA/ISO regulatory clauses.
3. **Operational Incident Lifecycle:** Automatically converts optical detections into actionable incident records assigned to safety personnel with real-time resolution SLAs.

---

## 4. Key Features

* 🦺 **PPE Compliance Verification:** Automated classification of hard hats (ANSI Z89.1), high-visibility vests (Class 2), gloves, and 100% harness tie-offs.
* 🏗️ **Structural Scaffolding Diagnostics:** Geometric edge analysis flagging missing diagonal lock pins, displaced baseplates, and open perimeters.
* 🚜 **Machinery Proximity Alerts:** Real-time spatial corridor tracking calculating worker-to-forklift separation distances.
* 🚨 **Instant Critical Alerts & Chimes:** Sub-millisecond hazard alert popups with synthesized Web Audio alarm chimes.
* 📷 **Forensic Evidence Vault:** Timestamped high-resolution visual evidence captures with burned-in spatial telemetry.
* 📋 **Regulatory Audit Generator:** One-click generation of print-ready and exportable OSHA 1926/1910 compliance reports.
* 🎯 **Deterministic Demo Simulation Mode:** 6 pre-configured industrial scenarios ensuring seamless hackathon presentations even in offline environments.

---

## 5. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT LAYER (React + Vite)          │
│  - Live Camera Viewport (getUserMedia)                 │
│  - Real-time Bounding Box HUD                          │
│  - Incident Management & Evidence Vault                │
│  - Centralized State (InspectionContext)               │
└───────────────────────────┬────────────────────────────┘
                            │ REST APIs / JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│                   BACKEND LAYER (Node.js + Express)    │
│  - JWT Authentication & Role-Based Authorization       │
│  - Rate Limiting, CORS & Input Validation              │
│  - Multer Image Buffer Preprocessor                    │
│  - Risk Scoring & Deduplication Engine                 │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
                ▼                        ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│       AI INFERENCE ENGINE    │ │       DATABASE LAYER         │
│  - Gemini Vision AI          │ │  - Supabase / PostgreSQL     │
│  - Structured JSON Mode      │ │  - Relational Schema         │
│  - Fallback Vision Engine    │ │  - ACID Sync Storage         │
└──────────────────────────────┘ └──────────────────────────────┘
```

---

## 6. Technology Stack

* **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Web Audio API, React Router v7
* **Backend:** Node.js, Express.js, Multer, JSON Web Tokens (JWT), Cors
* **AI & Vision:** Google Gemini Vision (`gemini-2.5-flash`), Custom Edge Vision Anomaly Classifier
* **Database & Storage:** Supabase / PostgreSQL with synchronized local fallback caching
* **Security:** Server-side secret encapsulation, parameterized queries, sanitized inputs

---

## 7. AI Architecture & Secure Integration

### Zero Frontend Secret Exposure
The Gemini API key is **never** exposed to client-side bundles or browser requests. All vision calls are proxied through authenticated server endpoints:

```
Browser (Image Frame) ➔ Backend API (/api/inspections) ➔ Gemini 2.5 Flash ➔ Validated JSON ➔ Client HUD
```

### Structured JSON Mode
Gemini responses are strictly governed by structured schemas:

```json
{
  "title": "North Scaffolding Structural Audit",
  "summary": "Critical diagonal lock pin missing on tier 6 frame.",
  "risk": "CRITICAL",
  "confidence": 98.4,
  "detections": [
    {
      "name": "Missing Diagonal Lock Pin",
      "severity": "CRITICAL",
      "confidence": 98.4,
      "location": "Joint Hub Tier 6",
      "box_2d": [180, 420, 520, 780]
    }
  ],
  "recommendations": [
    {
      "priority": "P1 - IMMEDIATE",
      "action": "Halt scaffold elevation work and insert Grade-8 locking pin."
    }
  ],
  "explanation": "Spatial void detected at the primary diagonal intersection."
}
```

---

## 8. Role-Based Access Control (RBAC)

| Role | Permissions & Operational Capabilities |
|---|---|
| **INSPECTOR** | Start camera scans, upload field imagery, view detection findings |
| **SAFETY SUPERVISOR** | Receive critical hazard alerts, create incidents, assign corrective actions, mark resolved |
| **SITE MANAGER** | View site-level safety scores, monitor compliance trends, export regulatory reports |
| **ADMIN** | Manage system parameters, configure cameras, audit users, reset demo states |

---

## 9. Database Schema

The system uses normalized relational entities:

* `users` (`id`, `email`, `password_hash`, `role`, `organization`, `created_at`)
* `inspections` (`id`, `user_id`, `site`, `category`, `risk`, `confidence`, `image_url`, `summary`, `created_at`)
* `detections` (`id`, `inspection_id`, `name`, `severity`, `confidence`, `box_2d`)
* `incidents` (`id`, `hazard`, `severity`, `risk_score`, `site`, `status`, `assigned_to`, `due_date`, `resolved_at`)
* `evidence` (`id`, `hazard`, `severity`, `camera`, `location`, `image_url`, `timestamp`)
* `corrective_actions` (`id`, `incident_id`, `action`, `assigned_to`, `priority`, `status`)
* `cameras` (`id`, `name`, `site`, `status`, `resolution`, `fps`, `risk`)

---

## 10. API Documentation

### Authentication
* `POST /api/auth/register` — Register a new safety officer
* `POST /api/auth/login` — Authenticate and receive JWT Bearer token
* `GET /api/auth/me` — Retrieve active authenticated session

### Inspections & AI
* `POST /api/inspections` — Upload image & run Gemini Vision AI diagnostic
* `GET /api/inspections` — Retrieve paginated inspection records with filters
* `GET /api/inspections/:id` — Retrieve detailed diagnostic findings

### Incidents & Operations
* `GET /api/incidents` — Retrieve open/resolved incident tickets
* `POST /api/incidents` — Create incident ticket from camera detection
* `PATCH /api/incidents/:id` — Update status (`ASSIGNED`, `RESOLVED`, `OPEN`)

### Evidence & Telemetry
* `GET /api/evidence` — Retrieve forensic evidence frames
* `GET /api/dashboard/stats` — Retrieve Site Safety Score, active cameras, and KPIs
* `GET /api/cameras` — Retrieve live camera wall stream telemetry

---

## 11. Environment Variables

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key_here
```

### Client (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 12. Local Setup & Installation

### Prerequisites
* Node.js v18.0.0+
* npm v9.0.0+

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/Vision-Guard-AI.git
cd Vision-Guard-AI

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment
```bash
# In server directory
cp .env.example .env
# Add your GEMINI_API_KEY

# In client directory
cp .env.example .env
```

### 3. Run Development Servers
```bash
# Start Backend API (Port 5000)
cd server
npm run dev

# In a separate terminal, start Frontend (Port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 13. Hackathon Live Demo Instructions

1. Navigate to **Dashboard (`/dashboard`)** to review the live **Site Safety Score** (`86/100`) and active CCTV status.
2. Open **Live Monitoring (`/live-monitoring`)** and click **Connect Camera** to stream your actual webcam with real-time bounding boxes.
3. Test scenario triggers using the **Demo Scenarios** bar (`[ PPE Violation ]`, `[ Restricted Zone ]`, `[ Machinery Risk ]`, `[ Fall Detection ]`).
4. Experience the **CRITICAL SAFETY ALERT** popup with synthesized audio alarms.
5. Click **Capture Evidence** and **Create Incident** to generate a ticket.
6. Navigate to **Incidents (`/incidents`)** to reassign or mark the incident resolved.
7. Open **Reports (`/reports`)** to preview, print, or download the regulatory audit sheet.

---

## 14. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
