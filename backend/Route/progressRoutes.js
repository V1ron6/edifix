import express from 'express';
import {
  getOverallProgress,
  getCourseProgress,
  updateLessonProgress,
  getRecentActivity,
  getContinueLesson
} from '../Controller/progressController.js';
import { protect } from '../middleware/auth.js';
import { uuidParam, validate } from '../middleware/validators.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getOverallProgress);
router.get('/activity', getRecentActivity);
router.get('/continue', getContinueLesson);
router.get('/course/:courseId', uuidParam('courseId'), validate, getCourseProgress);
router.post('/lesson/:lessonId', uuidParam('lessonId'), validate, updateLessonProgress);

export default router;
