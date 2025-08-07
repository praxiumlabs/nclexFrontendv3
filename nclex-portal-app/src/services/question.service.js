import { apiClient, API_ENDPOINTS } from './api';

class QuestionService {
  // Get questions with filters
  async getQuestions(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.questions.list, params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get question by ID
  async getQuestionById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.questions.getById(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get questions by subject
  async getQuestionsBySubject(subjectId, params = {}) {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.questions.bySubject(subjectId),
        params
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get questions by chapter
  async getQuestionsByChapter(chapterId, params = {}) {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.questions.byChapter(chapterId),
        params
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search questions
  async searchQuestions(query, params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.questions.search, {
        q: query,
        ...params
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get SRS due questions
  async getSRSDueQuestions() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.srs.due);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Submit SRS review
  async submitSRSReview(questionId, rating) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.srs.review, {
        questionId,
        rating
      });
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
          return new Error('Question not found');
        case 403:
          return new Error('You do not have permission to access this question');
        default:
          return new Error(data.message || 'An error occurred');
      }
    }
    return error;
  }
}

export default new QuestionService();