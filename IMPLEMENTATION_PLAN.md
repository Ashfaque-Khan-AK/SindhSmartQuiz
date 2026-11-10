# Sindh Smart Quiz — Implementation Plan

**Tagline:** Learn, Play, Compete!
**Stack:** MongoDB · Express · React (Vite) · Node.js
**Target:** Grades 6–10 · English / Urdu / Sindhi · Responsive web app

This plan is the build tracker for the project. A box is checked only when the item is implemented **and** verified against the running application.

**Status:** ✅ MVP complete — all groups implemented, the production build passes, and the primary flows were verified in-browser at 375 px, 768 px and 1280 px.

---

## 0. Project Foundation

- [x] Create monorepo folder structure (`client/`, `server/`, root docs)
- [x] Root `package.json` with `dev`, `seed`, `build` scripts (concurrently)
- [x] `.gitignore` and `.env.example` files
- [x] Install backend dependencies (express, mongoose, jwt, bcryptjs, cors, dotenv, morgan)
- [x] Install frontend dependencies (react, vite, tailwind, daisyui, router, axios, lucide, recharts, toast)
- [x] Configure Tailwind CSS + DaisyUI custom `sindh` theme
- [x] Configure Vite dev server + API proxy
- [x] Connect to local MongoDB / MongoDB Atlas via `MONGODB_URI`
- [x] Central error handler, async wrapper, standardized API envelope

## 1. Backend — Data Layer

- [x] `User` model (role student/admin, grade, language, totalXP, isActive, bcrypt hashing)
- [x] `Grade` model (name, number, isActive)
- [x] `Subject` model (name, description, icon, grades[], isActive)
- [x] `Topic` model (name, subjectId, gradeId, difficulty, isActive)
- [x] `Question` model (trilingual question/options/explanation, correctAnswer, difficulty, isActive)
- [x] `QuizAttempt` model (questions[], scoring, XP, timestamps, status)
- [x] `Achievement` model (criteria code, xpReward, isActive)
- [x] `StudentAchievement` model (unique student+achievement)
- [x] Indexes for auth lookups, grade/subject/topic filters, leaderboard sorting
- [x] Password hashing + `comparePassword` method; password never serialized

## 2. Backend — Authentication & Security

- [x] `POST /api/v1/auth/register` (student registration, server validation)
- [x] `POST /api/v1/auth/login` (JWT, rejects inactive accounts)
- [x] `GET /api/v1/auth/me` (current user)
- [x] JWT auth middleware (`protect`) + role guard (`adminOnly`)
- [x] Rate limiting on auth endpoints
- [x] Input validation helpers (email, password, enums, ObjectId)
- [x] Answer keys never returned before submission

## 3. Backend — Student APIs

- [x] `GET /students/dashboard` (XP, attempts, average, streak, subjects, recent attempts, achievements)
- [x] `GET /students/subjects` (grade-filtered, with progress and question counts)
- [x] `GET /students/topics/:subjectId` (grade-filtered, question counts, last performance)
- [x] `GET /students/history`
- [x] `GET /students/leaderboard` (overall + grade filter + own rank)
- [x] `GET /students/achievements` (earned + locked with progress)
- [x] `PUT /students/profile` (name, grade, language, avatar)
- [x] `PUT /students/password` (current + new password)

## 4. Backend — Quiz Engine

- [x] `POST /quizzes/start` (5/10/15 questions, difficulty, time limit, language)
- [x] Question selection with topic priority + subject backfill
- [x] `GET /quizzes/:attemptId` (resume in-progress quiz, sanitized questions)
- [x] `POST /quizzes/:attemptId/submit` (server-side scoring, idempotent)
- [x] `GET /quizzes/:attemptId/result`
- [x] `GET /quizzes/:attemptId/review` (correct answers, selected answers, explanations)
- [x] Timer authority on server (`expiresAt`), late submissions capped
- [x] No negative marking, 1 mark per correct answer
- [x] Percentage calculation per spec
- [x] XP engine: 10/correct + 20 completion + 30 perfect bonus, once per attempt

