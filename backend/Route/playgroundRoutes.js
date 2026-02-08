import express from 'express';
import {
  getMySessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  forkSession,
  explorePublicSessions,
  runCode
} from '../Controller/playgroundController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { playgroundValidation, validate, uuidParam } from '../middleware/validators.js';

const router = express.Router();

// Public routes
router.get('/explore', explorePublicSessions);

// Routes with optional auth (for viewing public sessions)
router.get('/:id', optionalAuth, uuidParam('id'), validate, getSession);

// Protected routes
router.get('/', protect, getMySessions);
router.post('/', protect, playgroundValidation, validate, createSession);
router.post('/run', protect, runCode);
router.post('/:id/fork', protect, uuidParam('id'), validate, forkSession);
router.put('/:id', protect, uuidParam('id'), validate, updateSession);
router.delete('/:id', protect, uuidParam('id'), validate, deleteSession);

export default router;
