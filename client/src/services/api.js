import axios from 'axios';

const configuredApiUrl = (import.meta.env.VITE_API_URL || '/api/v1').trim();

function normalizeApiBaseUrl(value) {
  let base = value.replace(/\/+$/, '');

  if (!base) return '/api/v1';
  if (!/^https?:\/\//i.test(base) && !base.startsWith('/')) {
    base = `/${base}`;
  }

  if (/\/api\/v1$/i.test(base)) return base;
  if (/\/api$/i.test(base)) return `${base}/v1`;
  return `${base}/api/v1`;
}

const CACHE_PREFIX = 'ssq_api_cache_v1:';
const DEFAULT_CACHE_TTL = 30_000;
const MAX_MEMORY_ENTRIES = 100;
const memoryCache = new Map();
const pendingGets = new Map();
let cacheGeneration = 0;

function buildCacheKey(url, config) {
  const token = localStorage.getItem('ssq_token') || 'anonymous';
  const params = config?.params ? JSON.stringify(config.params) : '';
  return `${token}:${url}:${params}`;
}

function readStoredCache(key) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry = JSON.parse(raw);
    if (!entry || !Number.isFinite(entry.expires) || entry.expires <= Date.now()) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry;
  } catch {
    return null;
  }
}

function saveCache(key, entry) {
  memoryCache.set(key, entry);
  if (memoryCache.size > MAX_MEMORY_ENTRIES) {
    memoryCache.delete(memoryCache.keys().next().value);
  }

  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Storage can be unavailable or full; the in-memory cache still works.
  }
}

export function clearApiCache() {
  cacheGeneration += 1;
  memoryCache.clear();
  pendingGets.clear();

  try {
    for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = sessionStorage.key(index);
      if (key?.startsWith(CACHE_PREFIX)) sessionStorage.removeItem(key);
    }
  } catch {
    // Ignore storage access errors.
  }
}

const api = axios.create({
  baseURL: normalizeApiBaseUrl(configuredApiUrl),
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

    if (status === 401) {
      clearApiCache();
      if (localStorage.getItem('ssq_token')) {
        window.dispatchEvent(new CustomEvent('ssq:unauthorized'));
      }
    }

    const wrapped = new Error(message);
    wrapped.status = status;
    wrapped.errors = error.response?.data?.errors;
    return Promise.reject(wrapped);
  }
);

const get = (url, config = {}) => {
  const { cache = true, cacheTtl = DEFAULT_CACHE_TTL, ...axiosConfig } = config;

  if (!cache) {
    return api.get(url, axiosConfig).then((response) => response.data);
  }

  const key = buildCacheKey(url, axiosConfig);
  const now = Date.now();
  const memoryEntry = memoryCache.get(key);

  if (memoryEntry && memoryEntry.expires > now) {
    return Promise.resolve(memoryEntry.data);
  }

  const storedEntry = readStoredCache(key);
  if (storedEntry) {
    memoryCache.set(key, storedEntry);
    return Promise.resolve(storedEntry.data);
  }

  if (pendingGets.has(key)) {
    return pendingGets.get(key);
  }

  const generation = cacheGeneration;
  const request = api
    .get(url, axiosConfig)
    .then((response) => {
      const payload = response.data;

      if (generation === cacheGeneration) {
        saveCache(key, { data: payload, expires: Date.now() + cacheTtl });
      }

      return payload;
    })
    .finally(() => {
      if (pendingGets.get(key) === request) pendingGets.delete(key);
    });

  pendingGets.set(key, request);
  return request;
};

const post = (url, payload, config) =>
  api.post(url, payload, config).then((response) => {
    clearApiCache();
    return response.data;
  });

const put = (url, payload) =>
  api.put(url, payload).then((response) => {
    clearApiCache();
    return response.data;
  });

const patch = (url, payload) =>
  api.patch(url, payload).then((response) => {
    clearApiCache();
    return response.data;
  });

const remove = (url) =>
  api.delete(url).then((response) => {
    clearApiCache();
    return response.data;
  });

export default api;

export const authApi = {
  login: (payload) => post('/auth/login', payload),
  register: (payload) => post('/auth/register', payload),
  me: () => get('/auth/me', { cache: false }),
};

export const studentApi = {
  dashboard: () => get('/students/dashboard', { cacheTtl: 30_000 }),
  subjects: (params) => get('/students/subjects', { params, cacheTtl: 60_000 }),
  topics: (subjectId, params) =>
    get(`/students/topics/${subjectId}`, { params, cacheTtl: 60_000 }),
  history: (params) => get('/students/history', { params, cacheTtl: 30_000 }),
  leaderboard: (params) => get('/students/leaderboard', { params, cacheTtl: 30_000 }),
  achievements: () => get('/students/achievements', { cacheTtl: 30_000 }),
  updateProfile: (payload) => put('/students/profile', payload),
  changePassword: (payload) => put('/students/password', payload),
};

export const quizApi = {
  start: (payload) => post('/quizzes/start', payload),
  get: (attemptId) => get(`/quizzes/${attemptId}`, { cache: false }),
  submit: (attemptId, answers, auto = false) =>
    post(`/quizzes/${attemptId}/submit`, { answers, auto }),
  result: (attemptId) => get(`/quizzes/${attemptId}/result`, { cacheTtl: 60_000 }),
  review: (attemptId) => get(`/quizzes/${attemptId}/review`, { cacheTtl: 60_000 }),
};

export const adminApi = {
  dashboard: () => get('/admin/dashboard', { cacheTtl: 30_000 }),
  students: (params) => get('/admin/students', { params, cacheTtl: 30_000 }),
  setStudentStatus: (id, isActive) => patch(`/admin/students/${id}/status`, { isActive }),

  grades: () => get('/admin/grades', { cacheTtl: 30_000 }),
  createGrade: (payload) => post('/admin/grades', payload),
  updateGrade: (id, payload) => put(`/admin/grades/${id}`, payload),
  deleteGrade: (id) => remove(`/admin/grades/${id}`),

  subjects: (params) => get('/admin/subjects', { params, cacheTtl: 30_000 }),
  createSubject: (payload) => post('/admin/subjects', payload),
  updateSubject: (id, payload) => put(`/admin/subjects/${id}`, payload),
  deleteSubject: (id) => remove(`/admin/subjects/${id}`),

  topics: (params) => get('/admin/topics', { params, cacheTtl: 30_000 }),
  createTopic: (payload) => post('/admin/topics', payload),
  updateTopic: (id, payload) => put(`/admin/topics/${id}`, payload),
  deleteTopic: (id) => remove(`/admin/topics/${id}`),

  questions: (params) => get('/admin/questions', { params, cacheTtl: 30_000 }),
  createQuestion: (payload) => post('/admin/questions', payload),
  updateQuestion: (id, payload) => put(`/admin/questions/${id}`, payload),
  setQuestionStatus: (id, isActive) => patch(`/admin/questions/${id}/publish`, { isActive }),
  deleteQuestion: (id) => remove(`/admin/questions/${id}`),

  attempts: (params) => get('/admin/attempts', { params, cacheTtl: 30_000 }),
  reports: () => get('/admin/reports', { cacheTtl: 30_000 }),
};
