# 🇸🇩 Hemma Sudan (همة السودان)
> **Offline-Resilient Programming Learning & Mentorship Platform**  
> *A lightweight Progressive Web Application (PWA) designed to provide uninterrupted programming education and peer code mentorship even during prolonged internet blackouts and power disruptions.*


1. Live App: https://hemma-sudan.vercel.app/
2. Demo video: https://youtu.be/bzkCZBeCBNE

---

## 📌 Table of Contents
1. [Project Overview & Problem Solved](#-project-overview--problem-solved)
2. [Key Features](#-key-features)
3. [Prerequisites](#-prerequisites)
4. [Step-by-Step Local Setup Guide](#-step-by-step-local-setup-guide)
   - [1. Clone the Repository](#1-clone-the-repository)
   - [2. Configure & Run Backend Server](#2-configure--run-backend-server)
   - [3. Configure & Run Frontend Client](#3-configure--run-frontend-client)
   - [4. Verify Local Installation](#4-verify-local-installation)
5. [Database Engine (Dual-Mode: PostgreSQL & In-Memory Fallback)](#-database-engine-dual-mode)
6. [Cloud Deployment Guide](#-cloud-deployment-guide)
   - [Deploying Backend on Render](#deploying-backend-on-render)
   - [Deploying Frontend on Vercel](#deploying-frontend-on-vercel)
7. [Authentication, User Roles & Demo Accounts](#-authentication-user-roles--demo-accounts)
   - [Test Accounts & Credentials Table](#test-accounts--credentials-table)
   - [Teacher Account Seeding & Role Lockdown](#teacher-account-seeding--role-lockdown)
   - [Demo Mode vs Production Mode](#demo-mode-vs-production-mode)
   - [Resetting Demo State](#resetting-demo-state)
8. [Automated Verification & Testing](#-automated-verification--testing)
9. [Feature Walkthrough & How to Use](#-feature-walkthrough--how-to-use)
10. [Project Directory & File Structure](#-project-directory--file-structure)

---

## 🌍 Project Overview & Problem Solved

### The Problem
In areas affected by conflict or severe infrastructure instability like Sudan, university and college students frequently endure **weeks or months of complete telecommunications blackouts** and intermittent power supply. Modern learning management systems (e.g., Canvas, Moodle, Coursera) depend on continuous, high-bandwidth internet connections; they freeze, fail to save progress, and lock students out when connectivity drops.

### The Solution
**Hemma Sudan** is an offline-first Progressive Web Application (PWA) built specifically to survive intermittent and zero-connectivity environments:
- **Cached Learning:** Students download lessons, code examples, and practice exercises onto their device during any brief window of connectivity.
- **Offline Practice & Quizzes:** Students continue reading lessons, writing code, and completing interactive quizzes fully offline. All answers and progress are safely stored locally in the browser's IndexedDB.
- **Zero-Loss Background Sync:** When internet access returns, the platform automatically syncs all queued progress to the backend server with duplicate protection and exponential backoff retry.
- **Peer Code Review & Mentorship:** Students submit public GitHub project repositories for asynchronous review by accredited mentors, with built-in revision requests and direct escalation to course instructors.
- **Bilingual Interface:** Fully supports Arabic (RTL) and English (LTR), while strictly keeping code blocks, terminal commands, and repository URLs Left-to-Right (LTR) so syntax is never broken.

---

## ✨ Key Features

- **📶 Offline-First Interactive Quizzes & Lessons:**  
  Lessons and quizzes can be saved locally with one click. Quizzes can be solved offline with instant local scoring, feedback, and score retention.

- **🔄 Automatic Background Sync:**  
  Queued progress is automatically synchronized as soon as the device reconnects to the internet. If a connection drops midway, retry exponential backoff (5s, 15s, 60s) ensures no data is dropped.

- **🛡️ Offline Session Safety:**  
  If a student's session expires while they are offline, their queued progress remains safely preserved in local storage. Once they sign in again, synchronization resumes automatically with zero lost work.

- **🔍 Public GitHub Repository Verification:**  
  Validates that student project submission links point to valid, publicly accessible GitHub repositories before accepting submissions.

- **💬 Mentor Revision Remarks & History:**  
  When a mentor requests revisions on a project, an amber revision callout displays the mentor's feedback directly above the resubmission form, alongside a collapsible history of previous attempts.

- **🚨 Direct Escalation to Course Lead:**  
  If a submission is delayed or if a student disagrees with feedback, the student can escalate their project directly to the course teacher for formal review.

- **📊 Role-Based Dashboards & Review Queue:**  
  - **Learners:** Track module completion, view saved offline lessons, and submit capstone projects.
  - **Mentors:** Filter reviews across 5 dedicated tabs (*All*, *Pending Review*, *Revision Requested*, *Escalated*, *Completed*) with real-time counters.
  - **Teachers:** Manage lessons, approve Arabic translation drafts, accredit mentors, resolve escalations, and reset live demo state.

- **🌐 English & Arabic with Code Isolation:**  
  One-click language toggle smoothly switches layout between Arabic (Right-to-Left) and English (Left-to-Right). All code snippets, variable names, and repository URLs are strictly isolated in LTR format.

- **🌙 Native Low-Power Dark Mode:**  
  High-contrast, purpose-built dark theme designed to conserve OLED battery life and reduce eye fatigue during late-night offline study sessions.

- **📖 In-App Bilingual Help & Troubleshooting Guide (`/help`):**  
  Built-in guides for learners, offline PWA storage troubleshooting, mentor evaluation guidelines, and teacher administrative tooling.

- **🛠️ Module 0 Developer Tooling Setup:**  
  Step-by-step developer environment setup covering VS Code, Git configuration, and creating public GitHub repositories across Python, C++, and Java.

- **📋 Interactive Capstone Rubric & Starter Repositories:**  
  Transparent checklist of evaluation criteria displayed directly to learners and reviewers on capstone project pages.

- **🔒 Offline Project Submission Guard:**  
  Project submissions are explicitly gated offline with prominent "needs internet" status badges, ensuring only live submissions can be made.

- **⚡ High Concurrency & Low Latency:**  
  Benchmarked for 20+ concurrent learner sessions with server response latencies consistently under 10ms.

- **🔒 Data Privacy & Demo Retention Consent:**  
  Prompts returning students for consent to retain their data across sessions, and gives instructors the ability to purge temporary demonstration data with administrative audit logging.

---

## 💻 Prerequisites

Ensure you have the following installed on your computer before starting:

| Tool | Minimum Version | Installation Link / Command |
|---|---|---|
| **Git** | `v2.20+` | `git --version` ([Download Git](https://git-scm.com/)) |
| **Node.js** | `v18.0.0+` (v20 or v22 LTS recommended) | `node --version` ([Download Node.js](https://nodejs.org/)) |
| **npm** | `v9.0.0+` | `npm --version` (bundled with Node.js) |
| **Web Browser** | Any modern browser | Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari |
| *(Optional)* **PostgreSQL** | `v14+` | Optional: system uses automatic in-memory fallback if absent |

---

## 🚀 Step-by-Step Local Setup Guide

Follow these instructions to get both the backend API and frontend client running on your local machine.

### 1. Clone the Repository

Open your terminal or command prompt:

```bash
git clone https://github.com/haru-094/Hemma_Sudan.git
cd Hemma_Sudan
```

---

### 2. Configure & Run Backend Server

The backend runs on **Node.js** and **Express 5**.

1. Navigate into the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your environment configuration file by copying the template:
   ```bash
   cp .env.example .env
   ```

4. *(Optional)* Inspect or customize `server/.env`:
   ```ini
   PORT=5001
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hemma_sudan
   LIBRETRANSLATE_URL=http://localhost:5000

   # Teacher Account Seeding (seeded automatically on startup if not present)
   TEACHER_EMAIL=teacher@hemma.sd
   TEACHER_PASSWORD=TeacherSecurePass2026!
   TEACHER_NAME=Dr. Tariq Ahmed

   # Demo Mode Toggle (true enables 1-click login shortcuts and relaxed passwords for evaluation)
   DEMO_MODE=true
   ```
   > ℹ️ **Database Note:** You do **not** need to install or start PostgreSQL. If PostgreSQL is not found at `DATABASE_URL`, the server will seamlessly boot into in-memory fallback mode!

5. Start the backend server:
   ```bash
   npm start
   ```
   *Or for development with automatic restart: `npm run dev`*

   You should see output similar to:
   ```text
   [DB] In-memory database initialized with demo data
   [Auth] Seeded default teacher account: teacher@hemma.sd
   [Hemma Sudan] API server running on port 5001
   ```

6. Verify that the backend is responding by opening a new terminal tab and testing:
   ```bash
   curl http://localhost:5001/health
   ```
   Expected response: `{"status":"ok","timestamp":"...","uptime":...}`

---

### 3. Configure & Run Frontend Client

The frontend is a **React 19 + Vite** Single Page Application styled with **Tailwind CSS v4**.

1. In a **new terminal window or tab**, navigate into the `client` directory:
   ```bash
   cd Hemma_Sudan/client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create your frontend environment configuration file:
   ```bash
   cp .env.example .env
   ```

4. Verify that `client/.env` points to your backend:
   ```ini
   VITE_API_URL=http://localhost:5001/api
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

   You should see:
   ```text
     VITE v8.3.4  ready in 180 ms

     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
   ```

---

### 4. Verify Local Installation

1. Open your browser and navigate to **`http://localhost:5173`**.
2. Click **Sign In** in the top navigation bar.
3. If `DEMO_MODE=true`, you will see **One-Click Demo Accounts** ready for immediate testing.
4. Click any demo account (e.g., **Ahmed Osman**) or log in using credentials from the table below.

---

## 🗄️ Database Engine (Dual-Mode)

Hemma Sudan features a resilient **dual-engine database adapter** located in `server/db.js`:

1. **PostgreSQL Mode:**  
   If a valid `DATABASE_URL` is configured and a PostgreSQL instance is reachable, the backend executes SQL queries against PostgreSQL using the connection pool. On first run, it initializes tables from `server/schema.sql` and seeds baseline curriculum and users.

2. **In-Memory Fallback Mode:**  
   If PostgreSQL is offline, unconfigured, or connection times out, the backend **automatically switches to the in-memory store** (`memoryDb`) without crashing. All CRUD operations (users, topics, lessons, quizzes, submissions, reviews, translation drafts) execute seamlessly in memory.

To seed or re-seed PostgreSQL manually when running a local database:
```bash
npm --prefix server run seed
```

---

## ☁️ Cloud Deployment Guide

### Deploying Backend on Render

1. Create a new account or log into [Render](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository (`Hemma_Sudan`).
4. Configure the Web Service settings:
   - **Name:** `hemma-sudan-api` (or your preferred name)
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. In the **Environment Variables** section, add:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Production environment flag |
   | `PORT` | `5001` | Express listening port |
   | `DEMO_MODE` | `true` | Set `true` for evaluation demos; `false` for strict production |
   | `TEACHER_EMAIL` | `teacher@hemma.sd` | Official teacher email |
   | `TEACHER_PASSWORD` | `TeacherSecurePass2026!` | Official teacher password |
   | `TEACHER_NAME` | `Dr. Tariq Ahmed` | Teacher display name |
   | *(Optional)* `DATABASE_URL` | *postgres connection string* | If attaching Render PostgreSQL; otherwise runs in-memory |
6. Click **Deploy Web Service**.
7. Note your public backend URL (e.g. `https://hemma-sudan-api.onrender.com`). Verify it with:
   ```bash
   curl https://hemma-sudan-api.onrender.com/health
   ```
   > ⏱️ **Cold Start Note:** On Render's free tier, services spin down after 15 minutes of inactivity. The first request after sleep may take ~45–60 seconds to wake up.

---

### Deploying Frontend on Vercel

1. Create an account or log into [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository (`Hemma_Sudan`).
4. Configure the Project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click *Edit* and select **`client`**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. In the **Environment Variables** section, add:
   - `VITE_API_URL` = `https://hemma-sudan-api.onrender.com/api`  
     *(Replace with your actual Render service URL, ensuring it ends with `/api`)*
6. Click **Deploy**.
7. Client single-page routing is pre-configured via `client/vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
   This prevents `404 Not Found` errors when refreshing routes such as `/lessons`, `/reviews`, or `/teacher`.

---

## 👥 Authentication, User Roles & Demo Accounts

### Test Accounts & Credentials Table

| Role | Name | Email | Password | Assigned Scope / Permissions |
|---|---|---|---|---|
| **Course Lead (Teacher)** | Dr. Tariq Ahmed | `teacher@hemma.sd` | `TeacherSecurePass2026!` | Author curriculum, approve Arabic translations, accredit mentors, resolve escalations, reset live demo |
| **Accredited Mentor** | Sarah Ibrahim | `sarah.mentor@hemma.sd` | `DemoPass2026!` | Review student GitHub projects for Topic 1 & Topic 2, request revisions, approve submissions |
| **Accredited Mentor** | Omar Farouk | `omar.mentor@hemma.sd` | `DemoPass2026!` | Review student GitHub projects for Topic 2 & Topic 3 (Arabic interface preference) |
| **Learner** | Ahmed Osman | `ahmed.student@hemma.sd` | `DemoPass2026!` | Take lessons & offline quizzes, sync progress, submit GitHub capstones, request teacher review |
| **Learner (Ready to Accredit)** | Mona Elhassan | `mona.mentor@hemma.sd` | `DemoPass2026!` | Starts as a learner; ready to demonstrate live mentor accreditation from the Teacher Hub |

---

### Teacher Account Seeding & Role Lockdown

Security and role assignment follow strict boundaries:
- **No Self-Registration for Teachers or Mentors:** The public registration page (`/register`) strictly sets role to `learner`. Any client attempt to inject elevated roles is completely ignored by the backend API.
- **Seeded via Server Environment:** The teacher account is created automatically on server startup using `TEACHER_EMAIL`, `TEACHER_PASSWORD`, and `TEACHER_NAME`. Plain text passwords are never stored; passwords are salted and hashed with `bcryptjs`.
- **Mentor Accreditation:** Learners become mentors exclusively when the course teacher explicitly grants them topic accreditation via the **Mentor Accreditation** panel on the Teacher Hub (`/teacher`).

---

### Demo Mode vs Production Mode

The platform behavior is controlled by `DEMO_MODE` in server environment variables:

| Feature | `DEMO_MODE=true` (Default / Demo) | `DEMO_MODE=false` (Production) |
|---|---|---|
| **One-Click Demo Login** | Visible on `/login` for rapid testing | Completely hidden |
| **Session Simulation Buttons** | Enabled (simulate offline expiry, simulate slow network) | Disabled / Hidden |
| **Password Validation** | Exact passwords or demo shortcuts accepted | Strict `bcryptjs` password validation required |
| **Teacher Account Login** | `TeacherSecurePass2026!` | `TeacherSecurePass2026!` |
| **New Learner Registration** | Saved and hashed with bcrypt | Saved and hashed with bcrypt |

---

### Resetting Demo State

When conducting live demonstrations or recordings, you can reset all project submissions, progress records, mentor assignments, and lesson statuses back to the clean baseline at any time:

- **From the Browser UI:**  
  Log in as **Dr. Tariq Ahmed (Teacher)** → Navigate to **Teacher Hub** (`/teacher`) → Click the purple **⚡ Reset Live Demo** button.
- **From the Command Line:**  
  Run in terminal:
  ```bash
  npm --prefix server run demo:reset
  ```
- **Via HTTP REST API:**  
  Send a POST request:
  ```bash
  curl -X POST https://your-server-url/api/demo/reset
  ```

---

## 🧪 Automated Verification & Testing

The repository includes a comprehensive automated test suite covering unit API tests, end-to-end scenario simulations, and concurrency load benchmarks.

### 1. Backend Route Smoke Test
Tests API routes for health, authentication, topics, and lesson retrieval:
```bash
npm --prefix server run test
```

### 2. Comprehensive End-to-End Simulation Test (26 Steps)
Runs through the complete multi-user lifecycle:
- Seed validation and teacher account verification
- Learner lesson completion and offline progress queuing
- Idempotent background synchronization and duplicate protection
- Public GitHub repository reachability check
- Mentor review submission, revision remarks, and timeline history
- Student escalation to course teacher
- Teacher escalation resolution and mentor accreditation
- Offline session expiry simulation and post-login sync recovery
- Data retention consent audit and demo state reset

```bash
npm --prefix server run test:e2e
```
Expected result: `26 passing steps, 0 failures (100% PASS)`.

### 3. Concurrency Load Benchmark
Simulates 20 concurrent virtual learners taking lessons, solving quizzes, and synchronizing progress simultaneously:
```bash
npm --prefix server run test:load
```
Expected result: `All 20 virtual user sessions completed successfully with average response times < 10ms`.

### 4. Client Code Quality & Build Verification
Validates ESLint rules and creates an optimized production bundle:
```bash
npm --prefix client run lint
npm --prefix client run build
```

---

## 🎯 Feature Walkthrough & How to Use

Follow these steps to demonstrate the core features of Hemma Sudan:

### Phase 1: Offline Learning & Knowledge Check
1. Sign in as **Ahmed Osman (Learner)**.
2. Go to **Lessons** (`/lessons`) and open **Variables, Expressions & Print Output**.
3. Toggle browser offline mode:
   - In Chrome/Firefox/Edge DevTools (`F12` / `Inspect`), open the **Network** tab and select **Offline** from the throttling dropdown. Or simply disconnect your Wi-Fi.
4. Notice the amber **Offline Mode** banner indicating the app is working locally.
5. Scroll down to the **Interactive Knowledge Check**, answer the questions, and click **Submit Quiz Answers**.
6. The quiz evaluates your score locally, provides immediate feedback, and displays the **`⏳ 1 Pending`** sync pill in the top navbar.
7. Restore network connection (switch back to **No throttling** or turn Wi-Fi on).
8. The sync indicator automatically updates to **`✓ Synced`** as the score is persisted to the backend.

### Phase 2: Capstone Project Submission & Mentor Review
1. While logged in as **Ahmed**, navigate to **Capstones** (`/project/topic-1`).
2. Enter a public GitHub repository URL (e.g. `https://github.com/octocat/Hello-World`) and project remarks.
3. Click **Submit for Mentor Review**. The system verifies that the GitHub repository is public and active before accepting.
4. Log out or switch user to **Sarah Ibrahim (Mentor)** via the user menu in the navbar.
5. Go to **Review Queue** (`/reviews`).
6. Notice the filter tabs (*All*, *Pending Review*, *Revision Requested*, *Escalated*, *Completed*) with real-time counters.
7. Click **Review** on Ahmed's submission, enter constructive revision remarks (e.g., *"Please add docstrings to all functions"*), select **Request Revision**, and click **Submit Review**.

### Phase 3: Revision Remarks & Teacher Escalation
1. Switch back to **Ahmed Osman (Learner)** and return to `/project/topic-1`.
2. Notice the amber **Mentor Revision Remarks Callout** displayed prominently right above the submission form with Sarah's comments.
3. Click **Disagree & Request Teacher Review**. Enter your justification and confirm.
4. The project status updates to **Escalated**.
5. Switch user to **Dr. Tariq Ahmed (Teacher)** and navigate to `/reviews` or `/teacher`.
6. Open the **Escalated** filter tab to see the submission.
7. As teacher, click **Review** and click **Approve & Mark Complete** to resolve the escalation directly.

### Phase 4: Curriculum Management & Translation Approval
1. While logged in as **Dr. Tariq Ahmed (Teacher)** on **Teacher Hub** (`/teacher`):
2. In the **Lesson Management** panel, locate Lesson 2 (*Conditionals, Branching & Decision Structures*), which is marked as **Draft Translation**.
3. Click **Approve Arabic Translation**. The badge changes to **Published**, making the translated content immediately live for Arabic-speaking learners.
4. In the **Mentor Accreditation** panel, promote **Mona Elhassan** by assigning her accreditation for **Topic 1**.

### Phase 5: Bilingual Support & Dark Mode
1. Click the language toggle button (**عربي / English**) in the navigation bar.
2. The entire layout transitions to Right-to-Left (RTL) Arabic, while code blocks, terminal snippets, and repository URLs strictly remain Left-to-Right (LTR).
3. Click the theme toggle icon in the navbar to switch between **Dark Mode** (OLED battery conservation) and **Light Mode**.

---

## 📁 Project Directory & File Structure

```
Hemma_Sudan/
├── README.md                          # Main documentation and installation guide
├── render.yaml                        # Infrastructure-as-code specification for Render
│
├── client/                            # Frontend PWA (React 19 + Vite + Tailwind CSS v4)
│   ├── .env.example                   # Environment configuration template
│   ├── index.html                     # HTML entry point with responsive meta tags & fonts
│   ├── package.json                   # Client dependencies and npm scripts
│   ├── vercel.json                    # Single-page application route rewrites for Vercel
│   ├── vite.config.js                 # Vite bundler configuration
│   │
│   ├── public/                        # Static assets, icons, and PWA manifest
│   │   ├── favicon.ico                # Application tab icon
│   │   └── manifest.json              # Progressive Web App installation manifest
│   │
│   └── src/                           # Frontend source code
│       ├── App.jsx                    # Root component with routing and global providers
│       ├── main.jsx                   # React DOM application mount point
│       ├── index.css                  # Global styling, Tailwind directives & font utilities
│       │
│       ├── context/                   # Global React state management
│       │   ├── AuthContext.jsx        # Authentication, session expiry & data retention consent
│       │   ├── SyncContext.jsx        # Offline queue, exponential retry backoff & sync status
│       │   ├── ThemeContext.jsx       # Native light/dark mode preference state
│       │   └── LanguageContext.jsx    # Arabic/English localization and RTL/LTR direction toggle
│       │
│       ├── pages/                     # Main user views and screens
│       │   ├── LandingPage.jsx        # Public welcome page with platform overview & curriculum
│       │   ├── LoginPage.jsx          # Login form, session expiry warning & demo shortcuts
│       │   ├── RegisterPage.jsx       # Learner registration with age confirmation check
│       │   ├── LessonsPage.jsx        # Curriculum module listing with offline-saved badges
│       │   ├── LessonDetailPage.jsx   # Lesson content, code snippets & offline interactive quiz
│       │   ├── TopicProjectPage.jsx   # Project submission, reachability check & revision callout
│       │   ├── LearnerDashboard.jsx   # Student overview, saved lessons & completed capstones
│       │   ├── ReviewsDashboard.jsx   # Mentor review queue with 5 filter tabs & assignment controls
│       │   ├── TeacherAdminPage.jsx   # Course lead hub for curriculum, escalations & demo reset
│       │   └── HelpPage.jsx           # Bilingual in-app documentation & offline troubleshooting
│       │
│       ├── components/                # Reusable UI components
│       │   ├── common/
│       │   │   ├── ConsentModal.jsx   # Data retention consent modal dialog
│       │   │   ├── GithubIcon.jsx     # SVG GitHub brand icon
│       │   │   ├── RevisionTimeline.jsx # Visual timeline tracking submission attempts & feedback
│       │   │   ├── StatusBadge.jsx    # Colored badges for submission and sync statuses
│       │   │   └── UnsupportedBrowser.jsx # Legacy browser warning dialog
│       │   ├── layout/
│       │   │   ├── Navbar.jsx         # Navigation bar with user switcher, language toggle & sync pill
│       │   │   ├── Footer.jsx         # Site footer with platform information
│       │   │   └── OfflineBanner.jsx  # Alerts for offline state, storage quota & session expiry
│       │   └── teacher/
│       │       └── LessonAuthoringModal.jsx # Modal for drafting new lessons with Arabic translation
│       │
│       ├── data/
│       │   └── mockData.js            # Initial curriculum topics, lessons, quizzes & demo submissions
│       │
│       └── services/
│           ├── api.js                 # Centralized HTTP client for backend REST API endpoints
│           └── indexedDB.js           # Browser IndexedDB wrapper for offline storage & sync queue
│
└── server/                            # Backend REST API (Node.js + Express 5)
    ├── .env.example                   # Server environment configuration template
    ├── package.json                   # Backend dependencies and test scripts
    ├── index.js                       # Express application initialization and route mounting
    ├── db.js                          # Database adapter with automated in-memory fallback store
    ├── schema.sql                     # Relational database schema definition (PostgreSQL)
    ├── seed.js                        # Database seeder for demo users and curriculum
    ├── reset-demo.js                  # CLI script to reset demo database state back to clean baseline
    ├── test-api.js                    # Basic HTTP route smoke test
    ├── test-e2e-scenarios.js          # Complete 26-step automated end-to-end scenario test suite
    │
    ├── routes/                        # Express API route controllers
    │   ├── auth.js                    # User login, registration, and retention consent endpoints
    │   ├── curriculum.js              # Topics, lessons, and translation draft generation
    │   ├── submissions.js             # Project submission, GitHub verification & review feedback
    │   ├── sync.js                    # Idempotent progress synchronization & conflict resolution
    │   └── teacher.js                 # Mentor accreditation, manual resets & demo state purge
    │
    └── test/                          # Additional test suites
        └── load-test.js              # 20 concurrent virtual users load benchmark
```

---

## 📄 License
This project is developed for educational and humanitarian purposes under the MIT License.
