import { asyncHandler } from '../utils/asyncHandler.js';
import { created, ok } from '../utils/response.js';
import * as admin from '../services/admin.service.js';

/* -------------------------------- Dashboard -------------------------------- */

export const dashboard = asyncHandler(async (_req, res) => {
  const data = await admin.getAdminDashboard();
  return ok(res, data, 'Admin dashboard loaded');
});

/* -------------------------------- Students --------------------------------- */

export const students = asyncHandler(async (req, res) => {
  const data = await admin.listStudents(req.query);
  return ok(res, data, 'Students loaded');
});

export const studentStatus = asyncHandler(async (req, res) => {
  const data = await admin.setStudentStatus(req.params.id, req.body.isActive);
  return ok(res, data, data.isActive ? 'Student activated' : 'Student deactivated');
});

/* ---------------------------------- Grades --------------------------------- */

export const grades = asyncHandler(async (_req, res) => {
  const data = await admin.listGrades();
  return ok(res, data, 'Grades loaded');
});

export const createGrade = asyncHandler(async (req, res) => {
  const data = await admin.createGrade(req.body);
  return created(res, data, 'Grade created');
});

export const updateGrade = asyncHandler(async (req, res) => {
  const data = await admin.updateGrade(req.params.id, req.body);
  return ok(res, data, 'Grade updated');
});

export const deleteGrade = asyncHandler(async (req, res) => {
  await admin.deleteGrade(req.params.id);
  return ok(res, null, 'Grade deleted');
});

/* -------------------------------- Subjects --------------------------------- */

export const subjects = asyncHandler(async (req, res) => {
  const data = await admin.listSubjects(req.query);
  return ok(res, data, 'Subjects loaded');
});

export const createSubject = asyncHandler(async (req, res) => {
  const data = await admin.createSubject(req.body);
  return created(res, data, 'Subject created');
});

export const updateSubject = asyncHandler(async (req, res) => {
  const data = await admin.updateSubject(req.params.id, req.body);
  return ok(res, data, 'Subject updated');
});

export const deleteSubject = asyncHandler(async (req, res) => {
  await admin.deleteSubject(req.params.id);
  return ok(res, null, 'Subject deleted');
});

/* ---------------------------------- Topics --------------------------------- */

export const topics = asyncHandler(async (req, res) => {
  const data = await admin.listTopics(req.query);
  return ok(res, data, 'Topics loaded');
});

export const createTopic = asyncHandler(async (req, res) => {
  const data = await admin.createTopic(req.body);
  return created(res, data, 'Topic created');
});

export const updateTopic = asyncHandler(async (req, res) => {
  const data = await admin.updateTopic(req.params.id, req.body);
  return ok(res, data, 'Topic updated');
});

export const deleteTopic = asyncHandler(async (req, res) => {
  await admin.deleteTopic(req.params.id);
  return ok(res, null, 'Topic deleted');
});

/* -------------------------------- Questions -------------------------------- */

export const questions = asyncHandler(async (req, res) => {
  const data = await admin.listQuestions(req.query);
  return ok(res, data, 'Questions loaded');
});

export const createQuestion = asyncHandler(async (req, res) => {
  const data = await admin.createQuestion(req.body);
  return created(res, data, 'Question created');
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const data = await admin.updateQuestion(req.params.id, req.body);
  return ok(res, data, 'Question updated');
});

export const questionStatus = asyncHandler(async (req, res) => {
  const data = await admin.setQuestionStatus(req.params.id, req.body.isActive);
  return ok(res, data, data.isActive ? 'Question published' : 'Question unpublished');
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  await admin.deleteQuestion(req.params.id);
  return ok(res, null, 'Question deleted');
});

/* -------------------------------- Attempts --------------------------------- */

export const attempts = asyncHandler(async (req, res) => {
  const data = await admin.listAttempts(req.query);
  return ok(res, data, 'Attempts loaded');
});

/* --------------------------------- Reports --------------------------------- */

export const reports = asyncHandler(async (_req, res) => {
  const data = await admin.getReports();
  return ok(res, data, 'Reports loaded');
});

export const achievements = asyncHandler(async (_req, res) => {
  const data = await admin.listAchievements();
  return ok(res, data, 'Achievements loaded');
});
