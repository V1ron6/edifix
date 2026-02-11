# Edifix

A structured, stage-based web development learning platform that guides users from zero to deployment — covering both frontend and backend tracks.

## Motive

Most self-taught developers struggle with knowing **what to learn next**. Free resources are scattered, unstructured, and overwhelming. Edifix solves this by providing a **clear, linear learning path** that mirrors how professional web development is actually built — one layer at a time.

The platform enforces a deliberate progression:

**Frontend Track:**
HTML → CSS → JavaScript → Git → Deployment

**Backend Track:**
Node.js → Databases → Express.js → Middlewares → CORS → Deployment

Each stage unlocks only after the previous one is understood, ensuring learners build on solid foundations rather than skipping ahead with gaps in knowledge.

## What It Does

- **Structured Courses** — 28 courses based on W3Schools curriculum, covering frontend and backend development end-to-end
- **Lessons with Full Content** — Self-contained lessons with no external link dependencies; everything a learner needs is on the platform
- **Exams & Questions** — 1000+ interview-style and beginner-friendly questions across all topics, with randomized exams after each study stage
- **Progress Tracking** — Per-lesson and per-course completion tracking with visual progress indicators
- **Streaks** — Daily learning streak system to build consistent study habits
- **Playground** — A sandbox environment for testing and experimenting with code
- **Personal Dashboard** — Each user gets a dashboard with notifications, reminders, and progress overview
- **Articles** — Curated best practices and reference articles on HTML, CSS, JavaScript, Node.js, Express.js, Git, databases, and security
- **Community Forum** — Discussion boards organized by topic where learners can ask questions, share knowledge, and help each other

## Tech Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js v5
- **Database:** MySQL with Sequelize ORM
- **Auth:** JWT (JSON Web Tokens) with bcrypt password hashing
- **Email:** Nodemailer (Gmail SMTP)
- **Scheduling:** node-cron (reminders, streak resets)
- **Logging:** Morgan

### Frontend
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Routing:** React Router v7
- **Charts:** Recharts
- **Icons:** Lucide React

## Project Structure

```
edifix/
├── backend/
│   ├── server.js            # Express app entry point
│   ├── seed.js              # Database seeder (courses, lessons, questions, articles)
│   ├── schema.sql           # Full database schema
│   ├── Config/              # Database, email, cron configuration
│   ├── Controller/          # Route handlers
│   ├── Model/               # Sequelize models
│   ├── Route/               # API route definitions
│   ├── middleware/           # Auth, validation, error handling
│   └── seedData/            # Modular seed data (1000+ questions)
├── frontend/
│   ├── src/
│   │   ├── component/       # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   └── config/          # API configuration
│   └── public/
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8.0+

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=4000
dbname=edifix
dbusername=root
dbpassword=yourpassword
dbip=127.0.0.1:3306
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
frontEndUrl=http://localhost:5173
```

Create the database and seed it:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS edifix;"
node seed.js
```

Start the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

Full API documentation is available in [backend/document.md](backend/document.md).

Public endpoints are listed on the server landing page at `http://localhost:4000`.

## License

ISC
