import express from 'express';
import { getProblems, getProblemBySlugOrId, createCustomProblem } from '../controllers/problemsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProblems);
router.get('/:idOrSlug', getProblemBySlugOrId);
router.post('/custom', authenticate, createCustomProblem);

export default router;

