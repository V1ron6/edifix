import User from './User.js';
import Course from './Course.js';
import Lesson from './Lesson.js';
import Progress from './Progress.js';
import Streak from './Streak.js';
import Exam from './Exam.js';
import ExamResult from './ExamResult.js';
import Notification from './Notification.js';
import Reminder from './Reminder.js';
import PlaygroundSession from './PlaygroundSession.js';
import Question from './Question.js';
import Article from './Article.js';
import ForumCategory from './ForumCategory.js';
import ForumThread from './ForumThread.js';
import ForumPost from './ForumPost.js';
import ForumLike from './ForumLike.js';

// ==================== ASSOCIATIONS ====================

// User - Streak (1:1)
User.hasOne(Streak, { foreignKey: 'userId', as: 'streak' });
Streak.belongsTo(User, { foreignKey: 'userId' });

// User - Progress (1:M)
User.hasMany(Progress, { foreignKey: 'userId', as: 'progress' });
Progress.belongsTo(User, { foreignKey: 'userId' });

// User - Notifications (1:M)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// User - Reminders (1:M)
User.hasMany(Reminder, { foreignKey: 'userId', as: 'reminders' });
Reminder.belongsTo(User, { foreignKey: 'userId' });

// User - ExamResults (1:M)
User.hasMany(ExamResult, { foreignKey: 'userId', as: 'examResults' });
ExamResult.belongsTo(User, { foreignKey: 'userId' });

// User - PlaygroundSessions (1:M)
User.hasMany(PlaygroundSession, { foreignKey: 'userId', as: 'playgroundSessions' });
PlaygroundSession.belongsTo(User, { foreignKey: 'userId' });

// Course - Lessons (1:M)
Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

// Course - Exams (1:M)
Course.hasMany(Exam, { foreignKey: 'courseId', as: 'exams' });
Exam.belongsTo(Course, { foreignKey: 'courseId' });

// Course - Progress (1:M)
Course.hasMany(Progress, { foreignKey: 'courseId', as: 'progress' });
Progress.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Course - Reminders (1:M)
Course.hasMany(Reminder, { foreignKey: 'relatedCourseId', as: 'reminders' });
Reminder.belongsTo(Course, { foreignKey: 'relatedCourseId', as: 'course' });

// Lesson - Progress (1:M)
Lesson.hasMany(Progress, { foreignKey: 'lessonId', as: 'progress' });
Progress.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

// Exam - ExamResults (1:M)
Exam.hasMany(ExamResult, { foreignKey: 'examId', as: 'results' });
ExamResult.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

// PlaygroundSession self-reference (forking)
PlaygroundSession.belongsTo(PlaygroundSession, { foreignKey: 'forkedFromId', as: 'forkedFrom' });
PlaygroundSession.hasMany(PlaygroundSession, { foreignKey: 'forkedFromId', as: 'forks' });

// Course - Questions (1:M)
Course.hasMany(Question, { foreignKey: 'courseId', as: 'questions' });
Question.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User - Articles (1:M) - Admin authored articles
User.hasMany(Article, { foreignKey: 'authorId', as: 'articles' });
Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// ==================== FORUM ASSOCIATIONS ====================

// ForumCategory - ForumThread (1:M)
ForumCategory.hasMany(ForumThread, { foreignKey: 'categoryId', as: 'threads' });
ForumThread.belongsTo(ForumCategory, { foreignKey: 'categoryId', as: 'category' });

// User - ForumThread (1:M)
User.hasMany(ForumThread, { foreignKey: 'authorId', as: 'forumThreads' });
ForumThread.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// ForumThread - ForumPost (1:M)
ForumThread.hasMany(ForumPost, { foreignKey: 'threadId', as: 'posts' });
ForumPost.belongsTo(ForumThread, { foreignKey: 'threadId', as: 'thread' });

// User - ForumPost (1:M)
User.hasMany(ForumPost, { foreignKey: 'authorId', as: 'forumPosts' });
ForumPost.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// ForumPost self-reference (nested replies)
ForumPost.belongsTo(ForumPost, { foreignKey: 'parentId', as: 'parent' });
ForumPost.hasMany(ForumPost, { foreignKey: 'parentId', as: 'replies' });

// User - ForumLike (1:M)
User.hasMany(ForumLike, { foreignKey: 'userId', as: 'forumLikes' });
ForumLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ForumThread - ForumLike (1:M)
ForumThread.hasMany(ForumLike, { foreignKey: 'threadId', as: 'likes' });
ForumLike.belongsTo(ForumThread, { foreignKey: 'threadId', as: 'thread' });

// ForumPost - ForumLike (1:M)
ForumPost.hasMany(ForumLike, { foreignKey: 'postId', as: 'likes' });
ForumLike.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });

export {
  User,
  Course,
  Lesson,
  Progress,
  Streak,
  Exam,
  ExamResult,
  Notification,
  Reminder,
  PlaygroundSession,
  Question,
  Article,
  ForumCategory,
  ForumThread,
  ForumPost,
  ForumLike
};
