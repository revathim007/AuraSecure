import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './App.css'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Clear error on typing
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8000/api/login/', formData)
      console.log('Login Successful:', response.data)
      localStorage.setItem('currentUser', JSON.stringify(response.data))
      navigate('/dashboard')
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error)
      }
    }
  }

  return (
    <div className="registration-container app-container">
      <div className="login-card">
        <h2 className="registration-title">
          <Lock size={24} className="lock-icon" /> AURASECURE
        </h2>
        <p className="registration-subtitle">Login to your safety portal</p>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              placeholder="Enter your username"
              className={error === 'No user found' ? 'input-error' : ''}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="Enter your password"
              className={error === 'Wrong password' ? 'input-error' : ''}
            />
          </div>

          {error && <div className="login-error-msg">{error}</div>}

          <button type="submit" className="submit-btn register-submit">Login</button>
        </form>

        <div className="form-footer">
          <button className="login-link-btn" onClick={() => navigate('/registration')}>
            Don't have an account? <span>Register</span>
          </button>
          <button className="back-btn-link" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
