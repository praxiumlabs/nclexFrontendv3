// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '../components/common/Loader/Loader';

export const PrivateRoute = ({ 
  children, 
  requiredRole, 
  requiredPermission,
  redirectTo = '/login',
  allowGuest = true // Allow guests by default
}) => {
  const location = useLocation();
  const { isAuthenticated, user, loading, hasRole, hasPermission, isGuest } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return <Loader fullScreen text="Checking authentication..." />;
  }

  // Check authentication (including guest mode)
  if (!isAuthenticated) {
    // Save the attempted location for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if route allows guests
  if (isGuest && !allowGuest) {
    return <Navigate to="/login" state={{ 
      from: location,
      message: "Please create an account to access this feature." 
    }} replace />;
  }

  // Check role requirement (skip for guests unless specifically required)
  if (requiredRole && !isGuest && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission requirement (skip for guests unless specifically required)
  if (requiredPermission && !isGuest && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // For guests, skip profile completion and email verification checks
  if (!isGuest) {
    // Check if user needs to complete profile
    if (user && !user.profileCompleted && location.pathname !== '/app/complete-profile') {
      return <Navigate to="/app/complete-profile" replace />;
    }

    // Check if user needs to verify email
    if (user && !user.emailVerified && location.pathname !== '/app/verify-email') {
      return <Navigate to="/app/verify-email" replace />;
    }
  }

  // All checks passed, render the route
  return children || <Outlet />;
};

// Specialized route components for different access levels

// Route that requires full authentication (no guests)
export const AuthenticatedRoute = ({ children, ...props }) => (
  <PrivateRoute allowGuest={false} {...props}>
    {children}
  </PrivateRoute>
);

// Route for admin only (no guests)
export const AdminRoute = ({ children, ...props }) => (
  <PrivateRoute 
    requiredRole="admin" 
    allowGuest={false} 
    redirectTo="/unauthorized"
    {...props}
  >
    {children}
  </PrivateRoute>
);

// Route for premium features (no guests)
export const PremiumRoute = ({ children, ...props }) => (
  <PrivateRoute 
    requiredPermission="premium" 
    allowGuest={false}
    redirectTo="/upgrade"
    {...props}
  >
    {children}
  </PrivateRoute>
);

// Route that's guest-friendly (default)
export const GuestFriendlyRoute = ({ children, ...props }) => (
  <PrivateRoute allowGuest={true} {...props}>
    {children}
  </PrivateRoute>
);

export default PrivateRoute;