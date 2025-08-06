// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '../components/common/Loader/Loader';

export const PrivateRoute = ({ 
  children, 
  requiredRole, 
  requiredPermission,
  redirectTo = '/login' 
}) => {
  const location = useLocation();
  const { isAuthenticated, user, loading, hasRole, hasPermission } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return <Loader fullScreen text="Checking authentication..." />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user needs to complete profile
  if (user && !user.profileCompleted && location.pathname !== '/app/complete-profile') {
    return <Navigate to="/app/complete-profile" replace />;
  }

  // Check if user needs to verify email
  if (user && !user.emailVerified && location.pathname !== '/app/verify-email') {
    return <Navigate to="/app/verify-email" replace />;
  }

  // All checks passed, render the route
  return children || <Outlet />;
};