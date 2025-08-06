// src/components/common/Button/Button.jsx
import React, { forwardRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Loader2 } from 'lucide-react';

// Animations
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

// Button variants
const variants = {
  primary: css`
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]} 0%, ${({ theme }) => theme.colors.primary[700]} 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  
  secondary: css`
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.gray[200]};
      border-color: ${({ theme }) => theme.colors.gray[400]};
    }
    
    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.gray[300]};
    }
  `,
  
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary[600]};
    border: 2px solid ${({ theme }) => theme.colors.primary[600]};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary[50]};
      border-color: ${({ theme }) => theme.colors.primary[700]};
      color: ${({ theme }) => theme.colors.primary[700]};
    }
    
    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary[100]};
    }
  `,
  
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: none;
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.action.hover};
    }
    
    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.action.selected};
    }
  `,
  
  danger: css`
    background: ${({ theme }) => theme.colors.error.main};
    color: ${({ theme }) => theme.colors.error.contrast};
    border: none;
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.error.dark};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  
  success: css`
    background: ${({ theme }) => theme.colors.success.main};
    color: ${({ theme }) => theme.colors.success.contrast};
    border: none;
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.success.dark};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
};

// Button sizes
const sizes = {
  xs: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: ${({ theme }) => theme.fontSize.xs};
    height: 28px;
  `,
  
  sm: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.fontSize.sm};
    height: 36px;
  `,
  
  md: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.fontSize.base};
    height: 44px;
  `,
  
  lg: css`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
    font-size: ${({ theme }) => theme.fontSize.lg};
    height: 52px;
  `,
  
  xl: css`
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xxl}`};
    font-size: ${({ theme }) => theme.fontSize.xl};
    height: 60px;
  `,
};

// Styled components
const StyledButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  border-radius: ${({ theme, $rounded }) => 
    $rounded === 'full' ? '9999px' : 
    $rounded === 'lg' ? theme.borderRadius.lg : 
    theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.base};
  overflow: hidden;
  
  /* Apply variant styles */
  ${({ $variant }) => variants[$variant] || variants.primary}
  
  /* Apply size styles */
  ${({ $size }) => sizes[$size] || sizes.md}
  
  /* Full width */
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Focus state */
  &:focus {
    outline: none;
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }
  
  /* Loading state */
  ${({ $loading }) => $loading && css`
    color: transparent;
    pointer-events: none;
  `}
  
  /* Icon only */
  ${({ $iconOnly, $size }) => $iconOnly && css`
    padding: ${sizes[$size] ? 
      $size === 'xs' ? '6px' :
      $size === 'sm' ? '8px' :
      $size === 'md' ? '10px' :
      $size === 'lg' ? '12px' :
      '14px' : '10px'};
    width: ${sizes[$size] ? 
      $size === 'xs' ? '28px' :
      $size === 'sm' ? '36px' :
      $size === 'md' ? '44px' :
      $size === 'lg' ? '52px' :
      '60px' : '44px'};
  `}
`;

const LoadingSpinner = styled(Loader2)`
  position: absolute;
  animation: ${spin} 1s linear infinite;
`;

const RippleEffect = styled.span`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: scale(0);
  animation: ${ripple} 0.6s ease-out;
  pointer-events: none;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

// Button component
export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconOnly = false,
  leftIcon,
  rightIcon,
  rounded = 'md',
  ripple = true,
  className,
  onClick,
  ...props
}, ref) => {
  const [ripples, setRipples] = React.useState([]);
  
  const handleClick = (e) => {
    if (ripple && !disabled && !loading) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
        size,
      };
      
      setRipples((prev) => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }
    
    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };
  
  return (
    <StyledButton
      ref={ref}
      className={className}
      onClick={handleClick}
      disabled={disabled || loading}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      $iconOnly={iconOnly}
      $rounded={rounded}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size={
            size === 'xs' ? 14 :
            size === 'sm' ? 16 :
            size === 'md' ? 18 :
            size === 'lg' ? 20 :
            22
          }
        />
      )}
      
      {leftIcon && !loading && (
        <IconWrapper>{leftIcon}</IconWrapper>
      )}
      
      {!iconOnly && children}
      
      {rightIcon && !loading && (
        <IconWrapper>{rightIcon}</IconWrapper>
      )}
      
      {ripples.map((ripple) => (
        <RippleEffect
          key={ripple.id}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </StyledButton>
  );
});

Button.displayName = 'Button';

// Export a styled version for extending
export const StyledButtonBase = StyledButton;