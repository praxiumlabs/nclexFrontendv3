// src/components/layout/Sidebar/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { 
  ChevronLeft, Home, BookOpen, Brain, Target, BarChart3, 
  Calendar, Settings, HelpCircle, Users, Award, FileText,
  Clock, Zap, TrendingUp, Menu
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

// Styled components
const SidebarContainer = styled.aside`
  position: fixed;
  top: 64px; /* Navigation height */
  left: 0;
  bottom: 0;
  width: ${({ $collapsed }) => $collapsed ? '80px' : '280px'};
  background: ${({ theme }) => theme.colors.background.paper};
  border-right: 1px solid ${({ theme }) => theme.colors.border.light};
  transform: translateX(${({ $open }) => $open ? '0' : '-100%'});
  transition: all ${({ theme }) => theme.transitions.base};
  z-index: ${({ theme }) => theme.zIndex.fixed};
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    transform: translateX(0);
  }
`;

const SidebarOverlay = styled.div`
  display: block;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${({ $open }) => $open ? '1' : '0'};
  visibility: ${({ $open }) => $open ? 'visible' : 'hidden'};
  transition: all ${({ theme }) => theme.transitions.base};
  z-index: ${({ theme }) => theme.zIndex.overlay};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0; /* Prevent shrinking */
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ theme }) => theme.colors.action.hover};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.action.selected};
  }
  
  svg {
    transition: transform ${({ theme }) => theme.transitions.base};
    ${({ $collapsed }) => $collapsed && css`
      transform: rotate(180deg);
    `}
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.md};
  
  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: 3px;
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[400]};
    }
  }
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `0 ${theme.spacing.sm}`};
  opacity: ${({ $collapsed }) => $collapsed ? '0' : '1'};
  transition: opacity ${({ theme }) => theme.transitions.base};
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm}`};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${({ theme }) => theme.colors.action.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  ${({ $active }) => $active && css`
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[600]};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${({ theme }) => theme.colors.primary[500]};
    }
  `}
`;

const NavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

const NavLabel = styled.span`
  flex: 1;
  white-space: nowrap;
  opacity: ${({ $collapsed }) => $collapsed ? '0' : '1'};
  transform: translateX(${({ $collapsed }) => $collapsed ? '-20px' : '0'});
  transition: all ${({ theme }) => theme.transitions.base};
`;

const NavBadge = styled.span`
  padding: ${({ theme }) => `2px ${theme.spacing.xs}`};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  min-width: 20px;
  text-align: center;
  opacity: ${({ $collapsed }) => $collapsed ? '0' : '1'};
  transition: opacity ${({ theme }) => theme.transitions.base};
`;

const SidebarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0; /* Prevent shrinking */
  margin-top: auto; /* Push to bottom */
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.base};
  
  ${({ $collapsed }) => $collapsed && css`
    justify-content: center;
  `}
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[400]} 0%, 
    ${({ theme }) => theme.colors.primary[600]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  opacity: ${({ $collapsed }) => $collapsed ? '0' : '1'};
  transform: translateX(${({ $collapsed }) => $collapsed ? '-20px' : '0'});
  transition: all ${({ theme }) => theme.transitions.base};
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.2;
`;

const UserRole = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Sidebar component
export const Sidebar = ({ open, collapsed, onToggle, onClose }) => {
  const location = useLocation();
  const { user, getDisplayName, getUserInitials, isGuest } = useAuth();

  // Navigation items
  const mainNavItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: Home },
    { path: '/app/practice', label: 'Practice', icon: BookOpen, badge: 'New' },
    { path: '/app/srs-review', label: 'SRS Review', icon: Brain, badge: '5' },
    { path: '/app/mock-exams', label: 'Mock Exams', icon: Target },
    { path: '/app/progress', label: 'Progress', icon: BarChart3 },
    { path: '/app/schedule', label: 'Study Schedule', icon: Calendar },
  ];

  const learningNavItems = [
    { path: '/app/subjects', label: 'Subjects', icon: FileText },
    { path: '/app/flashcards', label: 'Flashcards', icon: Zap },
    { path: '/app/case-studies', label: 'Case Studies', icon: Users },
    { path: '/app/achievements', label: 'Achievements', icon: Award },
  ];

  const supportNavItems = [
    { path: '/app/performance', label: 'Performance', icon: TrendingUp },
    { path: '/app/study-timer', label: 'Study Timer', icon: Clock },
    { path: '/app/settings', label: 'Settings', icon: Settings },
    { path: '/app/help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <>
      <SidebarOverlay $open={open && window.innerWidth < 1024} onClick={onClose} />
      
      <SidebarContainer $open={open} $collapsed={collapsed}>
        <SidebarHeader>
          {!collapsed && (
            <div style={{ fontSize: '18px', fontWeight: 600 }}>
              NCLEX Portal
            </div>
          )}
          <ToggleButton onClick={onToggle} $collapsed={collapsed}>
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </ToggleButton>
        </SidebarHeader>

        <SidebarContent>
          <NavSection>
            <SectionTitle $collapsed={collapsed}>MAIN</SectionTitle>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavItem
                  key={item.path}
                  to={item.path}
                  $active={location.pathname === item.path}
                  title={collapsed ? item.label : undefined}
                >
                  <NavIcon>
                    <Icon size={20} />
                  </NavIcon>
                  <NavLabel $collapsed={collapsed}>
                    {item.label}
                  </NavLabel>
                  {item.badge && (
                    <NavBadge $collapsed={collapsed}>
                      {item.badge}
                    </NavBadge>
                  )}
                </NavItem>
              );
            })}
          </NavSection>

          <NavSection>
            <SectionTitle $collapsed={collapsed}>LEARNING</SectionTitle>
            {learningNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavItem
                  key={item.path}
                  to={item.path}
                  $active={location.pathname === item.path}
                  title={collapsed ? item.label : undefined}
                >
                  <NavIcon>
                    <Icon size={20} />
                  </NavIcon>
                  <NavLabel $collapsed={collapsed}>
                    {item.label}
                  </NavLabel>
                </NavItem>
              );
            })}
          </NavSection>

          <NavSection>
            <SectionTitle $collapsed={collapsed}>SUPPORT</SectionTitle>
            {supportNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavItem
                  key={item.path}
                  to={item.path}
                  $active={location.pathname === item.path}
                  title={collapsed ? item.label : undefined}
                >
                  <NavIcon>
                    <Icon size={20} />
                  </NavIcon>
                  <NavLabel $collapsed={collapsed}>
                    {item.label}
                  </NavLabel>
                </NavItem>
              );
            })}
          </NavSection>
        </SidebarContent>

        <SidebarFooter>
          <UserCard $collapsed={collapsed}>
            <UserAvatar>
              {getUserInitials?.() || 'GU'}
            </UserAvatar>
            {!collapsed && (
              <UserInfo $collapsed={collapsed}>
                <UserName>
                  {isGuest ? 'Guest' : (getDisplayName?.() || 'User')}
                </UserName>
                <UserRole>
                  {isGuest ? 'Guest Mode' : (user?.role || 'Student')}
                </UserRole>
              </UserInfo>
            )}
          </UserCard>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;