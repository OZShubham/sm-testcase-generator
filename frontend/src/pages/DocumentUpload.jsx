// import React, { useState, useCallback, useRef } from 'react';
// import { Upload, Clock } from 'lucide-react';
// import Card from '../components/UI/Card';
// import JobList from '../components/Features/JobList';
// import './DocumentUpload.css';
// import { useAuth } from '../utils/auth';
// import { documentApi } from '../utils/api';
// import { useAppContext } from '../context/AppContext'; // Import useAppContext

// const DocumentUpload = () => {
//   const [dragActive, setDragActive] = useState(false);
//   const [jobStatus, setJobStatus] = useState(null);
//   const inputRef = useRef(null);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();
//   const [uploadCount, setUploadCount] = useState(0); // To trigger JobList refresh

//   const handleDrag = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
//     else if (e.type === 'dragleave') setDragActive(false);
//   }, []);

//   const handleFile = useCallback(async (file) => {
//     setError(null);
//     setJobStatus('Uploading...');

//     if (!user) {
//       setError("User not authenticated. Please log in to upload files.");
//       setJobStatus(null);
//       return;
//     }

//     try {
//       await documentApi.uploadDocument(file, user.uid);
//       setJobStatus('Uploaded');
//       setUploadCount(count => count + 1); // Trigger refresh
//     } catch (err) {
//       console.error('Upload error:', err);
//       setError(err.message);
//       setJobStatus(null);
//     }
//   }, [user]);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0]);
//     }
//   }, [handleFile]);

//   const handleFileInput = useCallback((e) => {
//     if (e.target.files && e.target.files[0]) {
//       handleFile(e.target.files[0]);
//     }
//   }, [handleFile]);

//   const handleClick = () => {
//     inputRef.current.click();
//   };

//   const { loading: appLoading } = useAppContext(); // Get global loading state

//   return (
//     <div className="document-upload fade-in">
//       <div className="document-upload__header">
//         <h1>Upload Document</h1>
//         <p>Upload a document to begin processing and indexing.</p>
//       </div>

//       <Card className="document-upload__zone-card" padding="large">
//         <div
//           className={`upload-zone ${dragActive ? 'upload-zone--active' : ''}`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//           onClick={handleClick}
//         >
//           <div className="upload-zone__content">
//             {jobStatus === 'Uploading...' ? (
//               <div className="upload-zone__status">
//                 <Clock size={48} className="status-icon processing spin" />
//                 <h3>Uploading...</h3>
//               </div>
//             ) : (
//               <>
//                 <div className="upload-zone__icon">
//                   <Upload size={48} />
//                 </div>
//                 <h3>Drag and drop a file here</h3>
//                 <p>or click to browse</p>
//                 <input
//                   ref={inputRef}
//                   type="file"
//                   onChange={handleFileInput}
//                   className="upload-zone__input"
//                   accept=".pdf,.doc,.docx,.xml,.txt,.pptx,.xlsx,.png,.jpg,.jpeg,.tiff"
//                   style={{ display: 'none' }}
//                 />
//               </>
//             )}
//             {error && <div className="error-message">{error}</div>}
//           </div>
//         </div>
//       </Card>

//       {appLoading ? (
//         <Card className="job-list-loading-card" padding="large">
//           <div className="job-list-loading">
//             <Clock size={32} className="spin" />
//             <p>Loading document jobs...</p>
//           </div>
//         </Card>
//       ) : (
//         <JobList key={uploadCount} />
//       )}
//     </div>
//   );
// };

// export default DocumentUpload;



import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Card from '../components/UI/Card';
import JobList from '../components/Features/JobList';
import './DocumentUpload.css';
import { useAuth } from '../utils/auth';
import { documentApi, documentUtils } from '../utils/api';
import { useAppContext } from '../context/AppContext';


const DocumentUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [uploadedJob, setUploadedJob] = useState(null);
  const { user } = useAuth();
  const [uploadCount, setUploadCount] = useState(0);


  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);


  const validateFile = (file) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/html',
      'image/png',
      'image/jpeg',
      'image/tiff'
    ];

    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`);
    }

    if (file.size === 0) {
      throw new Error('Empty file not allowed');
    }

    if (!allowedTypes.includes(file.type)) {
      const extensions = ['.pdf', '.docx', '.doc', '.txt', '.pptx', '.xlsx', '.html', '.png', '.jpg', '.jpeg', '.tiff'];
      throw new Error(`File type not supported. Allowed: ${extensions.join(', ')}`);
    }
  };


  const handleFile = useCallback(async (file) => {
    setError(null);
    setUploadStatus('validating');
    setUploadProgress(0);

    if (!user) {
      setError("User not authenticated. Please log in to upload files.");
      setUploadStatus(null);
      return;
    }

    try {
      // Validate file
      validateFile(file);
      
      setUploadStatus('uploading');
      setUploadProgress(25);

      // Upload file
      const result = await documentApi.uploadDocument(file, user.uid);
      
      setUploadProgress(50);
      setUploadStatus('processing');
      
      // Set uploaded job info
      setUploadedJob({
        id: result.document_id,
        filename: result.filename,
        size: result.file_size
      });

      setUploadProgress(100);
      
      // Start monitoring the job
      if (result.document_id) {
        documentApi.pollJobStatus(result.document_id, user.uid, (updatedJob) => {
          setUploadedJob(prev => ({ ...prev, ...updatedJob }));
          
          // If job is complete, trigger job list refresh
          if (!documentUtils.isProcessing(updatedJob)) {
            setUploadCount(count => count + 1);
            setTimeout(() => {
              setUploadStatus('completed');
              setTimeout(() => {
                setUploadStatus(null);
                setUploadedJob(null);
              }, 3000);
            }, 1000);
          }
        });
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      setUploadStatus('failed');
      setTimeout(() => {
        setUploadStatus(null);
        setUploadProgress(0);
      }, 3000);
    }
  }, [user]);


  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);


  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);


  const handleClick = () => {
    if (uploadStatus === 'uploading' || uploadStatus === 'processing') return;
    inputRef.current.click();
  };


  const getUploadStatusDisplay = () => {
    switch (uploadStatus) {
      case 'validating':
        return {
          icon: <Clock size={48} className="status-icon validating spin" />,
          title: 'Validating file...',
          description: 'Checking file type and size'
        };
      case 'uploading':
        return {
          icon: <Upload size={48} className="status-icon uploading" />,
          title: 'Uploading...',
          description: `${uploadProgress}% complete`
        };
      case 'processing':
        return {
          icon: <Clock size={48} className="status-icon processing spin" />,
          title: 'Processing...',
          description: uploadedJob ? 
            `Converting ${uploadedJob.filename} (${documentUtils.formatFileSize(uploadedJob.size)})` : 
            'Converting document to markdown'
        };
      case 'completed':
        return {
          icon: <CheckCircle size={48} className="status-icon completed" />,
          title: 'Upload Complete!',
          description: uploadedJob ? `${uploadedJob.filename} processed successfully` : 'Document processed successfully'
        };
      case 'failed':
        return {
          icon: <AlertTriangle size={48} className="status-icon failed" />,
          title: 'Upload Failed',
          description: error
        };
      default:
        return null;
    }
  };


  const { loading: appLoading } = useAppContext();
  const statusDisplay = getUploadStatusDisplay();


  return (
    <div className="document-upload fade-in">
      <div className="document-upload__header">
        <h1>Upload Document</h1>
        <p>Upload a document to begin processing and indexing. Supported formats: PDF, DOCX, TXT, PPTX, XLSX, HTML, Images.</p>
      </div>

      <Card className="document-upload__zone-card" padding="large">
        <div
          className={`upload-zone ${dragActive ? 'upload-zone--active' : ''} ${uploadStatus ? 'upload-zone--' + uploadStatus : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="upload-zone__content">
            {statusDisplay ? (
              <div className="upload-zone__status">
                {statusDisplay.icon}
                <h3>{statusDisplay.title}</h3>
                <p>{statusDisplay.description}</p>

                {uploadStatus === 'processing' && uploadedJob && (
                  <div className="processing-details">
                    <div className="processing-steps">
                      <div className={`step ${uploadedJob.docling_status !== 'Pending' ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">
                          Document Conversion
                          {uploadedJob.docling_status === 'Completed' && <CheckCircle size={16} />}
                          {uploadedJob.docling_status === 'Processing' && <Clock size={16} className="spin" />}
                        </span>
                      </div>
                      <div className={`step ${uploadedJob.indexing_status !== 'Pending' ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">
                          Document Indexing
                          {uploadedJob.indexing_status === 'Completed' && <CheckCircle size={16} />}
                          {uploadedJob.indexing_status === 'Processing' && <Clock size={16} className="spin" />}
                        </span>
                      </div>
                    </div>

                    {uploadedJob.processing_duration_seconds && (
                      <div className="processing-time">
                        Processing time: {documentUtils.formatDuration(uploadedJob.processing_duration_seconds)}
                      </div>
                    )}
                  </div>
                )}

                {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="upload-zone__icon">
                  <Upload size={48} />
                </div>
                <h3>Drag and drop a file here</h3>
                <p>or click to browse</p>
                <div className="file-requirements">
                  <small>
                    Max size: 50MB • Formats: PDF, DOCX, TXT, PPTX, XLSX, HTML, Images
                  </small>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  onChange={handleFileInput}
                  className="upload-zone__input"
                  accept=".pdf,.doc,.docx,.txt,.pptx,.xlsx,.html,.png,.jpg,.jpeg,.tiff"
                  style={{ display: 'none' }}
                />
              </>
            )}

            {error && uploadStatus !== 'failed' && (
              <div className="error-message">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}
            {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {appLoading ? (
        <Card className="job-list-loading-card" padding="large">
          <div className="job-list-loading">
            <Clock size={32} className="spin" />
            <p>Loading document jobs...</p>
          </div>
        </Card>
      ) : (
        <>
          {uploadedJob && (
            <Card className="job-metrics-card" padding="large">
              <h2>Job Metrics</h2>
              <p>File Name: {uploadedJob.filename}</p>
              <p>File Size: {documentUtils.formatFileSize(uploadedJob.size)}</p>
              <p>Upload Status: {uploadStatus}</p>
              {uploadedJob.processing_duration_seconds && (
                <p>Processing Time: {documentUtils.formatDuration(uploadedJob.processing_duration_seconds)}</p>
              )}
            </Card>
          )}
          <JobList refreshTrigger={uploadCount} />
        </>
      )}
    </div>
  );
};

export default DocumentUpload;
