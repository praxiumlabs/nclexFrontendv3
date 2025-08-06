// src/components/layout/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Shield, Mail, Phone, MapPin, Facebook, Twitter, 
  Instagram, Youtube, Heart, ExternalLink 
} from 'lucide-react';

// Styled components
const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.background.paper};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.lg}`};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
  }
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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

const BrandName = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const FooterDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
`;

const FooterTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const ExternalFooterLink = styled.a`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.action.hover};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LegalLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    justify-content: center;
  }
`;

const LegalLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

// Footer component
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterSection>
            <FooterBrand>
              <BrandIcon>
                <Shield size={24} color="white" />
              </BrandIcon>
              <BrandName>NCLEX Portal</BrandName>
            </FooterBrand>
            <FooterDescription>
              Your comprehensive platform for NCLEX preparation. Master the exam with our 
              adaptive learning system, practice questions, and detailed analytics.
            </FooterDescription>
            <SocialLinks>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={20} />
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </SocialLink>
              <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube size={20} />
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Product</FooterTitle>
            <FooterLinks>
              <li><FooterLink to="/features">Features</FooterLink></li>
              <li><FooterLink to="/pricing">Pricing</FooterLink></li>
              <li><FooterLink to="/testimonials">Success Stories</FooterLink></li>
              <li><FooterLink to="/demo">Free Demo</FooterLink></li>
              <li><FooterLink to="/mobile">Mobile App</FooterLink></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Resources</FooterTitle>
            <FooterLinks>
              <li><FooterLink to="/blog">Blog</FooterLink></li>
              <li><FooterLink to="/study-guides">Study Guides</FooterLink></li>
              <li><FooterLink to="/nclex-tips">NCLEX Tips</FooterLink></li>
              <li><FooterLink to="/faq">FAQ</FooterLink></li>
              <li>
                <ExternalFooterLink href="https://ncsbn.org" target="_blank" rel="noopener noreferrer">
                  NCSBN <ExternalLink size={14} />
                </ExternalFooterLink>
              </li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Contact</FooterTitle>
            <ContactInfo>
              <Mail size={18} />
              <div>
                <div>support@nclexportal.com</div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>24/7 Support</div>
              </div>
            </ContactInfo>
            <ContactInfo>
              <Phone size={18} />
              <div>
                <div>1-800-NCLEX-99</div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>Mon-Fri, 9AM-6PM EST</div>
              </div>
            </ContactInfo>
            <ContactInfo>
              <MapPin size={18} />
              <div>
                <div>123 Education Blvd</div>
                <div>New York, NY 10001</div>
              </div>
            </ContactInfo>
          </FooterSection>
        </FooterTop>

        <FooterBottom>
          <Copyright>
            © {currentYear} NCLEX Portal. Made with <Heart size={16} fill="currentColor" /> for nursing students.
          </Copyright>
          <LegalLinks>
            <LegalLink to="/privacy">Privacy Policy</LegalLink>
            <LegalLink to="/terms">Terms of Service</LegalLink>
            <LegalLink to="/accessibility">Accessibility</LegalLink>
            <LegalLink to="/sitemap">Sitemap</LegalLink>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};