# EDIFIX API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

---

## Table of Contents
1. [Health Check](#health-check)
2. [Authentication](#authentication-endpoints)
3. [Courses](#courses)
4. [Lessons](#lessons)
5. [Progress](#progress)
6. [Streak](#streak)
7. [Exams](#exams)
8. [Notifications](#notifications)
9. [Reminders](#reminders)
10. [Playground](#playground)
11. [Dashboard](#dashboard)
12. [Articles](#articles)
13. [Forum](#forum)

---

## Health Check

### GET /api/health
Get server health status.

**Access:** Public

**Response:**
```json
{
  "server": "ACTIVE",
  "secure": "HTTP",
  "database": "CONNECTED",
  "uptime": "1h 30m 45s",
  "port": 4000,
  "mode": "development"
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Access:** Public

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "jwt_token"
  }
}
```

---

### POST /api/auth/login
Login to an existing account.

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token"
  }
}
```

---

### GET /api/auth/me
Get current authenticated user details.

**Access:** Protected

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": null,
    "role": "student",
    "isEmailVerified": true,
    "notificationsEnabled": true,
    "emailRemindersEnabled": true
  }
}
```

---

### PUT /api/auth/profile
Update user profile.

**Access:** Protected

**Request Body:**
```json
{
  "username": "newusername",
  "avatar": "https://example.com/avatar.jpg",
  "notificationsEnabled": true,
  "emailRemindersEnabled": false
}
```

---

### PUT /api/auth/password
Change user password.

**Access:** Protected

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

---

## Courses

### GET /api/courses
Get all courses.

**Access:** Public

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by 'frontend' or 'backend' |
| difficulty | string | Filter by 'beginner', 'intermediate', 'advanced' |
| published | boolean | Filter by published status |

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "uuid",
      "title": "HTML Tutorial",
      "slug": "html-tutorial",
      "description": "...",
      "category": "frontend",
      "order": 1,
      "difficulty": "beginner",
      "estimatedHours": 10,
      "isPublished": true,
      "lessons": [...]
    }
  ]
}
```

---

### GET /api/courses/:id
Get a single course by ID.

**Access:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "HTML Tutorial",
    "slug": "html-tutorial",
    "description": "...",
    "lessons": [...]
  }
}
```

---

### GET /api/courses/slug/:slug
Get a course by its slug.

**Access:** Public

---

### GET /api/courses/learning-path/:category
Get the learning path for a category (frontend/backend).

**Access:** Public

**Parameters:**
- category: 'frontend' or 'backend'

---

### POST /api/courses
Create a new course.

**Access:** Admin only

**Request Body:**
```json
{
  "title": "Course Title",
  "description": "Course description",
  "category": "frontend",
  "order": 1,
  "difficulty": "beginner",
  "estimatedHours": 10,
  "prerequisites": [],
  "thumbnail": "https://example.com/image.jpg"
}
```

---

### PUT /api/courses/:id
Update a course.

**Access:** Admin only

---

### DELETE /api/courses/:id
Delete a course.

**Access:** Admin only

---

## Lessons

### GET /api/lessons/course/:courseId
Get all lessons for a course.

**Access:** Public

---

### GET /api/lessons/:id
Get a single lesson by ID.

**Access:** Public

---

### GET /api/lessons/slug/:courseSlug/:lessonSlug
Get a lesson by course slug and lesson slug.

**Access:** Public

---

### POST /api/lessons
Create a new lesson.

**Access:** Admin only

**Request Body:**
```json
{
  "courseId": "uuid",
  "title": "Lesson Title",
  "content": "Markdown content...",
  "order": 1,
  "type": "theory",
  "videoUrl": "https://youtube.com/...",
  "estimatedMinutes": 15,
  "codeTemplate": "// starter code",
  "expectedOutput": "expected result",
  "hints": ["Hint 1", "Hint 2"],
  "isPublished": true
}
```

---

### PUT /api/lessons/:id
Update a lesson.

**Access:** Admin only

---

### DELETE /api/lessons/:id
Delete a lesson.

**Access:** Admin only

---

## Progress

### GET /api/progress
Get overall progress for the authenticated user.

**Access:** Protected

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCourses": 10,
    "completedCourses": 3,
    "totalLessons": 100,
    "completedLessons": 45,
    "overallProgress": 45,
    "totalTimeSpent": 1250
  }
}
```

---

### GET /api/progress/course/:courseId
Get progress for a specific course.

**Access:** Protected

---

### GET /api/progress/activity
Get recent learning activity.

**Access:** Protected

---

### GET /api/progress/continue
Get the next lesson to continue learning.

**Access:** Protected

---

### POST /api/progress/lesson/:lessonId
Update progress for a lesson.

**Access:** Protected

**Request Body:**
```json
{
  "status": "completed",
  "timeSpentMinutes": 15,
  "lastAttemptCode": "// user's code"
}
```

---

## Streak

### GET /api/streak
Get the current user's streak information.

**Access:** Protected

**Response:**
```json
{
  "success": true,
  "data": {
    "currentStreak": 7,
    "longestStreak": 15,
    "lastActivityDate": "2026-02-10",
    "totalActiveDays": 45,
    "streakFreezes": 2
  }
}
```

---

### GET /api/streak/leaderboard
Get the streak leaderboard.

**Access:** Public

---

### POST /api/streak/update
Update the user's streak (called when completing activity).

**Access:** Protected

---

### POST /api/streak/use-freeze
Use a streak freeze to maintain streak.

**Access:** Protected

---

### POST /api/streak/award-freeze/:userId
Award a streak freeze to a user.

**Access:** Admin only

---

## Exams

### GET /api/exams/course/:courseId
Get all exams for a course.

**Access:** Protected

---

### GET /api/exams/:id
Get a single exam.

**Access:** Protected

---

### GET /api/exams/results
Get the authenticated user's exam results.

**Access:** Protected

---

### POST /api/exams/:id/submit
Submit exam answers.

**Access:** Protected

**Request Body:**
```json
{
  "answers": [
    { "questionIndex": 0, "answer": "A" },
    { "questionIndex": 1, "answer": "B" }
  ],
  "timeTaken": 1200
}
```

---

### POST /api/exams/generate
Generate a dynamic exam based on category/difficulty.

**Access:** Protected

**Request Body:**
```json
{
  "category": "javascript",
  "difficulty": "intermediate",
  "questionCount": 10
}
```

---

### POST /api/exams/submit-dynamic
Submit a dynamically generated exam.

**Access:** Protected

---

### GET /api/exams/questions/stats
Get question statistics.

**Access:** Admin only

---

### GET /api/exams/questions/:category
Get questions by category.

**Access:** Admin only

---

### POST /api/exams/questions
Add a new question.

**Access:** Admin only

**Request Body:**
```json
{
  "courseId": "uuid (optional)",
  "category": "javascript",
  "difficulty": "intermediate",
  "type": "multiple_choice",
  "question": "What is the output of console.log(typeof null)?",
  "options": ["undefined", "null", "object", "string"],
  "correctAnswer": "2",
  "explanation": "typeof null returns 'object' due to a historical bug",
  "points": 10
}
```

---

### PUT /api/exams/questions/:id
Update a question.

**Access:** Admin only

---

### DELETE /api/exams/questions/:id
Delete a question.

**Access:** Admin only

---

### POST /api/exams
Create a new exam.

**Access:** Admin only

**Request Body:**
```json
{
  "courseId": "uuid",
  "title": "JavaScript Fundamentals Exam",
  "description": "Test your JavaScript knowledge",
  "questions": [...],
  "totalPoints": 100,
  "passingScore": 70,
  "timeLimit": 30,
  "isPublished": true
}
```

---

### POST /api/exams/trigger-random
Trigger a random exam notification to users.

**Access:** Admin only

---

### PUT /api/exams/:id
Update an exam.

**Access:** Admin only

---

### DELETE /api/exams/:id
Delete an exam.

**Access:** Admin only

---

## Notifications

### GET /api/notifications
Get all notifications for the authenticated user.

**Access:** Protected

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| unreadOnly | boolean | Only show unread notifications |

---

### GET /api/notifications/unread-count
Get count of unread notifications.

**Access:** Protected

---

### PUT /api/notifications/:id/read
Mark a notification as read.

**Access:** Protected

---

### PUT /api/notifications/read-all
Mark all notifications as read.

**Access:** Protected

---

### DELETE /api/notifications/:id
Delete a notification.

**Access:** Protected

---

### DELETE /api/notifications/clear-read
Clear all read notifications.

**Access:** Protected

---

### POST /api/notifications
Create a notification for a specific user.

**Access:** Admin only

**Request Body:**
```json
{
  "userId": "uuid",
  "type": "system",
  "title": "Important Update",
  "message": "We have new features available!",
  "data": {}
}
```

---

### POST /api/notifications/broadcast
Broadcast a notification to all users.

**Access:** Admin only

**Request Body:**
```json
{
  "type": "new_course",
  "title": "New Course Available",
  "message": "Check out our new React course!",
  "data": { "courseId": "uuid" }
}
```

---

## Reminders

### GET /api/reminders
Get all reminders for the authenticated user.

**Access:** Protected

---

### GET /api/reminders/:id
Get a single reminder.

**Access:** Protected

---

### POST /api/reminders
Create a new reminder.

**Access:** Protected

**Request Body:**
```json
{
  "title": "Daily Study Reminder",
  "message": "Time to learn something new!",
  "reminderTime": "09:00:00",
  "daysOfWeek": [1, 2, 3, 4, 5],
  "type": "study",
  "sendEmail": true,
  "relatedCourseId": "uuid (optional)"
}
```

---

### PUT /api/reminders/:id
Update a reminder.

**Access:** Protected

---

### PUT /api/reminders/:id/toggle
Toggle a reminder's active status.

**Access:** Protected

---

### DELETE /api/reminders/:id
Delete a reminder.

**Access:** Protected

---

### POST /api/reminders/process
Process pending reminders (for cron job).

**Access:** Admin only

---

## Playground

### GET /api/playground
Get all playground sessions for the authenticated user.

**Access:** Protected

---

### GET /api/playground/explore
Explore public playground sessions.

**Access:** Public

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| language | string | Filter by language (html, css, javascript, nodejs) |
| page | number | Page number |
| limit | number | Items per page |

---

### GET /api/playground/:id
Get a single playground session.

**Access:** Public (for public sessions) / Protected (for private)

---

### POST /api/playground
Create a new playground session.

**Access:** Protected

**Request Body:**
```json
{
  "title": "My Cool Project",
  "language": "javascript",
  "htmlCode": "<!DOCTYPE html>...",
  "cssCode": "/* styles */",
  "jsCode": "// JavaScript code",
  "isPublic": true
}
```

---

### POST /api/playground/run
Execute code in the playground.

**Access:** Protected

**Request Body:**
```json
{
  "language": "javascript",
  "code": "console.log('Hello, World!');"
}
```

---

### POST /api/playground/:id/fork
Fork an existing playground session.

**Access:** Protected

---

### PUT /api/playground/:id
Update a playground session.

**Access:** Protected

---

### DELETE /api/playground/:id
Delete a playground session.

**Access:** Protected

---

## Dashboard

### GET /api/dashboard
Get the student dashboard data.

**Access:** Protected

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "streak": { ... },
    "progress": { ... },
    "recentActivity": [...],
    "upcomingExams": [...],
    "notifications": [...]
  }
}
```

---

### GET /api/dashboard/admin
Get the admin dashboard data.

**Access:** Admin only

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalCourses": 28,
      "totalLessons": 350,
      "totalExams": 45,
      "activeUsers": 89
    },
    "recentUsers": [...],
    "popularCourses": [...]
  }
}
```

---

## Articles

### GET /api/articles
Get all published articles.

**Access:** Public

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| tag | string | Filter by tag |
| featured | boolean | Filter featured articles |
| published | boolean | Filter by published status |
| search | string | Search in title/content/excerpt |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "totalPages": 5,
  "currentPage": 1,
  "data": [
    {
      "id": "uuid",
      "title": "10 HTML Best Practices",
      "slug": "10-html-best-practices",
      "excerpt": "Learn the essential HTML best practices...",
      "category": "html",
      "tags": ["html", "best-practices"],
      "readTimeMinutes": 8,
      "viewCount": 150,
      "isPublished": true,
      "isFeatured": true,
      "publishedAt": "2026-02-10T10:00:00Z",
      "author": {
        "id": "uuid",
        "username": "admin",
        "avatar": null
      }
    }
  ]
}
```

---

### GET /api/articles/featured
Get featured articles.

**Access:** Public

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Number of articles (default: 5) |

---

### GET /api/articles/category/:category
Get articles by category.

**Access:** Public

**Categories:**
- html
- css
- javascript
- nodejs
- expressjs
- databases
- git
- deployment
- best-practices
- tips
- general

---

### GET /api/articles/:id
Get a single article by ID (increments view count).

**Access:** Public

---

### GET /api/articles/slug/:slug
Get an article by its slug (increments view count).

**Access:** Public

---

### GET /api/articles/admin/all
Get all articles including unpublished (admin view).

**Access:** Admin only

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| published | boolean | Filter by published status |
| featured | boolean | Filter by featured status |
| page | number | Page number |
| limit | number | Items per page |

---

### POST /api/articles
Create a new article.

**Access:** Admin only

**Request Body:**
```json
{
  "title": "Article Title",
  "content": "Markdown content...",
  "excerpt": "Short description",
  "thumbnail": "https://example.com/image.jpg",
  "category": "javascript",
  "tags": ["javascript", "tips"],
  "source": "https://original-source.com",
  "readTimeMinutes": 10,
  "isPublished": true,
  "isFeatured": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "id": "uuid",
    "title": "Article Title",
    "slug": "article-title",
    ...
  }
}
```

---

### PUT /api/articles/:id
Update an article.

**Access:** Admin only

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "excerpt": "Updated excerpt",
  "category": "css",
  "tags": ["css", "best-practices"],
  "isPublished": true,
  "isFeatured": true
}
```

---

### DELETE /api/articles/:id
Delete an article.

**Access:** Admin only

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 409 | Conflict - Resource already exists |
| 422 | Validation Error |
| 500 | Server Error |

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes for authenticated users
- 50 requests per 15 minutes for unauthenticated users

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default varies by endpoint)

**Response includes:**
```json
{
  "count": 10,
  "total": 100,
  "totalPages": 10,
  "currentPage": 1,
  "data": [...]
}
```

---

## Forum

The forum allows registered users to create discussions, ask questions, and interact with each other.

### Categories

#### GET /api/forum/categories
Get all forum categories.

**Access:** Public

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": "uuid",
      "name": "General Discussion",
      "slug": "general-discussion",
      "description": "General conversations...",
      "icon": "chat",
      "color": "#3498db",
      "order": 1,
      "threadCount": 25
    }
  ]
}
```

---

#### GET /api/forum/categories/:slug
Get a single category by slug.

**Access:** Public

---

#### GET /api/forum/categories/:slug/threads
Get all threads in a category.

**Access:** Public

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| sort | string | 'latest', 'popular', 'most-replies' |

---

#### POST /api/forum/categories
Create a new category.

**Access:** Admin only

**Request Body:**
```json
{
  "name": "Category Name",
  "description": "Category description",
  "icon": "chat",
  "color": "#3498db",
  "order": 1
}
```

---

#### PUT /api/forum/categories/:id
Update a category.

**Access:** Admin only

---

#### DELETE /api/forum/categories/:id
Delete a category (only if empty).

**Access:** Admin only

---

### Threads

#### GET /api/forum/threads
Get all threads with filtering options.

**Access:** Public

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category slug |
| tag | string | Filter by tag |
| solved | boolean | Filter by solved status |
| search | string | Search in title/content |
| sort | string | 'latest', 'popular', 'most-replies', 'oldest' |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "totalPages": 8,
  "currentPage": 1,
  "data": [
    {
      "id": "uuid",
      "title": "How do I center a div?",
      "slug": "how-do-i-center-a-div",
      "content": "I've been trying to center...",
      "tags": ["css", "flexbox"],
      "viewCount": 150,
      "replyCount": 12,
      "likeCount": 5,
      "isPinned": false,
      "isLocked": false,
      "isSolved": true,
      "lastActivityAt": "2026-02-10T12:00:00Z",
      "author": {
        "id": "uuid",
        "username": "johndoe",
        "avatar": null
      },
      "category": {
        "id": "uuid",
        "name": "HTML & CSS",
        "slug": "html-css",
        "color": "#e44d26"
      }
    }
  ]
}
```

---

#### GET /api/forum/threads/:id
Get a single thread by ID (increments view count).

**Access:** Public

---

#### GET /api/forum/categories/:categorySlug/threads/:threadSlug
Get a thread by category and thread slug.

**Access:** Public

---

#### POST /api/forum/threads
Create a new thread.

**Access:** Protected

**Request Body:**
```json
{
  "categoryId": "uuid",
  "title": "Thread Title",
  "content": "Markdown content...",
  "tags": ["javascript", "async"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thread created successfully",
  "data": {
    "id": "uuid",
    "title": "Thread Title",
    "slug": "thread-title",
    ...
  }
}
```

---

#### PUT /api/forum/threads/:id
Update a thread.

**Access:** Protected (author or admin)

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["updated", "tags"],
  "categoryId": "new-category-uuid"
}
```

---

#### DELETE /api/forum/threads/:id
Delete a thread and all its posts.

**Access:** Protected (author or admin)

---

#### POST /api/forum/threads/:id/like
Like or unlike a thread (toggle).

**Access:** Protected

**Response:**
```json
{
  "success": true,
  "message": "Thread liked",
  "data": {
    "liked": true,
    "likeCount": 6
  }
}
```

---

#### PUT /api/forum/threads/:id/solve
Mark a thread as solved (optionally with a solution post).

**Access:** Protected (thread author or admin)

**Request Body:**
```json
{
  "postId": "uuid"
}
```

---

#### PUT /api/forum/threads/:id/pin
Pin or unpin a thread (toggle).

**Access:** Admin only

---

#### PUT /api/forum/threads/:id/lock
Lock or unlock a thread (toggle).

**Access:** Admin only

---

### Posts (Replies)

#### GET /api/forum/threads/:threadId/posts
Get all posts (replies) for a thread.

**Access:** Public

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "totalPages": 3,
  "currentPage": 1,
  "data": [
    {
      "id": "uuid",
      "content": "Here's how you can solve this...",
      "likeCount": 8,
      "isEdited": false,
      "isSolution": true,
      "hasLiked": false,
      "createdAt": "2026-02-10T10:30:00Z",
      "author": {
        "id": "uuid",
        "username": "helpfuluser",
        "avatar": null
      },
      "replies": [
        {
          "id": "uuid",
          "content": "Thanks, this worked!",
          "author": {...}
        }
      ]
    }
  ]
}
```

---

#### POST /api/forum/threads/:threadId/posts
Create a new post (reply) in a thread.

**Access:** Protected

**Request Body:**
```json
{
  "content": "Markdown content...",
  "parentId": "uuid (optional - for nested replies)"
}
```

---

#### PUT /api/forum/posts/:id
Update a post.

**Access:** Protected (author or admin)

**Request Body:**
```json
{
  "content": "Updated content..."
}
```

---

#### DELETE /api/forum/posts/:id
Delete a post.

**Access:** Protected (author or admin)

---

#### POST /api/forum/posts/:id/like
Like or unlike a post (toggle).

**Access:** Protected

**Response:**
```json
{
  "success": true,
  "message": "Post liked",
  "data": {
    "liked": true,
    "likeCount": 9
  }
}
```

---

### User's Forum Content

#### GET /api/forum/my/threads
Get current user's threads.

**Access:** Protected

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

---

#### GET /api/forum/my/posts
Get current user's posts.

**Access:** Protected

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
