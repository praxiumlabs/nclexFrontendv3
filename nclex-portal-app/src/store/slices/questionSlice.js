// src/store/slices/questionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import questionService from '../../services/question.service';

// Initial state
const initialState = {
  // Questions data
  questions: [],
  currentQuestion: null,
  totalQuestions: 0,
  
  // Filters
  filters: {
    subjectId: null,
    chapterId: null,
    difficulty: null,
    questionType: null,
    tags: [],
  },
  
  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  
  // Search
  searchQuery: '',
  searchResults: [],
  
  // SRS Questions
  srsQuestions: [],
  srsCount: 0,
  
  // Loading states
  loading: false,
  loadingSearch: false,
  loadingSRS: false,
  
  // Errors
  error: null,
};

// Async thunks
export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { filters, pagination } = state.question;
      
      const response = await questionService.getQuestions({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        ...params,
      });
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuestionById = createAsyncThunk(
  'questions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await questionService.getQuestionById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuestionsBySubject = createAsyncThunk(
  'questions/fetchBySubject',
  async ({ subjectId, params }, { rejectWithValue }) => {
    try {
      const response = await questionService.getQuestionsBySubject(subjectId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuestionsByChapter = createAsyncThunk(
  'questions/fetchByChapter',
  async ({ chapterId, params }, { rejectWithValue }) => {
    try {
      const response = await questionService.getQuestionsByChapter(chapterId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchQuestions = createAsyncThunk(
  'questions/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await questionService.searchQuestions(searchParams);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSRSQuestions = createAsyncThunk(
  'questions/fetchSRS',
  async (_, { rejectWithValue }) => {
    try {
      const response = await questionService.getSRSQuestions();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitSRSReview = createAsyncThunk(
  'questions/submitSRSReview',
  async ({ questionId, performanceRating }, { rejectWithValue }) => {
    try {
      const response = await questionService.submitSRSReview(questionId, performanceRating);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Question slice
const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    // Set filters
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    
    // Set page
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    
    // Set limit
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
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
    
    // Set current question
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch questions
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions || action.payload;
        state.totalQuestions = action.payload.total || state.questions.length;
        state.pagination.totalPages = Math.ceil(
          state.totalQuestions / state.pagination.limit
        );
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch question by ID
    builder
      .addCase(fetchQuestionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion = action.payload;
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch by subject
    builder
      .addCase(fetchQuestionsBySubject.fulfilled, (state, action) => {
        state.questions = action.payload.questions || action.payload;
        state.totalQuestions = action.payload.total || state.questions.length;
      });
    
    // Fetch by chapter
    builder
      .addCase(fetchQuestionsByChapter.fulfilled, (state, action) => {
        state.questions = action.payload.questions || action.payload;
        state.totalQuestions = action.payload.total || state.questions.length;
      });
    
    // Search questions
    builder
      .addCase(searchQuestions.pending, (state) => {
        state.loadingSearch = true;
      })
      .addCase(searchQuestions.fulfilled, (state, action) => {
        state.loadingSearch = false;
        state.searchResults = action.payload.questions || action.payload;
      })
      .addCase(searchQuestions.rejected, (state, action) => {
        state.loadingSearch = false;
        state.error = action.payload;
      });
    
    // Fetch SRS questions
    builder
      .addCase(fetchSRSQuestions.pending, (state) => {
        state.loadingSRS = true;
      })
      .addCase(fetchSRSQuestions.fulfilled, (state, action) => {
        state.loadingSRS = false;
        state.srsQuestions = action.payload.questions || action.payload;
        state.srsCount = state.srsQuestions.length;
      })
      .addCase(fetchSRSQuestions.rejected, (state, action) => {
        state.loadingSRS = false;
        state.error = action.payload;
      });
    
    // Submit SRS review
    builder
      .addCase(submitSRSReview.fulfilled, (state, action) => {
        // Remove reviewed question from SRS queue
        state.srsQuestions = state.srsQuestions.filter(
          q => q.id !== action.meta.arg.questionId
        );
        state.srsCount = state.srsQuestions.length;
      });
  },
});

// Actions
export const {
  setFilters,
  clearFilters,
  setPage,
  setLimit,
  setSearchQuery,
  clearSearch,
  setCurrentQuestion,
  clearError,
} = questionSlice.actions;

// Selectors
export const selectQuestions = (state) => state.question.questions;
export const selectCurrentQuestion = (state) => state.question.currentQuestion;
export const selectFilters = (state) => state.question.filters;
export const selectPagination = (state) => state.question.pagination;
export const selectSearchResults = (state) => state.question.searchResults;
export const selectSRSQuestions = (state) => state.question.srsQuestions;
export const selectSRSCount = (state) => state.question.srsCount;
export const selectQuestionLoading = (state) => state.question.loading;
export const selectQuestionError = (state) => state.question.error;

export default questionSlice.reducer;