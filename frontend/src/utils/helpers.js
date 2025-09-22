import { HEALTHCARE_STANDARDS, TEST_CASE_PRIORITIES, TEST_CASE_STATUSES } from './constants'

// Date and Time Helpers
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString)
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date)
}

export const formatDateTime = (dateString) => {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }
  
  return 'just now'
}

// File Helpers
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type) || allowedTypes.includes(`.${getFileExtension(file.name)}`)
}

// Test Case Helpers
export const generateTestCaseId = (prefix = 'TC') => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substr(2, 3).toUpperCase()
  return `${prefix}-${timestamp}${random}`
}

export const calculateComplianceScore = (testCase, activeStandards = []) => {
  if (!testCase.compliance || testCase.compliance.length === 0) return 0
  
  // Find matching standards
  const matchedStandards = testCase.compliance.filter(standard => 
    activeStandards.some(active => 
      HEALTHCARE_STANDARDS[active]?.name === standard || active === standard
    )
  )
  
  if (activeStandards.length === 0) return 100
  
  return Math.round((matchedStandards.length / activeStandards.length) * 100)
}

export const getStatusColor = (status) => {
  const statusKey = Object.keys(TEST_CASE_STATUSES).find(key => 
    TEST_CASE_STATUSES[key].label === status
  )
  return statusKey ? TEST_CASE_STATUSES[statusKey].color : '#6b7280'
}

export const getPriorityColor = (priority) => {
  const priorityKey = Object.keys(TEST_CASE_PRIORITIES).find(key => 
    TEST_CASE_PRIORITIES[key].label === priority
  )
  return priorityKey ? TEST_CASE_PRIORITIES[priorityKey].color : '#6b7280'
}

export const getPriorityWeight = (priority) => {
  const priorityKey = Object.keys(TEST_CASE_PRIORITIES).find(key => 
    TEST_CASE_PRIORITIES[key].label === priority
  )
  return priorityKey ? TEST_CASE_PRIORITIES[priorityKey].weight : 1
}

export const sortTestCasesByPriority = (testCases) => {
  return [...testCases].sort((a, b) => {
    const weightA = getPriorityWeight(a.priority)
    const weightB = getPriorityWeight(b.priority)
    return weightB - weightA // Higher weight first
  })
}

// Validation Helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export const validateTestCaseId = (id) => {
  const idRegex = /^[A-Z]{2,4}-[A-Z0-9]{6,10}$/
  return idRegex.test(id)
}

// Text Helpers
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength).trim() + '...'
}

export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const camelToTitle = (camelCase) => {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

// Array Helpers
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const valueA = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key]
    const valueB = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key]
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1
    if (valueA > valueB) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export const unique = (array, key) => {
  if (key) {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  }
  return [...new Set(array)]
}

// Performance Helpers
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Mock Data Helpers
export const generateMockDelay = (min = 1000, max = 3000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const simulateApiCall = (data, delay = null) => {
  const actualDelay = delay || generateMockDelay()
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), actualDelay)
  })
}

// Export Helpers
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data.length) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToJSON = (data, filename = 'export.json') => {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Color Helpers
export const hexToRgba = (hex, alpha = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const getContrastColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16)
  const g = parseInt(hexColor.substr(3, 2), 16)
  const b = parseInt(hexColor.substr(5, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
