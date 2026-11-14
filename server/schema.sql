-- Hemma Sudan Database Schema

-- Enable UUID extension for PostgreSQL if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('teacher', 'mentor', 'learner')),
    language VARCHAR(10) DEFAULT 'en',
    -- Learner specific fields (inheritance)
    university VARCHAR(255),
    age_confirmed BOOLEAN DEFAULT FALSE,
    -- Teacher specific fields
    course_title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TOPICS TABLE (Course modules managed by Teacher per UML Class Diagram)
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(64) PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    display_order INT NOT NULL DEFAULT 1,
    teacher_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. LESSONS TABLE (Units within a topic with English & Arabic versions per UML Class Diagram)
CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(64) PRIMARY KEY,
    topic_id VARCHAR(64) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 1,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    notes_en TEXT NOT NULL,
    notes_ar TEXT NOT NULL,
    code_snippet TEXT NOT NULL,
    arabic_status VARCHAR(32) DEFAULT 'approved' CHECK (arabic_status IN ('draft', 'approved', 'pending')),
    recording_link TEXT, -- External Zoom / Google Meet recording link
    is_published BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TOPIC QUIZZES TABLE (Self-assessment knowledge check before projects)
CREATE TABLE IF NOT EXISTS topic_quizzes (
    id VARCHAR(64) PRIMARY KEY,
    topic_id VARCHAR(64) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of questions, options, correctIndex, explanation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TOPIC ASSIGNMENTS TABLE (Capstone module assignments per topic)
CREATE TABLE IF NOT EXISTS topic_assignments (
    id VARCHAR(64) PRIMARY KEY,
    topic_id VARCHAR(64) NOT NULL UNIQUE REFERENCES topics(id) ON DELETE CASCADE,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    prompt_en TEXT NOT NULL,
    prompt_ar TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MENTOR APPROVAL TABLE (Teacher-approved mentor permissions by topic)
CREATE TABLE IF NOT EXISTS mentor_approvals (
    id VARCHAR(64) PRIMARY KEY,
    mentor_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(64) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_mentor_topic UNIQUE (mentor_id, topic_id)
);

-- 7. SUBMISSIONS TABLE (GitHub repository links + attempts per UML Class Diagram & State Machine)
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(64) PRIMARY KEY,
    topic_id VARCHAR(64) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    assignment_id VARCHAR(64) REFERENCES topic_assignments(id) ON DELETE SET NULL,
    learner_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    github_link TEXT NOT NULL,
    explanation TEXT NOT NULL,
    attempt_no INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL DEFAULT 'submitted' CHECK (
        status IN ('submitted', 'under_review', 'feedback_given', 'revision_requested', 'escalated', 'complete')
    ),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. REVIEW ASSIGNMENTS TABLE (Assigning mentor to submission per UML Class Diagram)
CREATE TABLE IF NOT EXISTS review_assignments (
    id VARCHAR(64) PRIMARY KEY,
    submission_id VARCHAR(64) NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    mentor_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    state VARCHAR(32) DEFAULT 'assigned'
);

-- 9. FEEDBACKS TABLE (Comments & revisions from mentors/teachers per UML Class Diagram)
CREATE TABLE IF NOT EXISTS feedbacks (
    id VARCHAR(64) PRIMARY KEY,
    submission_id VARCHAR(64) NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    author_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    kind VARCHAR(32) NOT NULL CHECK (kind IN ('comment', 'revision_request', 'escalation_resolution')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. PROGRESS RECORDS TABLE (Offline idempotent sync queue)
CREATE TABLE IF NOT EXISTS progress_records (
    id VARCHAR(64) PRIMARY KEY,
    update_id VARCHAR(128) NOT NULL UNIQUE, -- Unique client-generated ID for duplicate protection
    learner_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id VARCHAR(64) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'completed',
    last_position INT DEFAULT 100,
    client_time TIMESTAMP WITH TIME ZONE NOT NULL,
    sync_state VARCHAR(32) NOT NULL DEFAULT 'synced',
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. AUDIT LOGS TABLE (Records timestamps for mentor grant/revoke & manual account resets)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    action VARCHAR(64) NOT NULL, -- 'MENTOR_APPROVED', 'MENTOR_REVOKED', 'MANUAL_ACCOUNT_RESET'
    performed_by VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

