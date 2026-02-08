import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  createNotification,
  broadcastNotification
} from '../Controller/notificationController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uuidParam, validate } from '../middleware/validators.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.delete('/clear-read', clearReadNotifications);
router.put('/:id/read', uuidParam('id'), validate, markAsRead);
router.delete('/:id', uuidParam('id'), validate, deleteNotification);

// Admin routes
router.post('/', adminOnly, createNotification);
router.post('/broadcast', adminOnly, broadcastNotification);

export default router;
