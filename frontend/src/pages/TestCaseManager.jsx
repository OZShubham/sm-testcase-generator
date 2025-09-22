// import React, { useState, useMemo } from 'react'
// import { useAppContext } from '../context/AppContext'
// import { Search, Filter, Eye, Edit, Trash2, Download, Plus } from 'lucide-react'
// import Button from '../components/UI/Button'
// import Card from '../components/UI/Card'
// import Modal from '../components/UI/Modal'
// import TestCaseCard from '../components/Features/TestCaseCard'
// import './TestCaseManager.css'

// const TestCaseManager = () => {
//   const { testCases, deleteTestCase } = useAppContext()
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filterPriority, setFilterPriority] = useState('all')
//   const [filterStatus, setFilterStatus] = useState('all')
//   const [selectedTestCase, setSelectedTestCase] = useState(null)
//   const [showModal, setShowModal] = useState(false)
//   const [modalType, setModalType] = useState('view') // 'view', 'edit', 'delete'

//   const filteredTestCases = useMemo(() => {
//     return testCases.filter(tc => {
//       const matchesSearch = tc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            tc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            tc.id.toLowerCase().includes(searchTerm.toLowerCase())
//       const matchesPriority = filterPriority === 'all' || tc.priority === filterPriority
//       const matchesStatus = filterStatus === 'all' || tc.status === filterStatus
//       return matchesSearch && matchesPriority && matchesStatus
//     })
//   }, [testCases, searchTerm, filterPriority, filterStatus])

//   const handleViewTestCase = (testCase) => {
//     setSelectedTestCase(testCase)
//     setModalType('view')
//     setShowModal(true)
//   }

//   const handleEditTestCase = (testCase) => {
//     setSelectedTestCase(testCase)
//     setModalType('edit')
//     setShowModal(true)
//   }

//   const handleDeleteTestCase = (testCaseId) => {
//     const testCase = testCases.find(tc => tc.id === testCaseId)
//     setSelectedTestCase(testCase)
//     setModalType('delete')
//     setShowModal(true)
//   }

//   const confirmDelete = () => {
//     if (selectedTestCase) {
//       deleteTestCase(selectedTestCase.id)
//       setShowModal(false)
//       setSelectedTestCase(null)
//     }
//   }

//   const closeModal = () => {
//     setShowModal(false)
//     setSelectedTestCase(null)
//     setModalType('view')
//   }

//   const exportTestCases = () => {
//     const csvContent = [
//       ['ID', 'Title', 'Description', 'Priority', 'Status', 'Compliance', 'Created By', 'Created At'].join(','),
//       ...filteredTestCases.map(tc => [
//         tc.id,
//         `"${tc.title}"`,
//         `"${tc.description}"`,
//         tc.priority,
//         tc.status,
//         `"${(tc.compliance || []).join('; ')}"`, // Ensure compliance is an array
//         tc.createdBy || 'N/A', // Default value for createdBy
//         tc.createdAt || 'N/A' // Default value for createdAt
//       ].join(','))
//     ].join('\n')

