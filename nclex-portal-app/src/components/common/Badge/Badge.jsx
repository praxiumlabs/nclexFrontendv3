// src/components/common/Badge/Badge.jsx
import React from 'react';
import styled, { css } from 'styled-components';

// Badge variants
const variants = {
  default: css`
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[800]};
  `,
  
  primary: css`
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[800]};
  `,
  
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary[100]};
    color: ${({ theme }) => theme.colors.secondary[800]};
  `,
  
  success: css`
    background: ${({ theme }) => theme.colors.success.light};
    color: ${({ theme }) => theme.colors.success.dark};
  `,
  
  error: css`
    background: ${({ theme }) => theme.colors.error.light};
    color: ${({ theme }) => theme.colors.error.dark};
  `,
  
  warning: css`
    background: ${({ theme }) => theme.colors.warning.light};
    color: ${({ theme }) => theme.colors.warning.dark};
  `,
  
  info: css`
    background: ${({ theme }) => theme.colors.info.light};
    color: ${({ theme }) => theme.colors.info.dark};
  `,
  
  outline: css`
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.border.main};
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  
  solid: css`
    background: ${({ theme, $color }) => 
      $color === 'primary' ? theme.colors.primary[500] :
      $color === 'success' ? theme.colors.success.main :
      $color === 'error' ? theme.colors.error.main :
      $color === 'warning' ? theme.colors.warning.main :
      $color === 'info' ? theme.colors.info.main :
      theme.colors.gray[800]};
    color: white;
  `,
};

// Badge sizes
const sizes = {
  xs: css`
    padding: ${({ theme }) => `2px ${theme.spacing.xs}`};
    font-size: ${({ theme }) => theme.fontSize.xs};
    min-height: 16px;
  `,
  
  sm: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: ${({ theme }) => theme.fontSize.xs};
    min-height: 20px;
  `,
  
  md: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.fontSize.sm};
    min-height: 24px;
  `,
  
  lg: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.fontSize.sm};
    min-height: 28px;
  `,
};

// Styled components
const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  line-height: 1;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: ${({ theme, $rounded }) => 
    $rounded === 'none' ? '0' :
    $rounded === 'sm' ? theme.borderRadius.sm :
    $rounded === 'lg' ? theme.borderRadius.lg :
    $rounded === 'full' ? theme.borderRadius.full :
    theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  /* Apply variant styles */
  ${({ $variant, $color }) => variants[$variant] || variants.default}
  
  /* Apply size styles */
  ${({ $size }) => sizes[$size] || sizes.md}
  
  /* Dot indicator */
  ${({ $dot }) => $dot && css`
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: ${({ theme }) => theme.spacing.xs};
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
    
    padding-left: ${({ theme }) => `calc(${theme.spacing.md} + 6px)`};
  `}
  
  /* Clickable */
  ${({ $clickable }) => $clickable && css`
    cursor: pointer;
    
    &:hover {
      opacity: 0.8;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  /* Removable */
  ${({ $removable }) => $removable && css`
    padding-right: ${({ theme }) => `calc(${theme.spacing.sm} + 16px)`};
    
    .badge-remove {
      margin-left: ${({ theme }) => theme.spacing.xs};
      cursor: pointer;
      border-radius: 50%;
      padding: 2px;
      
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  `}
`;

const BadgeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  color: currentColor;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

// Badge component
export const Badge = React.forwardRef(({
  children,
  variant = 'default',
  color,
  size = 'md',
  rounded = 'full',
  dot = false,
  icon,
  removable = false,
  clickable = false,
  className,
  onClick,
  onRemove,
  ...props
}, ref) => {
  return (
    <StyledBadge
      ref={ref}
      className={className}
      $variant={variant}
      $color={color}
      $size={size}
      $rounded={rounded}
      $dot={dot}
      $clickable={clickable || !!onClick}
      $removable={removable}
      onClick={onClick}
      {...props}
    >
      {icon && (
        <BadgeIcon>
          {icon}
        </BadgeIcon>
      )}
      {children}
      {removable && (
        <RemoveButton
          className="badge-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove && onRemove();
          }}
          type="button"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </RemoveButton>
      )}
    </StyledBadge>
  );
});

Badge.displayName = 'Badge';

// Status badges
export const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    active: { variant: 'success', children: 'Active' },
    inactive: { variant: 'default', children: 'Inactive' },
    pending: { variant: 'warning', children: 'Pending' },
    completed: { variant: 'success', children: 'Completed' },
    failed: { variant: 'error', children: 'Failed' },
    cancelled: { variant: 'default', children: 'Cancelled' },
    draft: { variant: 'default', children: 'Draft' },
    published: { variant: 'success', children: 'Published' },
  };

  const config = statusConfig[status] || { variant: 'default', children: status };

  return <Badge {...config} {...props} />;
};

// Number badge (for notifications, counts, etc.)
export const NumberBadge = ({ count, max = 99, ...props }) => {
  const displayCount = count > max ? `${max}+` : count;
  
  return (
    <Badge 
      variant="solid" 
      color="error" 
      size="xs" 
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

// Tag badge
export const TagBadge = ({ children, onRemove, ...props }) => {
  return (
    <Badge
      variant="outline"
      removable={!!onRemove}
      onRemove={onRemove}
      {...props}
    >
      {children}
    </Badge>
  );
};

// Export styled component for extending
export { StyledBadge };