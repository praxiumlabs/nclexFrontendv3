// src/utils/validation.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
    length: password.length
  };
};

export const checkPasswordStrength = (password) => {
  const validation = validatePassword(password);
  let score = 0;
  
  if (validation.length >= 8) score++;
  if (validation.length >= 12) score++;
  if (validation.hasUpperCase) score++;
  if (validation.hasLowerCase) score++;
  if (validation.hasNumber) score++;
  if (validation.hasSpecialChar) score++;
  
  if (score <= 2) return { strength: 'weak', score };
  if (score <= 4) return { strength: 'medium', score };
  return { strength: 'strong', score };
};