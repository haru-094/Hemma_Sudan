# 🇸🇩 Hemma Sudan (همة السودان)
> **Offline-Resilient Programming Learning & Mentorship Platform**  
> *Built for higher education computer science students in Sudan experiencing prolonged internet blackouts and power disruptions.*

[![React 19](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express 5](https://img.shields.io/badge/Express-5.3-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![E2E Tests](https://img.shields.io/badge/E2E_Tests-22%2F22_Passed-success)](#-running-the-automated-e2e-simulation)
[![RTL / LTR](https://img.shields.io/badge/Localization-AR_(RTL)_|_EN_(LTR)-emerald)](#-bilingual-architecture-rtl--ltr)

---

## 📖 Table of Contents
1. [Overview & Motivation](#-overview--motivation)
2. [Key Features & SRS Compliance](#-key-features--srs-compliance)
3. [System Architecture](#-system-architecture)
4. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
5. [Quick Start & Setup Guide](#-quick-start--setup-guide)
6. [Demo Accounts (One-Click Testing)](#-demo-accounts-one-click-testing)
7. [How to Use & Test the Platform](#-how-to-use--test-the-platform)
8. [Running the Automated E2E Simulation](#-running-the-automated-e2e-simulation)
9. [Environment Variables Reference](#-environment-variables-reference)
10. [Project Structure](#-project-structure)

---

## 🌍 Overview & Motivation

Due to infrastructure instability and conflict in Sudan, university students frequently face **weeks or months of total telecommunications blackouts**. Standard learning platforms (Canvas, Moodle, Coursera) break completely under zero-connectivity conditions.

**Hemma Sudan** solves this with an **offline-first progressive web application (PWA)**:
- Students download interactive coding modules and exercises during brief windows of connectivity.
- They complete lessons, write Python code, and answer quizzes completely offline.
- All progress is saved locally in IndexedDB (`progress_queue`).
- When network reconnects, background workers synchronize data automatically with idempotent duplicate protection and zero progress loss.

---

## ✨ Key Features & SRS Compliance

| SRS Requirement | Feature Description | Status |
|---|---|:---:|
| **FR-5.1 – FR-5.4** | **Offline Quizzes & Lessons:** Content is cached in browser IndexedDB; quizzes can be solved offline with instant local scoring. | 🟢 Completed |
| **FR-5.5** | **Sync Conflict Resolution:** Disagreements on lesson completion revert to `incomplete`; latest client timestamp wins for position. | 🟢 Completed |
| **FR-5.6** | **Content Staleness Detection:** Server checks saved lessons against published versions; flags `update_available` or `no_longer_available`. | 🟢 Completed |
| **FR-5.7** | **Smart Retry Classification:** 401 stops retries & triggers re-auth; 400/403 marks failed; 5xx/timeouts retry with backoff (5s, 15s, 60s). | 🟢 Completed |
| **FR-6.3** | **Reachable GitHub Validation:** Submissions are probed via HTTP `HEAD` request to guarantee the repository is public and accessible. | 🟢 Completed |
| **FR-7** | **Mentor Revision Remarks Callout:** Prominent amber callout displays mentor review remarks and earlier remark accordion above resubmit form. | 🟢 Completed |
| **FR-9.1** | **Reviewer Assignment:** Course lead can assign submissions explicitly to specific mentors or themselves. | 🟢 Completed |
| **FR-10.2** | **Direct Escalation to Teacher:** Learners can escalate submissions directly to the instructor if mentors are unassigned or upon disagreement. | 🟢 Completed |
| **FR-11.2** | **Review Queue Filter Tabs:** 5 real-time tabs (`All`, `Pending Review`, `Revision Requested`, `Escalated`, `Completed`) with live counter badges. | 🟢 Completed |
| **FR-12.1** | **Offline Session Expiry & Re-Auth:** Session expiry while offline pauses sync and preserves the queue; re-logging in resumes sync with **zero data loss**. | 🟢 Completed |
| **NFR-3** | **Unsaved Progress Warning:** `beforeunload` browser guard warns users before leaving or discarding unsynchronized progress records. | 🟢 Completed |
| **NFR-14** | **Data Retention & Demo Purge:** 2nd login prompts for retention consent; teacher can purge non-consented demo records with audit logging. | 🟢 Completed |

---

## 🏗 System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React 19 PWA)"]
        UI["UI Layer\n(Tailwind CSS v4 + RTL/LTR)"]
        IDB[("IndexedDB\n(Lessons & Progress Queue)")]
        SyncCtx["SyncContext\n(Retry Backoff & Online Listeners)"]
        AuthCtx["AuthContext\n(Session Expiry & Retention Consent)"]
        UI <--> IDB
        UI <--> SyncCtx
        SyncCtx <--> AuthCtx
    end

    subgraph Network["Connectivity Layer"]
        Fetch["Fetch API / HTTP Client"]
    end

    subgraph Server["Backend API (Express 5)"]
        Routes["REST Endpoints\n(/auth, /curriculum, /submissions, /sync, /teacher)"]
        Engine["Sync Conflict & Reachability Engine"]
    end

    subgraph Storage["Data Persistence"]
        DB[("PostgreSQL\n(Production)")]
        MemStore[("In-Memory Store\n(Offline/Dev Fallback)")]
    end

    SyncCtx --> Fetch
    Fetch --> Routes
    Routes --> Engine
    Engine --> DB
    Engine -. "Fallback if DB offline" .-> MemStore
```

---

## 💻 Prerequisites & System Requirements

Before running the application, make sure you have the following installed:

- **Node.js**: `v18.0.0` or higher (`node -v`)
- **npm**: `v9.0.0` or higher (`npm -v`)
- **Modern Browser**: Chrome, Edge, Firefox, or Safari (supporting Service Workers and IndexedDB)
- *(Optional)* **PostgreSQL**: `v14+` — *Note: If PostgreSQL is not installed or running, the backend automatically switches to its built-in in-memory fallback store seamlessly!*

---

## 🚀 Quick Start & Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/haru-094/Hemma_Sudan.git
cd Hemma_Sudan
```

### 2. Set Up the Backend Server
```bash
cd server
npm install
cp .env.example .env
npm start
```
The backend API server will start on **`http://localhost:5001`**.

> **Note:** If PostgreSQL is offline, you will see `[DB Engine] PostgreSQL unreachable. Seamless in-memory fallback activated.` The server will continue running normally with mock/memory data.

### 3. Set Up the Frontend Client
In a **new terminal tab**:
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
The client application will start on **`http://localhost:5173`**.

Open your browser to **`http://localhost:5173`**.

---

## 👥 Demo Accounts (One-Click Testing)

The application comes pre-configured with demo accounts across all three platform roles:

| Role | Name | Email | Password | Features / Permissions |
|---|---|---|---|---|
| **Learner** | Ahmed Osman | `ahmed.student@hemma.sd` | `any` | Quizzes, offline lessons, GitHub capstone submission, escalation |
| **Mentor** | Sarah Ibrahim | `sarah.mentor@hemma.sd` | `any` | Review queue, topic approvals (Topics 1 & 2), revision requests |
| **Mentor** | Omar Farouk | `omar.mentor@hemma.sd` | `any` | Review queue (Arabic preference), topic approvals (Topics 2 & 3) |
| **Mentor** | Mona Elhassan | `mona.mentor@hemma.sd` | `any` | Review queue, topic approvals (Topic 1) |
| **Course Lead (Teacher)** | Dr. Tariq Ahmed | `teacher@hemma.sd` | `any` | Lesson authoring, Arabic translation approvals, escalation resolution, demo purge |

> 💡 **Quick Switch:** You can switch between these roles with one click using the user dropdown in the top navigation bar or the **"One-Click Demo Accounts"** section on the `/login` page.

---

## 🎯 How to Use & Test the Platform

### 1. Offline Quiz Completion & Auto-Sync
1. Log in as **Ahmed Osman (Learner)**.
2. Go to **Lessons** (`/lessons`) and select **Lesson 1** (`/lessons/lesson-1-1`).
3. Disconnect from the internet (open DevTools Network tab → choose **Offline**, or turn off Wi-Fi).
4. Notice the amber **"You are currently offline"** banner appears.
5. Answer the **Interactive Knowledge Check (Quiz)** and click **"Submit Quiz Answers"**.
6. Your score is calculated and saved to the offline queue (`⏳ Pending`).
7. Reconnect to the internet (choose **No throttling**). Progress automatically synchronizes with the server (`✓ Synced`).

### 2. Project Submission & Mentor Revision Remarks
1. Go to **Capstones / Project** (`/project/topic-1`).
2. Test reachability validation by entering a fake link (e.g. `https://github.com/fake-user/private-repo-123`). It is rejected.
3. Enter a valid public repo (e.g. `https://github.com/torvalds/linux`) and submit.
4. Switch user to **Sarah Ibrahim (Mentor)** → go to **Review Queue** (`/reviews`).
5. Choose **"Request Revision"** and add feedback: *"Please add input validation and error handling."*
6. Switch back to **Ahmed Osman (Learner)** → return to `/project/topic-1`.
7. You will see the **Mentor Revision Remarks Callout** (amber) displaying Sarah's remarks above the resubmission form.

### 3. Direct Escalation to Teacher
1. On the project page (`/project/topic-1`), click **"Disagree & Request Teacher Review"**.
2. Switch user to **Dr. Tariq Ahmed (Teacher)**.
3. In the Teacher Hub (`/teacher`) or Review Queue (`/reviews`), open the **Escalated** filter tab.
4. The instructor can assign a mentor (`FR-9.1`) or resolve the escalation directly (`Complete` or `Revision Requested`).

### 4. Offline Session Expiry (`FR-12.1`)
1. Go to the login page (`/login`).
2. Click **"⚡ Simulate Session Expiry While Offline (FR-12.1)"**.
3. A purple banner appears: *"Session expired while offline. Your progress is safely preserved in queue."*
4. Sign in again. The queue automatically resumes syncing with **zero data loss**.

### 5. Data Privacy & Retention Consent (`NFR-14`)
1. Log in twice as a learner.
2. The **Data Retention & Privacy Notice (NFR-14)** modal appears asking whether to retain data beyond the demo period.
3. As the **Teacher** (`/teacher` → **Accounts** tab), click **"Purge Unconsented Demo Data"**.
4. The server deletes non-consented records and writes an immutable audit log entry in the **Audit Logs** tab.

---

## 🧪 Running the Automated E2E Simulation

The platform includes an automated end-to-end verification script testing all 5 SRS scenarios:

```bash
# Run from repository root
npm --prefix server run test:e2e
```
*Or directly inside the server folder:*
```bash
cd server
npm run test:e2e
```

### Simulation Output:
```
========================================================================
🇸🇩  HEMMA SUDAN — 5 CORE SRS WORKFLOW SCENARIOS E2E SIMULATION
========================================================================

📌 SCENARIO 1: Offline Learning, IDB Quiz Completion & Sync Conflict Resolution
   ✅ [Scenario 1] 1.1 Offline Quiz Synced to Server 
   ✅ [Scenario 1] 1.2 Idempotency / Duplicate Update Ignored 
   ✅ [Scenario 1] 1.3 Progress Conflict Resolution (FR-5.5) 
   ✅ [Scenario 1] 1.4 Content Conflict Detection (FR-5.6) 

📌 SCENARIO 2: Project Submission, Reachability Check & Revision Cycle
   ✅ [Scenario 2] 2.1 Format Validation Rejects Non-GitHub URL 
   ✅ [Scenario 2] 2.2 Valid Public Repo Validated (FR-6.3) 
   ✅ [Scenario 2] 2.3 Learner Submits Attempt #1 
   ✅ [Scenario 2] 2.4 Mentor Requests Revision with Remarks (FR-7) 
   ✅ [Scenario 2] 2.5 Learner Sees Revision Remarks Callout 
   ✅ [Scenario 2] 2.6 Learner Submits Attempt #2 (Multi-Attempt) 
   ✅ [Scenario 2] 2.7 Mentor Approves & Marks Complete 

📌 SCENARIO 3: Direct Escalation Workflow & Teacher Review Assignment
   ✅ [Scenario 3] 3.1 Submission Created for Escalation Test 
   ✅ [Scenario 3] 3.2 Learner Requests Teacher Review (FR-10.2) 
   ✅ [Scenario 3] 3.3 Teacher Views in Escalated Filter Queue (FR-11.2) 
   ✅ [Scenario 3] 3.4 Teacher Assigns Reviewer (FR-9.1) 
   ✅ [Scenario 3] 3.5 Teacher Resolves Escalation Directly 

📌 SCENARIO 4: Session Expiry While Offline (Alternative 3: 401 Re-Auth)
   ✅ [Scenario 4] 4.1 Server Detects Expired Session and Returns 401 
   ✅ [Scenario 4] 4.2 Learner Re-authenticates (Session Refreshed) 
   ✅ [Scenario 4] 4.3 Queue Successfully Synced After Re-auth (0 Loss) 

📌 SCENARIO 5: Data Retention Consent & Teacher Demo Purge (NFR-14)
   ✅ [Scenario 5] 5.1 Learner Records Retention Consent 
   ✅ [Scenario 5] 5.2 Teacher Executes Purge of Non-Consented Data 
   ✅ [Scenario 5] 5.3 Audit Log Records Data Retention / Purge Operation 

========================================================================
🏁  SIMULATION SUMMARY: 22/22 STEPS PASSED (0 FAILURES)
========================================================================
```

---

## 🌐 Bilingual Architecture (RTL / LTR)

Hemma Sudan natively supports **English** and **Arabic (العربية)**:
- Switch language anytime using the **English / العربية** button in the navbar.
- The UI dynamically toggles `dir="rtl"` / `dir="ltr"` and re-aligns all grids, typography, and badges.
- **Forced LTR for Code Snippets:** All Python code samples, terminal commands, and GitHub URLs strictly maintain Left-to-Right orientation (`.ltr-forced`, `dir="ltr"`) even in Arabic mode to prevent code formatting corruption.

---

## ⚙️ Environment Variables Reference

### Backend (`server/.env`)
| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `5001` | Express server port |
| `NODE_ENV` | `development` | Runtime environment (`development` or `production`) |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/hemma_sudan` | PostgreSQL connection string |
| `LIBRETRANSLATE_URL` | `http://localhost:5000` | Optional local LibreTranslate instance |

### Frontend (`client/.env`)
| Variable | Default Value | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5001/api` | Base URL of the backend REST API |

---

## 📁 Project Structure

```
Hemma_Sudan/
├── README.md                          # Platform documentation & setup guide
├── client/                            # Frontend application (React 19 + Tailwind v4)
│   ├── .env.example                   # Client environment template
│   ├── package.json                   # Client dependencies and scripts
│   ├── index.html                     # Entry HTML & PWA manifest link
│   └── src/
│       ├── App.jsx                    # Route mapping & Provider tree
│       ├── context/
│       │   ├── AuthContext.jsx        # Auth, session expiry & retention state
│       │   ├── SyncContext.jsx        # Offline queue, backoff retry & staleness
│       │   └── LanguageContext.jsx    # Arabic/English i18n & RTL switcher
│       ├── pages/
│       │   ├── LessonsPage.jsx        # Offline-saved curriculum listing
│       │   ├── LessonDetailPage.jsx   # Interactive lessons & offline quizzes
│       │   ├── TopicProjectPage.jsx   # Capstone submissions & revision remarks
│       │   ├── LearnerDashboard.jsx   # Progress stats, badges & consent view
│       │   ├── ReviewsDashboard.jsx   # Mentor review queue with 5 filter tabs
│       │   ├── TeacherAdminPage.jsx   # Authoring, escalations & demo purge
│       │   └── LoginPage.jsx          # Re-auth prompt & demo accounts
│       ├── components/
│       │   ├── common/
│       │   │   ├── ConsentModal.jsx   # NFR-14 Data retention consent dialog
│       │   │   └── RevisionTimeline.jsx # Attempt history timeline
│       │   └── layout/
│       │       └── OfflineBanner.jsx  # Connection, quota & re-auth alerts
│       └── services/
│           ├── indexedDB.js           # Browser IndexedDB storage wrapper
│           └── api.js                 # Backend REST client with error typing
│
└── server/                            # Backend API (Express 5 + Node.js)
    ├── .env.example                   # Server environment template
    ├── package.json                   # Server dependencies & test:e2e script
    ├── index.js                       # Express app bootstrap & route registration
    ├── db.js                          # Database adapter with in-memory fallback
    ├── schema.sql                     # PostgreSQL relational schema
    ├── seed.js                        # Seed dataset for demo users & topics
    ├── test-api.js                    # Basic endpoint smoke test
    ├── test-e2e-scenarios.js          # Full 22-step E2E simulation suite
    └── routes/
        ├── auth.js                    # Login, registration & retention consent
        ├── curriculum.js              # Topics, lessons & translation drafts
        ├── submissions.js             # Project submit, reachability & feedback
        ├── sync.js                    # Idempotent sync & conflict resolution
        └── teacher.js                 # Mentor approvals, account resets & purge
```

---

## 🎓 Academic Context
This software was architected and developed for the **Software Architecture & Design (SAD)** course at **African Leadership University (ALU)** to address low-connectivity education resilience in Sudan.
