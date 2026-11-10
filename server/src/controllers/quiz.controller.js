import { asyncHandler } from '../utils/asyncHandler.js';
import { created, ok } from '../utils/response.js';
import {
  getActiveQuiz,
  getResult,
  getReview,
  startQuiz,
  submitQuiz,
} from '../services/quiz.service.js';

export const start = asyncHandler(async (req, res) => {
  const data = await startQuiz(req.user, req.body);
  return created(res, data, 'Quiz started');
});

export const active = asyncHandler(async (req, res) => {
  const data = await getActiveQuiz(req.user, req.params.attemptId);
  return ok(res, data, 'Quiz loaded');
});

export const submit = asyncHandler(async (req, res) => {
  const data = await submitQuiz(req.user, req.params.attemptId, req.body.answers, {
    auto: Boolean(req.body.auto),
  });
  return ok(res, data, 'Quiz submitted');
});

export const result = asyncHandler(async (req, res) => {
  const data = await getResult(req.user, req.params.attemptId);
  return ok(res, data, 'Result loaded');
});

export const review = asyncHandler(async (req, res) => {
  const data = await getReview(req.user, req.params.attemptId);
  return ok(res, data, 'Answer review loaded');
});
