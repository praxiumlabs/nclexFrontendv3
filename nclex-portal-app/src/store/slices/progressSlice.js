// src/store/slices/progressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import progressService from '../../services/progress.service';

// Initial state
const initialState = {
  // Overall progress
  overview: {
    currentLevel: null,
    nextLevel: null,
    overallAccuracy: 0,
    totalQuestionsAnswered: 0,
    totalStudyTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
  },
  
  // Subject progress
  subjectProgress: [],
  
  // Chapter progress
  chapterProgress: [],
  
  // Daily progress
  dailyProgress: {
    date: new Date().toISOString().split('T')[0],
    questionsAnswered: 0,
    correctAnswers: 0,
    studyTime: 0,
    subjectsStudied: [],
  },
  
  // Weekly goals
  weeklyGoals: {
    questionsTarget: 350,
    questionsCompleted: 0,
    studyTimeTarget: 600, // minutes
    studyTimeCompleted: 0,
    daysActiveTarget: 5,
    daysActive: 0,
    accuracy: 0,
  },
  
  // Statistics
  statistics: {
    byDifficulty: {
      easy: { total: 0, correct: 0, accuracy: 0 },
      medium: { total: 0, correct: 0, accuracy: 0 },
      hard: { total: 0, correct: 0, accuracy: 0 },
    },
    byQuestionType: {
      MCQ: { total: 0, correct: 0, accuracy: 0 },
      SATA: { total: 0, correct: 0, accuracy: 0 },
    },
    byTimeOfDay: {
      morning: { total: 0, correct: 0, accuracy: 0 },
      afternoon: { total: 0, correct: 0, accuracy: 0 },
      evening: { total: 0, correct: 0, accuracy: 0 },
      night: { total: 0, correct: 0, accuracy: 0 },
    },
    recentPerformance: [], // Last 7 days
  },
  
  // Achievements
  achievements: [],
  newAchievements: [],
  
  // Activity history
  activityHistory: [],
  
  // Loading states
  loading: false,
  loadingSubjects: false,
  loadingStatistics: false,
  loadingAchievements: false,
  
  // Errors
  error: null,
};

