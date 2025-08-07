
// src/pages/NotFound/NotFound.jsx
import React from 'react';
import styled from 'styled-components';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background: ${({ theme }) => theme.colors.background.default};
`;

const NotFoundIllustration = styled.div`
  font-size: 120px;
  font-weight: bold;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[500]} 0%, 
    ${({ theme }) => theme.colors.primary[600]} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 80px;
  }
`;

const NotFoundTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSize['2xl']};
  }
`;

const NotFoundMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 500px;
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
`;

const NotFoundActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <NotFoundIllustration>404</NotFoundIllustration>
      
      <NotFoundTitle>Page Not Found</NotFoundTitle>
      
      <NotFoundMessage>
        The page you're looking for doesn't exist or may have been moved. 
        Let's get you back on track with your NCLEX preparation.
      </NotFoundMessage>
      
      <NotFoundActions>
        <Button
          variant="outline"
          leftIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          leftIcon={<Home size={18} />}
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
        <Button
          variant="outline"
          leftIcon={<Search size={18} />}
          onClick={() => navigate('/app/practice')}
        >
          Start Practicing
        </Button>
      </NotFoundActions>
    </NotFoundContainer>
  );
};

export default NotFound;