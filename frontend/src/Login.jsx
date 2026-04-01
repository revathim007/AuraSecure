import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check if user exists
    const user = users.find(u => u.username === formData.username)
    
    if (!user) {
      setError('Please register')
      return
    }

    if (user.password !== formData.password) {
      setError('Wrong password')
      return
    }

    // Success
    console.log('Login successful for:', formData.username)
    localStorage.setItem('currentUser', JSON.stringify(user)) // Store session
    navigate('/dashboard')
  }

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2 className="registration-title">AURASECURE Login</h2>
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
              className={error === 'Please register' ? 'input-error' : ''}
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

          <button type="submit" className="submit-btn">Login</button>
        </form>
        <button className="back-btn" onClick={() => navigate('/registration')}>Don't have an account? Register</button>
      </div>
    </div>
  )
}

export default Login
