// src/components/layout/Navigation/Navigation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { 
  Menu, X, ChevronDown, Search, Bell, User, Settings, LogOut,
  Sun, Moon, Shield, Home, BookOpen, Brain, BarChart3, 
  Calendar, HelpCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { Button } from '../../common/Button/Button';
import { Badge } from '../../common/Badge/Badge';

// Styled components
const Nav = styled.nav`
  position: fixed; /* Changed from sticky to fixed */
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.modal}; /* Increased z-index to be above sidebar */
  background: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  backdrop-filter: blur(10px);
  transition: all ${({ theme }) => theme.transitions.base};
  
  ${({ $scrolled }) => $scrolled && css`
    box-shadow: ${({ theme }) => theme.shadows.md};
  `}
`;

const NavContainer = styled.div`
  max-width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.md};
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavBrand = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  
  &:hover {
    opacity: 0.8;
  }
`;

const BrandIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[500]} 0%, 
    ${({ theme }) => theme.colors.primary[600]} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.action.hover};
  }
  
  ${({ $active }) => $active && css`
    color: ${({ theme }) => theme.colors.primary[600]};
    background: ${({ theme }) => theme.colors.primary[50]};
  `}
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.action.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const NotificationButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.action.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.error.main};
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.background.paper};
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.action.hover};
  }
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
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: white;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  background: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  opacity: ${({ $open }) => $open ? '1' : '0'};
  visibility: ${({ $open }) => $open ? 'visible' : 'hidden'};
  transform: translateY(${({ $open }) => $open ? '0' : '-10px'});
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const MenuSection = styled.div`
  padding: ${({ theme }) => theme.spacing.xs};
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  &:hover {
    background: ${({ theme }) => theme.colors.action.hover};
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

// Mobile menu
const MobileMenu = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.background.paper};
  transform: translateX(100%);
  transition: transform ${({ theme }) => theme.transitions.base};
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.fixed};
  
  ${({ $open }) => $open && css`
    transform: translateX(0);
  `}
`;

const MobileMenuContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.action.hover};
  }
  
  ${({ $active }) => $active && css`
    color: ${({ theme }) => theme.colors.primary[600]};
    background: ${({ theme }) => theme.colors.primary[50]};
  `}
`;

// Navigation component
export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, getDisplayName, getUserInitials } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const dropdownRef = useRef(null);

  // Navigation items
  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: Home },
    { path: '/app/practice', label: 'Practice', icon: BookOpen },
    { path: '/app/srs-review', label: 'SRS Review', icon: Brain },
    { path: '/app/progress', label: 'Progress', icon: BarChart3 },
    { path: '/app/schedule', label: 'Schedule', icon: Calendar },
  ];

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Nav $scrolled={scrolled}>
        <NavContainer>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </MobileMenuButton>
            
            <NavBrand to="/app/dashboard">
              <BrandIcon>
                <Shield size={24} color="white" />
              </BrandIcon>
              NCLEX Portal
            </NavBrand>
          </div>

          <NavLinks>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  $active={location.pathname === item.path}
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </NavLinks>

          <NavActions>
            <SearchButton>
              <Search size={20} />
            </SearchButton>
            
            <NotificationButton>
              <Bell size={20} />
              {hasNotifications && <NotificationDot />}
            </NotificationButton>
            
            <UserMenu ref={dropdownRef}>
              <UserMenuButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <UserAvatar>
                  {getUserInitials?.() || 'GU'}
                </UserAvatar>
                <ChevronDown size={16} />
              </UserMenuButton>
              
              <UserMenuDropdown $open={userMenuOpen}>
                <MenuSection>
                  <div style={{ padding: '8px 12px' }}>
                    <div style={{ fontWeight: 600 }}>
                      {getDisplayName?.() || 'Guest User'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      {user?.email || 'guest@example.com'}
                    </div>
                  </div>
                </MenuSection>
                
                <MenuSection>
                  <MenuItem onClick={() => navigate('/app/profile')}>
                    <User size={16} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/app/settings')}>
                    <Settings size={16} />
                    Settings
                  </MenuItem>
                  <MenuItem onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </MenuItem>
                </MenuSection>
                
                <MenuSection>
                  <MenuItem onClick={() => navigate('/help')}>
                    <HelpCircle size={16} />
                    Help & Support
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                  </MenuItem>
                </MenuSection>
              </UserMenuDropdown>
            </UserMenu>
          </NavActions>
        </NavContainer>
      </Nav>

      {/* Mobile Menu */}
      <MobileMenu $open={mobileMenuOpen}>
        <MobileMenuContent>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <MobileNavLink
                key={item.path}
                to={item.path}
                $active={location.pathname === item.path}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={20} />
                  {item.label}
                </div>
                <ChevronRight size={16} />
              </MobileNavLink>
            );
          })}
        </MobileMenuContent>
      </MobileMenu>
    </>
  );
};

export default Navigation;