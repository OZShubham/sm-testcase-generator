export const mockData = {
  testCases: [
    {
      id: "TC-001",
      title: "Patient Data Validation for Insulin Pump",
      description: "Verify that patient data input validation works correctly for insulin pump configuration including weight, age, and medical history validation.",
      priority: "High",
      status: "Generated",
      compliance: ["FDA 21 CFR 820", "IEC 62304"],
      steps: [
        "Navigate to patient configuration screen",
        "Enter invalid patient weight (negative value)",
        "Attempt to save configuration",
        "Verify error message displays clearly",
        "Test with boundary values (0, max weight)",
        "Validate proper data formatting requirements"
      ],
      expectedResult: "System displays clear error message and prevents invalid data save with proper user guidance",
      traceability: "REQ-INS-001, REQ-VAL-003",
      createdAt: "2025-09-15T08:30:00Z",
      createdBy: "Dr. Sarah Johnson",
      estimatedTime: "30 minutes",
      riskLevel: "High"
    },
    {
      id: "TC-002", 
      title: "Emergency Stop Function Verification",
      description: "Test emergency stop functionality in medical device during critical operations to ensure patient safety compliance.",
      priority: "Critical",
      status: "Approved",
      compliance: ["IEC 62304", "ISO 13485"],
      steps: [
        "Start device operation in normal mode",
        "Trigger emergency stop button during operation",
        "Verify immediate cessation of all operations",
        "Check system state transition to safe mode",
        "Validate alarm notifications to medical staff",
        "Test system recovery procedures"
      ],
      expectedResult: "Device stops immediately and enters fail-safe state with proper notifications",
      traceability: "REQ-SAFE-001, REQ-EMRG-002",
      createdAt: "2025-09-15T07:15:00Z",
      createdBy: "Mike Chen",
      estimatedTime: "45 minutes",
      riskLevel: "Critical"
    },
    {
      id: "TC-003",
      title: "Audit Trail Generation Test",
      description: "Verify comprehensive audit trail creation for user actions to ensure regulatory compliance and traceability.",
      priority: "Medium", 
      status: "In Review",
      compliance: ["FDA 21 CFR 11", "ISO 27001"],
      steps: [
        "Perform user login with valid credentials",
        "Execute data modification operations",
        "Perform configuration changes",
        "Log out from system properly",
        "Review generated audit logs for completeness",
        "Validate timestamp accuracy and user attribution"
      ],
      expectedResult: "Complete audit trail with timestamps, user identification, and action details",
      traceability: "REQ-AUD-001, REQ-SEC-005",
      createdAt: "2025-09-14T16:45:00Z",
      createdBy: "Dr. Sarah Johnson",
      estimatedTime: "25 minutes",
      riskLevel: "Medium"
    },
    {
      id: "TC-004",
      title: "Data Encryption Validation",
      description: "Verify patient data is properly encrypted during transmission and storage according to HIPAA and GDPR requirements.",
      priority: "High",
      status: "Generated",
      compliance: ["HIPAA", "ISO 27001", "GDPR"],
      steps: [
        "Capture network traffic during data transmission",
        "Verify data encryption algorithms meet standards",
        "Check database storage encryption implementation",
        "Validate key management procedures",
        "Test encryption key rotation mechanisms",
        "Verify data integrity after encryption/decryption"
      ],
      expectedResult: "All patient data encrypted with AES-256 or higher with proper key management",
      traceability: "REQ-SEC-001, REQ-ENC-003",
      createdAt: "2025-09-14T14:20:00Z",
      createdBy: "Alex Kumar",
      estimatedTime: "60 minutes",
      riskLevel: "High"
    },
    {
      id: "TC-005",
      title: "Medical Device Interoperability Testing",
      description: "Test integration and data exchange between different medical devices in a healthcare network.",
      priority: "High",
      status: "Generated",
      compliance: ["HL7 FHIR", "IHE", "ISO 13485"],
      steps: [
        "Establish connection between devices",
        "Initiate data exchange protocol",
        "Verify data format compatibility",
        "Test error handling for communication failures",
        "Validate data integrity during transmission",
        "Confirm proper device synchronization"
      ],
      expectedResult: "Devices communicate successfully with accurate data exchange and proper error handling",
      traceability: "REQ-INT-001, REQ-COM-002",
      createdAt: "2025-09-14T11:30:00Z",
      createdBy: "Dr. Sarah Johnson",
      estimatedTime: "90 minutes",
      riskLevel: "High"
    },
    {
      id: "TC-006",
      title: "User Access Control Validation",
      description: "Verify role-based access control and user permission management in healthcare system.",
      priority: "Medium",
      status: "In Review",
      compliance: ["HIPAA", "ISO 27001"],
      steps: [
        "Create user accounts with different roles",
        "Attempt access with each role level",
        "Verify appropriate access restrictions",
        "Test privilege escalation prevention",
        "Validate audit logging of access attempts"
      ],
      expectedResult: "Users can only access features and data appropriate to their assigned roles",
      traceability: "REQ-SEC-010, REQ-ACC-001",
      createdAt: "2025-09-13T15:20:00Z",
      createdBy: "Alex Kumar",
      estimatedTime: "40 minutes",
      riskLevel: "Medium"
    }
  ],
  
  recentActivity: [
    {
      id: 1,
      action: "Generated 15 test cases",
      document: "Insulin Pump Requirements v2.3",
      time: "2 hours ago",
      user: "Dr. Sarah Johnson",
      type: "generation"
    },
    {
      id: 2,
      action: "Approved test cases",
      document: "Emergency Response Protocol",
      time: "4 hours ago", 
      user: "Mike Chen",
      type: "approval"
    },
    {
      id: 3,
      action: "Uploaded specification",
      document: "Patient Monitor BRD",
      time: "6 hours ago",
      user: "Dr. Sarah Johnson",
      type: "upload"
    },
    {
      id: 4,
      action: "Updated compliance mapping",
      document: "Cardiac Device Testing Suite",
      time: "8 hours ago",
      user: "Alex Kumar",
      type: "update"
    },
    {
      id: 5,
      action: "Exported test results",
      document: "Q3 Compliance Report",
      time: "1 day ago",
      user: "Mike Chen",
      type: "export"
    }
  ],
  
  complianceStats: {
    FDA: { 
      percentage: 92, 
      total: 45, 
      compliant: 41, 
      color: "#2563eb",
      description: "FDA 21 CFR Part 820 Quality System Regulation"
    },
    ISO13485: { 
      percentage: 88, 
      total: 38, 
      compliant: 33, 
      color: "#10b981",
      description: "Medical Device Quality Management Systems"
    },
    IEC62304: { 
      percentage: 95, 
      total: 42, 
      compliant: 40, 
      color: "#f59e0b",
      description: "Medical Device Software Lifecycle Processes"
    }
  },
  
  dashboardStats: {
    totalTests: 1247,
    testsThisMonth: 156,
    averageTime: "3.2 minutes",
    complianceRate: 92,
    passRate: 94,
    activeProjects: 8
  },
  
  uploadedFiles: [
    {
      id: "file-001",
      name: "Insulin_Pump_Requirements_v2.3.pdf",
      size: "2.4 MB",
      type: "PDF",
      uploadedAt: "2025-09-15T09:30:00Z",
      status: "Processed",
      testCasesGenerated: 15,
      complianceScore: 94
    },
    {
      id: "file-002", 
      name: "Emergency_Protocol_BRD.docx",
      size: "1.8 MB",
      type: "Word",
      uploadedAt: "2025-09-15T08:15:00Z",
      status: "Processing",
      progress: 67
    },
    {
      id: "file-003",
      name: "Cardiac_Monitor_Specifications.xml",
      size: "890 KB",
      type: "XML",
      uploadedAt: "2025-09-15T07:45:00Z",
      status: "Processed",
      testCasesGenerated: 23,
      complianceScore: 89
    },
    {
      id: "file-004",
      name: "Medical_Device_Requirements.pdf",
      size: "3.1 MB",
      type: "PDF",
      uploadedAt: "2025-09-14T16:20:00Z",
      status: "Processed",
      testCasesGenerated: 32,
      complianceScore: 91
    }
  ]
}
