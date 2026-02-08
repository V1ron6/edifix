import express from 'express';
import { getDashboard, getAdminDashboard } from '../Controller/dashboardController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/', protect, getDashboard);
router.get('/admin', protect, adminOnly, getAdminDashboard);

export default router;
