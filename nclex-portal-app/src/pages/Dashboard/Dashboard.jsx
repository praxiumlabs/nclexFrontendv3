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
// import {
//   PerformanceChart,
//   WeeklyActivityChart,
//   SubjectRadarChart
// } from '../../components/dashboard/Charts';

// Styled components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[500]} 0%, 
    ${({ theme }) => theme.colors.primary[600]} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const WelcomeContent = styled.div`
  flex: 1;
`;

const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  opacity: 0.9;
  margin: 0;
`;

const UserProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  backdrop-filter: blur(10px);
`;

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  opacity: 0.8;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const QuickActionCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ $color, theme }) => theme.colors[$color][500]};
  }
`;

const QuickActionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $color, theme }) => theme.colors[$color][100]};
  color: ${({ $color, theme }) => theme.colors[$color][600]};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const QuickActionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`;

const QuickActionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatChange = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $trend, theme }) => 
    $trend === 'up' ? theme.colors.success.light :
    $trend === 'down' ? theme.colors.error.light :
    theme.colors.gray[100]};
  color: ${({ $trend, theme }) => 
    $trend === 'up' ? theme.colors.success.main :
    $trend === 'down' ? theme.colors.error.main :
    theme.colors.gray[600]};
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
  
  // ADD THESE MISSING STATE VARIABLES
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  // MOVE HELPER FUNCTIONS BEFORE THEY'RE USED
  // Helper function to get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Helper function to format study time - MOVE THIS BEFORE stats ARRAY
  const formatStudyTime = (minutes) => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Set profile image URL on component mount
  useEffect(() => {
    if (user?.photoUrl && !imageError) {
      setProfileImageUrl(user.photoUrl);
    } else if (user?.photoURL && !imageError) {
      setProfileImageUrl(user.photoURL);
    } else if (user?.name) {
      // Generate avatar URL from initials
      const initials = getInitials(user.name);
      setProfileImageUrl(
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`
      );
    }
  }, [user, imageError]);

  // Animated values with fallbacks
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

  // Quick actions data
  const quickActions = [
    {
      id: 'quick-practice',
      title: 'Quick Practice',
      description: '10 random questions',
      icon: Zap,
      color: 'primary',
      action: () => navigate('/app/practice?mode=quick')
    },
    {
      id: 'srs-review',
      title: 'SRS Review',
      description: `${overview?.srssDue || 0} cards due`,
      icon: Brain,
      color: 'success',
      action: () => navigate('/app/srs-review')
    },
    {
      id: 'mock-exam',
      title: 'Mock Exam',
      description: 'Full 75-question test',
      icon: BookOpen,
      color: 'warning',
      action: () => navigate('/app/mock-exams')
    },
    {
      id: 'weak-areas',
      title: 'Weak Areas',
      description: 'Focus on improvements',
      icon: Target,
      color: 'error',
      action: () => navigate('/app/practice?mode=weak')
    }
  ];

  // Stats data - NOW formatStudyTime IS DEFINED ABOVE
  const stats = [
    {
      title: 'Overall Accuracy',
      value: `${Math.round(animatedAccuracy)}%`,
      icon: Target,
      trend: overview?.accuracyTrend || 'neutral',
      change: overview?.accuracyChange || '0%'
    },
    {
      title: 'Questions Answered',
      value: Math.round(animatedQuestions).toLocaleString(),
      icon: Activity,
      trend: 'up',
      change: `+${overview?.questionsToday || 0} today`
    },
    {
      title: 'Current Streak',
      value: `${Math.round(animatedStreak)} days`,
      icon: Star,
      trend: overview?.currentStreak > 0 ? 'up' : 'neutral',
      change: overview?.currentStreak > 0 ? 'Keep it up!' : 'Start today!'
    },
    {
      title: 'Study Time',
      value: formatStudyTime(overview?.totalStudyTime || 0), // NOW THIS WORKS
      icon: Clock,
      trend: 'up',
      change: `${formatStudyTime(overview?.todayStudyTime || 0)} today`
    }
  ];

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <DashboardContainer>
      {/* Welcome Section */}
      <WelcomeSection>
        <WelcomeContent>
          <WelcomeTitle>
            Welcome back, {user?.name?.split(' ')[0] || 'Guest'} 👋
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
            </UserAvatar>
            <UserDetails>
              <UserName>{user?.name || 'User'}</UserName>
              <UserEmail>{user?.email || 'user@example.com'}</UserEmail>
            </UserDetails>
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
                  ) : null}
                </StatBadge>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
              <StatChange>
                <IconComponent size={14} />
                {stat.change}
              </StatChange>
            </StatCard>
          );
        })}
      </StatsGrid>

      {/* Add more sections as needed */}
    </DashboardContainer>
  );
};

export default Dashboard;