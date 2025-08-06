// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Theme
  theme: localStorage.getItem('theme') || 'light',
  
  // Sidebar & Navigation
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  
  // Modals
  modals: {
    profile: false,
    settings: false,
    feedback: false,
    tutorial: false,
    confirmation: {
      open: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null,
    },
  },
  
  // Notifications
  notifications: [],
  notificationCount: 0,
  
  // Loading states
  globalLoading: false,
  pageLoading: false,
  
  // Toast/Snackbar
  toast: {
    open: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
    duration: 5000,
  },
  
  // Page settings
  pageSettings: {
    dashboard: {
      view: 'grid', // 'grid' or 'list'
      dateRange: 'week', // 'day', 'week', 'month', 'year'
    },
    practice: {
      showTimer: true,
      showProgress: true,
      fontSize: 'medium', // 'small', 'medium', 'large'
      questionLayout: 'vertical', // 'vertical', 'horizontal'
    },
    results: {
      showDetails: true,
      chartType: 'bar', // 'bar', 'pie', 'line'
    },
  },
  
  // User preferences
  preferences: {
    soundEnabled: true,
    animationsEnabled: true,
    keyboardShortcuts: true,
    autoSave: true,
    confirmOnExit: true,
    showHints: true,
  },
  
  // Tutorial/Onboarding
  onboarding: {
    completed: localStorage.getItem('onboardingCompleted') === 'true',
    currentStep: 0,
    totalSteps: 5,
  },
  
  // Feature flags
  features: {
    darkMode: true,
    srsEnabled: true,
    aiTutor: false,
    collaborativeStudy: false,
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    // Mobile menu
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    
    // Modals
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    
    toggleModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = !state.modals[modalName];
      }
    },
    
    // Confirmation modal
    showConfirmation: (state, action) => {
      state.modals.confirmation = {
        open: true,
        title: action.payload.title || 'Confirm',
        message: action.payload.message || 'Are you sure?',
        onConfirm: action.payload.onConfirm || null,
        onCancel: action.payload.onCancel || null,
      };
    },
    
    hideConfirmation: (state) => {
      state.modals.confirmation.open = false;
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.notifications.unshift(notification);
      state.notificationCount += 1;
    },
    
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.notificationCount = Math.max(0, state.notificationCount - 1);
      }
    },
    
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
      state.notificationCount = 0;
    },
    
    removeNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index > -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.notificationCount = Math.max(0, state.notificationCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
      state.notificationCount = 0;
    },
    
    // Loading states
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    
    setPageLoading: (state, action) => {
      state.pageLoading = action.payload;
    },
    
    // Toast
    showToast: (state, action) => {
      state.toast = {
        open: true,
        message: action.payload.message || '',
        type: action.payload.type || 'info',
        duration: action.payload.duration || 5000,
      };
    },
    
    hideToast: (state) => {
      state.toast.open = false;
    },
    
    // Page settings
    updatePageSettings: (state, action) => {
      const { page, settings } = action.payload;
      if (state.pageSettings[page]) {
        state.pageSettings[page] = {
          ...state.pageSettings[page],
          ...settings,
        };
      }
    },
    
    // User preferences
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
      
      // Save to localStorage
      Object.entries(action.payload).forEach(([key, value]) => {
        localStorage.setItem(`preference_${key}`, JSON.stringify(value));
      });
    },
    
    togglePreference: (state, action) => {
      const preference = action.payload;
      if (state.preferences.hasOwnProperty(preference)) {
        state.preferences[preference] = !state.preferences[preference];
        localStorage.setItem(
          `preference_${preference}`, 
          JSON.stringify(state.preferences[preference])
        );
      }
    },
    
    // Onboarding
    startOnboarding: (state) => {
      state.onboarding.currentStep = 0;
      state.onboarding.completed = false;
    },
    
    nextOnboardingStep: (state) => {
      if (state.onboarding.currentStep < state.onboarding.totalSteps - 1) {
        state.onboarding.currentStep += 1;
      }
    },
    
    previousOnboardingStep: (state) => {
      if (state.onboarding.currentStep > 0) {
        state.onboarding.currentStep -= 1;
      }
    },
    
    completeOnboarding: (state) => {
      state.onboarding.completed = true;
      state.onboarding.currentStep = 0;
      localStorage.setItem('onboardingCompleted', 'true');
    },
    
    skipOnboarding: (state) => {
      state.onboarding.completed = true;
      state.onboarding.currentStep = 0;
      localStorage.setItem('onboardingCompleted', 'true');
    },
    
    // Feature flags
    updateFeatureFlags: (state, action) => {
      state.features = {
        ...state.features,
        ...action.payload,
      };
    },
  },
});

// Actions
export const {
  setTheme,
  toggleTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
  openModal,
  closeModal,
  toggleModal,
  showConfirmation,
  hideConfirmation,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setPageLoading,
  showToast,
  hideToast,
  updatePageSettings,
  updatePreferences,
  togglePreference,
  startOnboarding,
  nextOnboardingStep,
  previousOnboardingStep,
  completeOnboarding,
  skipOnboarding,
  updateFeatureFlags,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectSidebar = (state) => ({
  open: state.ui.sidebarOpen,
  collapsed: state.ui.sidebarCollapsed,
});
export const selectModals = (state) => state.ui.modals;
export const selectNotifications = (state) => ({
  list: state.ui.notifications,
  count: state.ui.notificationCount,
});
export const selectToast = (state) => state.ui.toast;
export const selectPageSettings = (page) => (state) => state.ui.pageSettings[page];
export const selectPreferences = (state) => state.ui.preferences;
export const selectOnboarding = (state) => state.ui.onboarding;
export const selectFeatures = (state) => state.ui.features;

// Thunks for complex UI operations
export const showSuccessToast = (message) => (dispatch) => {
  dispatch(showToast({ message, type: 'success' }));
};

export const showErrorToast = (message) => (dispatch) => {
  dispatch(showToast({ message, type: 'error' }));
};

export const showWarningToast = (message) => (dispatch) => {
  dispatch(showToast({ message, type: 'warning' }));
};

export const showInfoToast = (message) => (dispatch) => {
  dispatch(showToast({ message, type: 'info' }));
};

export default uiSlice.reducer;