## 5. Backend — Gamification

- [x] Achievement criteria engine (First Step, Quick Learner, Quiz Master, Perfect Score, Consistent Learner, Knowledge Champion)
- [x] Achievement XP rewards + duplicate-award protection
- [x] Learning streak calculation (consecutive submission days)
- [x] Leaderboard aggregation with quiz counts and average score

## 6. Backend — Admin APIs

- [x] `GET /admin/dashboard` (counts, averages, 14-day attempts, subject participation, grade performance)
- [x] `GET /admin/students` (search, grade filter, pagination)
- [x] `PATCH /admin/students/:id/status` (activate/deactivate)
- [x] Grades CRUD (`GET/POST /admin/grades`, `PUT/DELETE /admin/grades/:id`)
- [x] Subjects CRUD (assign to grades, icon)
- [x] Topics CRUD (assign subject + grade)
- [x] Questions CRUD (trilingual fields, options, correct answer, publish toggle)
- [x] `GET /admin/attempts` (student, grade, subject, topic, score, date, time)
- [x] `GET /admin/reports` (grade/subject performance, most attempted, hardest topics, top students)
- [x] Protect every admin route with admin role guard

## 7. Demonstration Data (Seed)

- [x] Seed grades 6–10
- [x] Seed 4 subjects per grade (Mathematics, General Science, English, General Knowledge)
- [x] Seed topics per subject/grade
- [x] Seed trilingual question bank (≥100 questions, 4 options each, explanations)
- [x] Seed 6 achievements
- [x] Seed 1 administrator account
- [x] Seed demo students + attempts for leaderboard/report realism
- [x] Idempotent seed script (`npm run seed`)

## 8. Frontend — Foundation

- [x] Vite + React app entry (`main.jsx`, `App.jsx`)
- [x] Router with public / student / admin route groups
- [x] `AuthContext` (login, register, logout, profile refresh)
- [x] `LanguageContext` (English/Urdu/Sindhi UI strings)
- [x] RTL support (`dir="rtl"`, font switching, logical spacing)
- [x] Axios service with token interceptor + error propagation
- [x] `ProtectedRoute` role guard
- [x] Common components: Logo, Loading, EmptyState, StatCard, PageHeader, Modal, LanguageSwitcher, ProgressBar
- [x] `StudentLayout` (sidebar + topbar + mobile drawer)
- [x] `AdminLayout` (sidebar + topbar + mobile drawer)
- [x] Responsive navigation and accessible focus states
- [x] Toast notifications wired globally

## 9. Frontend — Public & Auth Pages

- [x] Landing page `/` (nav, hero, how it works, grades, subjects, features, footer)
- [x] Student registration `/register` (validation, grade + language)
- [x] Student login `/login`
- [x] Admin login `/admin/login` (rejects non-admin users)

## 10. Frontend — Student Portal

- [x] Dashboard `/student/dashboard`
- [x] Grade selection `/student/grades`
- [x] Subject selection `/student/subjects`
- [x] Topic selection `/student/topics/:subjectId`
- [x] Quiz configuration `/student/quiz/setup`
- [x] Quiz game `/student/quiz/:attemptId` (timer, prev/next, progress, answer persistence, auto-submit)
- [x] Quiz result `/student/result/:attemptId`
- [x] Answer review `/student/review/:attemptId`
- [x] Leaderboard `/student/leaderboard` (overall + grade filter + own rank)
- [x] Quiz history `/student/history`
- [x] Achievements `/student/achievements` (earned + locked)
- [x] Student profile `/student/profile` (edit profile, change password, logout)

## 11. Frontend — Admin Portal

- [x] Admin dashboard `/admin/dashboard` (stat cards + Recharts charts)
- [x] Manage students `/admin/students` (search, grade filter, activate/deactivate)
- [x] Manage grades `/admin/grades`
- [x] Manage subjects `/admin/subjects`
- [x] Manage topics `/admin/topics`
- [x] Manage questions `/admin/questions` (trilingual form, 4 options, correct answer, explanation, publish)
- [x] Manage quiz attempts `/admin/attempts`
- [x] Admin reports `/admin/reports`

