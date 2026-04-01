import { useState } from 'react'
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

          <button type="submit" className="submit-btn">Login</button>
        </form>
        <button className="back-btn" onClick={() => navigate('/registration')}>Don't have an account? Register</button>
      </div>
    </div>
  )
}

export default Login
