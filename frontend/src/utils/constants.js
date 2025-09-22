export const HEALTHCARE_STANDARDS = {
  FDA_21_CFR_820: {
    name: 'FDA 21 CFR Part 820',
    description: 'Quality System Regulation for Medical Devices',
    color: '#2563eb'
  },
  IEC_62304: {
    name: 'IEC 62304',
    description: 'Medical Device Software Lifecycle Processes',
    color: '#f59e0b'
  },
  ISO_13485: {
    name: 'ISO 13485',
    description: 'Medical Device Quality Management Systems',
    color: '#10b981'
  },
  ISO_27001: {
    name: 'ISO 27001',
    description: 'Information Security Management',
    color: '#8b5cf6'
  },
  HIPAA: {
    name: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act',
    color: '#ef4444'
  },
  GDPR: {
    name: 'GDPR',
    description: 'General Data Protection Regulation',
    color: '#06b6d4'
  }
}

export const TEST_CASE_PRIORITIES = {
  CRITICAL: { label: 'Critical', color: '#ef4444', weight: 4 },
  HIGH: { label: 'High', color: '#f59e0b', weight: 3 },
  MEDIUM: { label: 'Medium', color: '#2563eb', weight: 2 },
  LOW: { label: 'Low', color: '#6b7280', weight: 1 }
}

export const TEST_CASE_STATUSES = {
  GENERATED: { label: 'Generated', color: '#2563eb' },
  IN_REVIEW: { label: 'In Review', color: '#f59e0b' },
  APPROVED: { label: 'Approved', color: '#10b981' },
  REJECTED: { label: 'Rejected', color: '#ef4444' }
}

export const SUPPORTED_FILE_TYPES = {
  PDF: { extension: '.pdf', mime: 'application/pdf', icon: 'FileText' },
  WORD: { extension: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: 'FileText' },
  XML: { extension: '.xml', mime: 'application/xml', icon: 'Code' },
  TEXT: { extension: '.txt', mime: 'text/plain', icon: 'FileText' }
}

export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  UPLOAD_DOCUMENT: '/api/upload-document',
  GET_JOBS: '/api/jobs', // Renamed from GET_DOCUMENTS to GET_JOBS
  GENERATE_TESTS: '/tests/generate',
  GET_TESTS: '/tests',
  UPDATE_TEST: '/tests/:id',
  DELETE_TEST: '/tests/:id'
}

export const ROUTES = {
  DASHBOARD: '/dashboard',
  UPLOAD: '/upload',
  GENERATE: '/generate',
  TEST_CASES: '/test-cases',
  SETTINGS: '/settings'
}
