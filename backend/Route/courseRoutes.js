import express from 'express';
import {
  getCourses,
  getCourse,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getLearningPath
} from '../Controller/courseController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { courseValidation, validate, uuidParam } from '../middleware/validators.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/learning-path/:category', getLearningPath);
router.get('/slug/:slug', getCourseBySlug);
router.get('/:id', uuidParam('id'), validate, getCourse);

// Admin routes
router.post('/', protect, adminOnly, courseValidation, validate, createCourse);
router.put('/:id', protect, adminOnly, uuidParam('id'), validate, updateCourse);
router.delete('/:id', protect, adminOnly, uuidParam('id'), validate, deleteCourse);

export default router;
