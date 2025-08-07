import { apiClient, API_ENDPOINTS } from './api';

class ExamService {
  // Start exam session
  async startSession(params = {}) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.exams.start, params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Submit answer
  async submitAnswer(sessionId, data) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.exams.submitAnswer(sessionId),
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get exam session
  async getSession(sessionId) {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.exams.getSession(sessionId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Submit exam
  async submitExam(sessionId, data = {}) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.exams.submit, {
        sessionId,
        ...data
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get exam results
  async getResults(sessionId) {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.exams.results(sessionId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get exam history
  async getHistory(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.exams.history, params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
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
          return new Error('Exam session expired or invalid');
        default:
          return new Error(data.message || 'An error occurred during exam');
      }
    }
    return error;
  }
}

export default new ExamService();