// src/components/common/Toast/Toast.jsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectToast, hideToast } from '../../../store/slices/uiSlice';

// Animations
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const progressAnimation = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

// Toast variants
const variants = {
  success: css`
    background: ${({ theme }) => theme.colors.success.light};
    border-left: 4px solid ${({ theme }) => theme.colors.success.main};
    color: ${({ theme }) => theme.colors.success.dark};
  `,
  
  error: css`
    background: ${({ theme }) => theme.colors.error.light};
    border-left: 4px solid ${({ theme }) => theme.colors.error.main};
    color: ${({ theme }) => theme.colors.error.dark};
  `,
  
  warning: css`
    background: ${({ theme }) => theme.colors.warning.light};
    border-left: 4px solid ${({ theme }) => theme.colors.warning.main};
    color: ${({ theme }) => theme.colors.warning.dark};
  `,
  
  info: css`
    background: ${({ theme }) => theme.colors.info.light};
    border-left: 4px solid ${({ theme }) => theme.colors.info.main};
    color: ${({ theme }) => theme.colors.info.dark};
  `,
};

// Styled components
const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  pointer-events: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
    left: ${({ theme }) => theme.spacing.md};
  }
`;

const ToastWrapper = styled.div`
  position: relative;
  width: 400px;
  max-width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  animation: ${({ $isClosing }) => 
    $isClosing ? slideOutRight : slideInRight} 
    ${({ theme }) => theme.transitions.base};
  pointer-events: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const ToastContent = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  backdrop-filter: blur(10px);
  overflow: hidden;
  
  ${({ $type }) => variants[$type] || variants.info}
`;

const ToastHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme, $hasMessage }) => $hasMessage ? theme.spacing.sm : '0'};
`;

const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: currentColor;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  opacity: 0.7;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
  }
`;

const ToastMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
  color: currentColor;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  animation: ${progressAnimation} ${({ $duration }) => $duration}ms linear;
`;

// Toast icons
const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} />;
    case 'error':
      return <XCircle size={20} />;
    case 'warning':
      return <AlertTriangle size={20} />;
    case 'info':
    default:
      return <Info size={20} />;
  }
};

// Toast titles
const getToastTitle = (type) => {
  switch (type) {
    case 'success':
      return 'Success';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Warning';
    case 'info':
    default:
      return 'Info';
  }
};

// Individual Toast component
const Toast = ({ 
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  closable = true,
  onClose,
  autoClose = true
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, autoClose]); // eslint-disable-line

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  return (
    <ToastWrapper $isClosing={isClosing}>
      <ToastContent $type={type}>
        <ToastHeader $hasMessage={!!message}>
          <ToastIcon>
            {getToastIcon(type)}
            {title || getToastTitle(type)}
          </ToastIcon>
          {closable && (
            <CloseButton onClick={handleClose} type="button">
              <X size={16} />
            </CloseButton>
          )}
        </ToastHeader>
        
        {message && (
          <ToastMessage>{message}</ToastMessage>
        )}
        
        {autoClose && duration > 0 && (
          <ProgressBar $duration={duration} />
        )}
      </ToastContent>
    </ToastWrapper>
  );
};

// Toast Manager component
export const ToastManager = () => {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (toast.open && toast.message) {
      const newToast = {
        id: Date.now(),
        type: toast.type,
        message: toast.message,
        duration: toast.duration,
        timestamp: Date.now()
      };

      setToasts(prev => [...prev, newToast]);
      dispatch(hideToast());
    }
  }, [toast, dispatch]);

  const handleRemoveToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return createPortal(
    <ToastContainer>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={handleRemoveToast}
        />
      ))}
    </ToastContainer>,
    document.body
  );
};

// Hook for using toasts
export const useToast = () => {
  const dispatch = useDispatch();

  const showToast = (message, type = 'info', options = {}) => {
    dispatch({
      type: 'ui/showToast',
      payload: {
        message,
        type,
        duration: options.duration || 5000,
        ...options
      }
    });
  };

  const showSuccess = (message, options) => showToast(message, 'success', options);
  const showError = (message, options) => showToast(message, 'error', options);
  const showWarning = (message, options) => showToast(message, 'warning', options);
  const showInfo = (message, options) => showToast(message, 'info', options);

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

// Toast Provider component (alternative implementation)
export const ToastProvider = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    const newToast = { id, ...toast };
    
    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Toast Context (for alternative implementation)
const ToastContext = React.createContext();

export const useToastContext = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

export default Toast;