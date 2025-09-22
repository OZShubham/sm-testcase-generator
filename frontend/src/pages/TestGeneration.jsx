// import React, { useState, useCallback, useMemo } from 'react'
// import { useAppContext } from '../context/AppContext' // Corrected import path
// import { documentApi } from '../utils/api' // Import documentApi
// import { ChevronRight, CheckCircle, Clock, Wand2, FileText } from 'lucide-react'
// import Button from '../components/UI/Button'
// import Card from '../components/UI/Card'
// import './TestGeneration.css'

// const TestGeneration = () => {
//   const { uploadedFiles = [], generationWizard, updateGenerationWizard, updateState } = useAppContext()
  
//   const { 
//     currentStep, 
//     selectedFile, 
//     generating, 
//     generatedTestCases, 
//     generationStats, 
//     generationConfig 
//   } = generationWizard || {}; // Provide a default empty object for generationWizard
//                                // in case it's undefined during initial render
//                                // (though it should be initialized in AppContext)
//   // Ensure generationConfig is always an object
//   const currentGenerationConfig = generationConfig || {
//     testTypes: ['functional', 'safety', 'compliance'],
//     priorities: ['Critical', 'High', 'Medium'],
//     standards: ['FDA 21 CFR 820', 'IEC 62304', 'ISO 13485']
//   };
  
//   // Ensure other generationWizard properties are safely accessed
//   const currentSelectedFile = selectedFile;
//   const currentGenerating = generating;
//   const currentGeneratedTestCases = generatedTestCases || [];
//   const currentGenerationStats = generationStats;
//   const currentCurrentStep = currentStep || 1; // Default to step 1 if undefined

//   const steps = [
//     { id: 1, title: 'Select Document', description: 'Choose healthcare document' },
//     { id: 2, title: 'Configure Generation', description: 'Set test parameters' },
//     { id: 3, title: 'AI Processing', description: 'Generate test cases' },
//     { id: 4, title: 'Review Results', description: 'Review and approve' }
//   ]

//   const handleFileSelect = useCallback((file) => {
//     updateGenerationWizard({ selectedFile: file });
//   }, [updateGenerationWizard])

//   const handleNext = useCallback(async () => {
//     if (currentStep < steps.length) {
//       updateGenerationWizard({ currentStep: currentStep + 1 });
      
//       if (currentStep === 2) {
//         updateGenerationWizard({ generating: true });
//         try {
//           const response = await documentApi.generateTestCases(selectedFile.id, generationConfig);
//           updateGenerationWizard({ generating: false });
          
//           if (response && Array.isArray(response.test_cases)) {
//             updateGenerationWizard({ 
//               tempGeneratedTestCases: response.test_cases,
//               generationStats: {
//                 generated: response.test_cases.length,
//                 complianceScore: 90, // Placeholder, ideally from backend
//                 criticalPriority: response.test_cases.filter(tc => tc.priority === 'Critical').length,
//                 processingTime: 'N/A' // Placeholder, ideally from backend
//               }
//             });
//             updateGenerationWizard({ currentStep: 4 });
//           } else {
//             console.error("Test case generation failed or returned unexpected format:", response);
//             updateGenerationWizard({ currentStep: 2 });
//             alert("Failed to generate test cases. Please try again.");
//           }
//         } catch (error) {
//           console.error("Error generating test cases:", error);
//           updateGenerationWizard({ generating: false, currentStep: 2 });
//           alert("An error occurred during test case generation. Please check console for details.");
//         }
//       }
//     }
//   }, [currentStep, steps.length, selectedFile, generationConfig, updateGenerationWizard])

//   const handleConfigChange = useCallback((type, value) => {
//     updateGenerationWizard(prev => ({
//       generationConfig: {
//         ...prev.generationConfig,
//         [type]: value
//       }
//     }));
//   }, [updateGenerationWizard])

//   const processedFiles = useMemo(() => {
//     return (uploadedFiles || []).filter(file => 
//       file.docling_status === 'Completed' && file.indexing_status === 'Completed'
//     );
//   }, [uploadedFiles]);

