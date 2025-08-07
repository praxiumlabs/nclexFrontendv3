// src/utils/constants.js
export const NCLEX_CATEGORIES = {
  SAFE_EFFECTIVE_CARE: {
    id: 'safe-effective-care',
    name: 'Safe and Effective Care Environment',
    percentage: '18-24%',
    subcategories: [
      'Management of Care',
      'Safety and Infection Control'
    ]
  },
  HEALTH_PROMOTION: {
    id: 'health-promotion',
    name: 'Health Promotion and Maintenance',
    percentage: '6-12%',
    subcategories: [
      'Health Promotion and Disease Prevention',
      'Growth and Development'
    ]
  },
  PSYCHOSOCIAL_INTEGRITY: {
    id: 'psychosocial-integrity',
    name: 'Psychosocial Integrity',
    percentage: '6-12%',
    subcategories: [
      'Coping and Adaptation',
      'Psychosocial Adaptation'
    ]
  },
  PHYSIOLOGICAL_INTEGRITY: {
    id: 'physiological-integrity',
    name: 'Physiological Integrity',
    percentage: '38-62%',
    subcategories: [
      'Basic Care and Comfort',
      'Pharmacological and Parenteral Therapies',
      'Reduction of Risk Potential',
      'Physiological Adaptation'
    ]
  }
};

export const QUESTION_TYPES = {
  MCQ: {
    id: 'MCQ',
    name: 'Multiple Choice',
    description: 'Select one correct answer'
  },
  SATA: {
    id: 'SATA',
    name: 'Select All That Apply',
    description: 'Select all correct answers'
  },
  FILL_BLANK: {
    id: 'FILL_BLANK',
    name: 'Fill in the Blank',
    description: 'Type the correct answer'
  },
  HOTSPOT: {
    id: 'HOTSPOT',
    name: 'Hot Spot',
    description: 'Click on the correct area'
  },
  DRAG_DROP: {
    id: 'DRAG_DROP',
    name: 'Drag and Drop',
    description: 'Arrange items in correct order'
  }
};

export const DIFFICULTY_LEVELS = {
  1: { name: 'Beginner', color: '#10b981' },
  2: { name: 'Intermediate', color: '#f59e0b' },
  3: { name: 'Advanced', color: '#ef4444' }
};

export const EXAM_TYPES = {
  PRACTICE: {
    id: 'practice',
    name: 'Practice Session',
    description: 'Custom practice questions',
    duration: null,
    questionCount: [5, 10, 25, 50]
  },
  QUICK: {
    id: 'quick',
    name: 'Quick Practice',
    description: '10 adaptive questions',
    duration: null,
    questionCount: 10
  },
  MOCK: {
    id: 'mock',
    name: 'Mock Exam',
    description: 'Full-length NCLEX simulation',
    duration: 300, // 5 hours in minutes
    questionCount: 75
  },
  SRS: {
    id: 'srs',
    name: 'SRS Review',
    description: 'Spaced repetition review',
    duration: null,
    questionCount: null
  }
};

export const PERFORMANCE_LEVELS = {
  EXCELLENT: { min: 90, name: 'Excellent', color: '#10b981' },
  GOOD: { min: 80, name: 'Good', color: '#3b82f6' },
  SATISFACTORY: { min: 70, name: 'Satisfactory', color: '#f59e0b' },
  NEEDS_IMPROVEMENT: { min: 0, name: 'Needs Improvement', color: '#ef4444' }
};

export const SRS_INTERVALS = {
  AGAIN: 0, // Review immediately
  HARD: 6, // Review in 6 minutes
  GOOD: 10, // Review in 10 minutes
  EASY: 4 // Review in 4 days
};

export const LOCAL_STORAGE_KEYS = {
  THEME: 'nclex-theme',
  USER_PREFERENCES: 'nclex-user-preferences',
  ONBOARDING_COMPLETED: 'nclex-onboarding-completed',
  STUDY_SESSION: 'nclex-study-session'
};

export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/app/dashboard',
  PRACTICE: '/app/practice',
  MOCK_EXAM: '/app/mock-exams',
  SRS_REVIEW: '/app/srs-review',
  PROGRESS: '/app/progress',
  PROFILE: '/app/profile',
  SETTINGS: '/app/settings'
};

export const KEYBOARD_SHORTCUTS = {
  SUBMIT_ANSWER: 'Enter',
  NEXT_QUESTION: 'ArrowRight',
  PREVIOUS_QUESTION: 'ArrowLeft',
  FLAG_QUESTION: 'f',
  SHOW_HINT: 'h',
  EXIT_PRACTICE: 'Escape'
};

// src/utils/helpers.js
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const removeHtmlTags = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = (key instanceof Function) ? key(item) : item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = (key instanceof Function) ? key(a) : a[key];
    const bVal = (key instanceof Function) ? key(b) : b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const calculatePercentage = (part, total) => {
  if (!total || total === 0) return 0;
  return Math.round((part / total) * 100);
};

export const calculateAccuracy = (correct, total) => {
  return calculatePercentage(correct, total);
};

export const getPerformanceLevel = (accuracy) => {
  if (accuracy >= 90) return PERFORMANCE_LEVELS.EXCELLENT;
  if (accuracy >= 80) return PERFORMANCE_LEVELS.GOOD;
  if (accuracy >= 70) return PERFORMANCE_LEVELS.SATISFACTORY;
  return PERFORMANCE_LEVELS.NEEDS_IMPROVEMENT;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const downloadFile = (data, filename, type = 'text/plain') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  }
};

// src/utils/validators.js
export const validators = {
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    if (!isValidEmail(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  password: (value) => {
    if (!value) return null;
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    return null;
  },

  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) {
      return 'Passwords do not match';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Must not exceed ${max} characters`;
    }
    return null;
  },

  numeric: (value) => {
    if (!value) return null;
    if (isNaN(value)) {
      return 'Must be a valid number';
    }
    return null;
  },

  min: (min) => (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (parseFloat(value) < min) {
      return `Must be at least ${min}`;
    }
    return null;
  },

  max: (max) => (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (parseFloat(value) > max) {
      return `Must not exceed ${max}`;
    }
    return null;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/\s|-|\(|\)/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  }
};

export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    
    for (const rule of fieldRules) {
      const error = typeof rule === 'function' 
        ? rule(value, values) 
        : validators[rule]?.(value);
      
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return errors;
};

// src/utils/formatters.js
export const formatTime = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0 minutes';
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('en-US', defaultOptions);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now - target) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
};

export const formatNumber = (number, options = {}) => {
  if (typeof number !== 'number') return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(number);
};

export const formatPercentage = (value, total) => {
  const percentage = calculatePercentage(value, total);
  return `${percentage}%`;
};

export const formatScore = (score) => {
  if (typeof score !== 'number') return '0%';
  return `${Math.round(score)}%`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phoneNumber;
};

export const formatInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};