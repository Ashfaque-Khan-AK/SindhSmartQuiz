import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';
import {
  changePassword,
  getAchievements,
  getDashboard,
  getHistory,
  getLeaderboard,
  getSubjects,
  getTopics,
  updateProfile,
} from '../services/student.service.js';

export const dashboard = asyncHandler(async (req, res) => {
  const data = await getDashboard(req.user);
  return ok(res, data, 'Dashboard loaded');
});

export const subjects = asyncHandler(async (req, res) => {
  const data = await getSubjects(req.user, req.query.gradeId);
  return ok(res, data, 'Subjects loaded');
});

export const topics = asyncHandler(async (req, res) => {
  const data = await getTopics(req.user, req.params.subjectId, req.query.gradeId);
  return ok(res, data, 'Topics loaded');
});

export const history = asyncHandler(async (req, res) => {
  const data = await getHistory(req.user, req.query);
  return ok(res, data, 'Quiz history loaded');
});

export const leaderboard = asyncHandler(async (req, res) => {
  const data = await getLeaderboard(req.user, req.query);
  return ok(res, data, 'Leaderboard loaded');
});

export const achievements = asyncHandler(async (req, res) => {
  const data = await getAchievements(req.user);
  return ok(res, data, 'Achievements loaded');
});

export const profile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user, req.body);
  return ok(res, { user }, 'Profile updated');
});

export const password = asyncHandler(async (req, res) => {
  await changePassword(req.user, req.body);
  return ok(res, null, 'Password changed successfully');
});
