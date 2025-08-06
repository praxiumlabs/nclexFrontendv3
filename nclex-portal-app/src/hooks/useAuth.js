// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import {
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  login as loginAction,
  logout as logoutAction,
  register as registerAction,
  updateProfile as updateProfileAction,
  changePassword as changePasswordAction,
  getProfile,
  clearError,
} from '../store/slices/authSlice';
import { showSuccessToast, showErrorToast } from '../store/slices/uiSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Load user profile on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      const result = await dispatch(loginAction(credentials)).unwrap();
      dispatch(showSuccessToast('Login successful! Welcome back.'));
      navigate('/app/dashboard');
      return result;
    } catch (error) {
      dispatch(showErrorToast(error || 'Login failed. Please try again.'));
      throw error;
    }
  }, [dispatch, navigate]);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      const result = await dispatch(registerAction(userData)).unwrap();
      dispatch(showSuccessToast('Registration successful! Welcome to NCLEX Portal.'));
      navigate('/app/dashboard');
      return result;
    } catch (error) {
      dispatch(showErrorToast(error || 'Registration failed. Please try again.'));
      throw error;
    }
  }, [dispatch, navigate]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAction()).unwrap();
      dispatch(showSuccessToast('Logged out successfully.'));
      navigate('/login');
    } catch (error) {
      // Still navigate to login even if logout API fails
      navigate('/login');
    }
  }, [dispatch, navigate]);

  // Update profile function
  const updateProfile = useCallback(async (profileData) => {
    try {
      const result = await dispatch(updateProfileAction(profileData)).unwrap();
      dispatch(showSuccessToast('Profile updated successfully.'));
      return result;
    } catch (error) {
      dispatch(showErrorToast(error || 'Failed to update profile.'));
      throw error;
    }
  }, [dispatch]);

  // Change password function
  const changePassword = useCallback(async (passwordData) => {
    try {
      const result = await dispatch(changePasswordAction(passwordData)).unwrap();
      dispatch(showSuccessToast('Password changed successfully.'));
      return result;
    } catch (error) {
      dispatch(showErrorToast(error || 'Failed to change password.'));
      throw error;
    }
  }, [dispatch]);

  // Clear authentication error
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role) || false;
  }, [user]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    return user?.permissions?.includes(permission) || false;
  }, [user]);

  // Get user initials for avatar
  const getUserInitials = useCallback(() => {
    if (!user?.name) return 'U';
    
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  }, [user]);

  // Format user display name
  const getDisplayName = useCallback(() => {
    if (!user?.name) return 'User';
    
    const firstName = user.name.split(' ')[0];
    return firstName;
  }, [user]);

  return {
    // State
    user,
    isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    profileLoading: auth.profileLoading,
    profileError: auth.profileError,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearAuthError,
    
    // Utilities
    hasRole,
    hasPermission,
    getUserInitials,
    getDisplayName,
  };
};