## 12. UX, Accessibility & Non-Functional

- [x] Fully responsive at 375px / 768px / 1280px
- [x] Readable contrast, accessible text sizes, keyboard-usable forms
- [x] Loading states for every async screen
- [x] Friendly empty states for empty lists
- [x] Confirmation before destructive actions
- [x] Timer auto-submit and tab-refresh resilience
- [x] No answer keys in network payloads before submission

## 13. Testing & Verification

- [x] Auth flow: register → login → me → guarded routes
- [x] Quiz flow: start → answer → submit → result → review
- [x] Scoring accuracy (correct/incorrect/unanswered/perfect)
- [x] XP and achievement award verification
- [x] Leaderboard ordering and own-rank verification
- [x] Admin CRUD verification for grades/subjects/topics/questions
- [x] Student deactivation blocks login
- [x] Role isolation (student cannot call admin APIs, and vice versa)
- [x] Responsive visual check on desktop + mobile widths
- [x] Seeded credentials documented in `README.md`

## 14. MVP Acceptance Criteria

- [x] Students can register and log in
- [x] Admin can log in separately
- [x] Students can select Grades 6–10
- [x] Subjects and topics are available
- [x] Students can start quizzes
- [x] Each question has four options
- [x] Timer works and auto-submits
- [x] Quiz submissions are evaluated correctly
- [x] Results are stored and reviewable
- [x] XP and achievements are awarded correctly
- [x] Leaderboard shows actual student results
- [x] Admin can manage questions
- [x] English, Urdu and Sindhi selection works (UI + RTL)
- [x] Application works on mobile and desktop

---

## Verification Log

- **Build:** `npm run build` succeeds (2,100 modules, no errors).
- **i18n:** every `t('…')` key exists; Urdu and Sindhi dictionaries have full parity with English.
- **Student flow:** login → dashboard → subjects → topics → quiz setup → 5-question quiz → submit → result → review → leaderboard (overall + grade) → history → achievements → profile.
- **Admin flow:** dashboard, students, grades, subjects, topics, questions, attempts and reports render; question create/edit/delete with English + Urdu fields verified; grade/subject/topic create/update/delete verified through the API.
- **Security:** student token on an admin route returns `403`; admin token on a student route returns `403`; deactivated student login is blocked and reactivation restores access; quiz payloads contain no answer keys.
- **Scoring & gamification:** a perfect 5-question attempt returned `100 XP` plus `75` achievement XP and unlocked First Step, Quick Learner and Perfect Score on a temporary QA account (cleaned up afterwards).
- **Timer:** an attempt with an expired server deadline auto-submitted on load, showed the “Time is up” notice and redirected to the result page.
- **Responsive:** all 19 authenticated pages checked at 375 px, 768 px and 1280 px — no horizontal overflow, mobile drawer active below `lg`, desktop sidebar 288 px, no console errors.
- **Seed:** `npm run seed:fresh` resets to 5 grades, 4 subjects, 40 topics, 200 questions, 7 demo students and 38 attempts.

---

## Build Order (agreed priorities)

1. **Foundation** → install, theme, DB, layouts
2. **Auth** → register, login, admin login, guards
3. **First working product** → Landing → Register/Login → Dashboard → Subjects → Topics → Quiz setup → 5-question quiz → Result → Review → Leaderboard
4. **Gamification** → XP, achievements, streak, history, profile
5. **Admin** → dashboard, content CRUD, attempts, reports
6. **Polish** → i18n/RTL, responsiveness, testing, seed, docs

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@sindhsmartquiz.pk` | `Admin@12345` |
| Student | `student@sindhsmartquiz.pk` | `Student@12345` |

## Status Legend

- `[ ]` Not started
- `[x]` Implemented and verified

> Update this file as each group is completed. Do not create all 24 pages at once — build and test in functional groups.
