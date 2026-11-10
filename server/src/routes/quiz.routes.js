import { Router } from 'express';
import * as quiz from '../controllers/quiz.controller.js';
import { protect, studentOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect, studentOnly);

router.post('/start', quiz.start);
router.get('/:attemptId', quiz.active);
router.post('/:attemptId/submit', quiz.submit);
router.get('/:attemptId/result', quiz.result);
router.get('/:attemptId/review', quiz.review);

export default router;
