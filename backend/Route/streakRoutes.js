import express from 'express';
import {
  getStreak,
  updateStreak,
  useStreakFreeze,
  getStreakLeaderboard,
  awardStreakFreeze
} from '../Controller/streakController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uuidParam, validate } from '../middleware/validators.js';

const router = express.Router();

// Public routes
router.get('/leaderboard', getStreakLeaderboard);

// Protected routes
router.get('/', protect, getStreak);
router.post('/update', protect, updateStreak);
router.post('/use-freeze', protect, useStreakFreeze);

// Admin routes
router.post('/award-freeze/:userId', protect, adminOnly, uuidParam('userId'), validate, awardStreakFreeze);

export default router;
