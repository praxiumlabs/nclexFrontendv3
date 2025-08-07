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
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ProfileContainer>
      <Avatar>
        {user.photoUrl ? (
          <img src={user.photoUrl} alt={user.name} />
        ) : (
          <User size={20} color="white" />
        )}
      </Avatar>
      
      {!compact && (
        <UserInfo>
          <UserName>{user.name || 'User'}</UserName>
          <UserEmail>{user.email}</UserEmail>
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