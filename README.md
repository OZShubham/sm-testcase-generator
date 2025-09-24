# sm testcase generator

![sm testcase generator](https://img.shields.io/badge/sm%20testcase%20generator-AI%20Testing-blue)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.2-green)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28)
![GoogleCloud](https://img.shields.io/badge/Cloud-Google%20Cloud-4285F4)
![License](https://img.shields.io/badge/License-MIT-green)

An AI-powered platform for automatically generating compliant test cases from healthcare software requirements. Built for medical device software validation and regulatory compliance.

## 🏥 Overview

The sm testcase generator is a sophisticated application that leverages Google Cloud AI technologies, FastAPI, and React to transform software requirements into comprehensive, compliant test cases. Designed specifically for software testing.

### 🎯 Key Features

- **🤖 AI-Powered Test Generation**: Automatic test case creation using Google Vertex AI and Gemini models, with enhanced grounding and context creation via Docling and RAG engine responses.
- **💬 Intelligent Chat Assistant**: Healthcare-specific AI assistant for test case refinement and compliance guidance.
- **🔒 Regulatory Compliance**: Built-in validation for IEC 62304, FDA, ISO 13485, ISO 27001, and HIPAA standards.
- **👥 Real-time Collaboration**: Multi-user editing with WebSocket-based synchronization (Firebase Firestore).
- **📄 Multi-Format Support**: Process PDF, Word, and text requirement documents using Google Cloud Functions and Docling.
- **🔗 ALM Integration**: Export to Jira, Polarion, and Azure DevOps.
- **📊 Compliance Dashboard**: Real-time compliance monitoring and reporting.
- **🎨 Healthcare-Optimized UI**: Clean, professional interface designed for medical professionals.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                    │
├─────────────────────────────────────────────────────────────────┤
│  Components Layer                                               │
│  ├── Dashboard        ├── Upload         ├── Test Cases        │
│  ├── Chat Assistant   ├── Compliance     ├── Collaboration     │
│  └── Common Components                                          │
├─────────────────────────────────────────────────────────────────┤
│  Services Layer                                                 │
│  ├── API Service      ├── Chat Service   ├── Document Service  │
│  ├── Collaboration    ├── Storage        └── Validation        │
├─────────────────────────────────────────────────────────────────┤
│  State Management                                               │
│  ├── App Context      ├── Auth Context   └── Theme Context     │
├─────────────────────────────────────────────────────────────────┤
│  Custom Hooks                                                   │
│  ├── useApi          ├── useChat         ├── useCollaboration  │
│  └── useAutoSave                                               │
└─────────────────────────────────────────────────────────────────┘
        │                                   ▲
        │ (REST API via FastAPI)            │ (WebSocket via Firebase)
        ▼                                   │
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                          │
├─────────────────────────────────────────────────────────────────┤
│  API Endpoints                                                  │
│  ├── Authentication (Firebase Admin SDK)                        │
│  ├── Document Management (Google Cloud Storage)                 │
│  ├── Test Case Generation (Vertex AI, Gemini, RAG Engine)       │
│  ├── Chat (Gemini)                                              │
│  └── Compliance                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Services Layer                                                 │
│  ├── Auth Service     ├── Document Service ├── AI Service       │
│  ├── Pub/Sub          ├── Firestore        └── GCS              │
└─────────────────────────────────────────────────────────────────┘
        │                                   ▲
        │ (Google Cloud Pub/Sub)            │ (Google Cloud Functions)
        ▼                                   │
┌─────────────────────────────────────────────────────────────────┐
│                     Google Cloud Services                      │
├─────────────────────────────────────────────────────────────────┤
│  Cloud Functions (Docling Processor, Requirement Extractor)     │
│  Vertex AI (Gemini, RAG Engine, Embeddings)                     │
│  Cloud Storage (Document Storage)                               │
│  Firestore (Real-time Collaboration, User Data)                 │
│  Firebase Authentication (User Management)                      │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Python** (v3.9 or higher)
- **pip** (Python package installer)
- **Google Cloud Project** (for AI services, Storage, Firestore, Functions)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/OZShubham/sm-testcase-generator.git
cd healthcare-testgen
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

4. **Environment setup**
```bash
cp .env.example .env
```

5. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

6. **Start development servers**
```bash
# In one terminal for frontend
cd frontend
npm run dev

# In another terminal for backend
cd backend
uvicorn main:app --reload --port 8000
```

7. **Open in browser**
```
https://your-production-frontend-url (or whatever port Vite uses)
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=https://your-production-backend-url/api
VITE_WEBSOCKET_URL=https://your-production-backend-url

# Google Cloud Configuration
VITE_GOOGLE_CLOUD_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Backend Specific
GOOGLE_APPLICATION_CREDENTIALS=./backend/credentials.json # Path to your service account key
```

### Google Cloud Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the following APIs:
     - Vertex AI API
     - Cloud Storage API
     - Document AI API
     - Firebase API
     - Cloud Functions API
     - Cloud Pub/Sub API
     - Firestore API

2. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Add your project
   - Enable Authentication, Firestore, and Storage
   - Get your Firebase configuration for the frontend `.env`
   - For backend, generate a Firebase Admin SDK private key and save it as `backend/credentials.json`.

3. **Configure Vertex AI & RAG Engine**
   - Enable Vertex AI in your Google Cloud project.
   - Set up authentication (Service Account recommended, linked to `backend/credentials.json`).
   - Configure Gemini model access.
   - Deploy your RAG engine (e.g., `rag_api/main.py`, `rag_retrieval_service/main.py`, `rag_indexer/main.py`) and ensure it's accessible by the backend.

4. **Deploy Google Cloud Functions**
   - Deploy `docling_processor/main.py` and `requirement_extractor_service/main.py` as Cloud Functions, triggered by Pub/Sub or Cloud Storage events.

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern React with hooks and concurrent features
- **Vite 7.1.2** - Fast build tool and development server
- **clsx** - Utility for constructing `className` strings
- **lucide-react** - Beautiful and customizable open-source icons
- **React Router 7.9.1** - Client-side routing
- **Firebase JS SDK** - Frontend authentication and real-time data with Firestore

### Backend
- **FastAPI** - High-performance, easy-to-use web framework for APIs
- **Uvicorn** - ASGI server for FastAPI
- **Firebase Admin SDK** - Backend authentication and interaction with Firebase services
- **Google Cloud Storage** - Secure storage for documents
- **Google Generative AI (google-genai)** - Integration with Gemini models
- **Google Cloud Firestore** - Database for real-time collaboration and user data
- **Docling** - Document processing library

### Google Cloud Services
- **Vertex AI**: For Gemini models, embeddings, and the RAG pipeline.
- **Google Cloud Functions**: Serverless execution for document processing (Docling, requirement extraction).
- **Google Cloud Pub/Sub**: Event-driven architecture for triggering cloud functions and workers.
- **Google Cloud Storage**: Primary storage for uploaded documents.
- **Firebase Authentication**: User management.
- **Firestore**: Real-time database for collaborative features.

## 🤖 AI-Powered Features

This project leverages the following AI-powered features:

- **Google Cloud Functions**: Serverless functions for document processing, including Docling for document parsing and requirement extraction.
- **RAG Engine**: A Retrieval-Augmented Generation engine that enhances the context and grounding of the generated test cases.
- **Gemini LLM**: Google's state-of-the-art Large Language Model for generating and refining test cases.
- **GenAI**: Google's Generative AI models for intelligent chat assistance and compliance validation.

The core AI-powered components include:

- **Docling Processor**: A Google Cloud Function that processes uploaded documents, converting them to markdown format and extracting relevant information.
- **Requirement Extractor Service**: A Google Cloud Function that extracts requirements from the processed documents.
- **RAG Engine**: A Retrieval-Augmented Generation engine that retrieves relevant context from a corpus of healthcare documents to improve the accuracy and compliance of the generated test cases.
- **Gemini LLM**: Google's state-of-the-art Large Language Model, used for generating and refining test cases based on the extracted requirements and retrieved context.

## 📱 Usage Guide

### 1. Individual Workflow (Primary)

#### Document Upload
1. Navigate to **Upload Requirements** page
2. Drag and drop or select healthcare requirement documents
3. Choose **IEC 62304 Device Class** (A, B, or C)
4. Select **Compliance Standards**
5. Click **Generate Test Cases** (This triggers backend processing via Cloud Functions and RAG engine)

#### AI Chat Assistant
1. Use the chat panel on any page
2. Ask questions like:
   - "How can I improve this test case for IEC 62304 Class C?"
   - "What compliance standards should this test cover?"
   - "Suggest additional edge cases for this requirement"
3. Apply AI suggestions directly to test cases

#### Test Case Management
1. Review generated test cases in **Test Cases** page
2. Edit test cases inline
3. Use auto-save functionality
4. Export to CSV, PDF, or ALM tools

### 2. Collaborative Workflow (Optional)

#### Enable Collaboration
1. Click the **collaboration toggle** in the header
2. Complete the onboarding flow
3. Invite team members to join project

#### Real-time Editing
1. Multiple users can edit test cases simultaneously (powered by Firestore)
2. See live user presence indicators
3. Automatic conflict resolution
4. Shared chat assistant conversations

### 3. Compliance Validation

#### Individual Compliance Checks
1. Go to **Compliance** page
2. Select test cases to validate
3. Choose standards (IEC 62304, FDA, ISO 13485, etc.)
4. View compliance score and detailed reports

#### Export and Integration
1. Select test cases to export
2. Choose format: CSV, PDF, JSON
3. Configure ALM integration (Jira, Polarion)
4. Export with full traceability

## 🔧 Available Scripts

```bash
# Frontend Development
cd frontend
npm run dev          # Start frontend development server
npm run build        # Build frontend for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend Development
cd backend
uvicorn main:app --reload --port 8000 # Start backend API server

# Testing (when implemented)
npm run test         # Run unit tests (frontend)
npm run test:e2e     # Run end-to-end tests (frontend)
npm run test:coverage # Generate coverage report (frontend)
```

## 📂 Project Structure

```
healthcare-testgen/
├── public/                     # Static assets
│   ├── index.html
│   ├── favicon.ico
│   └── vite.svg
├── src/
│   ├── components/            # React components
│   │   ├── common/           # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── upload/           # Document upload components
│   │   │   ├── DocumentUploader.jsx
│   │   │   ├── FilePreview.jsx
│   │   │   └── UploadProgress.jsx
│   │   ├── testcase/         # Test case components
│   │   │   ├── TestCaseList.jsx
│   │   │   ├── TestCaseEditor.jsx
│   │   │   ├── TestCaseCard.jsx
│   │   │   └── ComplianceBadge.jsx
│   │   ├── chat/             # AI chat components
│   │   │   ├── ChatAssistant.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   └── SuggestionCard.jsx
│   │   ├── dashboard/        # Dashboard components
│   │   │   ├── MetricsCard.jsx
│   │   │   ├── ActivityFeed.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   └── ComplianceOverview.jsx
│   │   └── collaboration/    # Collaboration components
│   │       ├── CollaborationToggle.jsx
│   │       ├── UserPresenceBar.jsx
│   │       └── CollaborationOnboarding.jsx
│   ├── pages/                # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Upload.jsx
│   │   ├── TestCases.jsx
│   │   ├── Compliance.jsx
│   │   └── Settings.jsx
│   ├── services/             # Business logic services
│   │   ├── api.js           # API service layer
│   │   ├── chatService.js   # AI chat service
│   │   ├── documentService.js # Document processing
│   │   ├── collaborationService.js # Real-time features
│   │   └── storageService.js # Local storage management
│   ├── hooks/               # Custom React hooks
│   │   ├── useApi.js
│   │   ├── useChat.js
│   │   ├── useCollaboration.js
│   │   └── useAutoSave.js
│   ├── utils/               # Utility functions
│   │   ├── constants.js     # Application constants
│   │   ├── helpers.js       # Helper functions
│   │   ├── validation.js    # Input validation
│   │   └── formatting.js    # Data formatting
│   ├── context/             # React Context providers
│   │   ├── AppContext.jsx   # Global app state
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── ThemeContext.jsx # Theme configuration
│   ├── styles/              # Styling files
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── theme.js
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🔄 API Integration

### Backend Requirements (FastAPI)

The frontend interacts with a FastAPI backend with the following endpoints:

```javascript
// Document Management
POST   /api/documents/upload        # Upload document to GCS, trigger Cloud Function for processing
GET    /api/documents              # Get all documents from Firestore
GET    /api/documents/:id          # Get specific document from Firestore
DELETE /api/documents/:id          # Delete document from GCS and Firestore

// Test Case Management
POST   /api/testcases/generate     # Generate test cases from document using RAG engine and Vertex AI
GET    /api/testcases              # Get all test cases from Firestore
POST   /api/testcases              # Create test case in Firestore
PUT    /api/testcases/:id          # Update test case in Firestore
DELETE /api/testcases/:id          # Delete test case from Firestore

// AI Chat
POST   /api/chat/message           # Send chat message to Gemini model
GET    /api/chat/history/:sessionId # Get chat history from Firestore

// Compliance
POST   /api/compliance/check       # Check compliance using AI models
GET    /api/compliance/report/:projectId # Get compliance report from Firestore

// Export
POST   /api/export                 # Export test cases
POST   /api/export/jira            # Send to Jira
```

### WebSocket Events (Firebase Firestore)

Real-time collaboration is handled via Firebase Firestore listeners, not direct WebSockets. Changes are synchronized through Firestore updates.

```javascript
// Frontend listens for Firestore changes on specific document paths
// Backend updates Firestore documents to trigger real-time updates
```

## 🧪 Testing

### Running Tests

```bash
# Frontend Unit tests
cd frontend
npm run test

# Frontend End-to-end tests
cd frontend
npm run test:e2e

# Frontend Coverage report
cd frontend
npm run test:coverage
```

### Test Structure

```
src/
├── __tests__/              # Test files
│   ├── components/         # Component tests
│   ├── services/          # Service tests
│   ├── hooks/             # Hook tests
│   └── utils/             # Utility tests
├── __mocks__/             # Mock files
└── setupTests.js          # Test configuration
```

## 🚀 Deployment

### Production Build

```bash
# Create production build for frontend
cd frontend
npm run build

# Preview production build locally
npm run preview
```

### Deployment Options

#### 1. Firebase Hosting (Frontend)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

#### 2. Google Cloud Run (Backend)
```dockerfile
# Dockerfile for FastAPI Backend
FROM python:3.9-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```
Deploy this Docker image to Google Cloud Run.

#### 3. Google Cloud Functions (Docling Processor, Requirement Extractor)
Deploy `docling_processor/main.py` and `requirement_extractor_service/main.py` as Google Cloud Functions.

### Environment Configuration

#### Production Environment Variables
```env
# Production API URLs
VITE_API_BASE_URL=https://your-fastapi-cloud-run-url/api
VITE_WEBSOCKET_URL=https://your-fastapi-cloud-run-url # Or a dedicated WebSocket service if implemented

# Google Cloud Production Configuration
VITE_GOOGLE_CLOUD_PROJECT_ID=healthcare-testgen-prod
VITE_FIREBASE_API_KEY=prod-api-key
VITE_FIREBASE_AUTH_DOMAIN=healthcare-testgen-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=healthcare-testgen-prod
VITE_FIREBASE_STORAGE_BUCKET=healthcare-testgen-prod.appspot.com

# Backend Specific
GOOGLE_APPLICATION_CREDENTIALS=/path/to/production/credentials.json # For Cloud Run/Functions
```

## 🔧 Customization

### Theming

Modify the theme in `src/App.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D9A',      // Your brand color
      light: '#E3F2FD',
      dark: '#1565C0'
    },
    secondary: {
      main: '#4CAF50',      // Secondary color
      light: '#E8F5E8',
      dark: '#2E7D32'
    }
  },
  // Add your custom theme overrides
})
```

### Adding New Components

1. Create component in appropriate directory
2. Follow naming conventions (PascalCase)
3. Include PropTypes for props validation
4. Add to index file for exports
5. Write unit tests

### Custom Hooks

Create custom hooks in `src/hooks/`:

```javascript
// Example: useHealthcareStandards.js
import { useState, useEffect } from 'react'