//   return (
//     <div className="test-generation fade-in">
//       <div className="test-generation__header">
//         <h1>AI Test Case Generation</h1>
//         <p>Generate comprehensive healthcare test cases using AI-powered analysis</p>
//       </div>

//       {/* Progress Steps */}
//       <Card className="test-generation__steps" padding="large">
//         <div className="generation-steps">
//           {steps.map((step, index) => (
//             <div key={step.id} className="generation-step">
//               <div className={`step-indicator ${currentStep >= step.id ? 'step-indicator--active' : ''}`}>
//                 {currentStep > step.id ? <CheckCircle size={20} /> : step.id}
//               </div>
//               <div className="step-content">
//                 <h3>{step.title}</h3>
//                 <p>{step.description}</p>
//               </div>
//               {index < steps.length - 1 && <ChevronRight className="step-arrow" />}
//             </div>
//           ))}
//         </div>
//       </Card>

//       {/* Step Content */}
//       <Card className="test-generation__content" padding="large">
//         {currentStep === 1 && (
//           <div className="step-panel">
//             <h2>Select Healthcare Document</h2>
//             <p>Choose a processed document to generate test cases from:</p>
            
//             {processedFiles.length === 0 ? (
//               <div className="empty-state">
//                 <FileText size={48} />
//                 <h3>No processed documents available</h3>
//                 <p>Please upload and process some documents first.</p>
//                 <Button variant="primary" onClick={() => window.location.href = '/upload'}>
//                   Upload Documents
//                 </Button>
//               </div>
//             ) : (
//               <div className="file-selection">
//                 {processedFiles.map((file) => (
//                   <div 
//                     key={file.id} 
//                     className={`file-option ${selectedFile?.id === file.id ? 'file-option--selected' : ''}`}
//                     onClick={() => handleFileSelect(file)}
//                   >
//                     <div className="file-option__content">
//                       <h4>{file.name}</h4>
//                       <div className="file-meta">
//                         <span>{file.size}</span>
//                         <span>•</span>
//                         <span>{file.type}</span>
//                         {file.complianceScore && (
//                           <>
//                             <span>•</span>
//                             <span>Compliance: {file.complianceScore}%</span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                     {selectedFile?.id === file.id && (
//                       <CheckCircle className="file-option__check" />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {currentStep === 2 && (
//           <div className="step-panel">
//             <h2>Configure Test Generation</h2>
//             <div className="config-form">
//               <div className="config-group">
//                 <label>Test Case Types</label>
//                 <div className="checkbox-group">
//                   {[
//                     { id: 'functional', label: 'Functional Testing' },
//                     { id: 'safety', label: 'Safety Testing' },
//                     { id: 'performance', label: 'Performance Testing' },
//                     { id: 'compliance', label: 'Compliance Testing' }
//                   ].map((type) => (
//                     <label key={type.id} className="checkbox-item">
//                       <input 
//                         type="checkbox" 
//                         checked={generationConfig.testTypes.includes(type.id)}
//                         onChange={(e) => {
//                           const types = e.target.checked 
//                             ? [...generationConfig.testTypes, type.id]
//                             : generationConfig.testTypes.filter(t => t !== type.id)
//                           handleConfigChange('testTypes', types)
//                         }}
//                       />
//                       <span>{type.label}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className="config-group">
//                 <label>Priority Levels</label>
//                 <div className="checkbox-group">
//                   {['Critical', 'High', 'Medium', 'Low'].map((priority) => (
//                     <label key={priority} className="checkbox-item">
//                       <input 
//                         type="checkbox" 
//                         checked={generationConfig.priorities.includes(priority)}
//                         onChange={(e) => {
//                           const priorities = e.target.checked 
//                             ? [...generationConfig.priorities, priority]
//                             : generationConfig.priorities.filter(p => p !== priority)
//                           handleConfigChange('priorities', priorities)
//                         }}
//                       />
//                       <span>{priority}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className="config-group">
//                 <label>Compliance Standards</label>
//                 <div className="checkbox-group">
//                   {[
//                     'FDA 21 CFR 820',
//                     'IEC 62304', 
//                     'ISO 13485',
//                     'ISO 27001'
//                   ].map((standard) => (
//                     <label key={standard} className="checkbox-item">
//                       <input 
//                         type="checkbox" 
//                         checked={generationConfig.standards.includes(standard)}
//                         onChange={(e) => {
//                           const standards = e.target.checked 
//                             ? [...generationConfig.standards, standard]
//                             : generationConfig.standards.filter(s => s !== standard)
//                           handleConfigChange('standards', standards)
//                         }}
//                       />
//                       <span>{standard}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {currentStep === 3 && (
//           <div className="step-panel">
//             <div className="processing-status">
//               <div className="processing-icon">
//                 {generating ? <Clock className="spin" size={48} /> : <CheckCircle size={48} />}
//               </div>
//               <h2>{generating ? 'AI Processing in Progress...' : 'Processing Complete!'}</h2>
//               <p>
//                 {generating 
//                   ? 'Our AI is analyzing your healthcare document and generating comprehensive test cases.'
//                   : 'Test cases have been successfully generated and are ready for review.'
//                 }
//               </p>
              
