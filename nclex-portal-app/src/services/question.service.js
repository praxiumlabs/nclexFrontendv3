// src/services/auth.service.js
import { apiClient, API_ENDPOINTS } from './api';

class AuthService {
  // Login user
  async login(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.login, credentials);
      const { accessToken, refreshToken, user } = response.data;
      
      // Store tokens
      this.setTokens({ accessToken, refreshToken });
      
      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Register new user
  async register(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.register, userData);
      const { accessToken, refreshToken, user } = response.data;
      
      // Store tokens
      this.setTokens({ accessToken, refreshToken });
      
      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Logout user
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Clear tokens
      this.clearTokens();
    }
  }
  
  // Refresh access token
  async refreshAccessToken(refreshToken) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.refresh, {
        refreshToken,
      });
      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Update tokens
      this.setTokens({ 
        accessToken, 
        refreshToken: newRefreshToken || refreshToken 
      });
      
      return {
        accessToken,
        refreshToken: newRefreshToken || refreshToken,
      };
    } catch (error) {
      // Clear tokens on refresh failure
      this.clearTokens();
      throw this.handleError(error);
    }
  }
  
  // Get user profile
  async getProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.auth.profile);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.auth.updateProfile, profileData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.changePassword, passwordData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Request password reset
  async forgotPassword(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Reset password with token
  async resetPassword(resetData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.resetPassword, resetData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Verify email address
  async verifyEmail(token) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.verifyEmail, { token });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Token management methods
  setTokens({ accessToken, refreshToken }) {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }
  
  getTokens() {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  }
  
  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  
  // Check if user is authenticated
  isAuthenticated() {
    const { accessToken } = this.getTokens();
    return !!accessToken;
  }
  
  // Error handler
  handleError(error) {
    if (error.response) {
      // Server error response
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Invalid request');
        case 401:
          return new Error('Invalid credentials');
        case 403:
          return new Error('Access forbidden');
        case 404:
          return new Error('Resource not found');
        case 409:
          return new Error(data.message || 'Conflict occurred');
        case 422:
          return new Error(data.message || 'Validation failed');
        case 500:
          return new Error('Server error. Please try again later.');
        default:
          return new Error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other errors
      return error;
    }
  }
}

export default new AuthService();