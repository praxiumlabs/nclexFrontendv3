
import React from 'react';
import styled from 'styled-components';
import { User } from 'lucide-react';

const AvatarContainer = styled.div`
  width: ${({ $size }) => 
    $size === 'xs' ? '24px' :
    $size === 'sm' ? '32px' :
    $size === 'lg' ? '56px' :
    $size === 'xl' ? '72px' :
    '40px'};
  height: ${({ $size }) => 
    $size === 'xs' ? '24px' :
    $size === 'sm' ? '32px' :
    $size === 'lg' ? '56px' :
    $size === 'xl' ? '72px' :
    '40px'};
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme, $bgColor }) => $bgColor || theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.2s ease;
  }
  
  .initials {
    color: white;
    font-weight: 600;
    font-size: ${({ $size }) => 
      $size === 'xs' ? '10px' :
      $size === 'sm' ? '12px' :
      $size === 'lg' ? '20px' :
      $size === 'xl' ? '24px' :
      '14px'};
    user-select: none;
  }
  
  .icon {
    color: white;
  }
`;

export const ProfileAvatar = ({ 
  user, 
  size = 'md', 
  showOnlineStatus = false,
  fallbackColor,
  className,
  ...props 
}) => {
  const [imageError, setImageError] = React.useState(false);
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfileImageUrl = (user) => {
    // Priority order: photoUrl, avatar, profile_image, then generate one
    if (user?.photoUrl && !imageError) return user.photoUrl;
    if (user?.avatar && !imageError) return user.avatar;
    if (user?.profile_image && !imageError) return user.profile_image;
    
    // Generate avatar using UI Avatars service
    if (user?.name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=128&font-size=0.5`;
    }
    
    return null;
  };

  const profileImageUrl = getProfileImageUrl(user);
  
  return (
    <AvatarContainer 
      $size={size} 
      $bgColor={fallbackColor}
      className={className}
      {...props}
    >
      {profileImageUrl ? (
        <img 
          src={profileImageUrl}
          alt={user?.name || 'Profile'}
          onError={() => setImageError(true)}
        />
      ) : user?.name ? (
        <span className="initials">
          {getInitials(user.name)}
        </span>
      ) : (
        <User 
          className="icon" 
          size={size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'lg' ? 28 : size === 'xl' ? 36 : 20} 
        />
      )}
    </AvatarContainer>
  );
};