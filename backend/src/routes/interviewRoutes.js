import express from 'express';
import {
  startInterview,
  getInterview,
  saveDraft,
  getTokenStatus,
  runCode,
  submitInterview,
  getEvaluation,
  getReplay,
  deleteInterview
} from '../controllers/interviewsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/start', startInterview);
router.get('/:id', getInterview);
router.put('/:id/draft', saveDraft);
router.get('/:id/tokens', getTokenStatus);
router.post('/:id/execute', runCode);
router.post('/:id/submit', submitInterview);
router.get('/:id/evaluation', getEvaluation);
router.get('/:id/replay', getReplay);
router.delete('/:id', deleteInterview);

export default router;

