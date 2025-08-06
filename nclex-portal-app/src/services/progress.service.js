// src/services/progress.service.js
import { apiClient, API_ENDPOINTS } from './api';

class ProgressService {
  // Get overall progress overview
  async getProgressOverview() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.progress.overview);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject-wise progress
  async getSubjectProgress() {
    try {
      const response = await apiClient.get('/api/progress/subjects');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get progress for specific subject
  async getProgressBySubject(subjectId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.progress.bySubject(subjectId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get chapter progress for a subject
  async getChapterProgress(subjectId) {
    try {
      const response = await apiClient.get(`/api/progress/subjects/${subjectId}/chapters`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get daily streaks
  async getStreaks() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.progress.streaks);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get statistics
  async getStatistics(dateRange = 'week') {
    try {
      const response = await apiClient.get(API_ENDPOINTS.progress.statistics, {
        dateRange
      });
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
  async updateDailyProgress(progressData) {
    try {
      const response = await apiClient.post('/api/progress/daily', progressData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get weekly goals
  async getWeeklyGoals() {
    try {
      const response = await apiClient.get('/api/progress/weekly-goals');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update weekly goals
  async updateWeeklyGoals(goals) {
    try {
      const response = await apiClient.put('/api/progress/weekly-goals', goals);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get performance trends
  async getPerformanceTrends(params = {}) {
    try {
      const response = await apiClient.get('/api/progress/trends', params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get study time analytics
  async getStudyTimeAnalytics(params = {}) {
    try {
      const response = await apiClient.get('/api/progress/study-time', params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get weakness analysis
  async getWeaknessAnalysis() {
    try {
      const response = await apiClient.get('/api/progress/weakness-analysis');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check and unlock achievements
  async checkAchievements(progressData) {
    try {
      const response = await apiClient.post('/api/progress/check-achievements', progressData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mark achievement as seen
  async markAchievementSeen(achievementId) {
    try {
      const response = await apiClient.put(`/api/progress/achievements/${achievementId}/seen`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get learning path recommendations
  async getLearningPath() {
    try {
      const response = await apiClient.get('/api/progress/learning-path');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Export progress report
  async exportProgressReport(format = 'pdf') {
    try {
      const response = await apiClient.get('/api/progress/export', {
        format,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `progress-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Calculate progress percentage
  calculateProgressPercentage(current, total) {
    if (!total || total === 0) return 0;
    return Math.round((current / total) * 100);
  }

  // Calculate study streak
  calculateStreak(activityDates) {
    if (!activityDates || activityDates.length === 0) return 0;
    
    // Sort dates in descending order
    const sortedDates = activityDates
      .map(date => new Date(date))
      .sort((a, b) => b - a);
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      date.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Format study time
  formatStudyTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          return new Error('Progress data not found');
        case 403:
          return new Error('You do not have permission to access this data');
        default:
          return new Error(data.message || 'Error loading progress data');
      }
    }
    
    return error;
  }
}

export default new ProgressService();