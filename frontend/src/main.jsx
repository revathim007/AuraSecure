import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import App from './App.jsx';
import Registration from './Registration.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import HazardDetection from './HazardDetection.jsx';
import SendAlerts from './SendAlerts.jsx';
import Header from './Header.jsx';
import './index.css';

function Main() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const showHeader = user && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/registration';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hazard-detection" element={<HazardDetection />} />
        <Route path="/send-alerts" element={<SendAlerts />} />
      </Routes>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </React.StrictMode>
);
