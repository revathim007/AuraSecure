import { useState, useEffect } from 'react'
import axios from 'axios'
import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1 className="welcome-text">
        <Lock size={48} color="white" className="lock-icon" /> AURASECURE
      </h1>
      <button className="get-started-btn" onClick={() => navigate('/registration')}>
        Get Started
      </button>
    </div>
  );
}

export default App
