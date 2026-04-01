import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const [message, setMessage] = useState('Loading backend message...')
  const navigate = useNavigate()

  useEffect(() => {
    // Calling the Django backend API
    axios.get('http://localhost:8000/api/welcome/')
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setMessage('Welcome (Backend connection failed)')
      })
  }, [])

  return (
    <div className="welcome-container">
      <h1 className="welcome-text">AURASECURE</h1>
      <p className="backend-message">{message}</p>
      <button className="get-started-btn" onClick={() => navigate('/registration')}>
        Get Started
      </button>
    </div>
  )
}

export default App
