// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Clock, CheckCircle, AlertTriangle, FileText, Wand2, Trash2, MoreVertical } from 'lucide-react';
// import { documentApi } from '../../utils/api';
// import { useAuth } from '../../utils/auth';
// import Modal from '../UI/Modal';
// import { useModal } from '../../hooks/useModal';
// import './JobList.css';

// const JobList = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { isModalOpen, openModal, closeModal } = useModal();
//   const [selectedJob, setSelectedJob] = useState(null);

//   const fetchJobs = useCallback(async () => {
//     if (!user) return;
//     try {
//       setLoading(true);
//       const userJobs = await documentApi.getUserJobs(user.uid);
//       setJobs(userJobs);
//     } catch (err) {
//       setError('Failed to fetch job history.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchJobs();
//   }, [fetchJobs]);

//   const handleDeleteClick = (job) => {
//     setSelectedJob(job);
//     openModal();
//   };

//   const confirmDelete = async () => {
//     if (!selectedJob) return;
//     try {
//       await documentApi.deleteDocument(selectedJob.id, user.uid);
//       setJobs(jobs.filter(job => job.id !== selectedJob.id));
//       closeModal();
//     } catch (err) {
//       setError('Failed to delete document.');
//       console.error(err);
//     }
//   };

//   const getStatusBadge = (status) => {
//     let className = 'status-badge';
//     if (status === 'Completed') className += ' status-badge--completed';
//     else if (status === 'Failed') className += ' status-badge--failed';
//     else className += ' status-badge--processing';
//     return <span className={className}>{status}</span>;
//   };

//   if (error) return <div className="error-message">{error}</div>;

//   return (
//     <div className="job-list-container">
//       <h2>Processing History</h2>
//       <div className="job-table-wrapper">
//         <table className="job-table">
//           <thead>
//             <tr>
//               <th>File Name</th>
//               <th>Upload Date</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading && jobs.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className="loading-spinner">
//                   <Clock className="spin" />
//                 </td>
//               </tr>
//             ) : jobs.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className="empty-state">
//                   <FileText size={48} />
//                   <h3>No documents processed yet</h3>
//                   <p>Upload a document to see its processing status here.</p>
//                 </td>
//               </tr>
//             ) : (
//               jobs.map(job => {
//                 const uploadDate = job.created_at 
//                   ? new Date(job.created_at).toLocaleDateString() 
//                   : 'N/A';

//                 return (
//                 <tr key={job.id}>
//                   <td>{job.original_filename}</td>
//                   <td>{uploadDate}</td>
//                   <td>{getStatusBadge(job.overall_status)}</td>
//                   <td>
//                     <div className="action-menu">
//                       <button className="action-btn" onClick={() => handleDeleteClick(job)}>
//                         <Trash2 size={16} />
//                       </button>
//                       {job.overall_status === 'Completed' && (
//                         <button className="action-btn" onClick={() => navigate(`/generate/${job.id}`)}>
//                           <Wand2 size={16} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//       <Modal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         title="Confirm Deletion"
//         onConfirm={confirmDelete}
//       >
//         <p>Are you sure you want to delete this document and all its associated data? This action cannot be undone.</p>
//       </Modal>
//     </div>
//   );
// };

// export default JobList;


import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertTriangle, FileText, Wand2, Trash2, RefreshCw, MoreVertical, Download, Eye } from 'lucide-react';
import { documentApi, documentUtils } from '../../utils/api';
import { useAuth } from '../../utils/auth';
import Modal from '../UI/Modal';
import { useModal } from '../../hooks/useModal';
import './JobList.css';


