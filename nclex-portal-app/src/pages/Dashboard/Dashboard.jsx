// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  TrendingUp, Clock, Target, Star, Zap, Brain, 
  BookOpen, Calendar, Award, Activity, Coffee,
  ChevronRight, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Remove the Layout import - it's not needed here
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { Loader } from '../../components/common/Loader/Loader';
import { UserProfile } from '../../components/common/UserProfile/UserProfile';
import { useAuth } from '../../hooks/useAuth';
import { 
  selectOverview, 
  selectSubjectProgress,
  selectWeeklyGoals,
  selectActivityHistory,
  fetchProgressOverview,
  fetchSubjectProgress
} from '../../store/slices/progressSlice';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';
import {
  PerformanceChart,
  WeeklyActivityChart,
  SubjectRadarChart
} from '../../components/dashboard/Charts';

// Styled components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const WelcomeContent = styled.div``;

const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  
  span {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const QuickActionCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${({ $color }) => $color};
  }
`;

const QuickActionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const QuickActionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`;

const QuickActionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ $trend }) => 
    $trend === 'up' ? 'rgba(34, 197, 94, 0.1)' : 
    $trend === 'down' ? 'rgba(239, 68, 68, 0.1)' : 
    'rgba(107, 114, 128, 0.1)'};
  color: ${({ $trend }) => 
    $trend === 'up' ? '#22c55e' : 
    $trend === 'down' ? '#ef4444' : 
    '#6b7280'};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const StatMainValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ChartContainer = styled.div`
  height: 320px;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ProgressCard = styled(Card)`
  position: relative;
  overflow: visible;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.colors.primary[500]} 0%, 
      ${({ theme }) => theme.colors.primary[600]} 100%);
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    z-index: -1;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.base};
  }
  
  &:hover::before {
    opacity: 0.1;
  }
