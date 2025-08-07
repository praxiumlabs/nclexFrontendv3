// src/App.js - FIXED Redux Provider structure
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { store } from './store';
import { GlobalStyles } from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/theme';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { Loader } from './components/common/Loader/Loader';
import { ToastManager } from './components/common/Toast/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary/ErrorBoundary';
import { PrivateRoute } from './routes/PrivateRoute';
import { PublicRoute } from './routes/PublicRoute';
import { Layout } from './components/layout/layout/layout';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Practice = lazy(() => import('./pages/Practice/Practice'));
const Results = lazy(() => import('./pages/Results/Results'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

// ✅ App content component that uses hooks (AFTER Provider wrapper)
function AppContent() {
  const { initializeAuth } = useAuth(); // ✅ Now this is INSIDE Provider
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // ✅ Initialize auth from localStorage when app starts
  useEffect(() => {
    const initialized = initializeAuth();
    if (initialized) {
      console.log('User session restored from localStorage');
    }
  }, [initializeAuth]);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<Loader fullScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicRoute />}>
                <Route index element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              {/* Private Routes */}
              <Route path="/app" element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="practice" element={<Practice />} />
                  <Route path="practice/:sessionId/results" element={<Results />} />
                  <Route path="profile" element={<Profile />} />
                  
                  {/* Placeholder routes */}
                  <Route path="srs-review" element={
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <h1>SRS Review</h1>
                      <p>Spaced Repetition System - Coming Soon!</p>
                    </div>
                  } />
                  <Route path="mock-exams" element={
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <h1>Mock Exams</h1>
                      <p>Full-length practice exams - Coming Soon!</p>
                    </div>
                  } />
                  <Route path="progress" element={
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <h1>Progress Tracking</h1>
                      <p>Detailed progress analytics - Coming Soon!</p>
                    </div>
                  } />
                  <Route path="subjects" element={
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <h1>Subjects</h1>
                      <p>Browse subjects and chapters - Coming Soon!</p>
                    </div>
                  } />
                  <Route path="settings" element={
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <h1>Settings</h1>
                      <p>Account and app settings - Coming Soon!</p>
                    </div>
                  } />
                </Route>
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          
          {/* Global Toast Manager */}
          <ToastManager />
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

// ✅ Main App component - ONLY handles Provider wrapper
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;