//     const blob = new Blob([csvContent], { type: 'text/csv' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = 'test-cases.csv'
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   const getStatusStats = () => {
//     const stats = testCases.reduce((acc, tc) => {
//       acc[tc.status] = (acc[tc.status] || 0) + 1
//       return acc
//     }, {})
//     return stats
//   }

//   const statusStats = getStatusStats()

//   return (
//     <div className="test-case-manager fade-in">
//       <div className="test-case-manager__header">
//         <div>
//           <h1>Test Case Manager</h1>
//           <p>Manage and review your generated healthcare test cases</p>
//         </div>
//         <Button 
//           variant="primary" 
//           icon={Plus}
//           onClick={() => window.location.href = '/generate'}
//         >
//           Generate New Tests
//         </Button>
//       </div>

//       {/* Statistics */}
//       <div className="test-case-stats">
//         <Card className="stats-card" padding="medium">
//           <h3>Test Case Statistics</h3>
//           <div className="stats-grid">
//             <div className="stat-item">
//               <span className="stat-value">{testCases.length}</span>
//               <span className="stat-label">Total Cases</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-value">{statusStats['Approved'] || 0}</span>
//               <span className="stat-label">Approved</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-value">{statusStats['In Review'] || 0}</span>
//               <span className="stat-label">In Review</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-value">{statusStats['Generated'] || 0}</span>
//               <span className="stat-label">Generated</span>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Filters and Search */}
//       <Card className="test-case-controls" padding="medium">
//         <div className="controls-row">
//           <div className="search-box">
//             <Search size={20} />
//             <input
//               type="text"
//               placeholder="Search test cases..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="filters">
//             <select 
//               value={filterPriority}
//               onChange={(e) => setFilterPriority(e.target.value)}
//             >
//               <option value="all">All Priorities</option>
//               <option value="Critical">Critical</option>
//               <option value="High">High</option>
//               <option value="Medium">Medium</option>
//               <option value="Low">Low</option>
//             </select>

//             <select 
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option value="all">All Statuses</option>
//               <option value="Generated">Generated</option>
//               <option value="In Review">In Review</option>
//               <option value="Approved">Approved</option>
//               <option value="Rejected">Rejected</option>
//             </select>

//             <Button
//               variant="secondary"
//               icon={Download}
//               onClick={exportTestCases}
//               disabled={filteredTestCases.length === 0}
//             >
//               Export
//             </Button>
//           </div>
//         </div>

//         <div className="results-info">
//           Showing {filteredTestCases.length} of {testCases.length} test cases
//         </div>
//       </Card>

//       {/* Test Cases Grid */}
//       {filteredTestCases.length === 0 ? (
//         <Card className="empty-state" padding="large">
//           <div className="empty-content">
//             <Filter size={48} />
//             <h3>No test cases found</h3>
//             <p>No test cases match your current filters. Try adjusting your search criteria.</p>
//             <Button 
//               variant="primary"
//               onClick={() => {
//                 setSearchTerm('')
//                 setFilterPriority('all')
//                 setFilterStatus('all')
//               }}
//             >
//               Clear Filters
//             </Button>
//           </div>
//         </Card>
//       ) : (
//         <div className="test-cases-grid">
//           {filteredTestCases.map((testCase) => (
//             <TestCaseCard
//               key={testCase.id}
//               testCase={testCase}
//               onView={handleViewTestCase}
//               onEdit={handleEditTestCase}
//               onDelete={handleDeleteTestCase}
//             />
//           ))}
//         </div>
//       )}

//       {/* Modals */}
//       <Modal
//         isOpen={showModal}
//         onClose={closeModal}
//         title={
//           modalType === 'view' ? 'Test Case Details' :
//           modalType === 'edit' ? 'Edit Test Case' :
//           'Delete Test Case'
//         }
//         size={modalType === 'delete' ? 'small' : 'large'}
//       >
//         {modalType === 'view' && selectedTestCase && (
//           <div className="test-case-details">
//             <div className="detail-section">
//               <h4>Basic Information</h4>
//               <div className="detail-grid">
//                 <div className="detail-item">
//                   <label>ID:</label>
//                   <span>{selectedTestCase.id}</span>
//                 </div>
//                 <div className="detail-item">
//                   <label>Priority:</label>
//                   <span className={`priority-badge priority-${selectedTestCase.priority.toLowerCase()}`}>
//                     {selectedTestCase.priority}
//                   </span>
//                 </div>
//                 <div className="detail-item">
//                   <label>Status:</label>
//                   <span className={`status-badge status-${selectedTestCase.status.toLowerCase().replace(' ', '-')}`}>
//                     {selectedTestCase.status}
//                   </span>
//                 </div>
//                 <div className="detail-item">
//                   <label>Created By:</label>
//                   <span>{selectedTestCase.createdBy}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="detail-section">
//               <h4>Description</h4>
//               <p>{selectedTestCase.description}</p>
//             </div>

//             <div className="detail-section">
//               <h4>Test Steps</h4>
//               <ol className="test-steps">
//                 {selectedTestCase.steps.map((step, index) => (
//                   <li key={index}>{step}</li>
//                 ))}
//               </ol>
//             </div>

//             <div className="detail-section">
//               <h4>Expected Result</h4>
//               <p>{selectedTestCase.expectedResult}</p>
//             </div>

//             <div className="detail-section">
//               <h4>Compliance Standards</h4>
//               <div className="compliance-tags">
//                 {selectedTestCase.compliance.map((standard, index) => (
//                   <span key={index} className="compliance-tag">
//                     {standard}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div className="detail-section">
//               <h4>Traceability</h4>
//               <p>{selectedTestCase.traceability}</p>
//             </div>
//           </div>
//         )}

//         {modalType === 'edit' && selectedTestCase && (
//           <div className="test-case-edit">
//             <div className="edit-form">
//               <div className="form-group">
//                 <label htmlFor="title">Title</label>
//                 <input
//                   type="text"
//                   id="title"
//                   defaultValue={selectedTestCase.title}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="description">Description</label>
//                 <textarea
//                   id="description"
//                   rows="3"
//                   defaultValue={selectedTestCase.description}
//                 />
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="priority">Priority</label>
//                   <select id="priority" defaultValue={selectedTestCase.priority}>
//                     <option value="Critical">Critical</option>
//                     <option value="High">High</option>
//                     <option value="Medium">Medium</option>
//                     <option value="Low">Low</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="status">Status</label>
//                   <select id="status" defaultValue={selectedTestCase.status}>
//                     <option value="Generated">Generated</option>
//                     <option value="In Review">In Review</option>
//                     <option value="Approved">Approved</option>
//                     <option value="Rejected">Rejected</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-actions">
//               <Button variant="secondary" onClick={closeModal}>
//                 Cancel
//               </Button>
//               <Button variant="primary" onClick={closeModal}>
//                 Save Changes
//               </Button>
//             </div>
//           </div>
//         )}

//         {modalType === 'delete' && selectedTestCase && (
//           <div className="delete-confirmation">
//             <p>Are you sure you want to delete the test case <strong>{selectedTestCase.id}</strong>?</p>
//             <p className="warning-text">This action cannot be undone.</p>
//             <div className="modal-actions">
//               <Button variant="secondary" onClick={closeModal}>
//                 Cancel
//               </Button>
//               <Button variant="danger" onClick={confirmDelete}>
//                 Delete
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   )
// }

