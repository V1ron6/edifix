import express from 'express';
import {
  getLessonsByCourse,
  getLesson,
  getLessonBySlug,
  createLesson,
  updateLesson,
  deleteLesson
} from '../Controller/lessonController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { lessonValidation, validate, uuidParam } from '../middleware/validators.js';

const router = express.Router();

// Public routes
router.get('/course/:courseId', uuidParam('courseId'), validate, getLessonsByCourse);
router.get('/slug/:courseSlug/:lessonSlug', getLessonBySlug);
router.get('/:id', uuidParam('id'), validate, getLesson);

// Admin routes
router.post('/', protect, adminOnly, lessonValidation, validate, createLesson);
router.put('/:id', protect, adminOnly, uuidParam('id'), validate, updateLesson);
router.delete('/:id', protect, adminOnly, uuidParam('id'), validate, deleteLesson);

export default router;
