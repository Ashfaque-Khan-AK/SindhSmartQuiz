import { Router } from 'express';
import * as admin from '../controllers/admin.controller.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/dashboard', admin.dashboard);
router.get('/reports', admin.reports);
router.get('/achievements', admin.achievements);

router.get('/students', admin.students);
router.patch('/students/:id/status', admin.studentStatus);

router.get('/grades', admin.grades);
router.post('/grades', admin.createGrade);
router.put('/grades/:id', admin.updateGrade);
router.delete('/grades/:id', admin.deleteGrade);

router.get('/subjects', admin.subjects);
router.post('/subjects', admin.createSubject);
router.put('/subjects/:id', admin.updateSubject);
router.delete('/subjects/:id', admin.deleteSubject);

router.get('/topics', admin.topics);
router.post('/topics', admin.createTopic);
router.put('/topics/:id', admin.updateTopic);
router.delete('/topics/:id', admin.deleteTopic);

router.get('/questions', admin.questions);
router.post('/questions', admin.createQuestion);
router.put('/questions/:id', admin.updateQuestion);
router.patch('/questions/:id/publish', admin.questionStatus);
router.delete('/questions/:id', admin.deleteQuestion);

router.get('/attempts', admin.attempts);

export default router;
