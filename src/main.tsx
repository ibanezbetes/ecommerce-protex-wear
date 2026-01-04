import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import App from './App';
import './index.css';

// Configure Amplify
// Note: In production, these would come from environment variables
// For now, we'll configure them when the backend is deployed
try {
  // Amplify configuration will be added here once backend is deployed
  console.log('Amplify configuration will be loaded from backend deployment');
} catch (error) {
  console.warn('Amplify not configured yet - backend needs to be deployed first');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);