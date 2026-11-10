# Sindh Smart Quiz

**Learn, Play, Compete!**

A gamified, trilingual quiz platform for students in grades 6–10 across Sindh. Students practise Mathematics, General Science, English and General Knowledge in English, Urdu or Sindhi, earn XP and achievements, and compete on a leaderboard. Administrators manage students, content and reports from a dedicated panel.

---

## Highlights

- **24 pages** — landing, auth, 12 student screens and 8 admin screens.
- **STREAM Muqablo Journey context** — the home page carries a Government of Sindh STEAM / STREAM Initiative banner and a dedicated school-level competition section for 2026-27.
- **Trilingual content and UI** — English, اردو and سنڌي, with full RTL layout and font switching.
- **5 / 10 / 15-question quizzes** — single-answer MCQs, one mark per correct answer, no negative marking, unlimited attempts.
- **Server-authoritative quiz engine** — timer expiry, answer-key protection, idempotent submissions.
- **Gamification** — XP (`10 × correct + 20 completion + 30 perfect`), six achievements, daily streaks, leaderboard.
- **Admin panel** — student access control, grade/subject/topic/question CRUD, attempt explorer, Recharts reports.
- **Responsive design** — mobile drawer navigation, accessible forms, friendly loading/empty/error states.

## Deployment

The project is ready for a split deployment:

- React frontend → Netlify
- Express API → Back4App Containers
- Database → MongoDB Atlas

See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete step-by-step guide, environment variables and verification checklist.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 6, React Router 6, Tailwind CSS 3, DaisyUI 4, Axios, Lucide React, Recharts, React Hot Toast |
| Backend | Node.js, Express 4, Mongoose 8, JWT, bcryptjs, express-rate-limit |
| Database | MongoDB (local or Atlas) |
| Language | JavaScript (ES modules) |

## Project Structure

```
Quiz Game/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── components/         # common, auth and layout building blocks
│       ├── context/            # AuthContext, LanguageContext
│       ├── i18n/               # en / ur / sd dictionaries + translate()
│       ├── layouts/            # StudentLayout, AdminLayout
│       ├── pages/              # public, auth, student, admin
│       ├── services/           # Axios client and API functions
│       ├── utils/              # formatting and icon helpers
│       ├── App.jsx             # routes and role guards
│       └── main.jsx            # providers, router, toaster
├── server/
│   └── src/
│       ├── config/             # database + environment
│       ├── controllers/        # thin request handlers
│       ├── middleware/         # auth, validation, errors
│       ├── models/             # 8 Mongoose models
│       ├── routes/             # /api/v1 routers
│       ├── seed/               # demo data seeder
│       ├── services/           # business logic
│       ├── utils/              # ApiError, validators, response helpers
│       ├── app.js
│       └── server.js
├── IMPLEMENTATION_PLAN.md      # build tracker
├── package.json                # root scripts
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+ (tested on Node 22)
- npm 9+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Install dependencies

```bash
npm run install:all
```

This installs root, `server/` and `client/` dependencies.

### 2. Configure the server

```bash
copy server\.env.example server\.env    # Windows
# cp server/.env.example server/.env     # macOS / Linux
```

Edit `server/.env` if needed:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/sindh_smart_quiz
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

For Atlas, replace `MONGODB_URI` with your `mongodb+srv://…` connection string.

### 3. Seed data

```bash
npm run seed
```

Use `npm run seed:fresh` to wipe the quiz collections first. The seeder is idempotent.

To create or reset only the administrator account without touching any other data:

```bash
npm run seed:admin
```

Seeded data:

- Grades 6–10
- 4 subjects per grade (Mathematics, General Science, English, General Knowledge)
- 40 topics
- 200 trilingual questions with four options and explanations
- 6 achievements
- 1 administrator and 7 demo students with quiz attempts

### 4. Run the app

```bash
npm run dev
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:5000/api/v1>
- Health check: <http://localhost:5000/api/v1/health>

Run only one side when needed:

```bash
npm run dev:server
npm run dev:client
```

## Seeded Accounts (development)

These accounts are created by the seeder for local development. Change the passwords before any public deployment.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@sindhsmartquiz.pk` | `Admin@12345` |
| Student | `student@sindhsmartquiz.pk` | `Student@12345` |

