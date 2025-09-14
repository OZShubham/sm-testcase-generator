# Healthcare Test Case Generator

![Healthcare Test Case Generator](https://img.shields.io/badge/Healthcare-AI%20Testing-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.0-green)
![Material-UI](https://img.shields.io/badge/Material--UI-5.15.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

An AI-powered platform for automatically generating compliant test cases from healthcare software requirements. Built for medical device software validation and regulatory compliance.

## 🏥 Overview

The Healthcare Test Case Generator is a sophisticated React-based application that leverages Google Cloud AI technologies to transform healthcare software requirements into comprehensive, compliant test cases. Designed specifically for medical device software testing, it ensures adherence to critical healthcare standards like IEC 62304, FDA 21 CFR Part 820, and ISO 13485.

### 🎯 Key Features

- **🤖 AI-Powered Test Generation**: Automatic test case creation using Google Vertex AI and Gemini models
- **💬 Intelligent Chat Assistant**: Healthcare-specific AI assistant for test case refinement and compliance guidance
- **🔒 Regulatory Compliance**: Built-in validation for IEC 62304, FDA, ISO 13485, ISO 27001, and HIPAA standards
- **👥 Real-time Collaboration**: Multi-user editing with WebSocket-based synchronization
- **📄 Multi-Format Support**: Process PDF, Word, and text requirement documents
- **🔗 ALM Integration**: Export to Jira, Polarion, and Azure DevOps
- **📊 Compliance Dashboard**: Real-time compliance monitoring and reporting
- **🎨 Healthcare-Optimized UI**: Clean, professional interface designed for medical professionals

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
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Google Cloud Project** (for AI services)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/healthcare-testgen.git
cd healthcare-testgen
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
```

4. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

5. **Start development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WEBSOCKET_URL=http://localhost:8000

# Google Cloud Configuration
VITE_GOOGLE_CLOUD_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Optional: Development Settings
VITE_DEBUG_MODE=true
VITE_MOCK_API=true
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

2. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Add your project
   - Enable Authentication, Firestore, and Storage
   - Get your Firebase configuration

3. **Configure Vertex AI**
   - Enable Vertex AI in your Google Cloud project
   - Set up authentication (Service Account recommended)
   - Configure Gemini model access

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and concurrent features
- **Vite 5.0.0** - Fast build tool and development server
- **Material-UI 5.15.0** - Comprehensive React component library
- **React Router 6.18.0** - Client-side routing
- **Axios 1.6.0** - HTTP client for API requests

### Real-time Features
- **Socket.io Client 4.7.2** - WebSocket communication
- **React Hot Toast** - Beautiful notifications

### File Processing
- **React Dropzone 14.2.3** - Drag and drop file uploads
- **Date-fns 2.30.0** - Date manipulation utilities

### Development Tools
- **ESLint** - Code linting
- **Vite Plugin React** - React integration for Vite

## 📱 Usage Guide

### 1. Individual Workflow (Primary)

#### Document Upload
1. Navigate to **Upload Requirements** page
2. Drag and drop or select healthcare requirement documents
3. Choose **IEC 62304 Device Class** (A, B, or C)
4. Select **Compliance Standards**
5. Click **Generate Test Cases**

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
1. Multiple users can edit test cases simultaneously
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
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing (when implemented)
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report
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

### Backend Requirements

The frontend expects a backend API with the following endpoints:

```javascript
// Document Management
POST   /api/documents/upload        # Upload document
GET    /api/documents              # Get all documents
GET    /api/documents/:id          # Get specific document
DELETE /api/documents/:id          # Delete document

// Test Case Management
POST   /api/testcases/generate     # Generate test cases from document
GET    /api/testcases              # Get all test cases
POST   /api/testcases              # Create test case
PUT    /api/testcases/:id          # Update test case
DELETE /api/testcases/:id          # Delete test case

// AI Chat
POST   /api/chat/message           # Send chat message
GET    /api/chat/history/:sessionId # Get chat history

// Compliance
POST   /api/compliance/check       # Check compliance
GET    /api/compliance/report/:projectId # Get compliance report

// Export
POST   /api/export                 # Export test cases
POST   /api/export/jira            # Send to Jira
```

### WebSocket Events

```javascript
// Client to Server
'join-project'        # Join collaboration room
'leave-project'       # Leave collaboration room
'start-editing'       # Start editing test case
'stop-editing'        # Stop editing test case
'test-case-change'    # Broadcast test case changes
'chat-message'        # Send chat message

// Server to Client
'users-updated'       # User presence updates
'user-editing'        # User started editing
'user-stopped-editing' # User stopped editing
'test-case-updated'   # Test case was updated
'collaboration-chat'  # Chat message received
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Coverage report
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
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment Options

#### 1. Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

#### 2. Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### 3. Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### 4. Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Configuration

#### Production Environment Variables
```env
# Production API URLs
VITE_API_BASE_URL=https://your-api.healthcare-testgen.com/api
VITE_WEBSOCKET_URL=https://your-websocket.healthcare-testgen.com

# Google Cloud Production Configuration
VITE_GOOGLE_CLOUD_PROJECT_ID=healthcare-testgen-prod
VITE_FIREBASE_API_KEY=prod-api-key
VITE_FIREBASE_AUTH_DOMAIN=healthcare-testgen-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=healthcare-testgen-prod
VITE_FIREBASE_STORAGE_BUCKET=healthcare-testgen-prod.appspot.com

# Production Settings
VITE_DEBUG_MODE=false
VITE_MOCK_API=false
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
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Build Failures
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear Vite cache
npx vite --force
```

#### 3. WebSocket Connection Issues
- Check `VITE_WEBSOCKET_URL` in `.env`
- Ensure backend WebSocket server is running
- Check browser console for connection errors

#### 4. Google Cloud API Errors
- Verify API keys in `.env` file
- Check API quotas in Google Cloud Console
- Ensure required APIs are enabled

#### 5. File Upload Issues
- Check file size limits (10MB default)
- Verify supported file types (PDF, DOCX, TXT)
- Check browser console for errors

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
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

#### Code Splitting
- Lazy load pages with `React.lazy()`
- Use dynamic imports for large components
- Optimize images and assets

#### Memory Management
- Clean up event listeners in `useEffect`
- Dispose of WebSocket connections
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
- Use ESLint configuration provided
- Follow React best practices
- Write meaningful commit messages
- Include JSDoc comments for functions
- Maintain consistent naming conventions

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
- **GitHub Discussions**: [Link to discussions]
- **Discord Community**: [Link to Discord]
- **Stack Overflow**: Tag with `healthcare-testgen`

### Professional Support
- **Email**: support@healthcare-testgen.com
- **Documentation**: [Link to detailed docs]
- **Training**: [Link to training resources]

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
![GitHub Stars](https://img.shields.io/github/stars/your-username/healthcare-testgen)
![GitHub Forks](https://img.shields.io/github/forks/your-username/healthcare-testgen)
![GitHub Issues](https://img.shields.io/github/issues/your-username/healthcare-testgen)
![GitHub PR](https://img.shields.io/github/issues-pr/your-username/healthcare-testgen)
![Contributors](https://img.shields.io/github/contributors/your-username/healthcare-testgen)