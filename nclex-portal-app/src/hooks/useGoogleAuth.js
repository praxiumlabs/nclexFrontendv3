// src/hooks/useGoogleAuth.js
import { useState, useCallback } from 'react';
import GoogleAuthService from '../services/googleAuth.service';
import AuthService from '../services/auth.service';
import { useAuth } from './useAuth';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialize Google Auth if not already done
      await GoogleAuthService.initialize();
      
      // Trigger Google Sign-In popup
      return new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
            console.log("Google Response:", response); 
              // Send Google token to your backend for verification
            const authResult = await AuthService.login({ token: response.credential });
              
              // Update auth state
              await login(authResult);
              
              resolve(authResult);
            } catch (error) {
              setError(error.message || 'Google authentication failed');
              reject(error);
            } finally {
              setLoading(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Show the Google Sign-In popup
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
  }, [login]);

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