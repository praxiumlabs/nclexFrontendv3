// 1. Update useGoogleAuth hook - src/hooks/useGoogleAuth.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleAuthService from '../services/googleAuth.service';
import AuthService from '../services/auth.service';
import { useAuth } from './useAuth';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setAuthData } = useAuth(); // We'll need to add this method to useAuth

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Initialize Google Auth
      await GoogleAuthService.initialize();
      
      // Step 2: Get Google Token from user authentication
      const googleToken = await GoogleAuthService.signInWithPopup();
      
      if (!googleToken) {
        throw new Error('Failed to get Google token');
      }

      // Step 3: Send Google token to backend for verification and get our app token
      const response = await AuthService.googleLogin(googleToken);
      
      // Step 4: Store the token from our backend in localStorage
      const { token, user } = response;
      
      // Store our app's token
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Step 5: Update auth state
      setAuthData({ token, user });
      
      // Step 6: Navigate to dashboard
      navigate('/app/dashboard');
      
      return { token, user };
      
    } catch (error) {
      console.error('Google authentication failed:', error);
      setError(error.message || 'Google authentication failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, setAuthData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    signInWithGoogle,
    loading,
    error,
    clearError,
  };
};