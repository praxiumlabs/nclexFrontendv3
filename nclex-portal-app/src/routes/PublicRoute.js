// src/routes/PublicRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PublicRoute = ({ 
  children, 
  restricted = false,
  redirectTo = '/app/dashboard' 
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Get redirect location from state or use default
  const from = location.state?.from?.pathname || redirectTo;

  // If route is restricted and user is authenticated, redirect
  if (restricted && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  // Render the route
  return children || <Outlet />;
};