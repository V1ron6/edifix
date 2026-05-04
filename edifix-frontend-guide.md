# Edifix Frontend Implementation Guide

---

## Overview

Edifix is a stage-based web development learning platform with two learning tracks: Frontend and Backend. The UI must reflect a structured, progressive learning experience. Users move through courses and lessons in order, take exams, track streaks, use a code playground, read articles, and participate in a forum.

The frontend is built with React and base CSS. All protected pages must check for a JWT token stored in localStorage before rendering. If no token is found, redirect to the login page.

---

## Folder Structure

Organize the project as follows:

```
src/
  pages/
    auth/         → Login, Register
    dashboard/    → Dashboard
    courses/      → CourseList, CourseDetail
    lessons/      → LessonView
    exams/        → ExamPage, ExamResults
    playground/   → Playground
    articles/     → ArticleList, ArticleDetail
    forum/        → ForumHome, CategoryView, ThreadView, NewThread
    profile/      → Profile, Settings
    notifications/→ Notifications
  components/
    layout/       → Navbar, Sidebar, Footer
    shared/       → Button, Input, Modal, Badge, ProgressBar,
                    Pagination, Toast, LoadingSpinner, Avatar
    courses/      → CourseCard, LessonCard, DifficultyBadge
    dashboard/    → StreakWidget, ContinueCard, ActivityFeed,
                    StatCard
    forum/        → ThreadCard, PostCard, CategoryCard
    articles/     → ArticleCard
    exams/        → QuestionCard, ExamTimer
    notifications/→ NotificationItem, NotificationBell
  context/
    AuthContext   → stores user data and token globally
  utils/
    api.js        → central fetch helper that attaches JWT header
    auth.js       → token save/get/remove helpers
```

---

## Shared / Reusable Components

These are used across multiple pages. Build these first before any page.

### Button
A general-purpose button that accepts a type prop (primary, secondary, ghost, danger). Styles come from cbutton.css. Used everywhere — forms, modals, actions.

### Input
A labeled input field with an optional error message below it. Used in login, register, profile, forum forms.

### Modal
An overlay popup with a title, content area, and close button. Used for confirmations, exam instructions, streak freeze confirmation.

### Badge
A small colored pill that shows labels like difficulty level (beginner, intermediate, advanced) or category (frontend, backend). Each level and category gets its own color.

### ProgressBar
A horizontal bar that fills based on a percentage value. Used in course cards, dashboard stats, and lesson completion tracking.

### Pagination
Previous/Next buttons with a page indicator in the middle. Used in courses list, forum threads, articles, and notifications.

### Toast
A temporary notification that appears at the top-right of the screen and disappears after a few seconds. Shows success (green), error (red), or info (blue) messages after API actions.

### LoadingSpinner
A centered spinning indicator shown while waiting for API responses.

### Avatar
Displays a user's profile picture. If no avatar URL is available, show the first letter of the username inside a colored circle.

---

## Layout Components

### Navbar
Shown on all pages after login. Contains:
- Edifix logo on the left
- Navigation links: Dashboard, Courses, Playground, Articles, Forum
- On the right: NotificationBell component, user Avatar with a dropdown showing Profile, Settings, and Logout

For unauthenticated users, only show the logo and Login / Register buttons.

### Sidebar
Used on the Dashboard and Course pages. Shows:
- User's name and avatar at the top
- Current streak count with a flame icon
- Navigation links to each section
- A "Continue Learning" shortcut that links to the next lesson

### Footer
Minimal. Shows the Edifix name, copyright, and links to any public pages.

---

## Pages

---

### 1. Login Page — `/login`

A centered card on a neutral background. Contains the Edifix logo at the top, then two Input components (email and password), a primary Button labeled "Login", and a link to the Register page.

On submit, call POST `/api/auth/login`. On success, save the JWT token and user object, store them in AuthContext, then redirect to the Dashboard. On failure, show a Toast with the error message.

---

### 2. Register Page — `/register`

Same layout as Login. Contains three inputs: username, email, password. A primary Button labeled "Create Account" and a link back to Login.

On submit, call POST `/api/auth/register`. On success, save the token and redirect to Dashboard. Show a welcome Toast.

---

### 3. Dashboard — `/dashboard`