`;

// Dashboard component
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const overview = useSelector(selectOverview);
  const subjectProgress = useSelector(selectSubjectProgress);
  const weeklyGoals = useSelector(selectWeeklyGoals);
  const activityHistory = useSelector(selectActivityHistory);
  const [loading, setLoading] = useState(true);

  // Animated values
  const animatedAccuracy = useAnimatedValue(0, overview.overallAccuracy, { duration: 2000 });
  const animatedQuestions = useAnimatedValue(0, overview.totalQuestionsAnswered, { duration: 1500 });
  const animatedStreak = useAnimatedValue(0, overview.currentStreak, { duration: 1000 });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(fetchProgressOverview()),
          dispatch(fetchSubjectProgress())
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <Layout>
      <DashboardContainer>
        {/* Welcome section with user info */}
        <WelcomeSection>
          <WelcomeContent>
            <WelcomeTitle>Welcome back, {user?.name || 'Student'}!</WelcomeTitle>
            <WelcomeSubtitle>Ready to continue your NCLEX preparation?</WelcomeSubtitle>
          </WelcomeContent>
          
          {user && (
            <UserProfile user={user} onLogout={logout} />
          )}
        </WelcomeSection>
        
        {/* Rest of your dashboard content */}
      </DashboardContainer>
    </Layout>
  );
};

  const quickActions = [
    {
      id: 'quick-practice',
      title: 'Quick Practice',
      description: '10 adaptive questions',
      icon: Zap,
      color: '#10b981',
      action: () => navigate('/app/practice?mode=quick')
    },
    {
      id: 'srs-review',
      title: 'SRS Review',
      description: '5 questions due',
      icon: Brain,
      color: '#3b82f6',
      action: () => navigate('/app/srs-review')
    },
    {
      id: 'mock-exam',
      title: 'Mock Exam',
      description: 'Full-length test',
      icon: Target,
      color: '#8b5cf6',
      action: () => navigate('/app/mock-exams')
    }
  ];

  // If loading, return just the loader (no Layout wrapper)
  if (loading) {
    return <Loader fullScreen text="Loading your dashboard..." />;
  }

  // Return the dashboard content WITHOUT wrapping it in Layout
  return (
    <DashboardContainer>
      {/* Welcome Section */}
      <WelcomeSection>
        <WelcomeContent>
          <WelcomeTitle>
            {getGreeting()}, <span>Sarah</span>! 👋
          </WelcomeTitle>
          <WelcomeSubtitle>
            {overview.currentStreak > 0 
              ? `You're on a ${overview.currentStreak} day streak! Keep it up!`
              : 'Ready to start your study session?'}
          </WelcomeSubtitle>
        </WelcomeContent>
      </WelcomeSection>

      {/* Quick Actions */}
      <div>
        <SectionHeader>
          <SectionTitle>Quick Actions</SectionTitle>
        </SectionHeader>
        
        <QuickActionsGrid>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <QuickActionCard 
                key={action.id}
                $color={action.color}
                onClick={action.action}
                hoverable
              >
                <Card.Content>
                  <QuickActionIcon $color={action.color}>
                    <Icon size={24} />
                  </QuickActionIcon>
                  <QuickActionTitle>{action.title}</QuickActionTitle>
                  <QuickActionDescription>{action.description}</QuickActionDescription>
                </Card.Content>
              </QuickActionCard>
            );
          })}
        </QuickActionsGrid>
      </div>

      {/* Statistics */}
      <div>
        <SectionHeader>
          <SectionTitle>Your Progress</SectionTitle>
          <Button 
            variant="ghost" 
            size="sm"
            rightIcon={<ChevronRight size={16} />}
            onClick={() => navigate('/app/progress')}
          >
            View Details
          </Button>
        </SectionHeader>
        
        <StatsGrid>
          <StatCard variant="elevated" onClick={() => navigate('/app/progress')}>
            <Card.Content>
              <StatHeader>
                <StatTitle>Overall Accuracy</StatTitle>
                <StatBadge $trend="up">
                  <ArrowUpRight size={14} />
                  +5%
                </StatBadge>
              </StatHeader>
              <StatMainValue>{Math.floor(animatedAccuracy)}%</StatMainValue>
              <StatDescription>
                Keep it above 75% to maintain your current level
              </StatDescription>
            </Card.Content>
          </StatCard>

          <StatCard variant="elevated" onClick={() => navigate('/app/progress')}>
            <Card.Content>
              <StatHeader>
                <StatTitle>Questions Answered</StatTitle>
                <StatBadge $trend="up">
                  <ArrowUpRight size={14} />
                  +12%
                </StatBadge>
              </StatHeader>
              <StatMainValue>{Math.floor(animatedQuestions)}</StatMainValue>
              <StatDescription>
                {weeklyGoals.questionsTarget - weeklyGoals.questionsCompleted} more to reach weekly goal
              </StatDescription>
            </Card.Content>
          </StatCard>

          <StatCard variant="elevated" onClick={() => navigate('/app/progress')}>
            <Card.Content>
              <StatHeader>
                <StatTitle>Study Streak</StatTitle>
                <StatBadge $trend={animatedStreak > 0 ? 'up' : 'neutral'}>
                  {animatedStreak > 0 ? <ArrowUpRight size={14} /> : <Activity size={14} />}
                  {animatedStreak > 0 ? `${animatedStreak} days` : 'Start today'}
                </StatBadge>
              </StatHeader>
              <StatMainValue>{Math.floor(animatedStreak)} days</StatMainValue>
              <StatDescription>
                {animatedStreak > 0 
                  ? 'Keep studying daily to maintain your streak!'
                  : 'Complete a session to start your streak'}
              </StatDescription>
            </Card.Content>
          </StatCard>
        </StatsGrid>
      </div>

      {/* Performance Charts */}
      <StatsGrid>
        <ProgressCard variant="elevated">
          <Card.Content>
            <StatHeader>
              <StatTitle>Weekly Activity</StatTitle>
              <StatBadge $trend="up">
                <ArrowUpRight size={14} />
                +12%
              </StatBadge>
            </StatHeader>
            <StatMainValue>{Math.floor(animatedQuestions)}</StatMainValue>
            <StatDescription>
              {weeklyGoals.questionsTarget - weeklyGoals.questionsCompleted} more to reach weekly goal
            </StatDescription>
            <ChartContainer>
              <WeeklyActivityChart data={weeklyGoals} />
            </ChartContainer>
          </Card.Content>
        </ProgressCard>

        <ProgressCard variant="elevated">
          <Card.Content>
            <StatHeader>
              <StatTitle>Subject Performance</StatTitle>
              <Button variant="ghost" size="xs" onClick={() => navigate('/app/subjects')}>
                View All
              </Button>
            </StatHeader>
            <ChartContainer>
              <SubjectRadarChart data={subjectProgress} />
            </ChartContainer>
          </Card.Content>
        </ProgressCard>
      </StatsGrid>

      {/* Recent Activity */}
      <div>
        <SectionHeader>
          <SectionTitle>Recent Activity</SectionTitle>
          <Button 
            variant="ghost" 
            size="sm"
            rightIcon={<ChevronRight size={16} />}
            onClick={() => navigate('/app/activity')}
          >
            View All
          </Button>
        </SectionHeader>
        
        {/* Activity items would go here */}
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;