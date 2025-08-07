// 3. UPDATE: useGoogleAuth.js - Final version that matches backend
// src/hooks/useGoogleAuth.js

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleAuthService from '../services/googleAuth.service';
import AuthService from '../services/auth.service';
import { useAuth } from './useAuth';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialize Google Auth
      await GoogleAuthService.initialize();
      
      // Get Google Token ID from user authentication
      return new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              console.log("Google Response:", response);
              
              // Send Google token ID to your backend
              const authResult = await AuthService.googleLogin(response.credential);
              
              console.log('Backend auth result:', authResult);
              
              // Store auth data
              setAuthData(authResult);
              
              // Navigate to dashboard
              navigate('/app/dashboard');
              
              resolve(authResult);
            } catch (error) {
              console.error('Google auth failed:', error);
              setError(error.message || 'Google authentication failed');
              reject(error);
            } finally {
              setLoading(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Show Google Sign-In popup
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setError('Google Sign-In was cancelled or not displayed');
            reject(new Error('Google Sign-In cancelled'));
            setLoading(false);
          }
        });
      });
      
    } catch (error) {
      setError(error.message || 'Failed to initialize Google authentication');
      setLoading(false);
      throw error;
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