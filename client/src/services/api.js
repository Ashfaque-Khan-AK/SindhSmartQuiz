import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ssq_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'The request took too long. Please try again.'
        : 'Could not reach the server. Please check your connection.');

    if (status === 401 && localStorage.getItem('ssq_token')) {
      window.dispatchEvent(new CustomEvent('ssq:unauthorized'));
    }

    const wrapped = new Error(message);
    wrapped.status = status;
    wrapped.errors = error.response?.data?.errors;
    return Promise.reject(wrapped);
  }
);

const get = (url, config) => api.get(url, config).then((response) => response.data);
const post = (url, payload, config) => api.post(url, payload, config).then((response) => response.data);
const put = (url, payload) => api.put(url, payload).then((response) => response.data);
const patch = (url, payload) => api.patch(url, payload).then((response) => response.data);
const remove = (url) => api.delete(url).then((response) => response.data);

export default api;

export const authApi = {
  login: (payload) => post('/auth/login', payload),
  register: (payload) => post('/auth/register', payload),
  me: () => get('/auth/me'),
};

export const studentApi = {
  dashboard: () => get('/students/dashboard'),
  subjects: (params) => get('/students/subjects', { params }),
  topics: (subjectId, params) => get(`/students/topics/${subjectId}`, { params }),
  history: (params) => get('/students/history', { params }),
  leaderboard: (params) => get('/students/leaderboard', { params }),
  achievements: () => get('/students/achievements'),
  updateProfile: (payload) => put('/students/profile', payload),
  changePassword: (payload) => put('/students/password', payload),
};

export const quizApi = {
  start: (payload) => post('/quizzes/start', payload),
  get: (attemptId) => get(`/quizzes/${attemptId}`),
  submit: (attemptId, answers, auto = false) =>
    post(`/quizzes/${attemptId}/submit`, { answers, auto }),
  result: (attemptId) => get(`/quizzes/${attemptId}/result`),
  review: (attemptId) => get(`/quizzes/${attemptId}/review`),
};

export const adminApi = {
  dashboard: () => get('/admin/dashboard'),
  students: (params) => get('/admin/students', { params }),
  setStudentStatus: (id, isActive) => patch(`/admin/students/${id}/status`, { isActive }),

  grades: () => get('/admin/grades'),
  createGrade: (payload) => post('/admin/grades', payload),
  updateGrade: (id, payload) => put(`/admin/grades/${id}`, payload),
  deleteGrade: (id) => remove(`/admin/grades/${id}`),

  subjects: (params) => get('/admin/subjects', { params }),
  createSubject: (payload) => post('/admin/subjects', payload),
  updateSubject: (id, payload) => put(`/admin/subjects/${id}`, payload),
  deleteSubject: (id) => remove(`/admin/subjects/${id}`),

  topics: (params) => get('/admin/topics', { params }),
  createTopic: (payload) => post('/admin/topics', payload),
  updateTopic: (id, payload) => put(`/admin/topics/${id}`, payload),
  deleteTopic: (id) => remove(`/admin/topics/${id}`),

  questions: (params) => get('/admin/questions', { params }),
  createQuestion: (payload) => post('/admin/questions', payload),
  updateQuestion: (id, payload) => put(`/admin/questions/${id}`, payload),
  setQuestionStatus: (id, isActive) => patch(`/admin/questions/${id}/publish`, { isActive }),
  deleteQuestion: (id) => remove(`/admin/questions/${id}`),

  attempts: (params) => get('/admin/attempts', { params }),
  reports: () => get('/admin/reports'),
};
