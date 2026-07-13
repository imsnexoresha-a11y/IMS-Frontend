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
      name: 'Sarah Chen',
      email,
      role: email.includes('teacher') ? 'teacher' : email.includes('student') ? 'student' : 'admin',
    },
  });
}

export async function logout() {
  if (!USE_MOCK) {
    return apiClient.post('/auth/logout');
  }
  return mockResponse({ success: true });
}

export async function refreshToken(refreshTokenValue) {
  if (!USE_MOCK) {
    return apiClient.post('/auth/refresh', {
      refreshToken: refreshTokenValue,
    });
  }
  return mockResponse({
    token: 'mock-jwt-refreshed-' + Date.now(),
  });
}

export async function changePassword({
  currentPassword,
  newPassword,
  otp,
}) {
  if (!USE_MOCK) {
    return apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
      otp,
    });
  }
  return mockResponse({ success: true });
}

/**
 * Request an OTP to be sent to the given email.
 * POST /auth/send-otp
 */
export async function sendOtp(email) {
  if (!USE_MOCK) {
    return apiClient.post('/auth/send-otp', { email, type: 'forgot_password' });
  }
  return mockResponse({ message: 'OTP sent successfully' });
}

/**
 * Verify OTP and log in. Returns accessToken + user on success.
 * POST /auth/verify-otp
 */
export async function verifyOtp(email, otp) {
  if (!USE_MOCK) {
    return apiClient.post('/auth/verify-otp', { email, otp, type: 'forgot_password' });
  }
  return mockResponse({
    accessToken: 'mock-otp-token-' + Date.now(),
    refreshToken: 'mock-otp-refresh-' + Date.now(),
    user: {
      id: 'user-001',
      name: 'Mock User',
      email,
      role: 'student',
    },
  });
}

/**
 * Reset password directly (no old password required, uses OTP as proof).
 * POST /auth/reset-password
 */
export async function resetPassword({ email, otp, newPassword }) {
  if (!USE_MOCK) {
    return apiClient.post('/auth/reset-password', { email, otp, newPassword });
  }
  return mockResponse({ message: 'Password reset successfully' });
}