//               {generating && (
//                 <div className="processing-steps">
//                   <div className="processing-step active">
//                     <CheckCircle size={16} />
//                     <span>Document parsed and analyzed</span>
//                   </div>
//                   <div className="processing-step active">
//                     <CheckCircle size={16} />
//                     <span>Requirements extracted</span>
//                   </div>
//                   <div className="processing-step processing">
//                     <Clock size={16} className="spin" />
//                     <span>Generating test cases...</span>
//                   </div>
//                   <div className="processing-step">
//                     <Clock size={16} />
//                     <span>Compliance mapping</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {currentStep === 4 && (
//           <div className="step-panel">
//             <div className="results-summary">
//               <h2>Test Cases Generated Successfully! 🎉</h2>
              
//               {generationStats && (
//                 <div className="summary-stats">
//                   <div className="summary-stat">
//                     <span className="stat-value">{generationStats.generated}</span>
//                     <span className="stat-label">Test Cases Generated</span>
//                   </div>
//                   <div className="summary-stat">
//                     <span className="stat-value">{generationStats.complianceScore}%</span>
//                     <span className="stat-label">Compliance Score</span>
//                   </div>
//                   <div className="summary-stat">
//                     <span className="stat-value">{generationStats.criticalPriority}</span>
//                     <span className="stat-label">Critical Priority</span>
//                   </div>
//                   <div className="summary-stat">
//                     <span className="stat-value">{generationStats.processingTime}</span>
//                     <span className="stat-label">Processing Time</span>
//                   </div>
//                 </div>
//               )}

//               <div className="results-breakdown">
//                 <h3>Generated Test Cases:</h3>
//                 <div className="breakdown-items">
//                   {generatedTestCases.length > 0 ? (
//                     generatedTestCases.map((testCase) => (
//                       <div key={testCase.id} className="breakdown-item">
//                         <h4>{testCase.title} ({testCase.priority})</h4>
//                         <p>{testCase.description}</p>
//                         {testCase.compliance && testCase.compliance.length > 0 && (
//                           <p>Compliance: {testCase.compliance.join(', ')}</p>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <p>No detailed test cases to display.</p>
//                   )}
//                 </div>
//               </div>

//               <p>Your test cases are ready for review! You can now manage them in the Test Case Manager.</p>
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* Action Buttons */}
//       <div className="test-generation__actions">
//         {currentStep === 1 && (processedFiles && processedFiles.length > 0) && (
//           <Button 
//             variant="primary"
//             onClick={handleNext}
//             disabled={!selectedFile}
//             icon={ChevronRight}
//             iconPosition="right"
//           >
//             Continue
//           </Button>
//         )}
        
//         {currentStep === 2 && (
//           <Button 
//             variant="primary"
//             onClick={handleNext}
//             icon={Wand2}
//           >
//             Generate Test Cases
//           </Button>
//         )}
        
//         {currentStep === 4 && (
//           <Button 
//             variant="primary"
//             onClick={() => {
//               // Trigger a refresh of documents and test cases in AppContext
//               refreshDocumentsAndTestCases(); 
//               window.location.href = '/test-cases'; 
//             }}
//             icon={ChevronRight}
//             iconPosition="right"
//           >
//             View Test Cases
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }

