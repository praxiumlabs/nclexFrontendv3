// src/store/slices/examSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import examService from '../../services/exam.service';
import questionService from '../../services/question.service';

// Initial state
const initialState = {
  // Exam session data
  currentSession: null,
  sessionId: null,
  examType: null, // 'practice', 'mock', 'srs'
  
  // Questions data
  questions: [],
  currentQuestionIndex: 0,
  
  // User answers
  userAnswers: [],
  
  // Timer
  startTime: null,
  endTime: null,
  timeRemaining: null,
  timerActive: false,
  
  // Results
  results: null,
  
  // Loading states
  loading: false,
  submittingAnswer: false,
  loadingResults: false,
  
  // Errors
  error: null,
  
  // UI state
  showRationale: false,
  flaggedQuestions: [],
};

// Async thunks
export const startExamSession = createAsyncThunk(
  'exam/startSession',
  async ({ examType, params }, { rejectWithValue }) => {
    try {
      let questions = [];
      
      // Get questions based on exam type
      if (examType === 'srs') {
        questions = await questionService.getSRSQuestions();
      } else if (examType === 'practice' || examType === 'quick') {
        questions = await questionService.getPracticeQuestions(params);
      } else if (examType === 'mock') {
        questions = await questionService.getQuestions({
          limit: 75,
          random: true,
          ...params,
        });
      }
      
      // Start exam session on backend
      const session = await examService.startExam({
        examType,
        questionIds: questions.map(q => q.id),
        ...params,
      });
      
      return {
        session,
        questions,
        examType,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitAnswer = createAsyncThunk(
  'exam/submitAnswer',
  async ({ questionId, selectedOptionIds, timeSpent }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { sessionId, questions, currentQuestionIndex } = state.exam;
      const question = questions[currentQuestionIndex];
      
      // Validate answer locally
      const isCorrect = questionService.validateAnswer(question, selectedOptionIds);
      
      // Submit to backend
      await examService.submitAnswer(sessionId, {
        questionId,
        selectedOptionIds,
        timeSpent,
        isCorrect,
      });
      
      return {
        questionId,
        selectedOptionIds,
        timeSpent,
        isCorrect,
        questionIndex: currentQuestionIndex,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeExam = createAsyncThunk(
  'exam/complete',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { sessionId, userAnswers } = state.exam;
      
      // Submit exam completion
      const results = await examService.completeExam(sessionId, {
        answers: userAnswers,
        completedAt: new Date().toISOString(),
      });
      
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getExamResults = createAsyncThunk(
  'exam/getResults',
  async (sessionId, { rejectWithValue }) => {
    try {
      const results = await examService.getExamResults(sessionId);
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Exam slice
const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    // Navigation
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.showRationale = false;
      }
    },
    
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        state.showRationale = false;
      }
    },
    
    goToQuestion: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.questions.length) {
        state.currentQuestionIndex = index;
        state.showRationale = false;
      }
    },
    
    // Timer management
    startTimer: (state, action) => {
      state.timerActive = true;
      state.timeRemaining = action.payload || null;
    },
    
    updateTimer: (state, action) => {
      if (state.timerActive && state.timeRemaining !== null) {
        state.timeRemaining = Math.max(0, state.timeRemaining - action.payload);
      }
    },
    
    pauseTimer: (state) => {
      state.timerActive = false;
    },
    
    resumeTimer: (state) => {
      state.timerActive = true;
    },
    
    // UI state
    toggleRationale: (state) => {
      state.showRationale = !state.showRationale;
    },
    
    showRationale: (state) => {
      state.showRationale = true;
    },
    
    hideRationale: (state) => {
      state.showRationale = false;
    },
    
    // Flag questions
    toggleFlagQuestion: (state, action) => {
      const questionId = action.payload;
      const index = state.flaggedQuestions.indexOf(questionId);
      
      if (index > -1) {
        state.flaggedQuestions.splice(index, 1);
      } else {
        state.flaggedQuestions.push(questionId);
      }
    },
    
    // Reset exam
    resetExam: (state) => {
      return initialState;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Start exam session
    builder
      .addCase(startExamSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startExamSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload.session;
        state.sessionId = action.payload.session.id;
        state.questions = action.payload.questions;
        state.examType = action.payload.examType;
        state.currentQuestionIndex = 0;
        state.userAnswers = [];
        state.startTime = new Date().toISOString();
        state.error = null;
        
        // Set timer for mock exams (5 hours)
        if (action.payload.examType === 'mock') {
          state.timeRemaining = 5 * 60 * 60; // 5 hours in seconds
          state.timerActive = true;
        }
      })
      .addCase(startExamSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Submit answer
    builder
      .addCase(submitAnswer.pending, (state) => {
        state.submittingAnswer = true;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.submittingAnswer = false;
        state.userAnswers.push(action.payload);
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.submittingAnswer = false;
        state.error = action.payload;
      });
    
    // Complete exam
    builder
      .addCase(completeExam.pending, (state) => {
        state.loading = true;
      })
      .addCase(completeExam.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.endTime = new Date().toISOString();
        state.timerActive = false;
      })
      .addCase(completeExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Get exam results
    builder
      .addCase(getExamResults.pending, (state) => {
        state.loadingResults = true;
      })
      .addCase(getExamResults.fulfilled, (state, action) => {
        state.loadingResults = false;
        state.results = action.payload;
      })
      .addCase(getExamResults.rejected, (state, action) => {
        state.loadingResults = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  nextQuestion,
  previousQuestion,
  goToQuestion,
  startTimer,
  updateTimer,
  pauseTimer,
  resumeTimer,
  toggleRationale,
  showRationale,
  hideRationale,
  toggleFlagQuestion,
  resetExam,
  clearError,
} = examSlice.actions;

// Selectors
export const selectExam = (state) => state.exam;
export const selectCurrentQuestion = (state) => {
  const { questions, currentQuestionIndex } = state.exam;
  return questions[currentQuestionIndex] || null;
};
export const selectIsLastQuestion = (state) => {
  const { questions, currentQuestionIndex } = state.exam;
  return currentQuestionIndex === questions.length - 1;
};
export const selectProgress = (state) => {
  const { questions, currentQuestionIndex } = state.exam;
  return {
    current: currentQuestionIndex + 1,
    total: questions.length,
    percentage: questions.length > 0 
      ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
      : 0,
  };
};
export const selectUserAnswer = (state) => {
  const { userAnswers, currentQuestionIndex } = state.exam;
  return userAnswers.find(answer => answer.questionIndex === currentQuestionIndex);
};

export default examSlice.reducer;