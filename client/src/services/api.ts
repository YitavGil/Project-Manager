import axios from 'axios';
import { getAuthToken, isTokenExpired, removeAuthToken } from './auth';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    if (isTokenExpired(token)) {
      removeAuthToken();
      window.location.href = '/login'; // Redirect to login page
      return Promise.reject('Token expired');
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error('Response error:', error.response || error);
  if (error.response && error.response.status === 403) {
    removeAuthToken();
    window.location.href = '/login'; 
  }
  return Promise.reject(error);
});

export const projectApi = {
  getAll: () => api.get('/projects'),
  getById: (id: number) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: number, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

export const taskApi = {
  getAll: () => api.get('/tasks'),
  getById: (id: number) => api.get(`/tasks/${id}`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};

export default api;