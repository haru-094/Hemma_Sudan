# 🇸🇩 Hemma Sudan (همة السودان)
> **Offline-Resilient Programming Learning & Mentorship Platform**  
> *A lightweight Progressive Web Application (PWA) designed to provide uninterrupted programming education and peer code mentorship even during prolonged internet blackouts and power disruptions.*

---

## 📌 Table of Contents
1. [Project Overview & Problem Solved](#-project-overview--problem-solved)
2. [Key Features](#-key-features)
3. [Prerequisites](#-prerequisites)
4. [Installation & Setup](#-installation--setup)
5. [Demo Accounts](#-demo-accounts)
6. [How to Use the Application](#-how-to-use-the-application)
7. [Project Directory & File Structure](#-project-directory--file-structure)

---

## 🌍 Project Overview & Problem Solved

### The Problem
In areas affected by conflict or severe infrastructure instability like Sudan, university and college students frequently endure **weeks or months of complete telecommunications blackouts** and intermittent power supply. Modern learning management systems (e.g., Canvas, Moodle, Coursera) depend on steady, continuous high-bandwidth internet connections; they freeze, fail to save progress, and lock students out when connectivity drops.

### The Solution
**Hemma Sudan** is an offline-first Progressive Web Application (PWA) built specifically to survive intermittent and zero-connectivity environments:
- **Cached Learning:** Students download lessons, code examples, and practice exercises onto their device during any brief window of connectivity.
- **Offline Practice & Quizzes:** Students continue reading lessons, writing Python code, and completing interactive quizzes fully offline. All answers and progress are safely stored locally in the browser's IndexedDB.
- **Zero-Loss Background Sync:** When internet access returns, the platform automatically syncs all queued progress to the backend server with duplicate protection.
- **Peer Code Review & Mentorship:** Students submit GitHub project repositories for asynchronous review by teaching assistants and mentors, with built-in revision requests and direct escalation to course leads.
- **Bilingual Interface:** Fully supports Arabic (RTL) and English (LTR), while strictly keeping code blocks, terminal commands, and repository URLs Left-to-Right (LTR) so formatting is never broken.

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
  When a mentor requests revisions on a project, a prominent revision callout displays the mentor's feedback and actionable remarks directly above the resubmission form, alongside a collapsible history of previous attempts.

- **🚨 Direct Escalation to Course Lead:**  
  If a submission is delayed or if a student disagrees with feedback, the student can escalate their project directly to the course teacher for formal review.

- **📊 Role-Based Dashboards & Review Queue:**  
  - **Learners:** Track module completion, view saved offline lessons, and submit capstone projects.
  - **Mentors:** Filter reviews across 5 dedicated tabs (*All*, *Pending Review*, *Revision Requested*, *Escalated*, *Completed*) with real-time counters.
  - **Teachers:** Manage lessons, approve Arabic translation drafts, assign reviewers, resolve escalations, and perform account maintenance.

- **🌐 English & Arabic with Code Isolation:**  
  One-click language toggle smoothly switches the layout between Arabic (Right-to-Left) and English (Left-to-Right). All code snippets, variable names, and repository URLs are strictly isolated in LTR format to prevent indentation corruption.

- **🌙 Native Low-Power Dark Mode:**  
  High-contrast, purpose-built dark theme designed to conserve OLED battery life and reduce eye fatigue during late-night offline study sessions.

- **📖 In-App Bilingual Help & Troubleshooting Guide (`/help`):**  
  Built-in guides for learners, offline PWA storage troubleshooting, mentor evaluation guidelines, and teacher administrative tooling.

- **🛠️ Module 0 Developer Tooling Setup (SRS 2.7):**  
  Step-by-step developer environment setup covering VS Code, Git configuration, and creating public GitHub repositories across Python, C++, and Java.

- **📋 Interactive Capstone Rubric & Starter Repositories:**  
  Transparent checklist of evaluation criteria displayed directly to learners and reviewers on capstone project pages.

- **🔒 Offline Project Submission Guard:**  
  Project submissions are explicitly gated offline with prominent "needs internet" status badges, ensuring only live submissions can be made.

- **⚡ Verified Concurrency & Latency:**  
  Benchmarked for 20+ concurrent learner sessions with server response latencies consistently under 10ms (well under the 2000ms threshold).

- **🔒 Data Privacy & Demo Retention Consent:**  
  Prompts returning students for consent to retain their data across sessions, and gives instructors the ability to purge temporary demonstration data with administrative audit logging.

---

## 💻 Prerequisites

To run this project locally, ensure you have the following installed:

- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (comes bundled with Node.js)
- **Web Browser**: Any modern browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari) with IndexedDB support.
- *(Optional)* **PostgreSQL**: `v14` or higher — *Note: PostgreSQL is completely optional. If a PostgreSQL instance is not detected, the backend automatically activates a built-in in-memory database store so the app runs out of the box without any database setup!*

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/haru-094/Hemma_Sudan.git
cd Hemma_Sudan
```

### 2. Set Up the Backend Server
Open a terminal and run:
```bash
cd server
npm install
cp .env.example .env
npm start
```
The backend server will start on **`http://localhost:5001`**.  
*(If PostgreSQL is not running, it will automatically log that in-memory fallback mode is active and continue running normally).*

### 3. Set Up the Frontend Client
Open a **second terminal tab** and run:
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
The frontend application will start on **`http://localhost:5173`**.

Open your browser and navigate to **`http://localhost:5173`**.

---


## 👥 Demo Accounts

The platform includes pre-configured demo accounts so you can test all roles immediately without registering:

| Role | Name | Email | Password | Access & Capabilities |
|---|---|---|---|---|
| **Learner** | Ahmed Osman | `ahmed.student@hemma.sd` | *any* | Browse lessons, take offline quizzes, submit GitHub capstones, request teacher review |
| **Mentor** | Sarah Ibrahim | `sarah.mentor@hemma.sd` | *any* | Review submissions for Topics 1 & 2, request revisions, approve projects |
| **Mentor** | Omar Farouk | `omar.mentor@hemma.sd` | *any* | Review submissions for Topics 2 & 3 (prefers Arabic UI) |
| **Mentor** | Mona Elhassan | `mona.mentor@hemma.sd` | *any* | Review submissions for Topic 1 |
| **Course Lead (Teacher)** | Dr. Tariq Ahmed | `teacher@hemma.sd` | *any* | Author lessons, approve translations, assign mentors, resolve escalations, purge demo data |

> 💡 **One-Click Login:** On the `/login` page, you can click any name under **"One-Click Demo Accounts"** to log in instantly. You can also switch users at any time using the user menu in the top-right corner of the navbar.

---

## 🎯 How to Use the Application

### 1. Offline Learning & Interactive Quizzes
1. Log in as **Ahmed Osman (Learner)** and navigate to **Lessons** (`/lessons`).
2. Open any lesson (e.g., *Variables, Expressions & Print Output*).
3. **Simulate Offline Mode:** Open your browser's Developer Tools (`F12` or `Cmd+Option+I` on Mac) → go to the **Network** tab → change the throttling dropdown from **"No throttling"** to **"Offline"** (or simply turn off your Wi-Fi).
4. An amber banner appears confirming you are offline.
5. Scroll down to the **Interactive Knowledge Check**, select your answers, and click **Submit Quiz Answers**.
6. The quiz scores your answers locally, displays feedback, and queues your completion in IndexedDB (`⏳ Pending` sync pill in the navbar).
7. Re-enable network connectivity in DevTools. The sync pill updates to **`✓ Synced`** automatically.

### 2. Capstone Project Submission & Mentor Revision
1. Go to **Capstones** (`/project/topic-1`).
2. Enter your GitHub repository link and an explanation of your solution.
3. Click **Submit for Mentor Review**. The system verifies that the repository exists and is publicly reachable.
4. Switch user to **Sarah Ibrahim (Mentor)** using the top-right menu and navigate to **Review Queue** (`/reviews`).
5. Use the filter tabs (*All*, *Pending Review*, *Revision Requested*, etc.) to find the submission.
6. Click **Review**, enter revision remarks (e.g., *"Please add error handling for invalid input"*), select **Request Revision**, and submit.
7. Switch back to **Ahmed Osman (Learner)** and return to `/project/topic-1`.
8. An amber **Mentor Revision Remarks Callout** appears right above the submission form with Sarah's feedback.

### 3. Direct Escalation to Teacher
1. While viewing your project on `/project/topic-1`, click **Disagree & Request Teacher Review**.
2. Enter your reason and confirm. The submission status transitions to **Escalated**.
3. Switch user to **Dr. Tariq Ahmed (Teacher)** and navigate to `/reviews` or `/teacher`.
4. Open the **Escalated** filter tab. The teacher can explicitly assign a mentor or click **Approve & Mark Complete** to resolve it directly.

### 4. Simulating Offline Session Expiry
1. Go to the **Login page** (`/login`).
2. Click **⚡ Simulate Session Expiry While Offline**.
3. A purple banner notifies the student that their session expired while offline, but all progress is preserved in local storage.
4. Click **Ahmed Osman** to sign back in. The session refreshes and pending progress syncs immediately with zero data loss.

### 5. Automated System Verification (E2E & Load Suites)
To automatically test all core flows (offline quiz sync, duplicate protection, reachability checks, mentor revisions, escalations, session expiry, and demo data purge) in a single run:
```bash
npm --prefix server run test:e2e
```

To run the automated (20 concurrent virtual learners) and (<2000ms response time) load benchmark:
```bash
npm --prefix server run test:load
```
All 22 verification steps will run in the terminal and output green checkmarks (`✅ PASS`).

---

## 📁 Project Directory & File Structure

```
Hemma_Sudan/
├── README.md                          # Main documentation and guide
│
├── client/                            # Frontend PWA (React 19 + Tailwind CSS v4 + Vite)
│   ├── .env.example                   # Environment configuration template
│   ├── index.html                     # Main HTML template with responsive viewport & fonts
│   ├── package.json                   # Client dependencies and npm scripts
│   ├── vite.config.js                 # Vite bundler configuration with Tailwind plugin
│   │
│   ├── public/                        # Static assets, icons, and manifest
│   │   ├── favicon.ico                # Browser tab icon
│   │   └── manifest.json              # PWA installation manifest
│   │
│   └── src/                           # Frontend source code
│       ├── App.jsx                    # Root component with routing and global providers
│       ├── main.jsx                   # React DOM application mount point
│       ├── index.css                  # Global styles, Tailwind directives, and font utilities
│       │
│       ├── context/                   # Global React state management
│       │   ├── AuthContext.jsx        # User login, session expiry tracking & retention consent
│       │   ├── SyncContext.jsx        # Offline queue, exponential retry backoff & sync status
│       │   ├── ThemeContext.jsx       # Native light/dark mode preference state
│       │   └── LanguageContext.jsx    # Arabic/English localization and RTL/LTR direction toggle
│       │
│       ├── pages/                     # Main user views and screens
│       │   ├── LandingPage.jsx        # Public welcome page with platform overview & modules
│       │   ├── LoginPage.jsx          # Login form, session expiry warning & 1-click demo accounts
│       │   ├── RegisterPage.jsx       # Learner registration with age confirmation check
│       │   ├── LessonsPage.jsx        # Curriculum module listing with offline-saved badges
│       │   ├── LessonDetailPage.jsx   # Lesson content, code snippets & offline interactive quiz
│       │   ├── TopicProjectPage.jsx   # Project submission, reachability check & revision callout
│       │   ├── LearnerDashboard.jsx   # Student overview, saved lessons, completed capstones & consent
│       │   ├── ReviewsDashboard.jsx   # Mentor review queue with 5 filter tabs & assignment controls
│       │   ├── TeacherAdminPage.jsx   # Course lead hub for authoring, escalations & demo data purge
│       │   └── HelpPage.jsx           # Bilingual in-app documentation & offline troubleshooting
│       │
│       ├── components/                # Reusable UI components
│       │   ├── common/
│       │   │   ├── ConsentModal.jsx   # Data retention consent modal dialog
│       │   │   ├── GithubIcon.jsx     # SVG GitHub brand icon
│       │   │   ├── RevisionTimeline.jsx # Visual timeline tracking submission attempts & feedback
│       │   │   ├── StatusBadge.jsx    # Colored badges for submission and sync statuses
│       │   │   └── UnsupportedBrowser.jsx # Legacy browser warning dialog (Chrome <115, Safari <16)
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
    ├── test-api.js                    # Basic HTTP route smoke test
    ├── test-e2e-scenarios.js          # Complete 22-step automated end-to-end scenario test suite
    │
    └── routes/                        # Express API route controllers
        ├── auth.js                    # User login, registration, and retention consent endpoints
        ├── curriculum.js              # Topics, lessons, and machine translation draft generation
        ├── submissions.js             # Project submission, GitHub reachability check & review feedback
        ├── sync.js                    # Idempotent progress synchronization & conflict resolution
        └── teacher.js                 # Mentor permissions, manual account resets & demo data purge
```
