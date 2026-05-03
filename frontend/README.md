# Edifix — Frontend

Modern web interface for the Edifix learning platform, built with **React 19 + Vite + Tailwind CSS**.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 7 | Dev server & bundler |
| Tailwind CSS 4 | Utility-first styling |
| React Router 7 | Client-side routing |
| Axios | HTTP client |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| React Markdown | Markdown rendering |
| Recharts | Charts & graphs |

---

## Prerequisites

- **Node.js ≥ 18** (LTS recommended)
- **npm ≥ 9**
- The **Edifix backend** running at `http://localhost:4000` (see `../backend/README.md`)

---

## Getting Started

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different host/port:

```env
# .env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Design-system primitives (Button, Card, Input, …)
│   │   ├── Layout.jsx    # App shell (navbar + footer)
│   │   ├── Navbar.jsx    # Top navigation
│   │   ├── Footer.jsx    # Footer
│   │   ├── ProtectedRoute.jsx
│   │   └── LoadingScreen.jsx
│   ├── config/
│   │   └── api.js        # Axios instance with JWT interceptors
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── pages/            # Page components (one per route)
│   │   ├── auth/         # Login & Register
│   │   ├── admin/        # Admin-only pages (Articles management)
│   │   ├── Dashboard.jsx
│   │   ├── Courses.jsx / CourseDetail.jsx / LessonView.jsx
│   │   ├── Progress.jsx
│   │   ├── Streak.jsx
│   │   ├── Playground.jsx
│   │   ├── Articles.jsx / ArticleView.jsx
│   │   ├── Forum.jsx / ForumCategory.jsx / ThreadView.jsx / NewThread.jsx
│   │   ├── Notifications.jsx
│   │   ├── Reminders.jsx
│   │   ├── Profile.jsx
│   │   └── Leaderboard.jsx
│   ├── services/
│   │   └── api.js        # API call wrappers for every endpoint
│   ├── App.jsx           # Route definitions
│   └── main.jsx          # Entry point
├── .env.example          # Environment variable template
├── index.html
├── vite.config.js
└── package.json
```

---

## Pages & Features

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing / home page |
| `/login` | Public | Login |
| `/register` | Public | Registration |
| `/courses` | Public | Course catalogue with filters |
| `/courses/:slug` | Public | Course detail + lesson list + progress |
| `/courses/:courseSlug/:lessonSlug` | Public | Lesson view with completion tracking |
| `/dashboard` | Protected | Student dashboard |
| `/progress` | Protected | Overall & per-course progress |
| `/streak` | Protected | Streak summary + leaderboard |
| `/leaderboard` | Public | Streak leaderboard |
| `/playground` | Public/Protected | Code editor (My sessions / Explore public) |
| `/articles` | Public | Articles list with search & category filter |
| `/articles/:slug` | Public | Article detail |
| `/forum` | Public | Forum categories & threads |
| `/forum/c/:slug` | Public | Category thread list |
| `/forum/t/:id` | Public | Thread detail with replies |
| `/forum/new` | Protected | Create new thread |
| `/notifications` | Protected | Notification centre |
| `/reminders` | Protected | Learning reminders |
| `/profile` | Protected | Profile settings & password change |
| `/exams` | Protected | Exam list |
| `/exams/:id` | Protected | Take exam |
| `/admin/articles` | Admin | Article management (create/edit/delete) |

---

## Authentication

- JWT is stored in `localStorage` under the key `edifix_token`.
- The Axios interceptor automatically attaches the token to every request.
- A 401 response clears the token and redirects to `/login`.
- Protected routes are wrapped with `<ProtectedRoute>` which redirects unauthenticated users to `/login`.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:4000/api` | Backend API base URL |
