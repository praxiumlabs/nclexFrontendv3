// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import reducers
import authReducer from './slices/authSlice';
import examReducer from './slices/examSlice';
import progressReducer from './slices/progressSlice';
import uiReducer from './slices/uiSlice';
import questionReducer from './slices/questionSlice';
import subjectReducer from './slices/subjectSlice';

// Create Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    progress: progressReducer,
    ui: uiReducer,
    question: questionReducer,
    subject: subjectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'auth/login/fulfilled', 
          'auth/register/fulfilled',
          'persist/PERSIST',
          'persist/REHYDRATE'
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user.lastLogin'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query (if needed in future)
setupListeners(store.dispatch);

// Make store available globally for debugging
if (process.env.NODE_ENV === 'development') {
  window.__REDUX_STORE__ = store;
}

// Export types for TypeScript (if needed)
export const getState = store.getState;
export const dispatch = store.dispatch;

export default store;