// Async thunks
export const fetchProgressOverview = createAsyncThunk(
  'progress/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressService.getProgressOverview();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubjectProgress = createAsyncThunk(
  'progress/fetchSubjectProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressService.getSubjectProgress();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChapterProgress = createAsyncThunk(
  'progress/fetchChapterProgress',
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await progressService.getChapterProgress(subjectId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStatistics = createAsyncThunk(
  'progress/fetchStatistics',
  async (dateRange = 'week', { rejectWithValue }) => {
    try {
      const response = await progressService.getStatistics(dateRange);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAchievements = createAsyncThunk(
  'progress/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressService.getAchievements();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDailyProgress = createAsyncThunk(
  'progress/updateDaily',
  async (progressData, { rejectWithValue }) => {
    try {
      const response = await progressService.updateDailyProgress(progressData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAndUnlockAchievements = createAsyncThunk(
  'progress/checkAchievements',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { overview, weeklyGoals } = state.progress;
      
      const response = await progressService.checkAchievements({
        totalQuestions: overview.totalQuestionsAnswered,
        accuracy: overview.overallAccuracy,
        streak: overview.currentStreak,
        studyTime: overview.totalStudyTime,
        weeklyGoals,
      });
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Progress slice
const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // Update progress after answering question
    updateQuestionProgress: (state, action) => {
      const { isCorrect, difficulty, questionType, timeSpent, subjectId, chapterId } = action.payload;
      
      // Update daily progress
      state.dailyProgress.questionsAnswered += 1;
      if (isCorrect) {
        state.dailyProgress.correctAnswers += 1;
      }
      state.dailyProgress.studyTime += timeSpent;
      
      if (!state.dailyProgress.subjectsStudied.includes(subjectId)) {
        state.dailyProgress.subjectsStudied.push(subjectId);
      }
      
      // Update overall progress
      state.overview.totalQuestionsAnswered += 1;
      state.overview.totalStudyTime += timeSpent;
      
      // Update statistics
      if (state.statistics.byDifficulty[difficulty]) {
        state.statistics.byDifficulty[difficulty].total += 1;
        if (isCorrect) {
          state.statistics.byDifficulty[difficulty].correct += 1;
        }
      }
      
      if (state.statistics.byQuestionType[questionType]) {
        state.statistics.byQuestionType[questionType].total += 1;
        if (isCorrect) {
          state.statistics.byQuestionType[questionType].correct += 1;
        }
      }
    },
    
    // Update streak
    updateStreak: (state, action) => {
      state.overview.currentStreak = action.payload.current;
      if (action.payload.current > state.overview.longestStreak) {
        state.overview.longestStreak = action.payload.current;
      }
      state.overview.lastStudyDate = new Date().toISOString();
    },
    
    // Reset daily progress
    resetDailyProgress: (state) => {
      state.dailyProgress = {
        date: new Date().toISOString().split('T')[0],
        questionsAnswered: 0,
        correctAnswers: 0,
        studyTime: 0,
        subjectsStudied: [],
      };
    },
    
    // Add new achievement
    addNewAchievement: (state, action) => {
      const achievement = action.payload;
      state.achievements.push(achievement);
      state.newAchievements.push(achievement);
    },
    
    // Clear new achievements
    clearNewAchievements: (state) => {
      state.newAchievements = [];
    },
    
    // Add activity to history
    addActivity: (state, action) => {
      state.activityHistory.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
      
      // Keep only last 50 activities
      if (state.activityHistory.length > 50) {
        state.activityHistory = state.activityHistory.slice(0, 50);
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch progress overview
    builder
      .addCase(fetchProgressOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = {
          ...state.overview,
          ...action.payload,
        };
      })
      .addCase(fetchProgressOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch subject progress
    builder
      .addCase(fetchSubjectProgress.pending, (state) => {
        state.loadingSubjects = true;
      })
      .addCase(fetchSubjectProgress.fulfilled, (state, action) => {
        state.loadingSubjects = false;
        state.subjectProgress = action.payload;
      })
      .addCase(fetchSubjectProgress.rejected, (state, action) => {
        state.loadingSubjects = false;
        state.error = action.payload;
      });
    
    // Fetch chapter progress
    builder
      .addCase(fetchChapterProgress.fulfilled, (state, action) => {
        state.chapterProgress = action.payload;
      });
    
    // Fetch statistics
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loadingStatistics = true;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loadingStatistics = false;
        state.statistics = {
          ...state.statistics,
          ...action.payload,
        };
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loadingStatistics = false;
        state.error = action.payload;
      });
    
    // Fetch achievements
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.loadingAchievements = true;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.loadingAchievements = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.loadingAchievements = false;
        state.error = action.payload;
      });
    
    // Update daily progress
    builder
      .addCase(updateDailyProgress.fulfilled, (state, action) => {
        state.dailyProgress = action.payload;
      });
    
    // Check achievements
    builder
      .addCase(checkAndUnlockAchievements.fulfilled, (state, action) => {
        const newAchievements = action.payload;
        if (newAchievements && newAchievements.length > 0) {
          state.achievements.push(...newAchievements);
          state.newAchievements.push(...newAchievements);
        }
      });
  },
});

// Actions
export const {
  updateQuestionProgress,
  updateStreak,
  resetDailyProgress,
  addNewAchievement,
  clearNewAchievements,
  addActivity,
  clearError,
} = progressSlice.actions;

// Selectors
export const selectProgress = (state) => state.progress;
export const selectOverview = (state) => state.progress.overview;
export const selectSubjectProgress = (state) => state.progress.subjectProgress;
export const selectDailyProgress = (state) => state.progress.dailyProgress;
export const selectWeeklyGoals = (state) => state.progress.weeklyGoals;
export const selectStatistics = (state) => state.progress.statistics;
export const selectAchievements = (state) => state.progress.achievements;
export const selectNewAchievements = (state) => state.progress.newAchievements;
export const selectActivityHistory = (state) => state.progress.activityHistory;

// Complex selectors
export const selectAccuracyTrend = (state) => {
  const recentPerformance = state.progress.statistics.recentPerformance;
  return recentPerformance.map(day => ({
    date: day.date,
    accuracy: day.accuracy,
  }));
};

export const selectProgressBySubject = (subjectId) => (state) => {
  return state.progress.subjectProgress.find(sp => sp.subjectId === subjectId);
};

export const selectWeeklyGoalsCompletion = (state) => {
  const goals = state.progress.weeklyGoals;
  return {
    questions: Math.min(100, Math.round((goals.questionsCompleted / goals.questionsTarget) * 100)),
    studyTime: Math.min(100, Math.round((goals.studyTimeCompleted / goals.studyTimeTarget) * 100)),
    daysActive: Math.min(100, Math.round((goals.daysActive / goals.daysActiveTarget) * 100)),
  };
};

export default progressSlice.reducer;