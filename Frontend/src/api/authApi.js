import { USE_MOCK, mockResponse } from './mockHelpers';
import apiClient from './apiClient';

export async function login({ email, password }) {
  if (!USE_MOCK) {
    return apiClient.post('/auth/login', { email, password });
  }
  return mockResponse({
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'user-001',
      name: email.includes('teacher') ? 'Marcus Johnson' : (email.includes('admin') ? 'Sarah Chen' : (email.split('@')[0] || 'Student')),
      email,
      role: email.includes('teacher') ? 'teacher' : (email.includes('admin') ? 'admin' : 'student'),
    },
  });
}

export async function logout() {
  if (!USE_MOCK) {
    return apiClient.post('/auth/logout');
  }
  return mockResponse({ success: true });
}

export async function refreshToken() {
  if (!USE_MOCK) {
    return apiClient.post('/auth/refresh');
  }
  return mockResponse({
    token: 'mock-jwt-refreshed-' + Date.now(),
  });
}

export async function registerStudent(data) {
  if (!USE_MOCK) {
    return apiClient.post('/students', data);
  }
  return mockResponse({
    success: true,
    message: 'Mock registration successful',
  });
}
