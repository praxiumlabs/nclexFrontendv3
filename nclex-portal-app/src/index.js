// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error reporting setup (optional)
if (process.env.NODE_ENV === 'production') {
  // Setup error reporting service here
  // Example: Sentry, Bugsnag, etc.
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
