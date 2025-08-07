// Create src/components/common/GuestBanner/GuestBanner.jsx - Show guest mode indicator
import React from 'react';
import styled from 'styled-components';
import { UserCheck, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button/Button';

const BannerContainer = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.warning.light} 0%, 
    ${({ theme }) => theme.colors.warning.main} 100%);
  color: ${({ theme }) => theme.colors.warning.dark};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    text-align: center;
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BannerActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    justify-content: center;
  }
`;

export const GuestBanner = () => {
  const navigate = useNavigate();
  
  return (
    <BannerContainer>
      <BannerContent>
        <UserCheck size={20} />
        <span>You're browsing as a guest. Sign up to save your progress!</span>
      </BannerContent>
      
      <BannerActions>
        <Button 
          variant="outline" 
          size="xs"
          leftIcon={<LogIn size={14} />}
          onClick={() => navigate('/login')}
        >
          Sign In
        </Button>
        <Button 
          variant="solid" 
          color="primary"
          size="xs"
          leftIcon={<UserPlus size={14} />}
          onClick={() => navigate('/register')}
        >
          Sign Up
        </Button>
      </BannerActions>
    </BannerContainer>
  );
};