import api from '../config/api';

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
};

// Courses
export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getBySlug: (slug) => api.get(`/courses/slug/${slug}`),
  getLearningPath: (category) => api.get(`/courses/learning-path/${category}`),
};

// Lessons
export const lessonAPI = {
  getByCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
  getById: (id) => api.get(`/lessons/${id}`),
  getBySlug: (courseSlug, lessonSlug) => api.get(`/lessons/slug/${courseSlug}/${lessonSlug}`),
};

// Progress
export const progressAPI = {
  getOverall: () => api.get('/progress'),
  getByCourse: (courseId) => api.get(`/progress/course/${courseId}`),
  getActivity: () => api.get('/progress/activity'),
  getContinue: () => api.get('/progress/continue'),
  updateLesson: (lessonId, data) => api.post(`/progress/lesson/${lessonId}`, data),
};

// Streak
export const streakAPI = {
  get: () => api.get('/streak'),
  getLeaderboard: () => api.get('/streak/leaderboard'),
  update: () => api.post('/streak/update'),
  useFreeze: () => api.post('/streak/use-freeze'),
};

// Exams
export const examAPI = {
  getByCourse: (courseId) => api.get(`/exams/course/${courseId}`),
  getById: (id) => api.get(`/exams/${id}`),
  getResults: () => api.get('/exams/results'),
  submit: (id, data) => api.post(`/exams/${id}/submit`, data),
  generate: (data) => api.post('/exams/generate', data),
  submitDynamic: (data) => api.post('/exams/submit-dynamic', data),
};

// Notifications
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  clearRead: () => api.delete('/notifications/clear-read'),
};

// Reminders
export const reminderAPI = {
  getAll: () => api.get('/reminders'),
  getById: (id) => api.get(`/reminders/${id}`),
  create: (data) => api.post('/reminders', data),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  toggle: (id) => api.put(`/reminders/${id}/toggle`),
  delete: (id) => api.delete(`/reminders/${id}`),
};

// Playground
export const playgroundAPI = {
  getAll: () => api.get('/playground'),
  explore: (params) => api.get('/playground/explore', { params }),
  getById: (id) => api.get(`/playground/${id}`),
  create: (data) => api.post('/playground', data),
  run: (data) => api.post('/playground/run', data),
  fork: (id) => api.post(`/playground/${id}/fork`),
  update: (id, data) => api.put(`/playground/${id}`, data),
  delete: (id) => api.delete(`/playground/${id}`),
};

// Dashboard
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
  getAdmin: () => api.get('/dashboard/admin'),
};

// Articles
export const articleAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getFeatured: (limit) => api.get('/articles/featured', { params: { limit } }),
  getByCategory: (category) => api.get(`/articles/category/${category}`),
  getById: (id) => api.get(`/articles/${id}`),
  getBySlug: (slug) => api.get(`/articles/slug/${slug}`),
};

// Forum
export const forumAPI = {
  getCategories: () => api.get('/forum/categories'),
  getCategoryBySlug: (slug) => api.get(`/forum/categories/${slug}`),
  getCategoryThreads: (slug, params) => api.get(`/forum/categories/${slug}/threads`, { params }),
  getThreads: (params) => api.get('/forum/threads', { params }),
  getThread: (id) => api.get(`/forum/threads/${id}`),
  getThreadBySlug: (categorySlug, threadSlug) => api.get(`/forum/categories/${categorySlug}/threads/${threadSlug}`),
  createThread: (data) => api.post('/forum/threads', data),
  updateThread: (id, data) => api.put(`/forum/threads/${id}`, data),
  deleteThread: (id) => api.delete(`/forum/threads/${id}`),
  likeThread: (id) => api.post(`/forum/threads/${id}/like`),
  solveThread: (id, data) => api.put(`/forum/threads/${id}/solve`, data),
  getPosts: (threadId, params) => api.get(`/forum/threads/${threadId}/posts`, { params }),
  createPost: (threadId, data) => api.post(`/forum/threads/${threadId}/posts`, data),
  updatePost: (id, data) => api.put(`/forum/posts/${id}`, data),
  deletePost: (id) => api.delete(`/forum/posts/${id}`),
  likePost: (id) => api.post(`/forum/posts/${id}/like`),
  getMyThreads: (params) => api.get('/forum/my/threads', { params }),
  getMyPosts: (params) => api.get('/forum/my/posts', { params }),
};
