import { API_ENDPOINTS } from './constants';
import { getIdToken } from './firebase';


class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || API_ENDPOINTS.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = { ...this.defaultHeaders, ...options.headers };

    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const token = await getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Could not get auth token:', error);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('API Error Response:', errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params).toString();
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    
    return this.request(url, {
      method: 'GET'
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  async upload(endpoint, file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
    });
  }
}

const apiClient = new ApiClient();

export const testCaseApi = {
  getAll: (filters = {}) => apiClient.get(API_ENDPOINTS.GET_TESTS, filters),
  getById: (id) => apiClient.get(`${API_ENDPOINTS.GET_TESTS}/${id}`),
  create: (testCase) => apiClient.post(API_ENDPOINTS.GET_TESTS, testCase),
  update: (id, updates) => apiClient.put(API_ENDPOINTS.UPDATE_TEST.replace(':id', id), updates),
  delete: (id) => apiClient.delete(API_ENDPOINTS.DELETE_TEST.replace(':id', id)),
  generate: (documentId, config = {}) => apiClient.post(API_ENDPOINTS.GENERATE_TESTS, { documentId, ...config }),
  export: (testCaseIds, format = 'csv') => apiClient.post(API_ENDPOINTS.EXPORT_TESTS, { testCaseIds, format }),
};

export const documentApi = {
  getUserJobs: async (userId, options = {}) => {
    const { limit = 50, status } = options;
    
    try {
      const params = new URLSearchParams({ user_id: userId, limit: limit.toString() });
      if (status) params.append('status', status);
      
      const response = await apiClient.get(`/documents?${params}`);
      return response.jobs || response;
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      throw error;
    }
  },

  getJob: async (documentId, userId) => {
    try {
      return await apiClient.get(`/documents/${documentId}/status`);
    } catch (error) {
      console.error('Failed to get job details:', error);
      throw error;
    }
  },

  deleteDocument: async (documentId, userId) => {
    try {
      return await apiClient.delete(`/documents/${documentId}?user_id=${userId}`);
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  },

  uploadDocument: async (file, userId) => {
    if (!file) {
      throw new Error('File is required');
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`);
    }

    if (file.size === 0) {
      throw new Error('Empty file not allowed');
    }

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      return await apiClient.request('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  },

  pollJobStatus: async (documentId, userId, onUpdate, options = {}) => {
    const { interval = 3000, maxAttempts = 100 } = options;
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        console.log('Max polling attempts reached');
        return;
      }

      attempts++;

      try {
        const job = await documentApi.getJob(documentId, userId);
        onUpdate(job);
        
        const finalStates = ['Completed', 'Failed'];
        const doclingDone = finalStates.includes(job.docling_status);
        const indexingDone = finalStates.includes(job.indexing_status);
        
        if (doclingDone && indexingDone) {
          console.log('Polling complete - job finished');
          return;
        }
        
        setTimeout(poll, interval);
      } catch (error) {
        console.error('Polling error:', error);
        const retryInterval = Math.min(interval * Math.pow(1.5, attempts), 30000);
        setTimeout(poll, retryInterval);
      }
    };
    
    poll();
  },

  getDocumentStatus: (documentId) => apiClient.get(`/documents/${documentId}/status`),
  generateTestCases: (documentId, config) => apiClient.post(`/documents/${documentId}/generate-test-cases`, config),
};

export const complianceApi = {
  getStats: () => apiClient.get(API_ENDPOINTS.GET_COMPLIANCE),
  getStandards: () => apiClient.get('/compliance/standards'),
  updateMapping: (testCaseId, standards) => apiClient.post(`/compliance/mapping/${testCaseId}`, { standards }),
};

export const integrationApi = {
  getStatus: () => apiClient.get(API_ENDPOINTS.INTEGRATIONS),
  connect: (platform, config) => apiClient.post(`${API_ENDPOINTS.INTEGRATIONS}/${platform}/connect`, config),
  disconnect: (platform) => apiClient.delete(`${API_ENDPOINTS.INTEGRATIONS}/${platform}`),
  sync: (platform, data) => apiClient.post(`${API_ENDPOINTS.INTEGRATIONS}/${platform}/sync`, data),
};

export const userApi = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (updates) => apiClient.put('/user/profile', updates),
  getSettings: () => apiClient.get(API_ENDPOINTS.USER_SETTINGS),
  updateSettings: (settings) => apiClient.put(API_ENDPOINTS.USER_SETTINGS, settings),
};

// Enhanced utility functions
export const documentUtils = {
  formatFileSize: (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  formatDuration: (seconds) => {
    if (!seconds) return '';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  },

  getStatusColor: (status) => {
    const colors = {
      'Completed': '#10B981',
      'Failed': '#EF4444',
      'Processing': '#F59E0B',
      'Queued': '#8B5CF6',
      'Pending': '#6B7280',
    };
    return colors[status] || '#6B7280';
  },

  isProcessing: (job) => {
    if (!job) return false;
    const processingStates = ['Processing', 'Queued', 'Pending'];
    return processingStates.includes(job.docling_status) || 
           processingStates.includes(job.indexing_status);
  },

  canGenerateTests: (job) => {
    return job && 
           job.docling_status === 'Completed' && 
           job.indexing_status === 'Completed';
  },

  getOverallStatus: (job) => {
    if (!job) return 'Unknown';
    
    const { docling_status, indexing_status } = job;
    
    if (docling_status === 'Failed' || indexing_status === 'Failed') {
      return 'Failed';
    }
    
    if (docling_status === 'Completed' && indexing_status === 'Completed') {
      return 'Completed';
    }
    
    return 'Processing';
  },

  getCurrentStep: (job) => {
    if (!job) return 'Unknown';
    
    const { docling_status, indexing_status } = job;
    
    if (docling_status === 'Processing') {
      return 'Converting document to markdown';
    }
    
    if (docling_status === 'Completed' && indexing_status === 'Processing') {
      return 'Indexing document for search';
    }
    
    if (docling_status === 'Completed' && indexing_status === 'Completed') {
      return 'Ready for test case generation';
    }
    
    if (docling_status === 'Failed' || indexing_status === 'Failed') {
      return 'Processing failed';
    }
    
    return 'Waiting to start processing';
  }
};

// Mock API for development
export const mockApi = {
  delay: (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms)),
  generateTestCases: async (documentId, config = {}) => {
    await mockApi.delay(3000);
    return {
      success: true,
      testCases: [{ 
        id: `TC-${Date.now()}`, 
        title: 'Generated Test Case', 
        description: 'AI-generated test case based on document analysis', 
        priority: 'High', 
        status: 'Generated', 
        compliance: ['FDA 21 CFR 820', 'IEC 62304'] 
      }],
      stats: { 
        generated: 15, 
        complianceScore: 94, 
        processingTime: '2.3 minutes' 
      }
    };
  },
  uploadDocument: async (file) => {
    await mockApi.delay(2000);
    return {
      success: true,
      document: { 
        id: `doc-${Date.now()}`, 
        name: file.name, 
        size: file.size, 
        type: file.type, 
        status: 'Processing', 
        uploadedAt: new Date().toISOString() 
      }
    };
  }
};

export default apiClient;
