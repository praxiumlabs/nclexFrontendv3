// src/pages/Auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { 
  Shield, Mail, Lock, Eye, EyeOff, ArrowRight, 
  AlertCircle, CheckCircle, Loader2, Github
} from 'lucide-react';
import { Button } from '../../components/common/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { UserCheck } from 'lucide-react';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { Loader } from '../../components/common/Loader/Loader';





// Styled components
const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.colors.background.default};
`;

const AuthLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const AuthRight = styled.div`
  width: 50%;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[500]} 0%, 
    ${({ theme }) => theme.colors.primary[600]} 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: float 20s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(-50px, -50px) rotate(120deg); }
    66% { transform: translate(50px, -50px) rotate(240deg); }
  }
`;

const AuthContent = styled.div`
  width: 100%;
  max-width: 420px;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[500]} 0%, 
    ${({ theme }) => theme.colors.primary[600]} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin: 0;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[600]} 0%, 
    ${({ theme }) => theme.colors.primary[700]} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AuthTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

const AuthSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  padding-left: ${({ theme }) => `calc(${theme.spacing.md} + 24px + ${theme.spacing.sm})`};
  padding-right: ${({ $hasRightIcon, theme }) => 
    $hasRightIcon ? `calc(${theme.spacing.md} + 24px + ${theme.spacing.sm})` : theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.paper};
  border: 2px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[500]}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.hint};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.action.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.error.main};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RememberRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  margin-right: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
`;

const ForgotLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border.light};
  }
`;

const DividerText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.paper};
  border: 2px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FeatureContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
`;

const FeatureTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.lg};
  
  svg {
    flex-shrink: 0;
  }
`;

// Login component
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearAuthError } = useAuth();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signInWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();


  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const from = location.state?.from?.pathname || '/app/dashboard';

  useEffect(() => {
    setFocus('email');
    return () => clearAuthError();
  }, [setFocus, clearAuthError]);

  const onSubmit = async (data) => {
    try {
      await login({
        ...data,
        rememberMe
      });
      navigate(from, { replace: true });
    } catch (err) {
      // Error handled by auth hook
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
      // Error is already handled by the hook
    }
  };

  const handleGithubLogin = () => {
    // Implement GitHub OAuth
    window.location.href = '/api/auth/github';
  };
  // Add this function to your Login component (before the return statement)
  const handleGuestLogin = () => {
    // Set guest mode in localStorage
    localStorage.setItem('guestMode', 'true');
    localStorage.setItem('guestUser', JSON.stringify({
      id: 'guest-user',
      name: 'Guest User',
      email: 'guest@example.com',
      isGuest: true
    }));
    
    // Navigate to dashboard
    navigate('/app/dashboard');
  };

  return (
    <AuthContainer>
      <AuthLeft>
        <AuthContent>
          <AuthHeader>
            <Logo>
              <LogoIcon>
                <Shield size={28} color="white" />
              </LogoIcon>
              <LogoText>NCLEX Portal</LogoText>
            </Logo>
            
            <AuthTitle>Welcome back</AuthTitle>
            <AuthSubtitle>
              Sign in to continue your NCLEX preparation journey
            </AuthSubtitle>
          </AuthHeader>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="email">Email address</Label>
              <InputWrapper>
                <InputIcon>
                  <Mail size={20} />
                </InputIcon>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  disabled={loading}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </InputWrapper>
              {errors.email && (
                <ErrorMessage>
                  <AlertCircle size={16} />
                  {errors.email.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  disabled={loading}
                  $hasRightIcon
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputWrapper>
              {errors.password && (
                <ErrorMessage>
                  <AlertCircle size={16} />
                  {errors.password.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <RememberRow>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </CheckboxLabel>
              <ForgotLink to="/forgot-password">
                Forgot password?
              </ForgotLink>
            </RememberRow>

            {error && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {error}
              </ErrorMessage>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              rightIcon={!loading && <ArrowRight size={20} />}
            >
              Sign In
            </Button>

            <Divider>
              <DividerText>OR</DividerText>
            </Divider>

            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              leftIcon={<UserCheck size={20} />}
              onClick={handleGuestLogin}
              style={{ marginTop: '16px' }}
            >
              Continue as Guest
            </Button>
            <SocialButtons>
            <SocialButton 
              type="button" 
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
            >
              {googleLoading ? (
                <Loader size={20} />
              ) : (
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  width="20" 
                  height="20" 
                />
              )}
              Continue with Google
            </SocialButton>

            // Add error display for Google auth errors:
            // Add this after your existing error display in the Login component:

            {googleError && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {googleError}
              </ErrorMessage>
            )}
              
              <SocialButton type="button" onClick={handleGithubLogin}>
                <Github size={20} />
                Continue with GitHub
              </SocialButton>
            </SocialButtons>
          </Form>

          <SignupLink>
            Don't have an account? <Link to="/register">Sign up</Link>
          </SignupLink>
        </AuthContent>
      </AuthLeft>

      <AuthRight>
        <FeatureContent>
          <FeatureTitle>Pass Your NCLEX on the First Try</FeatureTitle>
          <FeatureList>
            <FeatureItem>
              <CheckCircle size={24} />
              <span>8,000+ practice questions with detailed rationales</span>
            </FeatureItem>
            <FeatureItem>
              <CheckCircle size={24} />
              <span>Adaptive learning that adjusts to your level</span>
            </FeatureItem>
            <FeatureItem>
              <CheckCircle size={24} />
              <span>Comprehensive performance analytics</span>
            </FeatureItem>
            <FeatureItem>
              <CheckCircle size={24} />
              <span>95% pass rate among active users</span>
            </FeatureItem>
          </FeatureList>
        </FeatureContent>
      </AuthRight>
    </AuthContainer>
  );
};

export default Login;