// export default TestGeneration



import React, { useState, useCallback, useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { documentApi } from '../utils/api'
import { ChevronRight, CheckCircle, Clock, Wand2, FileText } from 'lucide-react'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import './TestGeneration.css'

const TestGeneration = () => {
  const context = useAppContext()
  
  // Add early return if context is not available
  if (!context) {
    return (
      <div className="test-generation fade-in">
        <div className="test-generation__header">
          <h1>Loading...</h1>
          <p>Initializing application context...</p>
        </div>
      </div>
    )
  }
  
  // More defensive destructuring
  const uploadedFiles = context?.uploadedFiles || []
  const generationWizard = context?.generationWizard || {}
  const updateGenerationWizard = context?.updateGenerationWizard
  const updateState = context?.updateState
  const refreshDocumentsAndTestCases = context?.refreshDocumentsAndTestCases
  
  // Safely destructure with fallback values
  const { 
    currentStep = 1, 
    selectedFile = null, 
    generating = false, 
    generatedTestCases = [], 
    tempGeneratedTestCases = [],
    generationStats = null, 
    generationConfig = {
      testTypes: ['functional', 'safety', 'compliance'],
      priorities: ['Critical', 'High', 'Medium'],
      standards: ['FDA 21 CFR 820', 'IEC 62304', 'ISO 13485']
    }
  } = generationWizard || {}

  const steps = [
    { id: 1, title: 'Select Document', description: 'Choose healthcare document' },
    { id: 2, title: 'Configure Generation', description: 'Set test parameters' },
    { id: 3, title: 'AI Processing', description: 'Generate test cases' },
    { id: 4, title: 'Review Results', description: 'Review and approve' }
  ]

  const handleFileSelect = useCallback((file) => {
    if (updateGenerationWizard) {
      updateGenerationWizard({ selectedFile: file })
    }
  }, [updateGenerationWizard])

  const handleNext = useCallback(async () => {
    console.log('handleNext called with currentStep:', currentStep)
    console.log('selectedFile:', selectedFile)
    console.log('generationConfig:', generationConfig)
    console.log('updateGenerationWizard available:', !!updateGenerationWizard)
    
    if (!updateGenerationWizard) {
      console.error('updateGenerationWizard function not available')
      return
    }

    if (currentStep < steps.length) {
      updateGenerationWizard({ currentStep: currentStep + 1 })
      
      if (currentStep === 2) {
        if (!selectedFile || !selectedFile.id) {
          console.error('No file selected or file missing ID')
          alert('Please select a file first')
          updateGenerationWizard({ currentStep: 2 })
          return
        }
        
        updateGenerationWizard({ generating: true })
        try {
          console.log('Calling documentApi.generateTestCases with:', selectedFile.id, generationConfig)
          const response = await documentApi.generateTestCases(selectedFile.id, generationConfig)
          console.log('API Response:', response)
          
          updateGenerationWizard({ generating: false })
          
          if (response && Array.isArray(response.test_cases)) {
            console.log('Test cases received:', response.test_cases.length)
            updateGenerationWizard({ 
              tempGeneratedTestCases: response.test_cases,
              generationStats: {
                generated: response.test_cases.length,
                complianceScore: 90,
                criticalPriority: response.test_cases.filter(tc => tc && tc.priority === 'Critical').length,
                processingTime: 'N/A'
              }
            })
            updateGenerationWizard({ currentStep: 4 })
          } else {
            console.error("Test case generation failed or returned unexpected format:", response)
            updateGenerationWizard({ currentStep: 2 })
            alert("Failed to generate test cases. Please try again.")
          }
        } catch (error) {
          console.error("Error generating test cases:", error)
          updateGenerationWizard({ generating: false, currentStep: 2 })
          alert(`An error occurred during test case generation: ${error.message}`)
        }
      }
    }
  }, [currentStep, steps.length, selectedFile, generationConfig, updateGenerationWizard])

  const handleConfigChange = useCallback((type, value) => {
    if (updateGenerationWizard) {
      updateGenerationWizard(prev => ({
        generationConfig: {
          ...prev.generationConfig,
          [type]: value
        }
      }))
    }
  }, [updateGenerationWizard])

  const processedFiles = useMemo(() => {
    console.log('processedFiles calculation - uploadedFiles:', uploadedFiles)
    console.log('uploadedFiles type:', typeof uploadedFiles)
    console.log('uploadedFiles isArray:', Array.isArray(uploadedFiles))
    
    if (!Array.isArray(uploadedFiles)) {
      console.warn('uploadedFiles is not an array:', uploadedFiles)
      return []
    }
    
    const filtered = uploadedFiles.filter(file => {
      if (!file) {
        console.warn('Found null/undefined file in uploadedFiles')
        return false
      }
      console.log(`File ${file.id}: docling_status=${file.docling_status}, indexing_status=${file.indexing_status}`)
      return file.docling_status === 'Completed' && file.indexing_status === 'Completed'
    })
    
    console.log('Processed files count:', filtered.length)
    return filtered
  }, [uploadedFiles])

  // Use tempGeneratedTestCases for display if available, otherwise use generatedTestCases
  const displayTestCases = tempGeneratedTestCases.length > 0 ? tempGeneratedTestCases : generatedTestCases

  return (
    <div className="test-generation fade-in">
      <div className="test-generation__header">
        <h1>AI Test Case Generation</h1>
        <p>Generate comprehensive healthcare test cases using AI-powered analysis</p>
      </div>

      {/* Progress Steps */}
      <Card className="test-generation__steps" padding="large">
        <div className="generation-steps">
          {steps.map((step, index) => (
            <div key={step.id} className="generation-step">
              <div className={`step-indicator ${currentStep >= step.id ? 'step-indicator--active' : ''}`}>
                {currentStep > step.id ? <CheckCircle size={20} /> : step.id}
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && <ChevronRight className="step-arrow" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="test-generation__content" padding="large">
        {currentStep === 1 && (
          <div className="step-panel">
            <h2>Select Healthcare Document</h2>
            <p>Choose a processed document to generate test cases from:</p>
            
            {processedFiles.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} />
                <h3>No processed documents available</h3>
                <p>Please upload and process some documents first.</p>
                <Button variant="primary" onClick={() => window.location.href = '/upload'}>
                  Upload Documents
                </Button>
              </div>
            ) : (
              <div className="file-selection">
                {processedFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className={`file-option ${selectedFile?.id === file.id ? 'file-option--selected' : ''}`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <div className="file-option__content">
                      <h4>{file.name}</h4>
                      <div className="file-meta">
                        <span>{file.size || 'Unknown size'}</span>
                        <span>•</span>
                        <span>{file.type || 'Unknown type'}</span>
                        {file.complianceScore && (
                          <>
                            <span>•</span>
                            <span>Compliance: {file.complianceScore}%</span>
                          </>
                        )}
                      </div>
                    </div>
                    {selectedFile?.id === file.id && (
                      <CheckCircle className="file-option__check" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-panel">
            <h2>Configure Test Generation</h2>
            <div className="config-form">
              <div className="config-group">
                <label>Test Case Types</label>
                <div className="checkbox-group">
                  {[
                    { id: 'functional', label: 'Functional Testing' },
                    { id: 'safety', label: 'Safety Testing' },
                    { id: 'performance', label: 'Performance Testing' },
                    { id: 'compliance', label: 'Compliance Testing' }
                  ].map((type) => (
                    <label key={type.id} className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={generationConfig.testTypes?.includes(type.id) || false}
                        onChange={(e) => {
                          const currentTypes = generationConfig.testTypes || []
                          const types = e.target.checked 
                            ? [...currentTypes, type.id]
                            : currentTypes.filter(t => t !== type.id)
                          handleConfigChange('testTypes', types)
                        }}
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <label>Priority Levels</label>
                <div className="checkbox-group">
                  {['Critical', 'High', 'Medium', 'Low'].map((priority) => (
                    <label key={priority} className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={generationConfig.priorities?.includes(priority) || false}
                        onChange={(e) => {
                          const currentPriorities = generationConfig.priorities || []
                          const priorities = e.target.checked 
                            ? [...currentPriorities, priority]
                            : currentPriorities.filter(p => p !== priority)
                          handleConfigChange('priorities', priorities)
                        }}
                      />
                      <span>{priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <label>Compliance Standards</label>
                <div className="checkbox-group">
                  {[
                    'FDA 21 CFR 820',
                    'IEC 62304', 
                    'ISO 13485',
                    'ISO 27001'
                  ].map((standard) => (
                    <label key={standard} className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={generationConfig.standards?.includes(standard) || false}
                        onChange={(e) => {
                          const currentStandards = generationConfig.standards || []
                          const standards = e.target.checked 
                            ? [...currentStandards, standard]
                            : currentStandards.filter(s => s !== standard)
                          handleConfigChange('standards', standards)
                        }}
                      />
                      <span>{standard}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-panel">
            <div className="processing-status">
              <div className="processing-icon">
                {generating ? <Clock className="spin" size={48} /> : <CheckCircle size={48} />}
              </div>
              <h2>{generating ? 'AI Processing in Progress...' : 'Processing Complete!'}</h2>
              <p>
                {generating 
                  ? 'Our AI is analyzing your healthcare document and generating comprehensive test cases.'
                  : 'Test cases have been successfully generated and are ready for review.'
                }
              </p>
              
              {generating && (
                <div className="processing-steps">
                  <div className="processing-step active">
                    <CheckCircle size={16} />
                    <span>Document parsed and analyzed</span>
                  </div>
                  <div className="processing-step active">
                    <CheckCircle size={16} />
                    <span>Requirements extracted</span>
                  </div>
                  <div className="processing-step processing">
                    <Clock size={16} className="spin" />
                    <span>Generating test cases...</span>
                  </div>
                  <div className="processing-step">
                    <Clock size={16} />
                    <span>Compliance mapping</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-panel">
            <div className="results-summary">
              <h2>Test Cases Generated Successfully!</h2>
              
              {generationStats && (
                <div className="summary-stats">
                  <div className="summary-stat">
                    <span className="stat-value">{generationStats.generated || 0}</span>
                    <span className="stat-label">Test Cases Generated</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-value">{generationStats.complianceScore || 0}%</span>
                    <span className="stat-label">Compliance Score</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-value">{generationStats.criticalPriority || 0}</span>
                    <span className="stat-label">Critical Priority</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-value">{generationStats.processingTime || 'N/A'}</span>
                    <span className="stat-label">Processing Time</span>
                  </div>
                </div>
              )}

              <div className="results-breakdown">
                <h3>Generated Test Cases:</h3>
                <div className="breakdown-items">
                  {displayTestCases.length > 0 ? (
                    displayTestCases.map((testCase) => (
                      <div key={testCase.id} className="breakdown-item">
                        <h4>{testCase.title} ({testCase.priority})</h4>
                        <p>{testCase.description}</p>
                        {testCase.compliance && Array.isArray(testCase.compliance) && testCase.compliance.length > 0 && (
                          <p>Compliance: {testCase.compliance.join(', ')}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No detailed test cases to display.</p>
                  )}
                </div>
              </div>

              <p>Your test cases are ready for review! You can now manage them in the Test Case Manager.</p>
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="test-generation__actions">
        {currentStep === 1 && processedFiles.length > 0 && (
          <Button 
            variant="primary"
            onClick={handleNext}
            disabled={!selectedFile}
            icon={ChevronRight}
            iconPosition="right"
          >
            Continue
          </Button>
        )}
        
        {currentStep === 2 && (
          <Button 
            variant="primary"
            onClick={handleNext}
            icon={Wand2}
          >
            Generate Test Cases
          </Button>
        )}
        
        {currentStep === 4 && (
          <Button 
            variant="primary"
            onClick={() => {
              if (refreshDocumentsAndTestCases) {
                refreshDocumentsAndTestCases()
              }
              window.location.href = '/test-cases'
            }}
            icon={ChevronRight}
            iconPosition="right"
          >
            View Test Cases
          </Button>
        )}
      </div>
    </div>
  )
}

export default TestGeneration