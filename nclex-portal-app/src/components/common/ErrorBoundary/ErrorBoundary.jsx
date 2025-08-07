// src/components/common/ErrorBoundary/ErrorBoundary.jsx
import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

// Styled components
const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${({ $fullScreen }) => $fullScreen ? '100vh' : '400px'};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background.default};
`;

const ErrorCard = styled(Card)`
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  border-radius: 50%;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.error.light} 0%, 
    ${({ theme }) => theme.colors.error.main} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
`;

const ErrorDetails = styled.details`
  margin: ${({ theme }) => theme.spacing.lg} 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: left;
  
  summary {
    cursor: pointer;
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[600]};
    }
  }
  
  pre {
    background: ${({ theme }) => theme.colors.gray[50]};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    overflow-x: auto;
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

const ErrorActions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

// Error Boundary Class Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error,
      errorInfo
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Report to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  reportError = async (error, errorInfo) => {
    try {
      // Replace with your error reporting service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getUserId(), // Implement this based on your auth system
        errorId: this.state.errorId
      };

      // Example: Send to your error reporting service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });

      console.error('Error reported:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  getUserId = () => {
    // Get user ID from your auth system
    try {
      const state = window.__REDUX_STORE__?.getState?.();
      return state?.auth?.user?.id || 'anonymous';
    } catch {
      return 'anonymous';
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorInfo,
          this.handleRetry
        );
      }

      // Default error UI
      return (
        <ErrorContainer $fullScreen={this.props.fullScreen}>
          <ErrorCard variant="elevated">
            <Card.Content>
              <ErrorIcon>
                <AlertTriangle size={40} />
              </ErrorIcon>

              <ErrorTitle>
                {this.props.title || 'Oops! Something went wrong'}
              </ErrorTitle>

              <ErrorMessage>
                {this.props.message || 
                  'An unexpected error occurred. Our team has been notified and is working to fix the issue.'}
              </ErrorMessage>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <ErrorDetails>
                  <summary>
                    <Bug size={16} style={{ display: 'inline', marginRight: '8px' }} />
                    Error Details (Development Mode)
                  </summary>
                  <pre>
                    <strong>Error:</strong> {this.state.error.message}
                    {'\n\n'}
                    <strong>Stack Trace:</strong>
                    {'\n'}
                    {this.state.error.stack}
                    {'\n\n'}
                    <strong>Component Stack:</strong>
                    {'\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </ErrorDetails>
              )}

              <ErrorActions>
                <Button
                  variant="outline"
                  leftIcon={<RefreshCw size={18} />}
                  onClick={this.handleRetry}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<RefreshCw size={18} />}
                  onClick={this.handleReload}
                >
                  Reload Page
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<Home size={18} />}
                  onClick={this.handleGoHome}
                >
                  Go Home
                </Button>
              </ErrorActions>

              {this.state.errorId && (
                <div style={{ 
                  marginTop: '24px', 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)' 
                }}>
                  Error ID: {this.state.errorId}
                </div>
              )}
            </Card.Content>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Functional Error Boundary Hook (React 18+)
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = () => setError(null);

  const captureError = React.useCallback((error, errorInfo) => {
    setError({ error, errorInfo });
    
    // Report error
    if (process.env.NODE_ENV === 'production') {
      // Report to error service
      console.error('Error captured:', error, errorInfo);
    }
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// Async Error Boundary for handling async errors
export class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Async Error Boundary:', error, errorInfo);
    
    // Report error to monitoring service
    this.reportError(error, errorInfo);
  }

  reportError = (error, errorInfo) => {
    // Same implementation as main ErrorBoundary
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <AlertTriangle size={24} color="#ef4444" style={{ marginBottom: '12px' }} />
          <h3 style={{ margin: '0 0 8px', color: '#dc2626' }}>
            Something went wrong
          </h3>
          <p style={{ margin: '0 0 16px', color: '#7f1d1d', fontSize: '14px' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button size="sm" onClick={this.handleRetry}>
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = (Component, errorBoundaryConfig = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Error fallback components
export const ErrorFallback = ({ error, resetError }) => (
  <div style={{ 
    padding: '40px 20px', 
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto'
  }}>
    <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '20px' }} />
    <h2 style={{ marginBottom: '12px', color: '#dc2626' }}>
      Something went wrong
    </h2>
    <p style={{ marginBottom: '20px', color: '#6b7280' }}>
      {error?.message || 'An unexpected error occurred'}
    </p>
    <Button onClick={resetError}>Try again</Button>
  </div>
);

export const PageErrorFallback = ({ error, resetError }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    textAlign: 'center'
  }}>
    <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '24px' }} />
    <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>
      Page Error
    </h1>
    <p style={{ marginBottom: '24px', color: '#6b7280', maxWidth: '400px' }}>
      This page encountered an error and couldn't be displayed properly.
    </p>
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button variant="outline" onClick={resetError}>
        Try Again
      </Button>
      <Button onClick={() => window.location.href = '/'}>
        Go Home
      </Button>
    </div>
  </div>
);

// Component Error Boundary (smaller scope)
export const ComponentErrorBoundary = ({ children, fallback: Fallback = ErrorFallback }) => {
  return (
    <ErrorBoundary
      fallback={(error, errorInfo, retry) => (
        <Fallback error={error} resetError={retry} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

// Route Error Boundary
export const RouteErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      fullScreen
      title="Page Not Found"
      message="The page you're looking for couldn't be loaded."
      fallback={(error, errorInfo, retry) => (
        <PageErrorFallback error={error} resetError={retry} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;