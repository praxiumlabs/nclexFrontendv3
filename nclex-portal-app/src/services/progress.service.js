import { apiClient, API_ENDPOINTS } from './api';

class ProgressService {
  // Get progress overview
  async getOverview() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.progress.overview);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject progress
  async getSubjectProgress(subjectId = null) {
    try {
      const url = subjectId 
        ? API_ENDPOINTS.progress.bySubject(subjectId)
        : API_ENDPOINTS.progress.overview;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get streaks
  async getStreaks() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.progress.streaks);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get statistics
  async getStatistics(params = {}) {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.progress.statistics,
        params
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get achievements
  async getAchievements() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.progress.achievements);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update daily progress
  async updateDailyProgress(data) {
    try {
      const response = await apiClient.post('/api/progress/daily', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      return new Error(data.message || 'Failed to fetch progress data');
    }
    return error;
  }
}

export default new ProgressService();