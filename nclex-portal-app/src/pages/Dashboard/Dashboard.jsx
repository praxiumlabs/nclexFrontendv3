// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  TrendingUp, Clock, Target, Star, Zap, Brain, 
  BookOpen, Calendar, Award, Activity, Coffee,
  ChevronRight, ArrowUpRight, ArrowDownRight, LogOut, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from '../../components/layout/layout/layout';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { Loader } from '../../components/common/Loader/Loader';
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

const UserProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2px;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.error.main};
  }
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
  margin: 0;
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
    $trend === 'down' ? '#ef4444' : '#6b7280'};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(Card)`
  min-height: 400px;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

// Dashboard component
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const overview = useSelector(selectOverview);
  const subjectProgress = useSelector(selectSubjectProgress);
  const weeklyGoals = useSelector(selectWeeklyGoals);
  const activityHistory = useSelector(selectActivityHistory);
  const [loading, setLoading] = useState(true);

  // Animated values
  const animatedAccuracy = useAnimatedValue(0, overview?.overallAccuracy || 0, { duration: 2000 });
  const animatedQuestions = useAnimatedValue(0, overview?.totalQuestionsAnswered || 0, { duration: 1500 });
  const animatedStreak = useAnimatedValue(0, overview?.currentStreak || 0, { duration: 1000 });

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
      description: `${overview?.srsCount || 5} questions due`,
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
    },
    {
      id: 'study-plan',
      title: 'Study Plan',
      description: 'Personalized schedule',
      icon: Calendar,
      color: '#f59e0b',
      action: () => navigate('/app/study-plan')
    }
  ];

  const stats = [
    {
      title: 'Overall Accuracy',
      value: `${Math.round(animatedAccuracy)}%`,
      description: 'Across all subjects',
      trend: overview?.accuracyTrend || 'up',
      change: '+2.3%',
      icon: Target,
      color: '#22c55e'
    },
    {
      title: 'Questions Answered',
      value: Math.round(animatedQuestions).toLocaleString(),
      description: 'Total practice questions',
      trend: 'up',
      change: '+12',
      icon: BookOpen,
      color: '#3b82f6'
    },
    {
      title: 'Current Streak',
      value: `${Math.round(animatedStreak)} days`,
      description: 'Keep it going!',
      trend: animatedStreak > 0 ? 'up' : 'neutral',
      change: animatedStreak > 0 ? '+1' : '0',
      icon: Star,
      color: '#f59e0b'
    },
    {
      title: 'Study Time',
      value: `${overview?.weeklyStudyTime || 0}h`,
      description: 'This week',
      trend: 'up',
      change: '+2.5h',
      icon: Clock,
      color: '#8b5cf6'
    }
  ];

  if (loading) {
    return <Loader fullScreen text="Loading your dashboard..." />;
  }

  return (
    <Layout>
      <DashboardContainer>
        {/* Welcome Section */}
          <WelcomeSection>
            <WelcomeContent>
              <WelcomeTitle>
                {getGreeting()}, <span>{user?.name || 'Student'}</span>! 👋
              </WelcomeTitle>
              <WelcomeSubtitle>
                {user?.isGuest 
                  ? 'You\'re browsing as a guest. Sign up for the full experience!'
                  : overview?.currentStreak > 0 
                    ? `You're on a ${overview.currentStreak} day streak! Keep it up!`
                    : 'Ready to start your study session?'}
              </WelcomeSubtitle>
            </WelcomeContent>
            
            {/* User Profile Display */}
            {user && !user.isGuest && (
              <UserProfileContainer>
                <UserAvatar>
                  {user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={user.name} 
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{ display: user.photoUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <User size={20} color="white" />
                  </div>
                </UserAvatar>
                
                <UserDetails>
                  <UserName>{user.name || 'Unknown User'}</UserName>
                  <UserEmail>{user.email || 'No email'}</UserEmail>
                </UserDetails>
                
                <LogoutButton onClick={logout} title="Logout">
                  <LogOut size={16} />
                </LogoutButton>
              </UserProfileContainer>
            )}
          </WelcomeSection>
        {/* Quick Actions */}
        <QuickActionsGrid>
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <QuickActionCard
                key={action.id}
                onClick={action.action}
                $color={action.color}
              >
                <QuickActionIcon $color={action.color}>
                  <IconComponent size={24} />
                </QuickActionIcon>
                <QuickActionTitle>{action.title}</QuickActionTitle>
                <QuickActionDescription>{action.description}</QuickActionDescription>
              </QuickActionCard>
            );
          })}
        </QuickActionsGrid>

        {/* Stats Grid */}
        <StatsGrid>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <StatCard key={index}>
                <StatHeader>
                  <StatTitle>{stat.title}</StatTitle>
                  <StatBadge $trend={stat.trend}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight size={12} />
                    ) : stat.trend === 'down' ? (
                      <ArrowDownRight size={12} />
                    ) : (
                      <Activity size={12} />
                    )}
                    {stat.change}
                  </StatBadge>
                </StatHeader>
                <StatValue>{stat.value}</StatValue>
                <StatDescription>{stat.description}</StatDescription>
              </StatCard>
            );
          })}
        </StatsGrid>

        {/* Charts Section */}
        <ChartsSection>
          <ChartCard>
            <SectionTitle>Performance Overview</SectionTitle>
            <PerformanceChart data={activityHistory} />
          </ChartCard>
          
          <ChartCard>
            <SectionTitle>Subject Progress</SectionTitle>
            <SubjectRadarChart data={subjectProgress} />
          </ChartCard>
        </ChartsSection>

        {/* Weekly Activity Chart */}
        <ChartCard>
          <SectionTitle>Weekly Activity</SectionTitle>
          <WeeklyActivityChart data={activityHistory} />
        </ChartCard>
      </DashboardContainer>
    </Layout>
  );
};

export default Dashboard;