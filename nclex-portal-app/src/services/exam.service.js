// src/services/exam.service.js
import { apiClient, API_ENDPOINTS } from './api';

class ExamService {
  // Start a new exam session
  async startExam(examData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.exams.start, examData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Submit an answer for a question
  async submitAnswer(sessionId, answerData) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.exams.submitAnswer(sessionId),
        answerData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Submit/complete the entire exam
  async completeExam(sessionId, examData) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.exams.submit,
        {
          sessionId,
          ...examData
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get exam session details
  async getExamSession(sessionId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.exams.getSession(sessionId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get exam results
  async getExamResults(sessionId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.exams.results(sessionId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get exam history
  async getExamHistory(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.exams.history, params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create practice session
  async createPracticeSession(params) {
    const examData = {
      type: params.examType || 'practice',
      questionCount: params.limit || 10,
      subjectId: params.subjectId,
      chapterId: params.chapterId,
      difficulty: params.difficulty,
      timed: params.timed || false,
      duration: params.duration || null
    };

    return this.startExam(examData);
  }

  // Create mock exam session
  async createMockExam() {
    const examData = {
      type: 'mock',
      questionCount: 75,
      timed: true,
      duration: 18000 // 5 hours in seconds
    };

    return this.startExam(examData);
  }

  // Create SRS review session
  async createSRSSession() {
    const examData = {
      type: 'srs',
      timed: false
    };

    return this.startExam(examData);
  }

  // Pause exam (save current state)
  async pauseExam(sessionId, currentState) {
    try {
      const response = await apiClient.put(
        `/api/exams/${sessionId}/pause`,
        currentState
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Resume paused exam
  async resumeExam(sessionId) {
    try {
      const response = await apiClient.put(
        `/api/exams/${sessionId}/resume`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get exam statistics
  async getExamStatistics(sessionId) {
    try {
      const response = await apiClient.get(
        `/api/exams/${sessionId}/statistics`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Flag/unflag a question
  async toggleQuestionFlag(sessionId, questionId) {
    try {
      const response = await apiClient.post(
        `/api/exams/${sessionId}/questions/${questionId}/flag`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get flagged questions
  async getFlaggedQuestions(sessionId) {
    try {
      const response = await apiClient.get(
        `/api/exams/${sessionId}/flagged-questions`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Calculate exam score
  calculateScore(answers) {
    if (!answers || answers.length === 0) {
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        unanswered: 0,
        accuracy: 0,
        score: 0
      };
    }

    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const incorrectAnswers = answers.filter(a => !a.isCorrect && a.selectedOptionIds?.length > 0).length;
    const unanswered = answers.filter(a => !a.selectedOptionIds || a.selectedOptionIds.length === 0).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      accuracy,
      score
    };
  }

  // Calculate time statistics
  calculateTimeStats(answers) {
    if (!answers || answers.length === 0) {
      return {
        totalTime: 0,
        averageTime: 0,
        fastestTime: 0,
        slowestTime: 0
      };
    }

    const times = answers.map(a => a.timeSpent || 0);
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = Math.round(totalTime / times.length);
    const fastestTime = Math.min(...times);
    const slowestTime = Math.max(...times);

    return {
      totalTime,
      averageTime,
      fastestTime,
      slowestTime
    };
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          return new Error('Exam session not found');
        case 400:
          return new Error(data.message || 'Invalid exam data');
        case 403:
          return new Error('You do not have permission to access this exam');
        default:
          return new Error(data.message || 'Error processing exam request');
      }
    }
    
    return error;
  }
}

export default new ExamService();