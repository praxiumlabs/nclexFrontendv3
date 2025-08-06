// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { store } from './store';
import { GlobalStyles } from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/theme';
import { useTheme } from './hooks/useTheme';
import { Loader } from './components/common/Loader';
import { Layout } from './components/layout/Layout';
import { PrivateRoute } from './routes/PrivateRoute';
import { PublicRoute } from './routes/PublicRoute';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Practice = lazy(() => import('./pages/Practice'));
const Results = lazy(() => import('./pages/Results'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// App content component that uses hooks
function AppContent() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Router>
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
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

// Main App component
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;