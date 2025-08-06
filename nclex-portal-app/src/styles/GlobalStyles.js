// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    font-size: ${({ theme }) => theme.fontSize.base};
    line-height: ${({ theme }) => theme.lineHeight.normal};
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.default};
    transition: background-color ${({ theme }) => theme.transitions.base};
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    line-height: ${({ theme }) => theme.lineHeight.tight};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSize['5xl']};
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.fontSize['4xl']};
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSize['4xl']};
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.fontSize['3xl']};
    }
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSize['3xl']};
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.fontSize['2xl']};
    }
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSize['2xl']};
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.fontSize.xl};
    }
  }

  h5 {
    font-size: ${({ theme }) => theme.fontSize.xl};
  }

  h6 {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary[500]};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary[600]};
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
      outline-offset: 2px;
    }
  }

  /* Buttons */
  button {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: transparent;
    
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
      outline-offset: 2px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Forms */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
      outline-offset: -2px;
    }
  }

  /* Lists */
  ul, ol {
    list-style: none;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Tables */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.paper};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[400]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[500]};
    }
  }

  /* Selection */
  ::selection {
    background: ${({ theme }) => theme.colors.primary[200]};
    color: ${({ theme }) => theme.colors.primary[900]};
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  /* Utility Classes */
  .fadeIn {
    animation: fadeIn 0.5s ease-out;
  }

  .fadeInUp {
    animation: fadeInUp 0.5s ease-out;
  }

  .fadeInDown {
    animation: fadeInDown 0.5s ease-out;
  }

  .scaleIn {
    animation: scaleIn 0.3s ease-out;
  }

  .slideInRight {
    animation: slideInRight 0.3s ease-out;
  }

  .slideInLeft {
    animation: slideInLeft 0.3s ease-out;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .bounce {
    animation: bounce 1s infinite;
  }

  /* Responsive utilities */
  .container {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.md};

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
      max-width: ${({ theme }) => theme.breakpoints.sm};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      max-width: ${({ theme }) => theme.breakpoints.md};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      max-width: ${({ theme }) => theme.breakpoints.lg};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
      max-width: ${({ theme }) => theme.breakpoints.xl};
    }
  }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Focus visible only for keyboard navigation */
  .focus-visible:focus {
    outline: none;
  }

  .focus-visible:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;