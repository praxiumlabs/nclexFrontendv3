// src/pages/Auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { 
  Shield, Mail, Lock, Eye, EyeOff, ArrowRight, 
  AlertCircle, CheckCircle, User, Github, Check, X
} from 'lucide-react';
import { Button } from '../../components/common/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Loader } from '../../components/common/Loader/Loader';
import { useGoogleAuth } from '../../hooks/useGoogleAuth'; 


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
  overflow-y: auto;
  
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
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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

const PasswordStrength = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const StrengthBar = styled.div`
  flex: 1;
  height: 4px;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $filled }) => $filled ? '100%' : '0'};
    background: ${({ $strength }) => 
      $strength === 'weak' ? '#ef4444' :
      $strength === 'medium' ? '#f59e0b' :
      $strength === 'strong' ? '#22c55e' :
      '#e5e7eb'};
    transition: all ${({ theme }) => theme.transitions.base};
  }
`;

const PasswordRequirements = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Requirement = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ $met, theme }) => $met ? '#22c55e' : theme.colors.text.secondary};
  
  svg {
    flex-shrink: 0;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
  
  input {
    margin-top: 2px;
    flex-shrink: 0;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
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

const SigninLink = styled.div`
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

// Helper function to check password strength
const checkPasswordStrength = (password) => {
  if (!password) return { strength: 'none', score: 0 };
  
  let score = 0;
  const requirements = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
  
  Object.values(requirements).forEach(met => {
    if (met) score++;
  });
  
  let strength = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  
  return { strength, score, requirements };
};

// Register component
const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearAuthError } = useAuth();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 'none', score: 0 });
  const { signInWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setFocus
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password');

  useEffect(() => {
    setFocus('name');
    return () => clearAuthError();
  }, [setFocus, clearAuthError]);

  useEffect(() => {
    const strength = checkPasswordStrength(watchPassword);
    setPasswordStrength(strength);
  }, [watchPassword]);

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      navigate('/app/dashboard');
    } catch (err) {
      // Error handled by auth hook
    }
  };

  const handleGoogleSignup = async () => {
    try {
      console.log('Starting Google signup...');
      await signInWithGoogle();
      console.log('Google signup completed successfully');
      // Navigation is handled in useGoogleAuth hook
    } catch (error) {
      console.error('Google signup failed:', error);
      // Error is already handled by the hook and displayed via googleError
    }
  };

  const handleGithubSignup = () => {
    window.location.href = '/api/auth/github';
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
            
            <AuthTitle>Create your account</AuthTitle>
            <AuthSubtitle>
              Start your journey to NCLEX success
            </AuthSubtitle>
          </AuthHeader>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <InputWrapper>
                <InputIcon>
                  <User size={20} />
                </InputIcon>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  disabled={loading}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                />
              </InputWrapper>
              {errors.name && (
                <ErrorMessage>
                  <AlertCircle size={16} />
                  {errors.name.message}
                </ErrorMessage>
              )}
            </FormGroup>

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
                  placeholder="Create a password"
                  disabled={loading}
                  $hasRightIcon
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
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
              
              {watchPassword && (
                <>
                  <PasswordStrength>
                    <StrengthBar $filled={passwordStrength.score >= 1} $strength={passwordStrength.strength} />
                    <StrengthBar $filled={passwordStrength.score >= 2} $strength={passwordStrength.strength} />
                    <StrengthBar $filled={passwordStrength.score >= 3} $strength={passwordStrength.strength} />
                    <StrengthBar $filled={passwordStrength.score >= 4} $strength={passwordStrength.strength} />
                    <StrengthBar $filled={passwordStrength.score >= 5} $strength={passwordStrength.strength} />
                  </PasswordStrength>
                  
                  <PasswordRequirements>
                    <Requirement $met={passwordStrength.requirements?.length}>
                      {passwordStrength.requirements?.length ? <Check size={14} /> : <X size={14} />}
                      At least 8 characters
                    </Requirement>
                    <Requirement $met={passwordStrength.requirements?.uppercase}>
                      {passwordStrength.requirements?.uppercase ? <Check size={14} /> : <X size={14} />}
                      One uppercase letter
                    </Requirement>
                    <Requirement $met={passwordStrength.requirements?.lowercase}>
                      {passwordStrength.requirements?.lowercase ? <Check size={14} /> : <X size={14} />}
                      One lowercase letter
                    </Requirement>
                    <Requirement $met={passwordStrength.requirements?.number}>
                      {passwordStrength.requirements?.number ? <Check size={14} /> : <X size={14} />}
                      One number
                    </Requirement>
                    <Requirement $met={passwordStrength.requirements?.special}>
                      {passwordStrength.requirements?.special ? <Check size={14} /> : <X size={14} />}
                      One special character
                    </Requirement>
                  </PasswordRequirements>
                </>
              )}
              
              {errors.password && (
                <ErrorMessage>
                  <AlertCircle size={16} />
                  {errors.password.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  disabled={loading}
                  $hasRightIcon
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === watchPassword || 'Passwords do not match'
                  })}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputWrapper>
              {errors.confirmPassword && (
                <ErrorMessage>
                  <AlertCircle size={16} />
                  {errors.confirmPassword.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <CheckboxLabel>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span>
                I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>
              </span>
            </CheckboxLabel>

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
              disabled={!agreedToTerms}
              rightIcon={!loading && <ArrowRight size={20} />}
            >
              Create Account
            </Button>

            <Divider>
              <DividerText>OR</DividerText>
            </Divider>

            <SocialButtons>
            <SocialButton 
              type="button" 
              onClick={handleGoogleSignup}
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
              Sign up with Google
            </SocialButton>

            {googleError && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {googleError}
              </ErrorMessage>
            )}
              
              <SocialButton type="button" onClick={handleGithubSignup}>
                <Github size={20} />
                Sign up with GitHub
              </SocialButton>
            </SocialButtons>
          </Form>

          <SigninLink>
            Already have an account? <Link to="/login">Sign in</Link>
          </SigninLink>
        </AuthContent>
      </AuthLeft>

      <AuthRight>
        <FeatureContent>
          <FeatureTitle>Join 15,000+ Nursing Students</FeatureTitle>
          <FeatureList>
            <FeatureItem>
              <CheckCircle size={24} />
              <span>Free 7-day trial with full access</span>
            </FeatureItem>
            <FeatureItem>
              <CheckCircle size={24} />
              <span>Personalized study plan based on your level</span>
            </FeatureItem>
            <FeatureItem>
              <CheckCircle size={24} />
              <span>Track your progress with detailed analytics</span>
            </FeatureItem>
            <FeatureItem>
              <CheckCircle size={24} />
              <span>Cancel anytime, no questions asked</span>
            </FeatureItem>
          </FeatureList>
        </FeatureContent>
      </AuthRight>
    </AuthContainer>
  );
};

export default Register;