Other seeded students use the pattern `fatima@`, `zara@`, `usman@`, `hina@`, `bilal@`, `ayesha@` at `sindhsmartquiz.pk`, all with `Student@12345`.

Admin login is separated at `/admin/login`. Admin accounts cannot access student routes and vice versa.

## Available Scripts

| Command | Description |
|---|---|
| `npm run install:all` | Install server and client dependencies |
| `npm run dev` | Run API and Vite together with `concurrently` |
| `npm run dev:server` | Run the Express API with file watching |
| `npm run dev:client` | Run the Vite dev server |
| `npm run seed` | Seed data |
| `npm run seed:admin` | Create or reset the seeded administrator account |
| `npm run seed:fresh` | Reset and reseed all data |
| `npm run build` | Production build of the client |
| `npm start` | Start the API without file watching |

## Student Flow

1. **Landing → Register / Login** — choose grade and preferred language.
2. **Dashboard** — XP, quizzes, average score, streak, subjects and recent activity.
3. **Grades → Subjects → Topics** — browse grade-specific content and progress.
4. **Quiz setup** — choose 5/10/15 questions, time limit, difficulty and language.
5. **Quiz** — answer with the timer running; answers are saved locally and restored after a refresh; auto-submit on expiry.
6. **Result → Review** — score, XP breakdown, explanations and per-question answer review.
7. **Leaderboard / History / Achievements / Profile** — rankings, past attempts, badges and account settings.

## Admin Flow

1. **Dashboard** — platform counts, 14-day attempts chart, subject participation, grade performance and recent attempts.
2. **Students** — search, filter, inspect performance, activate/deactivate.
3. **Grades / Subjects / Topics** — full CRUD with grade assignment and activation.
4. **Questions** — trilingual tabbed editor (English required, Urdu/Sindhi optional), four options, correct answer, explanation, difficulty and publishing.
5. **Attempts** — filterable, paginated attempt explorer.
6. **Reports** — grade/subject performance, most-attempted subjects, hardest topics and top students.

## API Overview

All endpoints are under `/api/v1` and return a consistent envelope:

```json
{ "success": true, "message": "…", "data": { } }
```

| Group | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Student | `GET /students/dashboard`, `/subjects`, `/topics/:subjectId`, `/history`, `/leaderboard`, `/achievements`; `PUT /students/profile`, `/password` |
| Quiz | `POST /quizzes/start`, `GET /quizzes/:attemptId`, `POST /quizzes/:attemptId/submit`, `GET /quizzes/:attemptId/result`, `/review` |
| Admin | `GET /admin/dashboard`, `/students`, `/attempts`, `/reports`, `/achievements`; CRUD under `/admin/grades`, `/admin/subjects`, `/admin/topics`, `/admin/questions`; `PATCH /admin/students/:id/status` |

Protected routes require `Authorization: Bearer <token>`. Admin routes require the `admin` role; student and quiz routes require the `student` role.

## Quiz Rules

- Question counts: **5, 10 or 15** (limited by the available pool).
- One mark per correct answer; unanswered and incorrect answers score zero.
- No negative marking.
- XP: **10 per correct answer + 20 completion bonus + 30 perfect-score bonus**.
- Achievement XP is added to total XP once per achievement.
- The server owns the deadline (`expiresAt`); late submissions are auto-submitted and capped.
- Answer keys are stripped from every payload before submission.

## Internationalisation & RTL

- UI dictionaries live in `client/src/i18n/translations.js` (`en`, `ur`, `sd`).
- The chosen language is stored in `localStorage` (`ssq_language`) and applied to `<html lang dir>`.
- Urdu and Sindhi set `dir="rtl"` and switch to the Noto Naskh Arabic font.
- Layouts use logical spacing utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) so both directions work.
- Quiz attempts remember their language, so review pages render question content in the language the quiz was taken in.
- The account's preferred language is applied when a different user signs in; the in-app switcher overrides it for the session and persists across reloads.

## Notes

- Auth/session keys: `ssq_token`, `ssq_user`, `ssq_language`.
- Redux is not used; state lives in React contexts and local component state.
- Build output is written to `client/dist/`.
- If MongoDB is unavailable, the API starts but database-backed requests fail; start MongoDB or update `MONGODB_URI`.
- Windows PowerShell users should call `npm.cmd` if script execution policy blocks `npm.ps1`.

## License

Built for educational use. Demo content and branding are for the Sindh Smart Quiz project.
