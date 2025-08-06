// src/services/api.js
import axios from 'axios';
import { store } from '../store';
import { logout, refreshToken } from '../store/slices/authSlice';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const state = store.getState();
        const refreshTokenValue = state.auth.refreshToken;
        
        if (refreshTokenValue) {
          const result = await store.dispatch(refreshToken()).unwrap();
          
          if (result.accessToken) {
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          'An error occurred';
      
      // Create custom error object
      const customError = new Error(errorMessage);
      customError.status = error.response.status;
      customError.data = error.response.data;
      
      return Promise.reject(customError);
    } else if (error.request) {
      // Request was made but no response
      const networkError = new Error('Network error. Please check your connection.');
      networkError.status = 0;
      return Promise.reject(networkError);
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

// Helper functions for common HTTP methods
export const apiClient = {
  // GET request
  get: (url, params = {}, config = {}) => {
    return api.get(url, { params, ...config });
  },
  
  // POST request
  post: (url, data = {}, config = {}) => {
    return api.post(url, data, config);
  },
  
  // PUT request
  put: (url, data = {}, config = {}) => {
    return api.put(url, data, config);
  },
  
  // PATCH request
  patch: (url, data = {}, config = {}) => {
    return api.patch(url, data, config);
  },
  
  // DELETE request
  delete: (url, config = {}) => {
    return api.delete(url, config);
  },
  
  // Upload file
  upload: (url, formData, onUploadProgress) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  
  // Download file
  download: (url, filename = 'download') => {
    return api.get(url, {
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
  },
};

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    updateProfile: '/auth/profile',
    changePassword: '/auth/change-password',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },
  
  // User endpoints
  users: {
    list: '/users',
    getById: (id) => `/users/${id}`,
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    uploadAvatar: (id) => `/users/${id}/avatar`,
  },
  
  // Question endpoints
  questions: {
    list: '/questions',
    getById: (id) => `/questions/${id}`,
    create: '/questions',
    update: (id) => `/questions/${id}`,
    delete: (id) => `/questions/${id}`,
    search: '/questions/search',
    bySubject: (subjectId) => `/questions/subject/${subjectId}`,
    byChapter: (chapterId) => `/questions/chapter/${chapterId}`,
  },
  
  // Subject endpoints
  subjects: {
    list: '/subjects',
    getById: (id) => `/subjects/${id}`,
    chapters: (id) => `/subjects/${id}/chapters`,
  },
  
  // Exam endpoints
  exams: {
    start: '/exams/start',
    submit: '/exams/submit',
    submitAnswer: (sessionId) => `/exams/${sessionId}/answer`,
    getSession: (sessionId) => `/exams/${sessionId}`,
    history: '/exams/history',
    results: (sessionId) => `/exams/${sessionId}/results`,
  },
  
  // Progress endpoints
  progress: {
    overview: '/progress/overview',
    bySubject: (subjectId) => `/progress/subject/${subjectId}`,
    streaks: '/progress/streaks',
    statistics: '/progress/statistics',
    achievements: '/progress/achievements',
  },
  
  // SRS (Spaced Repetition System) endpoints
  srs: {
    due: '/srs/due',
    review: '/srs/review',
    schedule: '/srs/schedule',
  },
};

export default api;