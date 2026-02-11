import express from 'express';
import {
  getArticles,
  getArticle,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticlesAdmin,
  getFeaturedArticles,
  getArticlesByCategory
} from '../Controller/articleController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validate, uuidParam } from '../middleware/validators.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation for articles
const articleValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('content')
    .notEmpty().withMessage('Content is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['html', 'css', 'javascript', 'nodejs', 'expressjs', 'databases', 'git', 'deployment', 'best-practices', 'tips', 'general'])
    .withMessage('Invalid category')
];

// Public routes
router.get('/', getArticles);
router.get('/featured', getFeaturedArticles);
router.get('/category/:category', getArticlesByCategory);
router.get('/slug/:slug', getArticleBySlug);
router.get('/:id', uuidParam('id'), validate, getArticle);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllArticlesAdmin);
router.post('/', protect, adminOnly, articleValidation, validate, createArticle);
router.put('/:id', protect, adminOnly, uuidParam('id'), validate, updateArticle);
router.delete('/:id', protect, adminOnly, uuidParam('id'), validate, deleteArticle);

export default router;
