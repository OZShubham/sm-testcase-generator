import { useState, useCallback } from 'react'

export const useFileUpload = (options = {}) => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/xml', 'text/plain'],
    onSuccess,
    onError
  } = options

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [errors, setErrors] = useState([])

  const validateFile = useCallback((file) => {
    const errors = []

    // Check file size
    if (file.size > maxFileSize) {
      errors.push(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`)
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not supported`)
    }

    return errors
  }, [maxFileSize, allowedTypes])

  const uploadFiles = useCallback(async (files) => {
    setUploading(true)
    setUploadProgress(0)
    setErrors([])

    const fileArray = Array.from(files)
    const validFiles = []
    const fileErrors = []

    // Validate all files first
    fileArray.forEach((file, index) => {
      const validationErrors = validateFile(file)
      if (validationErrors.length > 0) {
        fileErrors.push({
          file: file.name,
          errors: validationErrors
        })
      } else {
        validFiles.push(file)
      }
    })

    if (fileErrors.length > 0) {
      setErrors(fileErrors)
      setUploading(false)
      if (onError) {
        onError(fileErrors)
      }
      return
    }

    try {
      // Simulate file upload with progress
      const uploadPromises = validFiles.map((file, index) => {
        return new Promise((resolve) => {
          const fileData = {
            id: `file-${Date.now()}-${index}`,
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            type: file.name.split('.').pop().toUpperCase(),
            uploadedAt: new Date().toISOString(),
            status: 'Processing',
            file: file
          }

          // Simulate upload progress
          let progress = 0
          const interval = setInterval(() => {
            progress += Math.random() * 30
            if (progress >= 100) {
              progress = 100
              clearInterval(interval)
              resolve({
                ...fileData,
                status: 'Processed',
                progress: 100
              })
            }
            setUploadProgress((prev) => Math.min(prev + 5, 95))
          }, 200)
        })
      })

      const results = await Promise.all(uploadPromises)
      setUploadedFiles(prev => [...prev, ...results])
      setUploadProgress(100)

      if (onSuccess) {
        onSuccess(results)
      }

      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0)
      }, 1000)

    } catch (error) {
      setErrors([{ file: 'Upload', errors: [error.message] }])
      if (onError) {
        onError([{ file: 'Upload', errors: [error.message] }])
      }
    } finally {
      setUploading(false)
    }
  }, [validateFile, onSuccess, onError])

  const removeFile = useCallback((fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }, [])

  const clearFiles = useCallback(() => {
    setUploadedFiles([])
    setErrors([])
    setUploadProgress(0)
  }, [])

  return {
    uploading,
    uploadProgress,
    uploadedFiles,
    errors,
    uploadFiles,
    removeFile,
    clearFiles
  }
}

export default useFileUpload
