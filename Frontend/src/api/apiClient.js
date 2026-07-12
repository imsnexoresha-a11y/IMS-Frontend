import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ims_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — unwrap the standard envelope { success, data, message }
apiClient.interceptors.response.use(
  (response) => {
    // Backend wraps in { success, data, message } — unwrap for convenience
    if (response.data && typeof response.data.success !== 'undefined') {
      if (!response.data.success) {
        return Promise.reject(new Error(response.data.message || 'Request failed'));
      }
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ims_token');
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
