import express from 'express';
import { getDashboardStats, getInterviewHistory } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/dashboard', getDashboardStats);
router.get('/history', getInterviewHistory);

export default router;

