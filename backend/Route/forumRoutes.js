import express from 'express';
import {
  // Categories
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  // Threads
  getThreads,
  getThreadsByCategory,
  getThread,
  getThreadBySlug,
  createThread,
  updateThread,
  deleteThread,
  togglePinThread,
  toggleLockThread,
  markThreadSolved,
  toggleThreadLike,
  // Posts
  getPostsByThread,
  createPost,
  updatePost,
  deletePost,
  togglePostLike,
  // User's content
  getMyThreads,
  getMyPosts
} from '../Controller/forumController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { validate, uuidParam } from '../middleware/validators.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name')
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters')
];

const threadValidation = [
  body('categoryId')
    .notEmpty().withMessage('Category is required')
    .isUUID().withMessage('Invalid category ID'),
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('content')
    .notEmpty().withMessage('Content is required')
];

const postValidation = [
  body('content')
    .notEmpty().withMessage('Content is required')
];

// ==================== CATEGORY ROUTES ====================

// Public
router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);
router.get('/categories/:slug/threads', getThreadsByCategory);

// Admin
router.post('/categories', protect, adminOnly, categoryValidation, validate, createCategory);
router.put('/categories/:id', protect, adminOnly, uuidParam('id'), validate, updateCategory);
router.delete('/categories/:id', protect, adminOnly, uuidParam('id'), validate, deleteCategory);

// ==================== THREAD ROUTES ====================

// Public (with optional auth for like status)
router.get('/threads', optionalAuth, getThreads);
router.get('/threads/:id', optionalAuth, uuidParam('id'), validate, getThread);
router.get('/categories/:categorySlug/threads/:threadSlug', optionalAuth, getThreadBySlug);

// Protected - User actions
router.post('/threads', protect, threadValidation, validate, createThread);
router.put('/threads/:id', protect, uuidParam('id'), validate, updateThread);
router.delete('/threads/:id', protect, uuidParam('id'), validate, deleteThread);
router.post('/threads/:id/like', protect, uuidParam('id'), validate, toggleThreadLike);
router.put('/threads/:id/solve', protect, uuidParam('id'), validate, markThreadSolved);

// Admin - Thread moderation
router.put('/threads/:id/pin', protect, adminOnly, uuidParam('id'), validate, togglePinThread);
router.put('/threads/:id/lock', protect, adminOnly, uuidParam('id'), validate, toggleLockThread);

// ==================== POST ROUTES ====================

// Public (with optional auth for like status)
router.get('/threads/:threadId/posts', optionalAuth, uuidParam('threadId'), validate, getPostsByThread);

// Protected
router.post('/threads/:threadId/posts', protect, uuidParam('threadId'), postValidation, validate, createPost);
router.put('/posts/:id', protect, uuidParam('id'), postValidation, validate, updatePost);
router.delete('/posts/:id', protect, uuidParam('id'), validate, deletePost);
router.post('/posts/:id/like', protect, uuidParam('id'), validate, togglePostLike);

// ==================== USER'S CONTENT ====================

router.get('/my/threads', protect, getMyThreads);
router.get('/my/posts', protect, getMyPosts);

export default router;
