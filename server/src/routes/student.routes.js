import { Router } from 'express';
import * as student from '../controllers/student.controller.js';
import { protect, studentOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect, studentOnly);

router.get('/dashboard', student.dashboard);
router.get('/subjects', student.subjects);
router.get('/topics/:subjectId', student.topics);
router.get('/history', student.history);
router.get('/leaderboard', student.leaderboard);
router.get('/achievements', student.achievements);
router.put('/profile', student.profile);
router.put('/password', student.password);

export default router;
