// src/hooks/useTheme.js
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, setTheme, toggleTheme as toggleThemeAction } from '../store/slices/uiSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#0f172a' : '#ffffff'
      );
    }
    
    // Update system UI elements on some browsers
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'system') {
      root.classList.add(prefersDark ? 'dark' : 'light');
    }
  }, [theme]);

  // Set specific theme
  const setCurrentTheme = useCallback((newTheme) => {
    dispatch(setTheme(newTheme));
  }, [dispatch]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    dispatch(toggleThemeAction());
  }, [dispatch]);

  // Set to system preference
  const setSystemTheme = useCallback(() => {
    dispatch(setTheme('system'));
  }, [dispatch]);

  // Check if current theme matches system preference
  const matchesSystemPreference = useCallback(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return (theme === 'dark' && prefersDark) || (theme === 'light' && !prefersDark);
  }, [theme]);

  // Get theme-aware colors
  const getThemeColor = useCallback((lightColor, darkColor) => {
    return isDark ? darkColor : lightColor;
  }, [isDark]);

  // Get theme-aware className
  const getThemeClass = useCallback((lightClass, darkClass) => {
    return isDark ? darkClass : lightClass;
  }, [isDark]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (theme === 'system') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme]);

  return {
    // Current theme
    theme,
    isDark,
    isLight,
    
    // Actions
    setTheme: setCurrentTheme,
    toggleTheme,
    setSystemTheme,
    
    // Utilities
    matchesSystemPreference,
    getThemeColor,
    getThemeClass,
  };
};