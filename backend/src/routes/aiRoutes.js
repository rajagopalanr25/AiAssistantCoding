import express from 'express';
import { askAI } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.post('/query', askAI);

export default router;