const JobList = ({ refreshTrigger }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingJobs, setDeletingJobs] = useState(new Set());
  const [pollingJobs, setPollingJobs] = useState(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [selectedJob, setSelectedJob] = useState(null);


  const fetchJobs = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      // Use the corrected documentApi.getUserJobs
      const userJobs = await documentApi.getUserJobs(user.uid);
      setJobs(Array.isArray(userJobs) ? userJobs : []);
      
      // Start polling for any processing jobs
      const processingJobs = userJobs.filter(job => documentUtils.isProcessing(job));
      processingJobs.forEach(job => {
        if (!pollingJobs.has(job.id)) {
          startPollingJob(job.id);
        }
      });
      
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to fetch job history.');
    } finally {
      setLoading(false);
    }
  }, [user, pollingJobs]);


  const startPollingJob = useCallback((jobId) => {
    if (pollingJobs.has(jobId)) return;
    
    setPollingJobs(prev => new Set(prev).add(jobId));
    
    documentApi.pollJobStatus(jobId, user.uid, (updatedJob) => {
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, ...updatedJob } : job
        )
      );
      
      // Stop polling if job is completed
      if (!documentUtils.isProcessing(updatedJob)) {
        setPollingJobs(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      }
    }, { interval: 3000, maxAttempts: 100 });
  }, [user, pollingJobs]);


  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    openModal();
  };


  const confirmDelete = async () => {
    if (!selectedJob) return;
    
    setDeletingJobs(prev => new Set(prev).add(selectedJob.id));
    
    try {
      // Use the corrected documentApi.deleteDocument
      await documentApi.deleteDocument(selectedJob.id, user.uid);
      setJobs(jobs.filter(job => job.id !== selectedJob.id));
      
      // Stop polling if it was running
      if (pollingJobs.has(selectedJob.id)) {
        setPollingJobs(prev => {
          const next = new Set(prev);
          next.delete(selectedJob.id);
          return next;
        });
      }
      
      closeModal();
    } catch (err) {
      console.error('Failed to delete document:', err);
      setError('Failed to delete document.');
    } finally {
      setDeletingJobs(prev => {
        const next = new Set(prev);
        next.delete(selectedJob.id);
        return next;
      });
    }
  };


  const getStatusBadge = (job) => {
    const status = documentUtils.getOverallStatus(job);
    let className = 'status-badge';
    
    if (status === 'Completed') className += ' status-badge--completed';
    else if (status === 'Failed') className += ' status-badge--failed';
    else className += ' status-badge--processing';
    
    return <span className={className}>{status}</span>;
  };


  const getStatusIcon = (job) => {
    const status = documentUtils.getOverallStatus(job);
    
    if (status === 'Failed') return <AlertTriangle className="status-icon failed" size={20} />;
    if (status === 'Completed') return <CheckCircle className="status-icon completed" size={20} />;
    return <Clock className="status-icon processing spin" size={20} />;
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };


  const handleRefresh = () => {
    setLoading(true);
    fetchJobs();
  };


  const viewJobDetails = (job) => {
    // You can implement a detailed view modal or navigate to a details page
    console.log('View job details:', job);
  };


  const downloadProcessedFile = async (job) => {
    if (!job.processed_gcs_uri) {
      alert('Processed file not available yet');
      return;
    }
    
    try {
      // This would need to be implemented in your API
      // For now, just show the info
      const fileName = job.processed_filename || `${job.original_filename}.md`;
      alert(`Download would fetch: ${fileName}`);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download file');
    }
  };


  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, refreshTrigger]);


  // Auto-refresh every 30 seconds if there are processing jobs
  useEffect(() => {
    const hasProcessingJobs = jobs.some(job => documentUtils.isProcessing(job));
    
    if (hasProcessingJobs) {
      const interval = setInterval(() => {
        fetchJobs();
      }, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [jobs, fetchJobs]);


  if (error) {
    return (
      <div className="job-list-container">
        <div className="error-message">
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button onClick={handleRefresh} className="retry-button">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="job-list-container">
      <div className="job-list-header">
        <h2>Processing History</h2>
        <button 
          onClick={handleRefresh} 
          disabled={loading}
          className="refresh-button"
          title="Refresh job list"
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
        </button>
      </div>
      
      <div className="job-table-wrapper">
        <table className="job-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>File Name</th>
              <th>Upload Date</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="loading-spinner">
                  <Clock className="spin" size={32} />
                  <p>Loading jobs...</p>
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  <FileText size={48} />
                  <h3>No documents processed yet</h3>
                  <p>Upload a document to see its processing status here.</p>
                </td>
              </tr>
            ) : (
              jobs.map(job => {
                const uploadDate = formatDate(job.created_at);
                const overallStatus = documentUtils.getOverallStatus(job);
                const currentStep = documentUtils.getCurrentStep(job);
                const isDeleting = deletingJobs.has(job.id);
                const canGenerateTests = documentUtils.canGenerateTests(job);

                return (
                  <tr key={job.id} className={`job-row job-row--${overallStatus.toLowerCase()}`}>
                    <td>
                      <div className="status-cell">
                        {getStatusIcon(job)}
                        {getStatusBadge(job)}
                      </div>
                    </td>
                    <td>
                      <div className="filename-cell">
                        <span className="filename">{job.original_filename || job.name}</span>
                        {job.file_size_bytes && (
                          <span className="file-size">
                            {documentUtils.formatFileSize(job.file_size_bytes)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{uploadDate}</td>
                    <td>
                      <div className="progress-cell">
                        <span className="progress-text">{currentStep}</span>
                        {job.processing_duration_seconds && (
                          <span className="processing-time">
                            {documentUtils.formatDuration(job.processing_duration_seconds)}
                          </span>
                        )}
                        {documentUtils.isProcessing(job) && (
                          <div className="progress-bar">
                            <div className="progress-fill" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-menu">
                        <button 
                          className="action-btn action-btn--details" 
                          onClick={() => viewJobDetails(job)}
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {job.processed_gcs_uri && (
                          <button 
                            className="action-btn action-btn--download" 
                            onClick={() => downloadProcessedFile(job)}
                            title="Download processed file"
                          >
                            <Download size={16} />
                          </button>
                        )}
                        
                        {canGenerateTests && (
                          <button 
                            className="action-btn action-btn--generate" 
                            onClick={() => navigate(`/generate/${job.id}`)}
                            title="Generate test cases"
                          >
                            <Wand2 size={16} />
                          </button>
                        )}
                        
                        <button 
                          className="action-btn action-btn--delete" 
                          onClick={() => handleDeleteClick(job)}
                          disabled={isDeleting}
                          title="Delete document"
                        >
                          {isDeleting ? <Clock size={16} className="spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Job Statistics */}
      {jobs.length > 0 && (
        <div className="job-stats">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{jobs.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed:</span>
            <span className="stat-value">
              {jobs.filter(job => documentUtils.getOverallStatus(job) === 'Completed').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Processing:</span>
            <span className="stat-value">
              {jobs.filter(job => documentUtils.isProcessing(job)).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Failed:</span>
            <span className="stat-value">
              {jobs.filter(job => documentUtils.getOverallStatus(job) === 'Failed').length}
            </span>
          </div>
        </div>
      )}
      
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Confirm Deletion"
        onConfirm={confirmDelete}
      >
        {selectedJob && (
          <div>
            <p>Are you sure you want to delete <strong>{selectedJob.original_filename || selectedJob.name}</strong> and all its associated data?</p>
            <p className="warning-text">This action cannot be undone.</p>
            {selectedJob.test_cases && (
              <p className="warning-text">⚠️ This will also delete generated test cases.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobList;