Protected page. This is the main home after login. Uses the Sidebar and Navbar layout.

Divide into three sections:

**Top row — StatCards:** Four cards side by side showing total courses completed, total lessons completed, overall progress percentage, and total time spent. Data comes from GET `/api/progress`.

**Middle row — Streak and Continue Learning:**
- StreakWidget: Shows the current streak, longest streak, total active days, and number of streak freezes available. Add a "Use Freeze" button that calls POST `/api/streak/use-freeze`. Data from GET `/api/streak`.
- ContinueCard: A prominent card showing the next lesson title and its course name. A "Continue" button links to that lesson. Data from GET `/api/progress/continue`.

**Bottom row — Activity Feed:** A vertical list of recent learning activity. Each item shows which lesson was completed and when. Data from GET `/api/progress/activity`.

---

### 4. Courses Page — `/courses`

Public page, accessible without login but full access requires being logged in.

At the top, show two large track buttons: "Frontend Track" and "Backend Track". Clicking either calls GET `/api/courses/learning-path/:category` and displays the courses in that track in order.

Below the track buttons, show filter controls using the Badge component for difficulty (All, Beginner, Intermediate, Advanced). These filter the course list client-side or via query params.

The main content is a grid of CourseCard components.

**CourseCard** shows:
- Course thumbnail
- Title and description (truncated)
- A DifficultyBadge
- Estimated hours
- A ProgressBar showing the user's completion percentage for that course (if logged in)
- A "Start" or "Continue" button

---

### 5. Course Detail Page — `/courses/:slug`

Shows the full course overview at the top: title, description, category, difficulty, and estimated hours.

Below that is a numbered list of LessonCards.

**LessonCard** shows:
- Lesson number and title
- Type (theory or practice)
- Estimated minutes
- A completion checkmark if the user has completed it
- A lock icon if the user has not yet completed the previous lesson

Clicking an unlocked lesson navigates to the Lesson View page.

---

### 6. Lesson View — `/courses/:courseSlug/:lessonSlug`

Protected page. Full-screen layout with the Navbar at top and a sidebar showing the lesson list for the course.

Main content area:
- Lesson title and type at the top
- If the lesson has a video URL, embed a video player
- Below that, render the lesson content (markdown — use a markdown renderer library)
- If the lesson type is "practice", show a code editor area below the content with the starter code pre-filled and a "Run" button. Show the expected output below.
- Hints toggle button — clicking reveals hints one at a time
- At the bottom, a "Mark as Complete" button that calls POST `/api/progress/lesson/:lessonId` with status "completed" and time spent. On success, show a Toast and update the lesson list checkmarks.

---

### 7. Exam Page — `/exams/:courseId`

Protected page. Accessed after completing all lessons in a course.

On first load, show a modal with exam instructions and a "Start Exam" button. Once started, show a countdown timer (ExamTimer component) at the top right.

Questions are shown one at a time using the QuestionCard component, which shows the question text and multiple choice options. User selects an answer and clicks "Next".

At the end, a "Submit" button calls POST `/api/exams/:id/submit`. Redirect to the Exam Results page.

**Exam Results** shows the score, pass/fail status, time taken, and a breakdown of correct and incorrect answers.

---

### 8. Playground — `/playground`

Protected page. A split-screen layout:
- Left side: a code editor with language selector (HTML, CSS, JavaScript) and a "Run" button
- Right side: a preview window showing the output

Calls POST `/api/playground/run` with the code and language. Displays the output or error in the preview panel.

There is also a "Save" button that calls POST `/api/playground/save` to save the snippet, and a list of saved snippets below the editor that can be loaded back.

---

### 9. Articles Page — `/articles`

Public page. A grid of ArticleCards with a filter bar at the top for category (javascript, css, html, etc.) and a search input.

**ArticleCard** shows:
- Thumbnail
- Title and excerpt
- Category badge
- Read time in minutes
- Author and date

Clicking navigates to the Article Detail page.

**Article Detail — `/articles/:slug`**
Shows the full article content rendered from markdown. At the bottom, show related articles.

---

### 10. Forum — `/forum`

Public page but posting requires login.

**Forum Home — `/forum`**
Shows a grid of CategoryCards. Each card shows the category name, description, icon, color accent, and thread count. Calls GET `/api/forum/categories`.

