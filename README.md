# NITSForge — Project Documentation

**Version:** 1.0.0 (Pre-Development Draft)
**Last Updated:** 2026-05-22
**Status:** 🟡 Planning Phase
**Tagline:** *Forge your path to the FE.*

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Objectives](#2-goals--objectives)
3. [Target Audience](#3-target-audience)
4. [Tech Stack](#4-tech-stack)
5. [System Architecture](#5-system-architecture)
6. [Features](#6-features)
   - 6.1 [Authentication & User System](#61-authentication--user-system)
   - 6.2 [Question Bank & Quiz Engine](#62-question-bank--quiz-engine)
   - 6.3 [AI-Generated Questions Mode](#63-ai-generated-questions-mode-sub-feature)
   - 6.4 [Progress Dashboard](#64-progress-dashboard)
   - 6.5 [Gamification System](#65-gamification-system)
   - 6.6 [AI Study Companion — Forge](#66-ai-study-companion--forge)
   - 6.7 [AI Supporting Features](#67-ai-supporting-features)
   - 6.8 [Bookmarks & Collections](#68-bookmarks--collections)
   - 6.9 [Answer History & Review](#69-answer-history--review)
   - 6.10 [Leaderboard](#610-leaderboard)
   - 6.11 [Themes & Personalization](#611-themes--personalization)
   - 6.12 [Notifications & Nudges](#612-notifications--nudges)
   - 6.13 [Study Planner](#613-study-planner-sub-feature)
   - 6.14 [Social / Share Features](#614-social--share-features-sub-feature)
7. [Page & Navigation Structure](#7-page--navigation-structure)
8. [Data Models](#8-data-models)
9. [AI Integration Design](#9-ai-integration-design)
10. [User Flows](#10-user-flows)
11. [Design System](#11-design-system)
12. [Backend Architecture](#12-backend-architecture)
13. [Development Roadmap](#13-development-roadmap)
14. [Project Conventions](#14-project-conventions)
15. [Open Questions & Decisions](#15-open-questions--decisions)

---

## 1. Project Overview

**NITSForge** is a full-featured, AI-powered, web-based reviewer application designed to help Filipino IT students prepare for the **Philippine National IT Standards (PhilNITS) FE (Fundamental IT Engineer) Examination**. It is built as a personal study tool that doubles as a shareable platform for classmates and peers.

NITSForge stands apart from basic reviewer sites through three pillars:

1. **Accuracy-first question bank** — A curated, fact-based question bank aligned to the official PhilNITS FE syllabus. Questions are verified; the AI never serves as the source of truth for exam content.
2. **AI-enhanced study experience** — Powered entirely by **Google Gemini**, using different models for different tasks: Gemini 1.5 Flash for fast, structured outputs and Gemini 1.5 Pro for richer, conversational interactions.
3. **Gamified progression system** — Badges, streaks, leaderboards, and achievement systems turn studying into an engaging loop rather than a chore.

NITSForge targets a v1 release that is feature-complete — no half-baked MVP. Post-v1 updates are expected to be bug fixes, question bank expansions, and minor UX improvements.

---

## 2. Goals & Objectives

### Primary Goals

- Provide a curated, accurate, and exam-aligned question bank covering all PhilNITS FE topic areas.
- Create a genuinely enjoyable and motivating study experience through gamification and AI support.
- Allow users to track detailed progress over time with persistent cloud-backed data.
- Support both logged-in users (full features) and guests (quick access with limited persistence).

### Secondary Goals

- Foster friendly competition among classmates via leaderboards and shareable stats.
- Provide AI-assisted study tools that enhance understanding without compromising factual accuracy.
- Keep the platform free to use and maintainable by a small team.

### Non-Goals

- NITSForge is **not** a replacement for official study materials or the JITEC/PhilNITS syllabi.
- The AI **does not** serve as the authoritative source for exam answers — only the curated bank does.
- NITSForge is **not** a paid product; it is a free, community-oriented tool.

---

## 3. Target Audience

| Audience | Description |
|---|---|
| **Primary** | 4th-year BS Computer Science / BS Information Technology students preparing for the PhilNITS FE exam |
| **Secondary** | 3rd-year students beginning early review |
| **Tertiary** | Working professionals reviewing for IT certification |
| **Guest Users** | Anyone wanting to try the app without committing to registration |

**Assumed technical level of users:** Non-technical (web app users). Only a browser is needed.

---

## 4. Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Vite + React + TypeScript** | Core framework — fast dev experience, type safety, component architecture |
| **Tailwind CSS** | Utility-first styling; supports multi-theme system via CSS variables |
| **React Router v6** | SPA routing |
| **Zustand** | Lightweight global state management |
| **Recharts** | Charts for dashboard (radar, line, bar, heatmap) |
| **Framer Motion** | Animations — badge unlocks, quiz transitions, gamification moments |
| **React Query (TanStack)** | Server state, caching, and sync with Supabase |

### Backend

| Technology | Purpose |
|---|---|
| **Supabase** | PostgreSQL database, Auth (email + OAuth), Row-Level Security, Realtime |
| **Node.js + Express** | Custom backend API for AI proxying, leaderboard logic, badge evaluation, and cron jobs |
| **Render** | Hosting for the Node.js backend |

### AI

| Provider | Model | Primary Use |
|---|---|---|
| **Google Gemini** | `gemini-1.5-pro` | Forge companion chat, weekly reports, study plan generation |
| **Google Gemini** | `gemini-1.5-flash` | Explanations, question generation, concept cards, post-session summaries |

> **Why two Gemini models?** Gemini 1.5 Flash is fast and cost-efficient — ideal for high-frequency, structured tasks. Gemini 1.5 Pro is more capable for open-ended, conversational, and reasoning-heavy tasks like the Forge companion and study planning. Both are available on Gemini's free tier, keeping NITSForge cost-free to operate at small scale.

### Hosting & Deployment

| Layer | Platform |
|---|---|
| **Frontend** | Vercel (with preview deploys on every PR) |
| **Backend API** | Render (Node.js server) |
| **Database + Auth** | Supabase (managed PostgreSQL) |
| **Static Assets** | Vercel Edge Network |

---

## 5. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
│                                                              │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ React + TS + TW │  │   Zustand    │  │  React Query   │  │
│  │   Components    │◄─│  Local State │  │  (Server Sync) │  │
│  └────────┬────────┘  └──────────────┘  └───────┬────────┘  │
│           │                                      │           │
└───────────┼──────────────────────────────────────┼───────────┘
            │                                      │
            ▼                                      ▼
┌──────────────────────┐              ┌────────────────────────┐
│  NITSForge Backend   │              │        Supabase        │
│  (Node.js on Render) │              │                        │
│                      │              │  • PostgreSQL DB        │
│  • Gemini AI Proxy   │◄────────────►│  • Auth (email/OAuth)  │
│  • Leaderboard API   │              │  • Row-Level Security  │
│  • Badge Evaluation  │              │  • Realtime (scores)   │
│  • Rate Limiting     │              └────────────────────────┘
│  • Cron Jobs         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Google Gemini API  │
│  Flash + Pro models  │
└──────────────────────┘
```

### Key Architectural Decisions

- **All AI calls are proxied through the backend** — The Gemini API key is never exposed to the client.
- **Supabase handles auth and data** — The backend complements Supabase, not replaces it.
- **Guest mode uses localStorage** — Guests get a local session; upon sign-up, local data is migrated to the cloud.

---

## 6. Features

---

### 6.1 Authentication & User System

#### Sign Up / Login

- Email + password registration via Supabase Auth
- OAuth login: **Google** and **GitHub**
- Email verification on registration
- Forgot password / password reset flow

#### Guest Mode

- One-click "Continue as Guest" on the landing page
- Full access to Practice Mode and Topic Drill
- Progress stored in localStorage only (no cloud sync)
- Persistent nudge to create an account (non-intrusive)
- On account creation: guest session data (answered questions, score history) is migrated to the new account

#### User Profile

- Display name + avatar (Supabase Storage or default generated avatar)
- Editable bio / course / year level (optional, used for leaderboard display)
- Account settings: change email, password, notification preferences
- Danger zone: delete account + all data

---

### 6.2 Question Bank & Quiz Engine

The core and most critical feature. All questions in this mode are manually curated and verified.

#### Question Metadata

Each question in the bank carries:

```
ID | Text | Options (A–D) | Correct Answer | Explanation |
Category | Difficulty | Source | Tags | Year (if from past exam)
```

#### Question Categories (PhilNITS FE Syllabus)

- Basic Theory of Information
- Computer Architecture
- Operating Systems
- Data Structures & Algorithms
- Databases
- Networking & Communication
- Information Security
- Software Engineering & Development
- Project Management
- System Strategy & Planning
- Discrete Mathematics & Probability

#### Quiz Modes

**Practice Mode** *(Primary mode)*
- Answer at your own pace
- Explanation revealed immediately after each answer
- Forge AI companion available for follow-up questions
- No time pressure; ideal for learning

**Exam Simulation Mode**
- Mirrors the real PhilNITS FE AM section: 80 questions, 150-minute timer
- No explanations shown until submission
- Auto-submits on timeout
- Results shown in a detailed post-exam breakdown
- Score mapped to a FE-style pass/fail threshold

**Topic Drill Mode**
- Select one or more categories to focus on
- Randomized questions from chosen topics only
- Ideal for targeting weak areas identified by the dashboard

**Quick Quiz Mode**
- 10 or 20 questions, randomly sampled across all topics
- For short study sessions (commute, break time)
- Results feed into the overall progress tracker

**Missed Questions Mode**
- Pulls from the user's answer history — only questions previously answered incorrectly
- Re-randomizes option order to prevent pattern memorization
- Marks improvement when a previously missed question is answered correctly

**Daily Challenge Mode**
- A new set of 10 curated questions every day (same for all users)
- Completing the daily challenge contributes to the streak system and earns bonus XP
- Leaderboard for daily challenge scores (daily reset)

#### Quiz Settings (per session)

- Number of questions (where applicable)
- Shuffle question order
- Shuffle answer options
- Show/hide timer (Practice Mode)
- Enable/disable Forge companion during quiz

---

### 6.3 AI-Generated Questions Mode *(Sub-feature)*

> **Important:** This mode is secondary to the fact-based question bank. It is clearly labeled as "AI-Generated" to set correct expectations. Users should treat these as supplemental practice, not authoritative exam prep.

**What it is:** A mode where Gemini Flash generates novel practice questions based on a selected topic and difficulty level. Questions are generated fresh each session.

**Flow:**
1. User navigates to "AI Practice" section (visually distinct from the main quiz)
2. Selects topic category and difficulty
3. Gemini Flash generates 5–15 questions in structured JSON format
4. User answers questions with the same quiz UI
5. After each answer, Gemini provides an explanation
6. Session is logged separately from fact-based history (labeled "AI Session")

**Guardrails:**
- Questions are generated with a strict prompt instructing Gemini to adhere to PhilNITS FE syllabus topics
- A disclaimer is shown before the session: *"These questions are AI-generated and may not reflect actual exam content. Always cross-reference with official materials."*
- Results from AI sessions are tracked separately and do not affect main progress metrics

**Why include it:**
- Provides virtually unlimited practice variety beyond the fixed question bank
- Useful for revisiting concepts from different angles
- Fills gaps while the human-curated question bank grows

---

### 6.4 Progress Dashboard

The user's central hub for understanding their study performance.

#### Overview Cards (top of dashboard)

- Total questions answered (fact-based only)
- Overall accuracy rate (%)
- Current study streak (days)
- Total XP earned
- Estimated exam readiness level (Beginner / Developing / Competent / Ready — score threshold-based)

#### Charts & Visualizations

- **Accuracy Over Time** — Line chart showing score % per session (last 30 sessions)
- **Category Breakdown** — Radar/spider chart showing performance across all 11 topic areas
- **Daily Activity Heatmap** — GitHub-style contribution graph showing study activity per day
- **Quiz Mode Distribution** — Donut chart showing how often each mode is used
- **Streak Calendar** — Monthly calendar view with streaks and daily challenge completions highlighted

#### Insights Panel

- "Your weakest category this week: [X]"
- "You've improved [Y]% in [Category] compared to last week"
- "You haven't practiced [Category] in [N] days"
- Computed server-side from raw stats — fast and always available without an AI call

#### AI Weekly Report Card *(Gemini Pro)*
- Generated once per week by Gemini Pro
- A 3–5 sentence personalized narrative summarizing the week's activity and suggested focus areas
- Displayed as a highlighted card at the top of the dashboard when new
- Cached in the database; not regenerated until the next week

---

### 6.5 Gamification System

Gamification is a first-class feature of NITSForge, designed to keep users engaged and reward consistent effort.

#### XP (Experience Points)

| Action | XP Earned |
|---|---|
| Answering a question correctly (Practice) | +5 XP |
| Answering incorrectly (Practice) | +1 XP (effort counts) |
| Completing a full Exam Simulation | +100 XP |
| Completing a Topic Drill session | +30 XP |
| Completing the Daily Challenge | +50 XP |
| Perfect score on any session | +25 XP bonus |
| Maintaining a 7-day streak | +75 XP bonus |
| First time answering a question | +2 XP bonus |

#### Rank Levels

| Level | Title | XP Required |
|---|---|---|
| 1 | Apprentice | 0 |
| 2 | Technician | 500 |
| 3 | Analyst | 1,500 |
| 4 | Specialist | 3,500 |
| 5 | Engineer | 7,000 |
| 6 | Senior Engineer | 13,000 |
| 7 | Architect | 22,000 |
| 8 | FE Master | 35,000 |

Level-up triggers a celebratory animation and an optional notification.

#### Badges & Achievements

**Streak Badges:**
- 🔥 `First Spark` — Complete your first daily challenge
- 🔥 `Week Warrior` — 7-day streak
- 🔥 `Fortnight Forge` — 14-day streak
- 🔥 `Unstoppable` — 30-day streak

**Performance Badges:**
- ⭐ `Sharpshooter` — 90%+ accuracy in a single session (min. 20 questions)
- ⭐ `Perfectionist` — 100% score in Exam Simulation
- ⭐ `Topic Master: [Category]` — 85%+ accuracy on 50+ questions in one category
- ⭐ `All-Rounder` — At least 70% accuracy across all 11 categories

**Volume Badges:**
- 📚 `First Step` — Answer your first question
- 📚 `Century` — Answer 100 questions
- 📚 `Millennium` — Answer 1,000 questions
- 📚 `Exam Ready` — Answer all unique questions in the fact-based bank at least once

**Mode Badges:**
- 🎯 `Simulation Veteran` — Complete 5 full Exam Simulations
- 🎯 `Drillmaster` — Complete 10 Topic Drill sessions
- 🎯 `Daily Regular` — Complete the Daily Challenge 15 times

**Social/Special Badges:**
- 🏆 `Leaderboard Legend` — Reach Top 3 on the all-time leaderboard
- 🤝 `Early Adopter` — Among the first 50 registered users

Badge unlocks trigger a full-screen modal animation. Newly unlocked badges are highlighted on the profile page.

#### Streaks

- A streak is maintained by completing at least 1 quiz session OR the Daily Challenge each calendar day
- Streak resets to 0 if a day is missed
- **Streak Freeze** — Users earn 1 Streak Freeze for every 7-day streak maintained. A Freeze can be used to skip one day without breaking the streak. Max 2 Freezes banked at a time.
- Streak count is displayed prominently on the dashboard and in the nav bar

---

### 6.6 AI Study Companion — Forge

**Forge** is NITSForge's persistent AI study companion, powered by **Gemini 1.5 Pro**.

Forge is accessed via a floating button in the bottom-right corner of the screen, expanding into a side panel chat.

#### What Forge Can Do

- Explain *why* a correct answer is correct (given the full question context)
- Clarify any concept related to PhilNITS FE topics in plain language
- Answer follow-up questions during or after a quiz (e.g., "What's the difference between TCP and UDP?")
- Provide encouragement and study tips
- Summarize a topic on request (e.g., "Give me a quick overview of normalization")
- Answer exam strategy questions (e.g., "How should I split my time in the AM section?")

#### What Forge Cannot Do

- Generate new exam questions (that's the AI Questions Mode)
- Override or change answers from the fact-based bank
- Browse the internet or access real-time information

#### Context Awareness

- **During a quiz:** Forge knows the current question, options, and whether the user has answered. If unanswered, Forge will not spoil the answer but can explain the concept. If answered, Forge can explain the correct answer fully.
- **On the Dashboard:** Forge can see the user's category breakdown and suggest what to focus on.
- **Idle:** Forge acts as a general PhilNITS FE study assistant.

#### Conversation Design

- Chat history persists within a session (resets on page reload for v1)
- Last 10 messages sent per API call to manage token usage
- Forge has a consistent personality: knowledgeable, encouraging, and concise
- Responses are streamed token by token for a natural feel
- A typing indicator is shown while Gemini is responding

---

### 6.7 AI Supporting Features

#### "Explain This" Button *(Gemini Flash)*

Available on every question in Practice Mode, Missed Questions Mode, and Answer History.

- One click sends the question + answer + user's choice to Gemini Flash
- Response streams inline below the question
- Fast and structured; designed for quick explanations
- Separate from Forge's conversational context

#### Post-Session AI Summary *(Gemini Flash)*

After every quiz session:
- Gemini Flash generates a short (4–6 sentence) debrief
- Highlights: best category, worst category, accuracy vs. past sessions, one specific tip
- Cached in the database per session; not regenerated on revisit

#### AI Concept Cards *(Gemini Flash, sub-feature)*

Accessible from the Topics page:
- User selects a category
- Gemini Flash generates a structured "Concept Card": key terms, core ideas, common pitfalls, and a quick memory trick
- Presented as a collapsible card alongside the category stats
- Cached per category (globally — same content for all users, saving API calls)

#### Weekly AI Report *(Gemini Pro)*

- Triggered once per week on the dashboard
- Gemini Pro receives: sessions this week, XP earned, categories practiced, accuracy trends, badges unlocked
- Returns a personalized narrative + 2–3 recommended focus areas for next week
- Stored in the database; displayed until replaced by next week's report

#### Study Plan Generation *(Gemini Pro, in Study Planner)*

- Gemini Pro generates a custom day-by-day study plan based on exam date, weak areas, and daily available hours
- Limited to 3 generations per user to keep usage reasonable
- Output stored in the database

---

### 6.8 Bookmarks & Collections

- Bookmark any question during a quiz or from answer history
- Bookmarks are organized into **Collections** (default: "All Bookmarks"; user can create named collections)
- Collections can be quizzed: "Start a session using this collection"
- Bookmarks synced to Supabase for logged-in users; localStorage for guests
- Bookmark icon visible on every question card; toggling is instant (optimistic UI)

---

### 6.9 Answer History & Review

A full chronological log of every question the user has answered.

- Filterable by: date range, category, correctness, quiz mode
- Each entry shows: question text (truncated), user's answer, correct answer, date, session
- Clicking a row expands to show the full question, all options, explanation, and "Explain This" button
- **Improvement Tracking:** For questions answered multiple times, a mini history indicator shows the answer trend (✓ ✗ ✓ ✓)
- Export to CSV (for logged-in users)

---

### 6.10 Leaderboard

#### All-Time Leaderboard

- Ranked by total XP
- Displays: rank, avatar, display name, rank title, total XP, badge count
- Top 3 entries highlighted (gold / silver / bronze)
- Current user's entry always visible even if outside top 20

#### Weekly Leaderboard

- Resets every Monday
- Ranked by XP earned in the current week
- Promotes active competition without permanently disadvantaging new users

#### Daily Challenge Leaderboard

- Resets every day
- Ranked by score on today's Daily Challenge (ties broken by completion time)

#### Friend Groups *(sub-feature)*

- Users can create or join a Group using a short invite code (e.g., `FORGE-7X2K`)
- Group leaderboard shows only members of that group
- Designed for classmates sharing the app
- Group admin can rename the group

---

### 6.11 Themes & Personalization

#### Theme System

Themes are applied globally via CSS variables. Each theme defines a full palette. Theme preference is saved to the user's profile (cloud) or localStorage (guest).

#### Built-In Themes

| Theme Name | Vibe | Base Colors |
|---|---|---|
| **Ember** *(default)* | Warm orange + gray; NITSForge brand feel | Orange `#F97316` + Slate `#64748B` |
| **Midnight** | Dark mode; deep navy + electric blue | `#0F172A` + `#3B82F6` |
| **Forest** | Calm, focused; deep greens + warm white | `#166534` + `#FEFCE8` |
| **Sakura** | Light and soft; pink + off-white | `#DB2777` + `#FFF1F2` |
| **Obsidian** | High-contrast dark; black + gold | `#000000` + `#F59E0B` |
| **Arctic** | Clean, minimal; white + ice blue | `#F0F9FF` + `#0EA5E9` |

> Special themes can be unlocked as rewards — e.g., an exclusive theme for reaching Level 8 "FE Master".

#### Other Personalization

- Font size preference (Normal / Large)
- Compact vs. Comfortable question layout
- Notification preferences (browser push, email)

---

### 6.12 Notifications & Nudges

- **Streak reminder:** Browser notification if user hasn't studied by 8 PM with an active streak (opt-in)
- **Daily Challenge available:** Morning notification when a new challenge is posted (opt-in)
- **Badge unlock:** In-app toast + optional browser notification
- **Weekly report ready:** In-app banner on the dashboard
- **Inactivity nudge:** Email after 3+ days inactive — *"Your streak is at risk!"* (via Supabase email)

All notifications are opt-in and configurable in Settings.

---

### 6.13 Study Planner *(Sub-feature)*

- User inputs target exam date and daily available study hours
- App displays a countdown to the exam date on the dashboard
- Gemini Pro generates a day-by-day study plan (which topics, when) based on current weak areas and available time
- Plan saved as a checklist; users check off completed days
- Completing plan days earns bonus XP
- Limited to 3 AI plan generations per user

---

### 6.14 Social / Share Features *(Sub-feature)*

- **Share a Score Card:** After a session, generate a shareable image card (score, accuracy, badges, QR code linking to NITSForge)
- **Share a Question:** Generate a shareable link to a specific question (guests can view and answer without logging in)
- **Refer a Friend:** Referral code system — when a classmate signs up using your code, both users earn bonus XP

---

## 7. Page & Navigation Structure

```
/                          → Landing Page (logged-out home)
/login                     → Login Page
/signup                    → Sign Up Page
/guest                     → Quick Guest Entry

/dashboard                 → Main Dashboard (logged-in home)
/quiz                      → Quiz Hub (mode selector)
/quiz/session              → Active Quiz Session
/quiz/results/:sessionId   → Post-Session Results + AI Summary
/quiz/ai                   → AI-Generated Questions Mode

/topics                    → Topics Overview (category cards with stats)
/topics/:category          → Category Deep-Dive (stats + concept card + drill)

/daily                     → Daily Challenge Page

/history                   → Answer History Log
/bookmarks                 → Bookmarks & Collections
/bookmarks/:collectionId   → Specific Collection + Quiz from Collection

/leaderboard               → Leaderboard (All-Time / Weekly / Daily / Groups)

/planner                   → Study Planner

/profile                   → Own Profile (stats, badges, settings)
/profile/:userId           → Public Profile (other users)

/settings                  → App Settings (theme, notifications, account)
/about                     → About NITSForge
```

### Navigation Layout

**Desktop:**
- Collapsible left sidebar: Logo, nav links, current streak, XP bar, Forge toggle
- Top bar: Page title, user avatar, notification bell

**Mobile:**
- Bottom navigation bar: Home, Quiz, Leaderboard, Profile
- Forge companion as floating action button (bottom-right)
- Hamburger menu for secondary pages

---

## 8. Data Models

### 8.1 Question *(Supabase: `questions` table)*

```typescript
interface Question {
  id: string;                         // e.g., "FE-DS-001"
  text: string;
  options: { A: string; B: string; C: string; D: string; };
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  category: QuestionCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  source?: string;                    // e.g., "FE 2019 Spring AM Q42"
  tags?: string[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
}
```

### 8.2 User Profile *(Supabase: `profiles` table)*

```typescript
interface Profile {
  id: string;                         // matches Supabase auth user id
  display_name: string;
  avatar_url?: string;
  bio?: string;
  course?: string;
  year_level?: number;
  total_xp: number;
  rank_level: number;
  current_streak: number;
  longest_streak: number;
  last_study_date?: string;
  streak_freezes_available: number;
  theme_preference: ThemeName;
  font_size_preference: 'normal' | 'large';
  notification_preferences: NotificationPrefs;
  referral_code: string;
  referred_by?: string;
  created_at: string;
}
```

### 8.3 Quiz Session *(Supabase: `quiz_sessions` table)*

```typescript
interface QuizSession {
  id: string;
  user_id: string;
  mode: 'practice' | 'exam-sim' | 'topic-drill' | 'quick-quiz'
       | 'missed' | 'daily-challenge' | 'ai-generated' | 'bookmark-collection';
  category_filter?: QuestionCategory;
  started_at: string;
  completed_at?: string;
  total_questions: number;
  correct_answers: number;
  accuracy_rate: number;
  xp_earned: number;
  ai_summary?: string;               // cached Gemini Flash post-session summary
  is_timed: boolean;
  time_limit_seconds?: number;
  time_spent_seconds?: number;
}
```

### 8.4 Session Answer *(Supabase: `session_answers` table)*

```typescript
interface SessionAnswer {
  id: string;
  session_id: string;
  user_id: string;
  question_id: string;
  selected_answer: 'A' | 'B' | 'C' | 'D' | null;
  is_correct: boolean;
  time_spent_ms?: number;
  answered_at: string;
}
```

### 8.5 User Badge *(Supabase: `user_badges` table)*

```typescript
interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
  is_featured: boolean;              // user can feature up to 3 badges on profile
}
```

### 8.6 Bookmark *(Supabase: `bookmarks` + `bookmark_collections` tables)*

```typescript
interface Bookmark {
  id: string;
  user_id: string;
  question_id: string;
  collection_id: string;
  created_at: string;
}

interface BookmarkCollection {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}
```

### 8.7 Daily Challenge *(Supabase: `daily_challenges` + `daily_challenge_entries` tables)*

```typescript
interface DailyChallenge {
  id: string;
  date: string;                      // YYYY-MM-DD, unique
  question_ids: string[];            // 10 curated question IDs
}

interface DailyChallengeEntry {
  id: string;
  user_id: string;
  challenge_id: string;
  score: number;
  completed_at: string;
  time_spent_seconds: number;
}
```

### 8.8 Study Planner *(Supabase: `study_plans` table)*

```typescript
interface StudyPlan {
  id: string;
  user_id: string;
  exam_date: string;
  daily_hours: number;
  ai_plan_content: string;           // Cached Gemini Pro plan (markdown)
  days: StudyPlanDay[];
  created_at: string;
}

interface StudyPlanDay {
  date: string;
  topics: QuestionCategory[];
  is_completed: boolean;
  xp_bonus_claimed: boolean;
}
```

### 8.9 Friend Group *(Supabase: `groups` + `group_members` tables)*

```typescript
interface Group {
  id: string;
  name: string;
  invite_code: string;              // e.g., "FORGE-7X2K"
  created_by: string;
  created_at: string;
}

interface GroupMember {
  group_id: string;
  user_id: string;
  joined_at: string;
}
```

---

## 9. AI Integration Design

### Model Assignment

| Feature | Model | Reason |
|---|---|---|
| Forge companion chat | `gemini-1.5-pro` | Best conversational quality for open-ended dialogue |
| "Explain This" button | `gemini-1.5-flash` | Fast, cheap, structured single-turn response |
| Post-Session Summary | `gemini-1.5-flash` | Short structured output, called frequently |
| AI-Generated Questions | `gemini-1.5-flash` | JSON output, reliable and fast |
| AI Concept Cards | `gemini-1.5-flash` | Structured content, cached globally |
| Weekly AI Report | `gemini-1.5-pro` | Nuanced narrative, called once per week |
| Study Plan Generation | `gemini-1.5-pro` | Complex reasoning, personalized output |

### All AI Calls Are Proxied

All Gemini API calls are routed through the NITSForge Node.js backend. The frontend never directly contacts the Gemini API. This ensures:
- The API key is never exposed to the client
- Centralized rate limiting and abuse prevention
- Response caching and logging at the proxy layer

### Context Passed per Feature

| Feature | Context Provided |
|---|---|
| Forge (during quiz) | System prompt, question + options + correct answer (if answered), user's answer, last 10 messages |
| Forge (on dashboard) | System prompt, user's top 3 weak categories |
| "Explain This" | Question text, options, correct answer, user's selected answer |
| Post-Session Summary | Mode, total questions, accuracy %, category breakdown, accuracy vs. historical avg |
| AI Question Generation | Syllabus category, difficulty, count, strict JSON output schema |
| AI Concept Card | Category name and scope description |
| Weekly Report | 7 days of sessions, XP earned, badges unlocked, current weak areas |
| Study Plan | Exam date, daily hours, current radar data, today's date |

### Prompt Design

**Forge System Prompt (draft):**
```
You are Forge, the AI study companion for NITSForge — a PhilNITS FE exam reviewer
for Filipino IT students. You are knowledgeable, encouraging, and concise.
Your role: help users understand concepts, clarify questions, and stay motivated.
Never invent exam questions. Never contradict the correct answer provided to you.
Use clear language appropriate for a 4th-year CS/IT student in the Philippines.
Keep responses under 250 words unless the user explicitly asks for more detail.
```

**AI Question Generation — Output Schema:**
```json
{
  "questions": [
    {
      "text": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct_answer": "B",
      "explanation": "..."
    }
  ]
}
```
Gemini is prompted to return only valid JSON matching this schema. The backend validates the schema before returning to the client.

### Rate Limiting

| Feature | Limit | Cache Strategy |
|---|---|---|
| Forge messages | 30 messages / user / day | No (conversational) |
| "Explain This" | 50 calls / user / day | 24h per question per user |
| Post-Session Summary | 1 per session | Permanent (per session ID) |
| AI Questions (generation) | 10 sessions / user / day | No |
| AI Concept Cards | Unlimited requests | Globally cached per category (24h) |
| Weekly Report | 1 per 7 days | Stored in DB until next week |
| Study Plan | 3 generations per user total | Stored in DB |

---

## 10. User Flows

### 10.1 First-Time User (Registered)

```
Land on Landing Page
        ↓
Click "Sign Up" → Email + Password or Google OAuth
        ↓
Email verification (if email signup)
        ↓
Onboarding: display name, course, exam date, theme
        ↓
Dashboard (empty state with "Start your first quiz!" CTA)
        ↓
Start Practice Mode → Answer questions → Explanations shown
        ↓
Complete session → Results page + AI Summary
        ↓
First badge unlocked: "First Step" → Badge modal animation
        ↓
Dashboard populates with initial stats; Forge is available
```

### 10.2 Returning User (Daily Loop)

```
Open NITSForge → Auto-redirected to Dashboard
        ↓
See: streak count, XP bar, weekly report card (if new week),
     daily challenge banner
        ↓
Complete Daily Challenge → +50 XP, streak maintained
        ↓
Optional: Topic Drill on weak category from dashboard
        ↓
Session complete → Results → AI Summary
        ↓
Check Group Leaderboard → See position vs. classmates
```

### 10.3 Guest User

```
Land on Home Page → "Continue as Guest"
        ↓
Full access to Practice Mode and Topic Drill
        ↓
Progress saved to localStorage only
        ↓
After session: non-blocking prompt to create account
        ↓
If user signs up: localStorage data migrated to Supabase
```

### 10.4 Forge Companion During Quiz

```
User is on Question 12 (unanswered) in Practice Mode
        ↓
Opens Forge panel
        ↓
Forge: "You're on Q12 about data structures. What's up?"
        ↓
User: "What's a hash collision?"
        ↓
Forge explains without revealing the answer
        ↓
User answers → answer revealed
        ↓
Forge explains why the correct answer is correct
```

### 10.5 Badge Unlock Flow

```
User completes 7th consecutive daily session
        ↓
Session results screen appears
        ↓
Full-screen overlay: badge animation + glow effect
        ↓
"Week Warrior — 7-Day Streak! +75 XP"
        ↓
Dismiss → Badge visible on profile
        ↓
Optional browser notification: "🔥 You earned Week Warrior!"
```

---

## 11. Design System

### Brand Identity

| Attribute | Value |
|---|---|
| **App Name** | NITSForge |
| **Tagline** | *Forge your path to the FE.* |
| **Tone** | Focused, energetic, encouraging |
| **Personality** | Smart senior classmate meets study app — not corporate, not childish |

### Default Theme — "Ember"

Warm orange + gray, inspired by the forge/fire metaphor and the claude.ai aesthetic.

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#F9F7F4` | App background (warm off-white) |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-surface-2` | `#F3EDE6` | Secondary surfaces, sidebars |
| `--color-primary` | `#F97316` | Buttons, active states, links |
| `--color-primary-dark` | `#EA6C0A` | Hover states |
| `--color-accent` | `#FB923C` | Streak badges, highlights |
| `--color-text-primary` | `#1C1917` | Main text |
| `--color-text-muted` | `#78716C` | Secondary / helper text |
| `--color-border` | `#E7E0D8` | Borders, dividers |
| `--color-success` | `#16A34A` | Correct answer |
| `--color-error` | `#DC2626` | Incorrect answer |
| `--color-xp` | `#F59E0B` | XP bar, level indicators |

### Typography

| Role | Font | Weight |
|---|---|---|
| Display / Headings | **Sora** | 600–700 |
| Body | **Plus Jakarta Sans** | 400–500 |
| Monospace | **JetBrains Mono** | 400 |

### Component Conventions

```
Card:             rounded-2xl border border-[--color-border] bg-[--color-surface] p-6 shadow-sm
Primary Button:   bg-[--color-primary] text-white rounded-xl px-5 py-2.5 font-semibold
                  hover:bg-[--color-primary-dark] transition-colors
Ghost Button:     border border-[--color-border] text-[--color-text-primary] rounded-xl px-5 py-2.5
Correct Option:   bg-green-50 border-2 border-green-500 text-green-900 rounded-xl
Incorrect Option: bg-red-50 border-2 border-red-400 text-red-900 rounded-xl
Badge Card:       rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-200
XP Bar:           h-2 rounded-full bg-amber-400 transition-all duration-500
```

### Animation Guidelines (Framer Motion)

- **Page transitions:** Subtle fade + slide (100ms ease-out)
- **Quiz answer reveal:** Option highlights animate in sequence (stagger 50ms)
- **Badge unlock:** Scale-up + glow pulse, full-screen overlay (600ms)
- **Level-up:** Confetti burst + XP bar overflow animation
- **Forge panel:** Slide in from right (250ms ease-out)
- **Streak milestone:** Fire emoji pulse animation

---

## 12. Backend Architecture

### Node.js + Express Server (Render)

Serves as:
1. **Gemini AI Proxy** — All Gemini API calls routed here; key never exposed to client
2. **Business Logic** — Leaderboard aggregation, badge evaluation, XP computation
3. **Scheduled Jobs** — Daily challenge rotation (cron), weekly report trigger

### API Endpoints (Draft)

| Method | Endpoint | Description | AI Model |
|---|---|---|---|
| `POST` | `/api/ai/forge` | Forge companion chat | Gemini Pro |
| `POST` | `/api/ai/explain` | "Explain This" | Gemini Flash |
| `POST` | `/api/ai/summary` | Post-session summary | Gemini Flash |
| `POST` | `/api/ai/generate-questions` | AI question generation | Gemini Flash |
| `POST` | `/api/ai/concept-card` | Concept card | Gemini Flash |
| `POST` | `/api/ai/weekly-report` | Weekly report | Gemini Pro |
| `POST` | `/api/ai/study-plan` | Study plan | Gemini Pro |
| `GET`  | `/api/leaderboard/alltime` | All-time leaderboard | — |
| `GET`  | `/api/leaderboard/weekly` | Weekly leaderboard | — |
| `GET`  | `/api/leaderboard/daily` | Daily challenge leaderboard | — |
| `GET`  | `/api/leaderboard/group/:groupId` | Group leaderboard | — |
| `POST` | `/api/badges/evaluate` | Evaluate + unlock badges | — |
| `GET`  | `/api/daily-challenge` | Get today's challenge | — |
| `POST` | `/api/xp/add` | Award XP + level-up check | — |

### Supabase Tables

- `profiles` — User profiles and global stats
- `questions` — Full question bank
- `quiz_sessions` — All quiz sessions
- `session_answers` — Individual answers per session
- `user_badges` — Earned badges per user
- `bookmarks` + `bookmark_collections` — Bookmark system
- `daily_challenges` + `daily_challenge_entries` — Daily challenge system
- `study_plans` — AI-generated study plans
- `groups` + `group_members` — Friend groups
- `weekly_reports` — Cached AI weekly reports
- `referrals` — Referral tracking
- `concept_cards_cache` — Globally cached AI concept cards per category

### Row-Level Security (RLS) Summary

- Users can only read/write their own profiles, sessions, answers, bookmarks, and badges
- `questions` and `daily_challenges` are readable by all (including guests via anon key)
- Leaderboard views expose only display_name, avatar_url, total_xp, rank_level (no PII)
- Group members can read group info; only the creator can update the group name

---

## 13. Development Roadmap

### Phase 0 — Project Setup (Week 1)

- Initialize Vite + React + TypeScript + Tailwind
- Set up React Router, Zustand, TanStack Query
- Configure ESLint, Prettier, Husky pre-commit hooks
- Set up GitHub repo, Vercel preview deploys, Render backend skeleton
- Initialize Supabase project: auth + initial schema
- Environment variable management across all three platforms

### Phase 1 — Auth & User System (Weeks 2–3)

- Login, Signup, Guest mode pages and flows
- Supabase Auth integration (email + Google OAuth)
- Profile creation on signup + onboarding screen
- Protected routes, auth context
- Guest → account data migration logic
- Basic Settings page (theme selector, display name)

### Phase 2 — Question Bank & Core Quiz Engine (Weeks 4–6)

- Seed question bank (target: 300+ questions across all 11 categories)
- Build Practice Mode (full flow: question → answer → explanation)
- Build Quick Quiz and Missed Questions modes
- Session creation and answer recording in Supabase
- XP + streak system (award XP, update streak on session complete)

### Phase 3 — Progress Dashboard & History (Weeks 7–8)

- Dashboard with all overview cards and Recharts visualizations
- Answer History page with filters and expansion
- Bookmarks + Collections (CRUD + quiz from collection)
- Topics Overview and Category Deep-Dive pages
- Daily Activity Heatmap

### Phase 4 — Gamification (Week 9)

- Badge definitions and backend evaluation endpoint
- Badge unlock animation (Framer Motion full-screen overlay)
- Rank level system + level-up animation + confetti
- Streak Freeze mechanic
- Daily Challenge (cron-based rotation, leaderboard)

### Phase 5 — Leaderboard & Social (Week 10)

- All-time, weekly, and daily leaderboards
- Friend Groups (create, join via code, group leaderboard)
- Shareable score cards (image generation)
- Shareable question links
- Referral code system + bonus XP

### Phase 6 — AI Integration (Weeks 11–13)

- Backend Gemini proxy setup (all routes)
- Forge companion panel (Gemini Pro, streaming)
- "Explain This" button (Gemini Flash)
- Post-Session AI Summary (Gemini Flash)
- AI-Generated Questions Mode (Gemini Flash + JSON schema validation)
- AI Concept Cards with global cache (Gemini Flash)
- Weekly AI Report (Gemini Pro)
- Study Planner + AI Plan Generation (Gemini Pro)

### Phase 7 — Exam Simulation Mode (Week 14)

- Full timed exam mode (80 questions, 150-minute countdown)
- Auto-submit on timeout
- Exam-accurate results breakdown and scoring
- Exam Simulation badge evaluation

### Phase 8 — Themes, Personalization & Notifications (Week 15)

- Full CSS variable theme system with all 6 themes
- Font size and layout density preferences
- Browser push notification setup (opt-in)
- Email nudge for inactivity (via Supabase email)
- In-app toast notification system

### Phase 9 — Polish, QA & Launch (Week 16)

- Full responsive design pass (mobile optimization)
- Accessibility audit (ARIA, keyboard nav, color contrast)
- Performance optimization (lazy loading, code splitting)
- End-to-end testing of all critical flows
- Security review (RLS policies, rate limiting, input sanitization)
- Final question bank review and expansion
- Deploy v1 to production (Vercel + Render)
- Share with classmates 🎉

---

## 14. Project Conventions

### Folder Structure

```
src/
├── assets/              # Static assets (icons, theme SVGs, badge images)
├── components/
│   ├── ui/              # Base components (Button, Card, Badge, Input, Modal)
│   ├── quiz/            # Quiz components (QuestionCard, OptionButton, Timer)
│   ├── dashboard/       # Dashboard widgets (RadarChart, HeatMap, StreakCard)
│   ├── leaderboard/     # Leaderboard components
│   ├── gamification/    # BadgeModal, XPBar, LevelBadge, LevelUpOverlay
│   └── forge/           # Forge AI panel components
├── data/                # Static data: badge definitions, rank thresholds, category metadata
├── hooks/               # Custom React hooks (useAuth, useProgress, useForge, useTheme)
├── pages/               # Page-level route components
├── services/
│   ├── supabase.ts      # Supabase client + typed query helpers
│   └── ai.ts            # AI API calls (all routed to backend proxy)
├── store/               # Zustand stores (authStore, quizStore, themeStore)
├── types/               # TypeScript interfaces and types
└── utils/               # Helper functions (formatXP, computeAccuracy, etc.)

backend/
├── routes/
│   ├── ai.ts            # All Gemini proxy routes
│   ├── leaderboard.ts   # Leaderboard aggregation
│   ├── badges.ts        # Badge evaluation logic
│   ├── xp.ts            # XP and level management
│   └── daily.ts         # Daily challenge management
├── services/
│   ├── gemini.ts        # Gemini API client (Flash + Pro)
│   └── supabase.ts      # Supabase admin client (service role key)
├── middleware/
│   ├── auth.ts          # JWT verification from Supabase
│   └── rateLimit.ts     # Per-user rate limiting per feature
└── jobs/
    └── dailyChallenge.ts # Cron job for daily challenge rotation
```

### Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `QuizCard.tsx`, `BadgeModal.tsx` |
| Hooks | camelCase, `use` prefix | `useProgress.ts`, `useForge.ts` |
| Stores | camelCase, `Store` suffix | `quizStore.ts`, `authStore.ts` |
| Types / Interfaces | PascalCase | `QuizSession`, `UserProfile` |
| Utility functions | camelCase | `formatXP.ts`, `computeAccuracy.ts` |
| API routes | kebab-case | `/api/ai/explain`, `/api/daily-challenge` |
| Question IDs | `{CATEGORY-ABBR}-{NUMBER}` | `FE-DS-001`, `FE-NET-042` |
| Badge IDs | snake_case | `week_warrior`, `perfectionist` |

### Git Conventions

- **Branches:** `feature/forge-panel`, `fix/streak-reset-bug`, `chore/seed-questions`, `docs/update-readme`
- **Commits:** Conventional Commits
  - `feat:` new feature | `fix:` bug fix | `chore:` maintenance
  - `docs:` documentation | `style:` formatting | `refactor:` restructure | `test:` tests

### Environment Variables

**Frontend (`.env`):**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_BACKEND_URL=
```

**Backend (`.env`):**
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
PORT=
ALLOWED_ORIGINS=
```

---

## 15. Open Questions & Decisions

| # | Question | Status | Notes |
|---|---|---|---|
| OQ-01 | Source of the fact-based question bank? | ❓ Undecided | Past FE exams (JITEC-released); needs legal/copyright review |
| OQ-02 | Minimum question count for launch? | ❓ Undecided | Suggested: 300+ across all 11 categories |
| OQ-03 | Daily Challenge curation — algorithm or manual? | ❓ Undecided | Algorithm (weighted random by category balance) preferred |
| OQ-04 | Supabase free tier sufficient for v1? | ✅ Likely yes | 500MB DB, 50,000 MAU — fine for classmate-scale usage |
| OQ-05 | Render free tier cold starts acceptable? | ❓ Undecided | 15–30s first request delay; consider keep-alive ping or paid tier |
| OQ-06 | OAuth: Google only, or also GitHub? | ❓ Undecided | Google recommended for target audience; GitHub as a bonus |
| OQ-07 | Score card image generation library? | ❓ Undecided | Options: `html-to-image`, `canvas`, or Vercel OG image API |
| OQ-08 | Who maintains the question bank long-term? | ❓ Undecided | Solo initially; classmate contributions via GitHub PR possible |
| OQ-09 | Gemini free tier rate limits — sufficient? | ❓ Needs testing | Flash: 15 RPM / 1M TPD; Pro: 2 RPM / 50K TPD on free tier. Pro may need throttling for Forge |
| OQ-10 | Study Planner plan — fixed or updatable? | ❓ Undecided | 3 generations max; suggest re-generate only when exam date changes |

---

*This document is a living reference. Update it as decisions are made and the project evolves. v1 is the target full release — all features listed are in scope.*

---

**NITSForge** — *Forge your path to the FE.*
