// src/components/common/UserProfile/UserProfile.jsx

import React from 'react';
import styled from 'styled-components';
import { User, Mail, LogOut } from 'lucide-react';

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.paper};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;


    export const UserProfile = ({ user, onLogout, compact = false }) => {
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
            if (user?.photoUrl && !imageError) return user.photoUrl;
            if (user?.avatar && !imageError) return user.avatar;
            if (user?.profile_image && !imageError) return user.profile_image;
            
            if (user?.name) {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=80&font-size=0.5`;
            }
            
            return null;
        };

        const profileImageUrl = getProfileImageUrl(user);

        return (
            <ProfileContainer>
            <Avatar>
                {profileImageUrl ? (
                <img 
                    src={profileImageUrl} 
                    alt={user?.name || 'Profile'}
                    onError={() => setImageError(true)}
                />
                ) : (
                <span style={{ color: 'white', fontWeight: '600' }}>
                    {getInitials(user?.name)}
                </span>
                )}
            </Avatar>
            
            {!compact && (
                <UserInfo>
                <UserName>{user?.name || 'User'}</UserName>
                <UserEmail>{user?.email}</UserEmail>
                </UserInfo>
            )}
            
            {onLogout && (
                <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <LogOut size={18} />
                </button>
            )}
            </ProfileContainer>
        );
    };


export { UserProfile };