**Category View — `/forum/:categorySlug`**
Shows a list of ThreadCards for that category. At the top, a "New Thread" button (visible only to logged-in users) and filter/sort controls (latest, popular, most replies).

**ThreadCard** shows:
- Thread title
- Author avatar and username
- Tags as small badges
- Reply count, view count, like count
- A "Solved" badge if the thread is marked solved
- A "Pinned" label if pinned
- Time of last activity

**Thread View — `/forum/:categorySlug/:threadSlug`**
Shows the thread title, original post content, and all replies as PostCards below.

**PostCard** shows:
- Author avatar and username
- Post content rendered from markdown
- Like button with like count
- A "Solution" highlight if the post is marked as the solution
- Nested replies indented below if any
- Edit/Delete buttons if the logged-in user is the author

A reply input box is fixed at the bottom of the page.

**New Thread — `/forum/new`**
A form with a category selector, title input, markdown content editor, and tags input. Submit calls POST `/api/forum/threads`.

---

### 11. Notifications — `/notifications`

Protected page. A vertical list of NotificationItems. Each item shows the notification message, timestamp, and a read/unread indicator dot. Pagination at the bottom.

The NotificationBell in the Navbar shows an unread count badge. Clicking it opens a small dropdown of the 5 most recent notifications with a "See all" link to this page.

---

### 12. Profile — `/profile`

Protected page. Shows the user's avatar, username, email, and role.

An edit form below allows updating the username, avatar URL, and toggle switches for notifications and email reminders. Submit calls PUT `/api/auth/profile`.

A separate "Change Password" section with current password, new password, and confirm new password inputs. Submit calls PUT `/api/auth/password`.

---

### 13. Leaderboard — `/leaderboard`

Public page. A table showing the top users by streak, with rank number, avatar, username, current streak, and longest streak. Data from GET `/api/streak/leaderboard`. Highlight the current logged-in user's row.

---

## Authentication Flow

Create an AuthContext that wraps the entire app. It stores the current user object and the JWT token. On app load, check localStorage for a saved token and call GET `/api/auth/me` to verify it is still valid. If valid, populate the context. If not, clear localStorage and redirect to login.

Create a ProtectedRoute component that wraps any page requiring login. If the user is not authenticated, redirect to `/login`. Use this on Dashboard, Lesson View, Exam, Playground, Notifications, and Profile pages.

---

## API Utility

Create a central `api.js` file that exports a fetch wrapper function. This function automatically attaches the `Authorization: Bearer <token>` header to every request that needs it, and handles 401 responses by clearing the token and redirecting to login. All pages call API functions through this utility — never write raw fetch calls inside components.

---

## State Management Notes

Use AuthContext for global user state. For everything else, use local useState and useEffect inside each page component. Fetch data when the component mounts. Show a LoadingSpinner while fetching. Show a Toast on errors.

---

## Route Summary

| Path | Page | Access |
|------|------|--------|
| `/` | Redirect to `/dashboard` or `/login` | — |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard | Protected |
| `/courses` | Course List | Public |
| `/courses/:slug` | Course Detail | Public |
| `/courses/:courseSlug/:lessonSlug` | Lesson View | Protected |
| `/exams/:courseId` | Exam | Protected |
| `/playground` | Playground | Protected |
| `/articles` | Article List | Public |
| `/articles/:slug` | Article Detail | Public |
| `/forum` | Forum Home | Public |
| `/forum/:categorySlug` | Category View | Public |
| `/forum/:categorySlug/:threadSlug` | Thread View | Public |
| `/forum/new` | New Thread | Protected |
| `/notifications` | Notifications | Protected |
| `/profile` | Profile & Settings | Protected |
| `/leaderboard` | Leaderboard | Public |

---

## Build Order Recommendation

1. Build all shared components first (Button, Input, Modal, Badge, ProgressBar, Toast, Spinner, Avatar)
2. Set up AuthContext and ProtectedRoute
3. Build api.js utility
4. Build Navbar and Sidebar
5. Build Login and Register pages
6. Build Dashboard
7. Build Courses and Course Detail
8. Build Lesson View
9. Build Playground
10. Build Forum
11. Build Articles
12. Build Exam
13. Build Notifications, Profile, Leaderboard last
