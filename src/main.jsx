import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n.js';

// Apply saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
