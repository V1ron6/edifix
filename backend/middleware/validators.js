import { validationResult, body, param, query } from 'express-validator';

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validations
export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3-50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Course validations
export const courseValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be 3-100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('category')
    .isIn(['frontend', 'backend'])
    .withMessage('Category must be frontend or backend'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level')
];

// Lesson validations
export const lessonValidation = [
  body('courseId')
    .isUUID()
    .withMessage('Invalid course ID'),
  body('title')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be 3-150 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  body('type')
    .optional()
    .isIn(['theory', 'practice', 'quiz'])
    .withMessage('Invalid lesson type')
];

// Exam validations
export const examValidation = [
  body('courseId')
    .isUUID()
    .withMessage('Invalid course ID'),
  body('title')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be 3-150 characters'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),
  body('totalPoints')
    .isInt({ min: 1 })
    .withMessage('Total points must be a positive integer'),
  body('passingScore')
    .isInt({ min: 1 })
    .withMessage('Passing score must be a positive integer')
];

// Reminder validations
export const reminderValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be 3-150 characters'),
  body('reminderTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .withMessage('Invalid time format (HH:MM or HH:MM:SS)'),
  body('type')
    .optional()
    .isIn(['study', 'exam', 'custom'])
    .withMessage('Invalid reminder type')
];

// Playground validations
export const playgroundValidation = [
  body('language')
    .isIn(['html', 'css', 'javascript', 'nodejs'])
    .withMessage('Invalid language'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Title must be max 150 characters')
];

// UUID param validation
export const uuidParam = (paramName = 'id') => [
  param(paramName)
    .isUUID()
    .withMessage(`Invalid ${paramName}`)
];

// Pagination validation
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];