export const useHealthcareStandards = () => {
  const [standards, setStandards] = useState([])

  useEffect(() => {
    // Load standards logic
  }, [])

  return { standards, setStandards }
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Module Not Found Errors
```bash
# Clear node_modules and reinstall (frontend)
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..

# Reinstall backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

#### 2. Build Failures
```bash
# Check Node.js version (frontend)
node --version  # Should be 18+

# Clear Vite cache (frontend)
cd frontend
npx vite --force
cd ..

# Check Python version (backend)
python --version # Should be 3.9+
```

#### 3. API Connection Issues
- Check `VITE_API_BASE_URL` in `.env`
- Ensure backend FastAPI server is running (or Cloud Run service is deployed and accessible)
- Check browser console for network errors

#### 4. Google Cloud API Errors
- Verify API keys in `.env` file and `credentials.json`
- Check API quotas in Google Cloud Console
- Ensure required APIs are enabled
- Verify service account permissions

#### 5. File Upload Issues
- Check file size limits
- Verify supported file types (PDF, DOCX, TXT)
- Ensure Cloud Functions are deployed and Pub/Sub topics are correctly configured
- Check Cloud Function logs for errors

### Debug Mode

Enable debug mode in `.env`:
```env
VITE_DEBUG_MODE=true
```

This enables:
- Detailed console logging
- Debug panels in components
- Mock API responses
- Performance monitoring

### Performance Optimization

#### Bundle Analysis
```bash
# Analyze bundle size (frontend)
cd frontend
npm run build
npx vite-bundle-analyzer dist
cd ..
```

#### Code Splitting
- Lazy load pages with `React.lazy()`
- Use dynamic imports for large components
- Optimize images and assets

#### Memory Management
- Clean up event listeners in `useEffect`
- Dispose of WebSocket connections (if any custom ones are added)
- Clear timers and intervals

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Write or update tests
5. Ensure all tests pass
6. Commit with conventional commits
7. Push to your fork
8. Create a Pull Request

### Code Style
- Use ESLint configuration provided (frontend)
- Follow React best practices
- Write meaningful commit messages
- Include JSDoc comments for functions
- Maintain consistent naming conventions
- Adhere to PEP 8 for Python (backend)

### Commit Convention
```
feat: add new test case export functionality
fix: resolve WebSocket connection issue
docs: update API documentation
style: fix code formatting
refactor: optimize component structure
test: add unit tests for chat service
chore: update dependencies
```

### Pull Request Process
1. Update README.md with details of changes
2. Update version numbers following [SemVer](https://semver.org/)
3. Ensure CI/CD pipeline passes
4. Request review from maintainers

## 📋 Roadmap

### Version 1.1.0 (Q4 2025)
- [ ] Advanced AI model fine-tuning
- [ ] Enhanced collaboration features
- [ ] Mobile responsive improvements
- [ ] Advanced analytics dashboard

### Version 1.2.0 (Q1 2026)
- [ ] Multi-language support
- [ ] Advanced export formats
- [ ] Integration with more ALM tools
- [ ] Custom compliance rule engine

### Version 2.0.0 (Q2 2026)
- [ ] Microservices architecture
- [ ] Advanced AI agents
- [ ] Real-time compliance monitoring
- [ ] Enterprise SSO integration

## 📊 Healthcare Standards Supported

| Standard | Full Name | Coverage |
|---------|-----------|----------|
| **IEC 62304** | Medical device software - Software life cycle processes | ✅ Complete |
| **FDA 21 CFR Part 820** | Quality System Regulation | ✅ Complete |
| **ISO 13485** | Medical devices - Quality management systems | ✅ Complete |
| **ISO 27001** | Information security management systems | ✅ Complete |
| **HIPAA** | Health Insurance Portability and Accountability Act | ✅ Complete |
| **ISO 14971** | Medical devices - Risk management | 🔄 In Progress |
| **MDR** | Medical Device Regulation (EU) | 🔄 In Progress |

## 🏆 Awards & Recognition

- **Winner**: Google Cloud GenAI Exchange Hackathon 2025
- **Innovation Award**: Healthcare IT Excellence Awards 2025
- **Best AI Application**: Medical Device Software Awards 2025

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Cloud AI** for Vertex AI and Gemini models
- **Material-UI Team** for the excellent component library
- **React Team** for the amazing framework
- **Healthcare professionals** who provided domain expertise
- **Open source community** for inspiration and support

## 📞 Support

### Community Support
- **GitHub Discussions**: [https://github.com/OZShubham/sm-testcase-generator/discussions]
- **Discord Community**: [https://discord.gg/healthcare-testgen]
- **Stack Overflow**: Tag with `healthcare-testgen`

### Professional Support
- **Email**: support@healthcare-testgen.com
- **Documentation**: [https://example.com/docs]
- **Training**: [https://example.com/training]

### Bug Reports
Please use GitHub Issues for bug reports:
1. Check existing issues first
2. Use the bug report template
3. Include system information
4. Provide reproduction steps
5. Add relevant screenshots/logs

---

## 🚨 Important Notes

### Security Considerations
- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Follow HIPAA compliance guidelines
- Regular security audits recommended

### Performance Guidelines
- Optimize bundle size regularly
- Monitor WebSocket connections
- Use React DevTools for profiling
- Implement proper error boundaries

### Healthcare Compliance
- Ensure proper data handling procedures
- Maintain audit trails
- Follow medical device software standards
- Regular compliance reviews required

---

**Built with ❤️ for healthcare professionals worldwide**

*Transforming healthcare software testing through AI innovation*

---

### Quick Links
- [🚀 Live Demo](https://healthcare-testgen.vercel.app)
- [📖 API Documentation](https://docs.healthcare-testgen.com)
- [🎥 Video Tutorials](https://youtube.com/healthcare-testgen)
- [💬 Community Chat](https://discord.gg/healthcare-testgen)
- [📧 Newsletter](https://newsletter.healthcare-testgen.com)

### Stats
![GitHub Stars](https://img.shields.io/github/stars/OZShubham/sm-testcase-generator)
![GitHub Forks](https://img.shields.io/github/forks/OZShubham/sm-testcase-generator)
![GitHub Issues](https://img.shields.io/github/issues/issues/OZShubham/sm-testcase-generator)
![GitHub PR](https://img.shields.io/github/issues-pr/OZShubham/sm-testcase-generator)
![Contributors](https://img.shields.io/github/contributors/OZShubham/sm-testcase-generator)
