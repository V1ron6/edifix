import express from 'express';
import {
  getReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
  toggleReminder,
  processReminders
} from '../Controller/reminderController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { reminderValidation, validate, uuidParam } from '../middleware/validators.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/', getReminders);
router.get('/:id', uuidParam('id'), validate, getReminder);
router.post('/', reminderValidation, validate, createReminder);
router.put('/:id', uuidParam('id'), validate, updateReminder);
router.put('/:id/toggle', uuidParam('id'), validate, toggleReminder);
router.delete('/:id', uuidParam('id'), validate, deleteReminder);

// System/Admin route for cron job
router.post('/process', adminOnly, processReminders);

export default router;
