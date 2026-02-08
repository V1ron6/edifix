-- EDIFIX Database Schema
-- Run this script to create all tables manually
-- Database: MySQL/MariaDB

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS edifix;
USE edifix;

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  isEmailVerified TINYINT(1) DEFAULT 0,
  lastLoginAt DATETIME DEFAULT NULL,
  notificationsEnabled TINYINT(1) DEFAULT 1,
  emailRemindersEnabled TINYINT(1) DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================== COURSES TABLE ====================
CREATE TABLE IF NOT EXISTS courses (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  thumbnail VARCHAR(255) DEFAULT NULL,
  category ENUM('frontend', 'backend') NOT NULL,
  `order` INT NOT NULL COMMENT 'Order in learning path',
  difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  estimatedHours INT DEFAULT 0,
  isPublished TINYINT(1) DEFAULT 0,
  prerequisites JSON DEFAULT NULL COMMENT 'Array of course IDs that must be completed first',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================== LESSONS TABLE ====================
CREATE TABLE IF NOT EXISTS lessons (
  id CHAR(36) PRIMARY KEY,
  courseId CHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  content LONGTEXT NOT NULL COMMENT 'Markdown content',
  `order` INT NOT NULL,
  type ENUM('theory', 'practice', 'quiz') DEFAULT 'theory',
  videoUrl VARCHAR(255) DEFAULT NULL,
  estimatedMinutes INT DEFAULT 15,
  codeTemplate TEXT DEFAULT NULL COMMENT 'Starter code for practice lessons',
  expectedOutput TEXT DEFAULT NULL COMMENT 'Expected output for validation',
  hints JSON DEFAULT NULL COMMENT 'Array of hints for practice lessons',
  isPublished TINYINT(1) DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==================== STREAKS TABLE ====================
CREATE TABLE IF NOT EXISTS streaks (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL UNIQUE,
  currentStreak INT DEFAULT 0,
  longestStreak INT DEFAULT 0,
  lastActivityDate DATE DEFAULT NULL,
  totalActiveDays INT DEFAULT 0,
  streakFreezes INT DEFAULT 0 COMMENT 'Number of streak freezes available',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==================== PROGRESS TABLE ====================
CREATE TABLE IF NOT EXISTS progress (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  courseId CHAR(36) NOT NULL,
  lessonId CHAR(36) NOT NULL,
  status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  completedAt DATETIME DEFAULT NULL,
  timeSpentMinutes INT DEFAULT 0,
  attempts INT DEFAULT 0 COMMENT 'Number of attempts for practice lessons',
  lastAttemptCode TEXT DEFAULT NULL COMMENT 'Last code submitted in playground',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (lessonId) REFERENCES lessons(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY unique_user_lesson (userId, lessonId)
);

-- ==================== EXAMS TABLE ====================
CREATE TABLE IF NOT EXISTS exams (
  id CHAR(36) PRIMARY KEY,
  courseId CHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT DEFAULT NULL,
  questions JSON NOT NULL COMMENT 'Array of question objects',
  totalPoints INT NOT NULL,
  passingScore INT NOT NULL COMMENT 'Minimum points to pass',
  timeLimit INT DEFAULT 30 COMMENT 'Time limit in minutes',
  isPublished TINYINT(1) DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==================== EXAM RESULTS TABLE ====================
CREATE TABLE IF NOT EXISTS exam_results (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  examId CHAR(36) NOT NULL,
  score INT NOT NULL,
  totalPoints INT NOT NULL,
  passed TINYINT(1) NOT NULL,
  answers JSON NOT NULL COMMENT 'User answers for each question',
  timeTaken INT DEFAULT NULL COMMENT 'Time taken in seconds',
  startedAt DATETIME NOT NULL,
  completedAt DATETIME NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==================== NOTIFICATIONS TABLE ====================
CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  type ENUM('streak_reminder', 'exam_ready', 'course_completed', 'lesson_completed', 'streak_milestone', 'streak_broken', 'new_course', 'system') NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  data JSON DEFAULT NULL COMMENT 'Additional data like courseId, examId, etc.',
  isRead TINYINT(1) DEFAULT 0,
  readAt DATETIME DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==================== REMINDERS TABLE ====================
CREATE TABLE IF NOT EXISTS reminders (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT DEFAULT NULL,
  reminderTime TIME NOT NULL COMMENT 'Time of day to send reminder (HH:MM:SS)',
  daysOfWeek JSON DEFAULT '[1,2,3,4,5,6,0]' COMMENT 'Days to send reminder (0=Sunday, 6=Saturday)',
  type ENUM('study', 'exam', 'custom') DEFAULT 'study',
  isActive TINYINT(1) DEFAULT 1,
  sendEmail TINYINT(1) DEFAULT 0,
  lastSentAt DATETIME DEFAULT NULL,
  relatedCourseId CHAR(36) DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (relatedCourseId) REFERENCES courses(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ==================== PLAYGROUND SESSIONS TABLE ====================
CREATE TABLE IF NOT EXISTS playground_sessions (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  title VARCHAR(150) DEFAULT 'Untitled',
  language ENUM('html', 'css', 'javascript', 'nodejs') NOT NULL,
  htmlCode LONGTEXT DEFAULT '<!DOCTYPE html>\n<html>\n<head>\n  <title>Playground</title>\n</head>\n<body>\n  \n</body>\n</html>',
  cssCode LONGTEXT DEFAULT '/* Your CSS here */',
  jsCode LONGTEXT DEFAULT '// Your JavaScript here',
  isPublic TINYINT(1) DEFAULT 0,
  forkedFromId CHAR(36) DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (forkedFromId) REFERENCES playground_sessions(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ==================== QUESTIONS TABLE ====================
CREATE TABLE IF NOT EXISTS questions (
  id CHAR(36) PRIMARY KEY,
  courseId CHAR(36) DEFAULT NULL COMMENT 'Optional - can be null for general questions',
  category ENUM('html', 'css', 'javascript', 'git', 'nodejs', 'databases', 'expressjs', 'middleware', 'cors', 'deployment', 'general') NOT NULL,
  difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  type ENUM('multiple_choice', 'true_false', 'code', 'fill_blank', 'short_answer') NOT NULL DEFAULT 'multiple_choice',
  question TEXT NOT NULL,
  options JSON DEFAULT NULL COMMENT 'Array of options for multiple choice questions',
  correctAnswer TEXT NOT NULL COMMENT 'Index for multiple choice, boolean string for true/false, or actual answer for others',
  explanation TEXT DEFAULT NULL COMMENT 'Explanation shown after answering',
  codeTemplate TEXT DEFAULT NULL COMMENT 'Starting code for code-type questions',
  expectedOutput TEXT DEFAULT NULL COMMENT 'Expected output for code-type questions',
  hints JSON DEFAULT NULL COMMENT 'Array of hints',
  points INT NOT NULL DEFAULT 10,
  timesUsed INT DEFAULT 0 COMMENT 'How many times used in exams',
  correctRate DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Percentage of correct answers',
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ==================== INDEXES ====================
CREATE INDEX idx_progress_user ON progress(userId);
CREATE INDEX idx_progress_course ON progress(courseId);
CREATE INDEX idx_notifications_user ON notifications(userId);
CREATE INDEX idx_notifications_read ON notifications(isRead);
CREATE INDEX idx_reminders_user ON reminders(userId);
CREATE INDEX idx_reminders_active ON reminders(isActive);
CREATE INDEX idx_exam_results_user ON exam_results(userId);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_playground_user ON playground_sessions(userId);

-- ==================== DONE ====================
-- All tables created successfully
