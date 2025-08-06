// src/components/common/Loader/Loader.jsx
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Loader2, Activity, BookOpen } from 'lucide-react';

// Animations
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const wave = keyframes`
  0%, 40%, 100% {
    transform: scaleY(0.4);
    opacity: 0.5;
  }
  20% {
    transform: scaleY(1);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Loader types
const loaderTypes = {
  spinner: css`
    svg {
      animation: ${spin} 1s linear infinite;
    }
  `,
  
  pulse: css`
    animation: ${pulse} 1.5s ease-in-out infinite;
  `,
  
  bounce: css`
    animation: ${bounce} 1.4s ease-in-out infinite;
  `,
  
  dots: css`
    display: flex;
    gap: 4px;
    
    span {
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: 50%;
      animation: ${bounce} 1.4s ease-in-out infinite;
      
      &:nth-child(1) {
        animation-delay: -0.32s;
      }
      
      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  `,
  
  bars: css`
    display: flex;
    gap: 4px;
    
    span {
      width: 4px;
      height: 20px;
      background: currentColor;
      border-radius: 2px;
      animation: ${wave} 1.2s ease-in-out infinite;
      
      &:nth-child(1) {
        animation-delay: -0.36s;
      }
      
      &:nth-child(2) {
        animation-delay: -0.24s;
      }
      
      &:nth-child(3) {
        animation-delay: -0.12s;
      }
    }
  `,
};

// Styled components
const LoaderContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $color }) => 
    $color === 'primary' ? theme.colors.primary[500] :
    $color === 'secondary' ? theme.colors.secondary[500] :
    $color === 'success' ? theme.colors.success.main :
    $color === 'error' ? theme.colors.error.main :
    $color === 'warning' ? theme.colors.warning.main :
    $color === 'inherit' ? 'inherit' :
    theme.colors.text.primary};
  
  /* Apply loader type styles */
  ${({ $type }) => loaderTypes[$type] || loaderTypes.spinner}
`;

const FullScreenLoader = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.default};
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const LoaderText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SkeletonContainer = styled.div`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => 
    theme.name === 'dark' 
      ? theme.colors.gray[800] 
      : theme.colors.gray[200]};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => 
        theme.name === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(255, 255, 255, 0.3)'} 50%,
      transparent 100%
    );
    animation: ${shimmer} 2s linear infinite;
  }
  
  /* Skeleton shapes */
  ${({ $variant, theme }) => 
    $variant === 'text' ? css`
      height: 1em;
      border-radius: ${theme.borderRadius.sm};
      margin-bottom: ${theme.spacing.xs};
      
      &:last-child {
        width: 60%;
      }
    ` :
    $variant === 'title' ? css`
      height: 1.5em;
      border-radius: ${theme.borderRadius.sm};
      width: 50%;
      margin-bottom: ${theme.spacing.sm};
    ` :
    $variant === 'avatar' ? css`
      width: 40px;
      height: 40px;
      border-radius: ${theme.borderRadius.full};
    ` :
    $variant === 'button' ? css`
      height: 44px;
      width: 120px;
      border-radius: ${theme.borderRadius.md};
    ` :
    $variant === 'card' ? css`
      height: 200px;
      border-radius: ${theme.borderRadius.lg};
    ` :
    css`
      height: 100%;
      border-radius: ${theme.borderRadius.md};
    `
  }
`;

// Loader component
export const Loader = ({
  type = 'spinner',
  size = 24,
  color = 'primary',
  fullScreen = false,
  text,
  icon: CustomIcon,
  className,
  ...props
}) => {
  if (fullScreen) {
    const Icon = CustomIcon || BookOpen;
    
    return (
      <FullScreenLoader className={className} {...props}>
        <LoaderContainer $type={type} $color={color}>
          {type === 'spinner' && <Loader2 size={size * 2} />}
          {type === 'dots' && (
            <>
              <span />
              <span />
              <span />
            </>
          )}
          {type === 'bars' && (
            <>
              <span />
              <span />
              <span />
              <span />
              <span />
            </>
          )}
          {(type === 'pulse' || type === 'bounce') && <Icon size={size * 2} />}
        </LoaderContainer>
        {text && <LoaderText>{text}</LoaderText>}
      </FullScreenLoader>
    );
  }
  
  return (
    <LoaderContainer 
      className={className}
      $type={type}
      $color={color}
      {...props}
    >
      {type === 'spinner' && <Loader2 size={size} />}
      {type === 'dots' && (
        <>
          <span />
          <span />
          <span />
        </>
      )}
      {type === 'bars' && (
        <>
          <span />
          <span />
          <span />
          <span />
          <span />
        </>
      )}
      {(type === 'pulse' || type === 'bounce') && 
        (CustomIcon ? <CustomIcon size={size} /> : <Activity size={size} />)
      }
    </LoaderContainer>
  );
};

// Skeleton loader component
export const Skeleton = ({ 
  variant = 'text',
  width,
  height,
  count = 1,
  className,
  ...props 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonContainer
          key={index}
          className={className}
          $variant={variant}
          style={{ width, height }}
          {...props}
        />
      ))}
    </>
  );
};

// Page loader component
export const PageLoader = ({ text = 'Loading...' }) => (
  <Loader
    fullScreen
    type="pulse"
    size={48}
    text={text}
  />
);

// Inline loader component
export const InlineLoader = ({ text = 'Loading...', size = 16 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
    <Loader type="spinner" size={size} />
    {text && <span>{text}</span>}
  </div>
);

// Content loader patterns
export const ContentLoader = {
  Card: () => (
    <div>
      <Skeleton variant="card" />
      <div style={{ padding: '16px' }}>
        <Skeleton variant="title" />
        <Skeleton variant="text" count={3} />
      </div>
    </div>
  ),
  
  List: ({ count = 5 }) => (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <Skeleton variant="avatar" />
          <div style={{ flex: 1 }}>
            <Skeleton variant="title" />
            <Skeleton variant="text" count={2} />
          </div>
        </div>
      ))}
    </>
  ),
  
  Table: ({ rows = 5, cols = 4 }) => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px', marginBottom: '16px' }}>
        {Array.from({ length: cols }).map((_, index) => (
          <Skeleton key={index} variant="text" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px', marginBottom: '8px' }}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" />
          ))}
        </div>
      ))}
    </div>
  ),
};