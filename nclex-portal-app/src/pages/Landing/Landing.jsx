
// src/pages/Landing/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ArrowRight, CheckCircle, Star, Users, Award, 
  BookOpen, Target, TrendingUp, Shield 
} from 'lucide-react';
import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.default};
`;

const LandingHeader = styled.header`
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.background.paper};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const HeroSection = styled.section`
  padding: ${({ theme }) => `${theme.spacing.xxxl} ${theme.spacing.xl}`};
  text-align: center;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[50]} 0%, 
    ${({ theme }) => theme.colors.primary[100]} 100%);
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSize['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
`;

const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;
`;

const StatCard = styled(Card)`
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Landing = () => {
  const navigate = useNavigate();

  return (
    <LandingContainer>
      <LandingHeader>
        <Logo>
          <Shield size={32} />
          NCLEX Portal
        </Logo>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </div>
      </LandingHeader>

      <HeroSection>
        <HeroTitle>
          Master the NCLEX with Confidence
        </HeroTitle>
        
        <HeroSubtitle>
          Join thousands of nursing students who've passed their NCLEX exam 
          using our adaptive learning platform and comprehensive question bank.
        </HeroSubtitle>
        
        <HeroActions>
          <Button 
            size="lg"
            rightIcon={<ArrowRight size={20} />}
            onClick={() => navigate('/register')}
          >
            Start Free Trial
          </Button>
          <Button 
            variant="outline"
            size="lg"
            onClick={() => navigate('/demo')}
          >
            Watch Demo
          </Button>
        </HeroActions>

        <StatsSection>
          <StatCard>
            <Card.Content>
              <StatNumber>15,000+</StatNumber>
              <StatLabel>Active Students</StatLabel>
            </Card.Content>
          </StatCard>
          
          <StatCard>
            <Card.Content>
              <StatNumber>95%</StatNumber>
              <StatLabel>Pass Rate</StatLabel>
            </Card.Content>
          </StatCard>
          
          <StatCard>
            <Card.Content>
              <StatNumber>8,000+</StatNumber>
              <StatLabel>Practice Questions</StatLabel>
            </Card.Content>
          </StatCard>
          
          <StatCard>
            <Card.Content>
              <StatNumber>4.9/5</StatNumber>
              <StatLabel>Student Rating</StatLabel>
            </Card.Content>
          </StatCard>
        </StatsSection>
      </HeroSection>
    </LandingContainer>
  );
};

export default Landing;