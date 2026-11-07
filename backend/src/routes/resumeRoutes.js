import express from 'express';
import { processResume } from '../controllers/resumeController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.post('/generate', processResume);

export default router;

