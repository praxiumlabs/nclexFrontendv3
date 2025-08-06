// src/components/common/Card/Card.jsx
import React from 'react';
import styled, { css } from 'styled-components';

// Card variants
const variants = {
  default: css`
    background: ${({ theme }) => theme.colors.background.paper};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
  `,
  
  elevated: css`
    background: ${({ theme }) => theme.colors.background.elevated};
    border: none;
    box-shadow: ${({ theme }) => theme.shadows.lg};
  `,
  
  outlined: css`
    background: transparent;
    border: 2px solid ${({ theme }) => theme.colors.border.main};
  `,
  
  gradient: css`
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.colors.primary[500]} 0%, 
      ${({ theme }) => theme.colors.primary[600]} 100%);
    border: none;
    color: white;
  `,
  
  glass: css`
    background: ${({ theme }) => 
      theme.name === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(255, 255, 255, 0.7)'};
    backdrop-filter: blur(10px);
    border: 1px solid ${({ theme }) => 
      theme.name === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.3)'};
  `,
};

// Styled components
const StyledCard = styled.div`
  position: relative;
  border-radius: ${({ theme, $rounded }) => 
    $rounded === 'none' ? '0' :
    $rounded === 'sm' ? theme.borderRadius.sm :
    $rounded === 'lg' ? theme.borderRadius.lg :
    $rounded === 'xl' ? theme.borderRadius.xl :
    theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.base};
  overflow: ${({ $overflow }) => $overflow || 'hidden'};
  
  /* Apply variant styles */
  ${({ $variant }) => variants[$variant] || variants.default}
  
  /* Apply padding */
  ${({ $padding, theme }) => $padding !== false && css`
    padding: ${
      $padding === 'xs' ? theme.spacing.xs :
      $padding === 'sm' ? theme.spacing.sm :
      $padding === 'lg' ? theme.spacing.lg :
      $padding === 'xl' ? theme.spacing.xl :
      theme.spacing.md
    };
  `}
  
  /* Hover effect */
  ${({ $hoverable }) => $hoverable && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.xl};
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  /* Clickable */
  ${({ $onClick }) => $onClick && css`
    cursor: pointer;
  `}
  
  /* Full height */
  ${({ $fullHeight }) => $fullHeight && css`
    height: 100%;
  `}
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  
  ${({ $noBorder }) => $noBorder && css`
    border-bottom: none;
  `}
  
  /* If card has no padding, adjust header */
  ${StyledCard}:not([data-padding="true"]) & {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md}`};
    margin: ${({ theme }) => `-${theme.spacing.md} -${theme.spacing.md} ${theme.spacing.md}`};
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme, $size }) => 
    $size === 'sm' ? theme.fontSize.lg :
    $size === 'lg' ? theme.fontSize['2xl'] :
    theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: ${({ theme }) => theme.lineHeight.tight};
`;

const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => `${theme.spacing.xs} 0 0`};
  line-height: ${({ theme }) => theme.lineHeight.normal};
`;

const CardContent = styled.div`
  ${({ $padding, theme }) => $padding && css`
    padding: ${
      $padding === 'xs' ? theme.spacing.xs :
      $padding === 'sm' ? theme.spacing.sm :
      $padding === 'lg' ? theme.spacing.lg :
      $padding === 'xl' ? theme.spacing.xl :
      theme.spacing.md
    };
  `}
`;

const CardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  
  ${({ $noBorder }) => $noBorder && css`
    border-top: none;
  `}
  
  /* If card has no padding, adjust footer */
  ${StyledCard}:not([data-padding="true"]) & {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md}`};
    margin: ${({ theme }) => `${theme.spacing.md} -${theme.spacing.md} -${theme.spacing.md}`};
  }
`;

const CardMedia = styled.div`
  position: relative;
  width: 100%;
  padding-top: ${({ $aspectRatio }) => 
    $aspectRatio === '16:9' ? '56.25%' :
    $aspectRatio === '4:3' ? '75%' :
    $aspectRatio === '1:1' ? '100%' :
    $aspectRatio === '3:2' ? '66.67%' :
    '56.25%'};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray[200]};
  
  /* If card has no padding, adjust media */
  ${StyledCard}:not([data-padding="true"]) & {
    margin: ${({ theme }) => `-${theme.spacing.md} -${theme.spacing.md} ${theme.spacing.md}`};
  }
  
  img, video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ theme, $color }) => 
    $color === 'primary' ? theme.colors.primary[500] :
    $color === 'success' ? theme.colors.success.main :
    $color === 'error' ? theme.colors.error.main :
    $color === 'warning' ? theme.colors.warning.main :
    theme.colors.gray[800]};
  color: white;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  z-index: 1;
`;

// Card component
export const Card = React.forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'md',
  hoverable = false,
  fullHeight = false,
  overflow = 'hidden',
  className,
  onClick,
  ...props
}, ref) => {
  return (
    <StyledCard
      ref={ref}
      className={className}
      $variant={variant}
      $padding={padding}
      $rounded={rounded}
      $hoverable={hoverable}
      $fullHeight={fullHeight}
      $overflow={overflow}
      $onClick={onClick}
      onClick={onClick}
      data-padding={padding !== false}
      {...props}
    >
      {children}
    </StyledCard>
  );
});

Card.displayName = 'Card';

// Sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Media = CardMedia;
Card.Badge = CardBadge;

// Export styled components for extending
export {
  StyledCard,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardContent,
  CardFooter,
  CardMedia,
  CardBadge,
};