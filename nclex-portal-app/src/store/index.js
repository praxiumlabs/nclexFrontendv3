// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
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
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
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

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;