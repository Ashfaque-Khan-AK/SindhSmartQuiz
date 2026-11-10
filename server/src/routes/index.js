import { Router } from 'express';
import authRoutes from './auth.routes.js';
import studentRoutes from './student.routes.js';
import quizRoutes from './quiz.routes.js';
import adminRoutes from './admin.routes.js';
import { ok } from '../utils/response.js';

const router = Router();

router.get('/health', (_req, res) =>
  ok(res, { status: 'healthy', timestamp: new Date().toISOString() }, 'Sindh Smart Quiz API')
);

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/quizzes', quizRoutes);
router.use('/admin', adminRoutes);

export default router;