// export default TestCaseManager




import React, { useState, useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { Search, Filter, Eye, Edit, Trash2, Download, Plus } from 'lucide-react'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import Modal from '../components/UI/Modal'
import TestCaseCard from '../components/Features/TestCaseCard'
import './TestCaseManager.css'

const TestCaseManager = () => {
  const context = useAppContext()
  
  // Add early return if context is not available
  if (!context) {
    return (
      <div className="test-case-manager fade-in">
        <div className="test-case-manager__header">
          <h1>Loading...</h1>
          <p>Initializing test case manager...</p>
        </div>
      </div>
    )
  }

  // Safely destructure with fallbacks
  const testCases = context?.testCases || []
  const deleteTestCase = context?.deleteTestCase || (() => {})

  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTestCase, setSelectedTestCase] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('view') // 'view', 'edit', 'delete'

  const filteredTestCases = useMemo(() => {
    console.log('Filtering test cases:', testCases)
    console.log('testCases type:', typeof testCases)
    console.log('testCases isArray:', Array.isArray(testCases))
    
    if (!Array.isArray(testCases)) {
      console.warn('testCases is not an array:', testCases)
      return []
    }
    
    return testCases.filter(tc => {
      if (!tc) {
        console.warn('Found null/undefined test case')
        return false
      }
      
      const matchesSearch = (tc.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (tc.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (tc.id || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPriority = filterPriority === 'all' || tc.priority === filterPriority
      const matchesStatus = filterStatus === 'all' || tc.status === filterStatus
      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [testCases, searchTerm, filterPriority, filterStatus])

  const handleViewTestCase = (testCase) => {
    setSelectedTestCase(testCase)
    setModalType('view')
    setShowModal(true)
  }

  const handleEditTestCase = (testCase) => {
    setSelectedTestCase(testCase)
    setModalType('edit')
    setShowModal(true)
  }

  const handleDeleteTestCase = (testCaseId) => {
    const testCase = testCases.find(tc => tc && tc.id === testCaseId)
    setSelectedTestCase(testCase)
    setModalType('delete')
    setShowModal(true)
  }

  const confirmDelete = () => {
    if (selectedTestCase && deleteTestCase) {
      deleteTestCase(selectedTestCase.id)
      setShowModal(false)
      setSelectedTestCase(null)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedTestCase(null)
    setModalType('view')
  }

  const exportTestCases = () => {
    if (!Array.isArray(filteredTestCases) || filteredTestCases.length === 0) {
      alert('No test cases to export')
      return
    }

    const csvContent = [
      ['ID', 'Title', 'Description', 'Priority', 'Status', 'Compliance', 'Created By', 'Created At'].join(','),
      ...filteredTestCases.map(tc => [
        tc?.id || '',
        `"${tc?.title || ''}"`,
        `"${tc?.description || ''}"`,
        tc?.priority || '',
        tc?.status || '',
        `"${Array.isArray(tc?.compliance) ? tc.compliance.join('; ') : ''}"`,
        tc?.createdBy || 'N/A',
        tc?.createdAt || 'N/A'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'test-cases.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusStats = () => {
    if (!Array.isArray(testCases)) return {}
    
    const stats = testCases.reduce((acc, tc) => {
      if (tc && tc.status) {
        acc[tc.status] = (acc[tc.status] || 0) + 1
      }
      return acc
    }, {})
    return stats
  }

  const statusStats = getStatusStats()

  return (
    <div className="test-case-manager fade-in">
      <div className="test-case-manager__header">
        <div>
          <h1>Test Case Manager</h1>
          <p>Manage and review your generated healthcare test cases</p>
        </div>
        <Button 
          variant="primary" 
          icon={Plus}
          onClick={() => window.location.href = '/generate'}
        >
          Generate New Tests
        </Button>
      </div>

      {/* Statistics */}
      <div className="test-case-stats">
        <Card className="stats-card" padding="medium">
          <h3>Test Case Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{Array.isArray(testCases) ? testCases.length : 0}</span>
              <span className="stat-label">Total Cases</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statusStats['Approved'] || 0}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statusStats['In Review'] || 0}</span>
              <span className="stat-label">In Review</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statusStats['Generated'] || 0}</span>
              <span className="stat-label">Generated</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="test-case-controls" padding="medium">
        <div className="controls-row">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search test cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Generated">Generated</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <Button
              variant="secondary"
              icon={Download}
              onClick={exportTestCases}
              disabled={!Array.isArray(filteredTestCases) || filteredTestCases.length === 0}
            >
              Export
            </Button>
          </div>
        </div>

        <div className="results-info">
          Showing {Array.isArray(filteredTestCases) ? filteredTestCases.length : 0} of {Array.isArray(testCases) ? testCases.length : 0} test cases
        </div>
      </Card>

      {/* Test Cases Grid */}
      {!Array.isArray(filteredTestCases) || filteredTestCases.length === 0 ? (
        <Card className="empty-state" padding="large">
          <div className="empty-content">
            <Filter size={48} />
            <h3>No test cases found</h3>
            <p>
              {!Array.isArray(testCases) || testCases.length === 0 
                ? "No test cases available. Generate some test cases first." 
                : "No test cases match your current filters. Try adjusting your search criteria."
              }
            </p>
            <Button 
              variant="primary"
              onClick={() => {
                if (Array.isArray(testCases) && testCases.length > 0) {
                  setSearchTerm('')
                  setFilterPriority('all')
                  setFilterStatus('all')
                } else {
                  window.location.href = '/generate'
                }
              }}
            >
              {!Array.isArray(testCases) || testCases.length === 0 ? 'Generate Test Cases' : 'Clear Filters'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="test-cases-grid">
          {filteredTestCases.map((testCase) => (
            <TestCaseCard
              key={testCase?.id || Math.random()}
              testCase={testCase}
              onView={handleViewTestCase}
              onEdit={handleEditTestCase}
              onDelete={handleDeleteTestCase}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          modalType === 'view' ? 'Test Case Details' :
          modalType === 'edit' ? 'Edit Test Case' :
          'Delete Test Case'
        }
        size={modalType === 'delete' ? 'small' : 'large'}
      >
        {modalType === 'view' && selectedTestCase && (
          <div className="test-case-details">
            <div className="detail-section">
              <h4>Basic Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>ID:</label>
                  <span>{selectedTestCase.id || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Priority:</label>
                  <span className={`priority-badge priority-${(selectedTestCase.priority || 'medium').toLowerCase()}`}>
                    {selectedTestCase.priority || 'Medium'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge status-${(selectedTestCase.status || 'generated').toLowerCase().replace(' ', '-')}`}>
                    {selectedTestCase.status || 'Generated'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Created By:</label>
                  <span>{selectedTestCase.createdBy || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Description</h4>
              <p>{selectedTestCase.description || 'No description available'}</p>
            </div>

            <div className="detail-section">
              <h4>Test Steps</h4>
              <ol className="test-steps">
                {Array.isArray(selectedTestCase.steps) ? (
                  selectedTestCase.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))
                ) : (
                  <li>No test steps available</li>
                )}
              </ol>
            </div>

            <div className="detail-section">
              <h4>Expected Result</h4>
              <p>{selectedTestCase.expectedResult || 'No expected result specified'}</p>
            </div>

            <div className="detail-section">
              <h4>Compliance Standards</h4>
              <div className="compliance-tags">
                {Array.isArray(selectedTestCase.compliance) ? (
                  selectedTestCase.compliance.map((standard, index) => (
                    <span key={index} className="compliance-tag">
                      {standard}
                    </span>
                  ))
                ) : (
                  <span className="compliance-tag">No compliance standards specified</span>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h4>Traceability</h4>
              <p>{selectedTestCase.traceability || 'No traceability information available'}</p>
            </div>
          </div>
        )}

        {modalType === 'edit' && selectedTestCase && (
          <div className="test-case-edit">
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  defaultValue={selectedTestCase.title || ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="3"
                  defaultValue={selectedTestCase.description || ''}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select id="priority" defaultValue={selectedTestCase.priority || 'Medium'}>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" defaultValue={selectedTestCase.status || 'Generated'}>
                    <option value="Generated">Generated</option>
                    <option value="In Review">In Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={closeModal}>
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {modalType === 'delete' && selectedTestCase && (
          <div className="delete-confirmation">
            <p>Are you sure you want to delete the test case <strong>{selectedTestCase.id || 'Unknown'}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TestCaseManager
