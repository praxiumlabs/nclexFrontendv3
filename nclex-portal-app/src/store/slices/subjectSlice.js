// src/store/slices/subjectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subjectService from '../../services/subject.service';

// Initial state
const initialState = {
  // Subjects data
  subjects: [],
  currentSubject: null,
  
  // Chapters data
  chapters: [],
  currentChapter: null,
  
  // Topics data
  topics: [],
  
  // Hierarchy data
  hierarchy: [],
  
  // Statistics
  statistics: {
    totalSubjects: 0,
    completedSubjects: 0,
    totalChapters: 0,
    completedChapters: 0,
  },
  
  // Recommendations
  recommendations: [],
  
  // Search
  searchResults: [],
  searchQuery: '',
  
  // Loading states
  loading: false,
  loadingChapters: false,
  loadingStatistics: false,
  loadingRecommendations: false,
  
  // Errors
  error: null,
};

// Async thunks
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await subjectService.getSubjects(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubjectById = createAsyncThunk(
  'subjects/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await subjectService.getSubjectById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChaptersBySubject = createAsyncThunk(
  'subjects/fetchChapters',
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await subjectService.getChaptersBySubject(subjectId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubjectStatistics = createAsyncThunk(
  'subjects/fetchStatistics',
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await subjectService.getSubjectStatistics(subjectId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubjectHierarchy = createAsyncThunk(
  'subjects/fetchHierarchy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subjectService.getSubjectHierarchy();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubjectRecommendations = createAsyncThunk(
  'subjects/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subjectService.getSubjectRecommendations();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchSubjects = createAsyncThunk(
  'subjects/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await subjectService.searchContent(searchParams.query, searchParams);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markChapterCompleted = createAsyncThunk(
  'subjects/markChapterCompleted',
  async (chapterId, { rejectWithValue }) => {
    try {
      const response = await subjectService.markChapterCompleted(chapterId);
      return { chapterId, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Subject slice
const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    // Set current subject
    setCurrentSubject: (state, action) => {
      state.currentSubject = action.payload;
    },
    
    // Set current chapter
    setCurrentChapter: (state, action) => {
      state.currentChapter = action.payload;
    },
    
    // Clear current selections
    clearCurrentSelections: (state) => {
      state.currentSubject = null;
      state.currentChapter = null;
    },
    
    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    // Clear search
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
    
    // Update subject progress
    updateSubjectProgress: (state, action) => {
      const { subjectId, progress } = action.payload;
      const subject = state.subjects.find(s => s.id === subjectId);
      if (subject) {
        subject.progress = progress;
      }
    },
    
    // Update chapter completion
    updateChapterCompletion: (state, action) => {
      const { chapterId, completed } = action.payload;
      const chapter = state.chapters.find(c => c.id === chapterId);
      if (chapter) {
        chapter.completed = completed;
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch subjects
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.subjects || action.payload;
        state.statistics.totalSubjects = state.subjects.length;
        state.statistics.completedSubjects = state.subjects.filter(s => s.completed).length;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch subject by ID
    builder
      .addCase(fetchSubjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubject = action.payload;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch chapters by subject
    builder
      .addCase(fetchChaptersBySubject.pending, (state) => {
        state.loadingChapters = true;
      })
      .addCase(fetchChaptersBySubject.fulfilled, (state, action) => {
        state.loadingChapters = false;
        state.chapters = action.payload.chapters || action.payload;
        state.statistics.totalChapters = state.chapters.length;
        state.statistics.completedChapters = state.chapters.filter(c => c.completed).length;
      })
      .addCase(fetchChaptersBySubject.rejected, (state, action) => {
        state.loadingChapters = false;
        state.error = action.payload;
      });
    
    // Fetch subject statistics
    builder
      .addCase(fetchSubjectStatistics.pending, (state) => {
        state.loadingStatistics = true;
      })
      .addCase(fetchSubjectStatistics.fulfilled, (state, action) => {
        state.loadingStatistics = false;
        // Update statistics for current subject
        if (state.currentSubject) {
          state.currentSubject.statistics = action.payload;
        }
      })
      .addCase(fetchSubjectStatistics.rejected, (state, action) => {
        state.loadingStatistics = false;
        state.error = action.payload;
      });
    
    // Fetch subject hierarchy
    builder
      .addCase(fetchSubjectHierarchy.fulfilled, (state, action) => {
        state.hierarchy = action.payload;
      });
    
    // Fetch recommendations
    builder
      .addCase(fetchSubjectRecommendations.pending, (state) => {
        state.loadingRecommendations = true;
      })
      .addCase(fetchSubjectRecommendations.fulfilled, (state, action) => {
        state.loadingRecommendations = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchSubjectRecommendations.rejected, (state, action) => {
        state.loadingRecommendations = false;
        state.error = action.payload;
      });
    
    // Search subjects
    builder
      .addCase(searchSubjects.fulfilled, (state, action) => {
        state.searchResults = action.payload.results || action.payload;
      });
    
    // Mark chapter completed
    builder
      .addCase(markChapterCompleted.fulfilled, (state, action) => {
        const { chapterId } = action.payload;
        const chapter = state.chapters.find(c => c.id === chapterId);
        if (chapter) {
          chapter.completed = true;
        }
        // Recalculate statistics
        state.statistics.completedChapters = state.chapters.filter(c => c.completed).length;
      });
  },
});

// Actions
export const {
  setCurrentSubject,
  setCurrentChapter,
  clearCurrentSelections,
  setSearchQuery,
  clearSearch,
  updateSubjectProgress,
  updateChapterCompletion,
  clearError,
} = subjectSlice.actions;

// Selectors
export const selectSubjects = (state) => state.subject.subjects;
export const selectCurrentSubject = (state) => state.subject.currentSubject;
export const selectChapters = (state) => state.subject.chapters;
export const selectCurrentChapter = (state) => state.subject.currentChapter;
export const selectSubjectHierarchy = (state) => state.subject.hierarchy;
export const selectSubjectStatistics = (state) => state.subject.statistics;
export const selectSubjectRecommendations = (state) => state.subject.recommendations;
export const selectSubjectSearchResults = (state) => state.subject.searchResults;
export const selectSubjectLoading = (state) => state.subject.loading;
export const selectSubjectError = (state) => state.subject.error;

// Complex selectors
export const selectSubjectById = (id) => (state) => {
  return state.subject.subjects.find(subject => subject.id === id);
};

export const selectChaptersBySubject = (subjectId) => (state) => {
  return state.subject.chapters.filter(chapter => chapter.subjectId === subjectId);
};

export const selectSubjectProgress = (state) => {
  const { subjects } = state.subject;
  return subjects.map(subject => ({
    id: subject.id,
    name: subject.name,
    progress: subject.progress || 0,
    accuracy: subject.accuracy || 0,
    questionsAnswered: subject.questionsAnswered || 0,
    totalQuestions: subject.totalQuestions || 0,
  }));
};

export const selectSubjectCategories = (state) => {
  const subjects = state.subject.subjects;
  return subjects.reduce((categories, subject) => {
    const category = subject.category || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(subject);
    return categories;
  }, {});
};

export const selectWeakSubjects = (state) => {
  return state.subject.subjects
    .filter(subject => subject.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy);
};

export const selectCompletedSubjects = (state) => {
  return state.subject.subjects.filter(subject => subject.completed);
};

export const selectInProgressSubjects = (state) => {
  return state.subject.subjects.filter(subject => 
    subject.progress > 0 && !subject.completed
  );
};

export default subjectSlice.reducer;