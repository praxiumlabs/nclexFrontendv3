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
  setUser,
} from '../store/slices/authSlice';
import { showSuccessToast, showErrorToast } from '../store/slices/uiSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Check guest mode
  const checkGuestMode = useCallback(() => {
    const isGuest = localStorage.getItem('guestMode') === 'true';
    const guestUser = localStorage.getItem('guestUser');
    
    if (isGuest && guestUser && !user) {
      // Set guest user in Redux store
      dispatch(setUser(JSON.parse(guestUser)));
      return true;
    }
    return isGuest && !!guestUser;
  }, [dispatch, user]);

  // Load user profile on mount if authenticated (but not for guests)
  useEffect(() => {
    if (isAuthenticated && !user && !checkGuestMode()) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, dispatch, checkGuestMode]);

  // Initialize guest mode if detected
  useEffect(() => {
    checkGuestMode();
  }, [checkGuestMode]);

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

  // Guest login function
  const loginAsGuest = useCallback(() => {
    const guestUser = {
      id: 'guest-user',
      name: 'Guest User',
      email: 'guest@example.com',
      isGuest: true,
      photoUrl: null,
      createdAt: new Date().toISOString(),
    };

    // Set guest mode in localStorage
    localStorage.setItem('guestMode', 'true');
    localStorage.setItem('guestUser', JSON.stringify(guestUser));
    
    // Set user in Redux store
    dispatch(setUser(guestUser));
    
    dispatch(showSuccessToast('Welcome! You\'re browsing as a guest.'));
    navigate('/app/dashboard');
    
    return guestUser;
  }, [dispatch, navigate]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Clear guest mode
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestUser');
      
      // Only call API logout if not a guest
      if (!user?.isGuest) {
        await dispatch(logoutAction()).unwrap();
      }
      
      dispatch(showSuccessToast('Logged out successfully.'));
      navigate('/login');
    } catch (error) {
      // Still navigate to login even if logout API fails
      navigate('/login');
    }
  }, [dispatch, navigate, user?.isGuest]);

  // Update profile function
  const updateProfile = useCallback(async (profileData) => {
    // Prevent guests from updating profile
    if (user?.isGuest) {
      dispatch(showErrorToast('Please create an account to update your profile.'));
      return;
    }

    try {
      const result = await dispatch(updateProfileAction(profileData)).unwrap();
      dispatch(showSuccessToast('Profile updated successfully.'));
      return result;
    } catch (error) {
      dispatch(showErrorToast(error || 'Failed to update profile.'));
      throw error;
    }
  }, [dispatch, user?.isGuest]);

  // Change password function
  const changePassword = useCallback(async (passwordData) => {
    // Prevent guests from changing password
    if (user?.isGuest) {
      dispatch(showErrorToast('Please create an account to change your password.'));
      return;
    }

    try {
      const result = await dispatch(changePasswordAction(passwordData)).unwrap();
      dispatch(showSuccessToast('Password changed successfully.'));
      return result;
    } catch (error) {
      dispatch(showErrorToast(error || 'Failed to change password.'));
      throw error;
    }
  }, [dispatch, user?.isGuest]);

    const setAuthData = useCallback(({ token, user }) => {
    // Store in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update Redux state
    dispatch(setUser(user));
    dispatch(setAuthenticated(true));
  }, [dispatch]);

  // Clear authentication error
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Check if user has specific role (always false for guests)
  const hasRole = useCallback((role) => {
    if (user?.isGuest) return false;
    return user?.roles?.includes(role) || false;
  }, [user]);

  // Check if user has specific permission (always false for guests)
  const hasPermission = useCallback((permission) => {
    if (user?.isGuest) return false;
    return user?.permissions?.includes(permission) || false;
  }, [user]);

  // Get user initials for avatar
  const getUserInitials = useCallback(() => {
    if (!user?.name) return 'G';
    
    if (user.isGuest) return 'G';
    
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  }, [user]);

  // Format user display name
  const getDisplayName = useCallback(() => {
    if (!user?.name) return 'User';
    
    if (user.isGuest) return 'Guest';
    
    const firstName = user.name.split(' ')[0];
    return firstName;
  }, [user]);

  // Check if user is guest
  const isGuest = user?.isGuest || checkGuestMode();
  
  // Override isAuthenticated to include guest mode
  const isAuthenticatedOrGuest = isAuthenticated || checkGuestMode();


  const initializeAuth = useCallback(() => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    try {
        const user = JSON.parse(userData);
        dispatch(setUser(user));
        dispatch(setAuthenticated(true));
        return true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    return false;
  }, [dispatch]);
  return {
    // State
    user,
    isAuthenticated: isAuthenticatedOrGuest,
    isGuest,
    loading: auth.loading,
    error: auth.error,
    profileLoading: auth.profileLoading,
    profileError: auth.profileError,

    
    // Actions
    login,
    register,
    loginAsGuest,
    logout,
    updateProfile,
    changePassword,
    clearAuthError,
    setAuthData,
    initializeAuth,
    
    // Utilities
    hasRole,
    hasPermission,
    getUserInitials,
    getDisplayName,
    checkGuestMode,
  };
};