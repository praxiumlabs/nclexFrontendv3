// src/components/layout/layout/layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Navigation } from '../Navigation/Navigation';
import { Sidebar } from '../Sidebar/Sidebar';
import { Footer } from '../Footer/Footer';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useAuth } from '../../../hooks/useAuth';

// Guest Banner Component
const GuestBannerContainer = styled.div`
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
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    text-align: center;
  }
`;

const GuestBannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const GuestBannerActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    justify-content: center;
  }
`;

const GuestBannerButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ $variant }) => $variant === 'primary' 
    ? css`
        background: ${({ theme }) => theme.colors.primary[500]};
        color: white;
        
        &:hover {
          background: ${({ theme }) => theme.colors.primary[600]};
        }
      `
    : css`
        background: transparent;
        color: ${({ theme }) => theme.colors.warning.dark};
        border: 1px solid ${({ theme }) => theme.colors.warning.dark};
        
        &:hover {
          background: ${({ theme }) => theme.colors.warning.dark};
          color: white;
        }
      `
  }
`;

// Guest Banner Component
const GuestBanner = () => {
  const handleSignIn = () => {
    window.location.href = '/login';
  };

  const handleSignUp = () => {
    window.location.href = '/register';
  };

  return (
    <GuestBannerContainer>
      <GuestBannerContent>
        <span>👤</span>
        <span>You're browsing as a guest. Sign up to save your progress!</span>
      </GuestBannerContent>
      
      <GuestBannerActions>
        <GuestBannerButton onClick={handleSignIn}>
          Sign In
        </GuestBannerButton>
        <GuestBannerButton $variant="primary" onClick={handleSignUp}>
          Sign Up Free
        </GuestBannerButton>
      </GuestBannerActions>
    </GuestBannerContainer>
  );
};

// Styled components
const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.default};
`;

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  padding-top: 64px; /* Add padding for fixed navigation */
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  transition: margin-left ${({ theme }) => theme.transitions.base};
  
  /* Always apply margin-left for sidebar on desktop when showSidebar is true */
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: ${({ $showSidebar, $sidebarCollapsed }) => 
      $showSidebar ? ($sidebarCollapsed ? '80px' : '280px') : '0'
    };
  }
  
  /* On mobile, no margin needed as sidebar overlays */
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  width: 100%;
  max-width: ${({ $fullWidth }) => $fullWidth ? 'none' : '1280px'};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const PageHeader = styled.header`
  background: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSize['2xl']};
  }
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => `${theme.spacing.sm} 0 0`};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSize.base};
  }
`;

const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BreadcrumbItem = styled.span`
  &:not(:last-child)::after {
    content: '/';
    margin-left: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.hint};
  }
  
  a {
    color: ${({ theme }) => theme.colors.text.secondary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[600]};
    }
  }
  
  &:last-child {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
  }
`;

// Loading bar
const LoadingBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${({ theme }) => theme.colors.primary[500]};
  transform: scaleX(0);
  transform-origin: left;
  transition: transform ${({ theme }) => theme.transitions.slow};
  z-index: ${({ theme }) => theme.zIndex.fixed};
  
  ${({ $loading }) => $loading && css`
    transform: scaleX(1);
  `}
`;

// Layout component
export const Layout = ({
  children,
  showSidebar = true,
  showFooter = true,
  fullWidth = false,
  pageTitle,
  pageDescription,
  breadcrumbs,
  loading = false,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const { isGuest } = useAuth();

  // Set sidebar open state based on screen size
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true); // Always open on desktop
    } else {
      setSidebarOpen(false); // Closed by default on mobile
    }
  }, [isMobile]);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <LayoutContainer>
      <LoadingBar $loading={loading} />
      
      {/* Show guest banner if in guest mode */}
      {isGuest && <GuestBanner />}
      
      <Navigation />
      
      <MainWrapper>
        {showSidebar && (
          <Sidebar
            open={sidebarOpen}
            collapsed={sidebarCollapsed}
            onToggle={handleSidebarToggle}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        
        <MainContent 
          $showSidebar={showSidebar}
          $sidebarCollapsed={sidebarCollapsed}
        >
          {(pageTitle || breadcrumbs) && (
            <PageHeader>
              {breadcrumbs && (
                <Breadcrumbs>
                  {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={index}>
                      {crumb.link ? (
                        <a href={crumb.link}>{crumb.label}</a>
                      ) : (
                        crumb.label
                      )}
                    </BreadcrumbItem>
                  ))}
                </Breadcrumbs>
              )}
              
              {pageTitle && <PageTitle>{pageTitle}</PageTitle>}
              {pageDescription && <PageDescription>{pageDescription}</PageDescription>}
            </PageHeader>
          )}
          
          <ContentArea $fullWidth={fullWidth}>
            {children || <Outlet />}
          </ContentArea>
          
          {showFooter && <Footer />}
        </MainContent>
      </MainWrapper>
    </LayoutContainer>
  );
};

// Layout variants
export const DashboardLayout = ({ children, ...props }) => (
  <Layout showSidebar showFooter {...props}>
    {children}
  </Layout>
);

export const FullScreenLayout = ({ children, ...props }) => (
  <Layout showSidebar={false} showFooter={false} fullWidth {...props}>
    {children}
  </Layout>
);

export const SimpleLayout = ({ children, ...props }) => (
  <Layout showSidebar={false} showFooter {...props}>
    {children}
  </Layout>
);