import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { mockData } from '../utils/mockData';
import { documentApi } from '../utils/api'; // Import documentApi
import { useAuth } from '../utils/auth'; // Import useAuth

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); // Get user and isAuthenticated from useAuth

const [appState, setAppState] = useState({
    testCases: [], // Initialize as empty, will be populated from API
    recentActivity: mockData.recentActivity,
    complianceStats: mockData.complianceStats,
    dashboardStats: mockData.dashboardStats,
    uploadedFiles: [],
    notifications: 3,
    loading: false,
    selectedTestCase: null,
    currentWizardStep: 1,
    // New state for TestGeneration wizard retention
    generationWizard: {
      selectedFile: null,
      generationConfig: {
        testTypes: ['functional', 'safety', 'compliance'],
        priorities: ['Critical', 'High', 'Medium'],
        standards: ['FDA 21 CFR 820', 'IEC 62304', 'ISO 13485']
      },
      tempGeneratedTestCases: [], // For displaying results before full persistence
      currentStep: 1,
      generating: false,
      generationStats: null,
    }
  });

  const refreshDocumentsAndTestCases = useCallback(async () => {
    if (isAuthenticated && user?.uid) {
      try {
        setAppState(prev => ({ ...prev, loading: true }));
        const files = await documentApi.getUserJobs(user.uid);
        
        let allTestCases = [];
        files.forEach(file => {
          if (file.test_cases && Array.isArray(file.test_cases)) {
            allTestCases = [...allTestCases, ...file.test_cases];
          }
        });

        setAppState(prev => ({ 
          ...prev, 
          uploadedFiles: files, 
          testCases: allTestCases, 
          loading: false 
        }));
      } catch (error) {
        console.error("Failed to fetch uploaded files or test cases:", error);
        setAppState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setAppState(prev => ({ ...prev, uploadedFiles: [], testCases: [], loading: false }));
    }
  }, [isAuthenticated, user?.uid]);

  // Fetch uploaded files and associated test cases when the user is authenticated or a refresh is triggered
  useEffect(() => {
    refreshDocumentsAndTestCases();
  }, [isAuthenticated, user?.uid, refreshDocumentsAndTestCases]); // Re-run when auth status or user ID changes

  const updateState = useCallback((updater) => {
    setAppState(prev => {
      const newUpdates = typeof updater === 'function' ? updater(prev) : updater;
      return { ...prev, ...newUpdates };
    });
  }, []);

  // New update function for generationWizard state
  const updateGenerationWizard = useCallback((updater) => {
    setAppState(prev => ({
      ...prev,
      generationWizard: typeof updater === 'function' 
        ? updater(prev.generationWizard) 
        : { ...prev.generationWizard, ...updater }
    }));
  }, []);

  const contextValue = useMemo(() => ({
    ...appState,
    updateState,
    selectTestCase: (testCase) => updateState({ selectedTestCase: testCase }),
    clearSelectedTestCase: () => updateState({ selectedTestCase: null }),
    addTestCase: (testCase) => updateState(prev => ({ ...prev, testCases: [...prev.testCases, testCase] })),
    updateTestCase: (id, updates) => updateState(prev => ({ ...prev, testCases: prev.testCases.map(tc => tc.id === id ? { ...tc, ...updates } : tc) })),
    deleteTestCase: (id) => updateState(prev => ({ ...prev, testCases: prev.testCases.filter(tc => tc.id !== id) })),
    // Expose generation wizard state and updater
    generationWizard: appState.generationWizard,
    updateGenerationWizard,
    refreshDocumentsAndTestCases, // Expose the refresh function
  }), [appState, updateState, updateGenerationWizard, refreshDocumentsAndTestCases]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
