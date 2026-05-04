# Edifix

Edifix is a stage-based web development learning platform with clear learning paths, guided progression, practical lessons, and community support.

## Why Edifix

Most self-taught developers hit the same problem: resources are everywhere, but the sequence is unclear. Edifix solves this with a structured roadmap and progressive unlock model.

Frontend path:
HTML -> CSS -> JavaScript -> Git -> Deployment

Backend path:
Node.js -> Databases -> Express.js -> Middleware -> CORS -> Deployment

## Core Features

- Structured courses and lessons across frontend and backend tracks
- Lesson progression and completion tracking
- Dashboard with overall progress, streak stats, activity feed, and continue-learning
- Exam flow with timer, per-question navigation, and results summary
- Playground for running and saving code snippets
- Articles listing and markdown article details with related posts
- Forum categories, thread listing, thread view, replies, and new thread creation
- Notifications center with pagination and bulk actions
- Profile management and password updates
- Public streak leaderboard
- Authentication with JWT and protected routes

## New Frontend Additions

- Saved courses feature from the course catalog
- My Learning page for saved courses and recently viewed lessons
- Actionable notifications:
	- mark single notification as read
	- delete single notification
	- mark all as read
	- clear read notifications
- User settings page with persisted UI preferences
- 404 fallback page for unknown routes

## Tech Stack

Backend:
- Node.js (ES modules)
- Express.js
- MySQL + Sequelize
- JWT + bcrypt
- Nodemailer
- node-cron
- Morgan

Frontend:
- React 19
- React Router
- Vite
- Base CSS (custom design system)
- react-hot-toast
- react-markdown
- Lucide icons

## Repository Structure

```
edifix/
├── backend/
│   ├── server.js
│   ├── schema.sql
│   ├── seed.js
│   ├── Config/
│   ├── Controller/
│   ├── Model/
│   ├── Route/
│   ├── middleware/
│   └── seedData/
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

## Frontend Routes

Public routes:
- /
- /login
- /register
- /courses
- /courses/:slug
- /articles
- /articles/:slug
- /forum
- /forum/:categorySlug
- /forum/:categorySlug/:threadSlug
- /leaderboard

Protected routes:
- /dashboard
- /courses/:courseSlug/:lessonSlug
- /my-learning
- /playground
- /exams/:courseId
- /exams/results
- /notifications
- /profile
- /settings
- /forum/new

Fallback route:
- * -> not found page

## Local Setup

### Prerequisites

- Node.js 18+
- MySQL 8+

### 1) Backend

```bash
cd backend
npm install
```

Create backend/.env:

```env
PORT=4000
dbname=edifix
dbusername=root
dbpassword=your_password
dbip=127.0.0.1:3306
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

Create DB and seed:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS edifix;"
node seed.js
```

Run backend:

```bash
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional frontend env:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## API Reference

- Full API docs: [backend/document.md](backend/document.md)
- Health endpoint: http://localhost:4000/api/health

## License

ISC
