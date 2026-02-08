import express from 'express';
import {
  getExamsByCourse,
  getExam,
  submitExam,
  getMyResults,
  createExam,
  updateExam,
  deleteExam,
  triggerRandomExam,
  generateDynamicExam,
  submitDynamicExam,
  getQuestionsByCategory,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionStats
} from '../Controller/examController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { examValidation, validate, uuidParam } from '../middleware/validators.js';

const router = express.Router();

// Protected routes (student)
router.get('/results', protect, getMyResults);
router.get('/course/:courseId', protect, uuidParam('courseId'), validate, getExamsByCourse);
router.get('/:id', protect, uuidParam('id'), validate, getExam);
router.post('/:id/submit', protect, uuidParam('id'), validate, submitExam);

// Dynamic exam routes
router.post('/generate', protect, generateDynamicExam);
router.post('/submit-dynamic', protect, submitDynamicExam);

// Question management routes (Admin)
router.get('/questions/stats', protect, adminOnly, getQuestionStats);
router.get('/questions/:category', protect, adminOnly, getQuestionsByCategory);
router.post('/questions', protect, adminOnly, addQuestion);
router.put('/questions/:id', protect, adminOnly, uuidParam('id'), validate, updateQuestion);
router.delete('/questions/:id', protect, adminOnly, uuidParam('id'), validate, deleteQuestion);

// Admin routes
router.post('/', protect, adminOnly, examValidation, validate, createExam);
router.post('/trigger-random', protect, adminOnly, triggerRandomExam);
router.put('/:id', protect, adminOnly, uuidParam('id'), validate, updateExam);
router.delete('/:id', protect, adminOnly, uuidParam('id'), validate, deleteExam);

export default router;
