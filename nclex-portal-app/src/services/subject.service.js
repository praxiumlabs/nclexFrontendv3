// src/services/subject.service.js
import { apiClient, API_ENDPOINTS } from './api';

class SubjectService {
  // Get all subjects
  async getSubjects(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.subjects.list, params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject by ID
  async getSubjectById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.subjects.getById(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get chapters for a subject
  async getChaptersBySubject(subjectId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.subjects.chapters(subjectId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all chapters
  async getAllChapters(params = {}) {
    try {
      const response = await apiClient.get('/api/chapters', params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get chapter by ID
  async getChapterById(id) {
    try {
      const response = await apiClient.get(`/api/chapters/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get topics for a chapter
  async getTopicsByChapter(chapterId) {
    try {
      const response = await apiClient.get(`/api/chapters/${chapterId}/topics`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject statistics
  async getSubjectStatistics(subjectId) {
    try {
      const response = await apiClient.get(`/api/subjects/${subjectId}/statistics`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get chapter statistics
  async getChapterStatistics(chapterId) {
    try {
      const response = await apiClient.get(`/api/chapters/${chapterId}/statistics`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject question count
  async getSubjectQuestionCount(subjectId) {
    try {
      const response = await apiClient.get(`/api/subjects/${subjectId}/question-count`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject progress summary
  async getSubjectProgressSummary(subjectId) {
    try {
      const response = await apiClient.get(`/api/subjects/${subjectId}/progress-summary`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get recommended chapters based on performance
  async getRecommendedChapters(subjectId) {
    try {
      const response = await apiClient.get(`/api/subjects/${subjectId}/recommended-chapters`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject learning objectives
  async getLearningObjectives(subjectId) {
    try {
      const response = await apiClient.get(`/api/subjects/${subjectId}/learning-objectives`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get study materials for a chapter
  async getStudyMaterials(chapterId) {
    try {
      const response = await apiClient.get(`/api/chapters/${chapterId}/study-materials`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get flashcards for a subject
  async getFlashcards(subjectId, params = {}) {
    try {
      const response = await apiClient.get(`/api/subjects/${subjectId}/flashcards`, params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get case studies for a subject
  async getCaseStudies(subjectId, params = {}) {
    try {
      const response = await apiClient.get(`/api/subjects/${subjectId}/case-studies`, params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search subjects and chapters
  async searchContent(query, params = {}) {
    try {
      const response = await apiClient.get('/api/subjects/search', {
        q: query,
        ...params
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject hierarchy (subjects -> chapters -> topics)
  async getSubjectHierarchy() {
    try {
      const response = await apiClient.get('/api/subjects/hierarchy');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mark chapter as completed
  async markChapterCompleted(chapterId) {
    try {
      const response = await apiClient.post(`/api/chapters/${chapterId}/complete`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject recommendations based on weak areas
  async getSubjectRecommendations() {
    try {
      const response = await apiClient.get('/api/subjects/recommendations');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Helper method to organize subjects by category
  organizeSubjectsByCategory(subjects) {
    const categories = {
      'Safe and Effective Care Environment': [],
      'Health Promotion and Maintenance': [],
      'Psychosocial Integrity': [],
      'Physiological Integrity': []
    };

    subjects.forEach(subject => {
      if (categories[subject.name]) {
        categories[subject.name].push(subject);
      }
    });

    return categories;
  }

  // Calculate subject completion percentage
  calculateSubjectCompletion(completedChapters, totalChapters) {
    if (!totalChapters || totalChapters === 0) return 0;
    return Math.round((completedChapters / totalChapters) * 100);
  }

  // Format subject difficulty
  formatDifficulty(difficulty) {
    const levels = {
      1: 'Beginner',
      2: 'Intermediate',
      3: 'Advanced',
      4: 'Expert',
      5: 'Master'
    };
    return levels[difficulty] || 'Unknown';
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          return new Error('Subject or chapter not found');
        case 403:
          return new Error('You do not have access to this content');
        default:
          return new Error(data.message || 'Error loading subject data');
      }
    }
    
    return error;
  }
}

export default new SubjectService();