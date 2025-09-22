# HealthTest AI - Frontend

This directory contains the frontend code for the HealthTest AI application, a modern React 19 application for AI-powered healthcare test case generation with compliance tracking for medical devices.

## Project Structure

The frontend is structured to promote maintainability, scalability, and ease of development. Key directories and their purposes are outlined below:

* **`public`**: This directory contains static assets such as images, icons, and the application's favicon. These assets are served directly by the build process.

    * `images`: Contains images used throughout the application.
    * `icons`: Contains SVG icons used for visual elements.
    * `vite.svg`: Vite's default SVG logo.

* **`src`**: This directory houses the core source code of the application.

    * **`App.css`, `App.jsx`**: The main application component and its associated styles.
    * **`index.css`**: Global CSS styles for the application.
    * **`main.jsx`**: The entry point of the application.
    * **`assets`**: Contains additional assets such as images or logos.
    * **`components`**: Contains reusable UI components, organized into subdirectories for better management.
        * **`Features`**: Components specific to the application's features (e.g., ComplianceStatus, QuickActions, RecentActivity, StatsWidget, TestCaseCard).
        * **`Layout`**: Components responsible for the application's layout and structure (e.g., Header).
        * **`UI`**: Basic UI components (e.g., Button, Card, Modal).
        * **`Auth`**: Components related to user authentication (LoginForm, RegisterForm).
    * **`hooks`**: Contains custom React hooks for reusable logic and state management (e.g., useDebounce, useFileUpload, useLocalStorage, useModal).
    * **`pages`**: Contains the application's individual pages (e.g., Dashboard, DocumentUpload, Settings, TestCaseManager, TestGeneration, Auth). Each page is typically a self-contained component.
    * **`styles`**: Contains global and component-specific styles.
        * `components.css`: Styles for reusable components.
        * `globals.css`: Global styles for the application.
        * `utilities.css`: Utility classes for common styling patterns.
    * **`utils`**: Contains utility functions and helpers.
        * `api.js`: Functions for interacting with the backend API.
        * `constants.js`: Contains constants used throughout the application.
        * `helpers.js`: General utility functions.
        * `mockData.js`: Mock data for development and testing.
        * `firebase.js`: Functions for interacting with Firebase.
        * `auth.js`: Authentication-related functions.


* **`package.json`**: Contains project metadata, dependencies, and scripts.
* **`package-lock.json`**: Contains the exact versions of all installed packages.


## Tech Stack

- **React 19**: The core JavaScript library for building user interfaces.
- **Vite**: A build tool for fast development and building.
- **React Router**: For client-side routing.
- **Lucide React**: For beautiful icons.
- **Modern CSS**: Using custom properties and responsive design.
- **Firebase**: For authentication and potentially other backend services.


## Getting Started

1.  **Clone the repository:**  `git clone [repository URL]`
2.  **Navigate to the directory:** `cd frontend`
3.  **Install dependencies:** `npm install` or `yarn install`
4.  **Start the development server:** `npm run dev` or `yarn dev`


This README provides a comprehensive overview of the frontend project structure and its components. For more detailed information on specific components or features, refer to the individual files and their associated comments.

```
frontend/
├── public/
│   ├── images/
│   │   └── logo.svg
│   ├── icons/
│   │   ├── healthcare.svg
│   │   └── medical-device.svg
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── Features/
│   │   │   ├── ComplianceStatus.css
│   │   │   ├── ComplianceStatus.jsx
│   │   │   ├── QuickActions.css
│   │   │   ├── QuickActions.jsx
│   │   │   ├── RecentActivity.css
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── StatsWidget.css
│   │   │   ├── StatsWidget.jsx
│   │   │   └── TestCaseCard.css
│   │   │       └── TestCaseCard.jsx
│   │   ├── Layout/
│   │   │   ├── Header.css
│   │   │   └── Header.jsx
│   │   └── UI/
│   │       ├── Button.css
│   │       ├── Button.jsx
│   │       ├── Card.css
│   │       ├── Card.jsx
│   │       └── Modal.css
│   │           └── Modal.jsx
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── useFileUpload.js
│   │   ├── useLocalStorage.js
│   │   └── useModal.js
│   ├── pages/
│   │   ├── Dashboard.css
│   │   ├── Dashboard.jsx
│   │   ├── DocumentUpload.css
│   │   ├── DocumentUpload.jsx
│   │   ├── Settings.css
│   │   ├── Settings.jsx
│   │   ├── TestCaseManager.css
│   │   ├── TestCaseManager.jsx
│   │   ├── TestGeneration.css
│   │   └── TestGeneration.jsx
│   ├── styles/
│   │   ├── components.css
│   │   ├── globals.css
│   │   └── utilities.css
│   └── utils/
│       ├── api.js
│       ├── constants.js
│       ├── helpers.js
│       └── mockData.js
│       ├── firebase.js
│       └── auth.js
│   ├── components/Auth/
│   │   ├── LoginForm.jsx
│   │   └── LoginForm.css
│   │   ├── RegisterForm.jsx
│   │   └── RegisterForm.css
│   └── pages/Auth.jsx
│       └── pages/Auth.css
└── package.json
