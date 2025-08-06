// src/components/common/Modal/Modal.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { X } from 'lucide-react';
import { Button } from '../Button/Button';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-20px);
    opacity: 0;
  }
`;

const scaleIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const scaleOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.9);
    opacity: 0;
  }
`;

// Modal sizes
const sizes = {
  xs: css`
    max-width: 320px;
  `,
  sm: css`
    max-width: 480px;
  `,
  md: css`
    max-width: 640px;
  `,
  lg: css`
    max-width: 800px;
  `,
  xl: css`
    max-width: 1024px;
  `,
  full: css`
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
  `,
};

// Styled components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.background.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndex.modal};
  animation: ${({ $isClosing }) => $isClosing ? fadeOut : fadeIn} 
    ${({ theme }) => theme.transitions.base};
`;

const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: calc(100vh - 32px);
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  display: flex;
  flex-direction: column;
  animation: ${({ $isClosing, $animation }) => 
    $isClosing 
      ? $animation === 'scale' ? scaleOut : slideOut
      : $animation === 'scale' ? scaleIn : slideIn} 
    ${({ theme }) => theme.transitions.base};
  
  /* Apply size */
  ${({ $size }) => sizes[$size] || sizes.md}
  
  /* Fullscreen on mobile */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
    max-height: 100%;
    height: ${({ $fullscreenMobile }) => $fullscreenMobile ? '100%' : 'auto'};
    border-radius: ${({ $fullscreenMobile, theme }) => 
      $fullscreenMobile ? '0' : theme.borderRadius.xl};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
  
  ${({ $noBorder }) => $noBorder && css`
    border-bottom: none;
  `}
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: ${({ theme }) => theme.lineHeight.tight};
`;

const ModalDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => `${theme.spacing.xs} 0 0`};
  line-height: ${({ theme }) => theme.lineHeight.normal};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;
  margin-left: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    background: ${({ theme }) => theme.colors.action.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  &:focus {
    outline: none;
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  
  ${({ $noPadding }) => $noPadding && css`
    padding: 0;
  `}
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) => 
    $align === 'left' ? 'flex-start' :
    $align === 'right' ? 'flex-end' :
    $align === 'between' ? 'space-between' :
    'flex-end'};
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
  
  ${({ $noBorder }) => $noBorder && css`
    border-top: none;
  `}
  
  /* Stack buttons on mobile */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    ${({ $stackOnMobile }) => $stackOnMobile && css`
      flex-direction: column-reverse;
      
      button {
        width: 100%;
      }
    `}
  }
`;

// Modal component
export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  animation = 'slide',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  fullscreenMobile = false,
  preventScroll = true,
  className,
  overlayClassName,
  ...props
}) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape]); // eslint-disable-line
  
  // Handle body scroll
  useEffect(() => {
    if (!preventScroll) return;
    
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, preventScroll]);
  
  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      
      // Focus first focusable element or modal container
      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements?.length > 0) {
          focusableElements[0].focus();
        } else {
          modalRef.current?.focus();
        }
      }, 100);
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);
  
  // Handle close with animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose]);
  
  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  }, [closeOnOverlayClick, handleClose]);
  
  // Don't render if not open and not closing
  if (!isOpen && !isClosing) return null;
  
  // Render modal using portal
  return createPortal(
    <Overlay
      className={overlayClassName}
      onClick={handleOverlayClick}
      $isClosing={isClosing}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <ModalContainer
        ref={modalRef}
        className={className}
        $size={size}
        $animation={animation}
        $isClosing={isClosing}
        $fullscreenMobile={fullscreenMobile}
        tabIndex={-1}
        {...props}
      >
        {(title || showCloseButton) && (
          <ModalHeader>
            <div>
              {title && <ModalTitle id="modal-title">{title}</ModalTitle>}
              {description && <ModalDescription id="modal-description">{description}</ModalDescription>}
            </div>
            {showCloseButton && (
              <CloseButton
                onClick={handleClose}
                aria-label="Close modal"
                type="button"
              >
                <X size={20} />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        {children}
      </ModalContainer>
    </Overlay>,
    document.body
  );
};

// Sub-components
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

// Preset modal components
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  isLoading = false,
  ...props
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      {...props}
    >
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={handleConfirm}
          loading={isLoading}
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const AlertModal = ({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  buttonText = 'OK',
  variant = 'primary',
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      {...props}
    >
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer align="center">
        <Button
          variant={variant}
          onClick={onClose}
          fullWidth
        >
          {buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};