import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './App.css'

function Registration() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    contactNumber: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    let newErrors = {}
    
    // Full Name: At least 2 characters, only letters and spaces
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required"
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.fullName)) {
      newErrors.fullName = "Full Name should only contain letters (min 2 characters)"
    }

    // Username: 3-20 characters, alphanumeric
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = "Username must be 3-20 characters (alphanumeric or underscore)"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Contact Number: 10 digits
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required"
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be exactly 10 digits"
    }

    // Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = "Password must include uppercase, lowercase, number, and special character"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      try {
        const response = await axios.post('http://localhost:8000/api/register/', {
          full_name: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          contact: formData.contactNumber
        })
        console.log('Registration Successful:', response.data)
        navigate('/login')
      } catch (error) {
        if (error.response && error.response.data) {
          // Map backend errors to frontend state
          const backendErrors = error.response.data
          let newErrors = {}
          for (const key in backendErrors) {
            newErrors[key] = backendErrors[key][0]
          }
          setErrors(newErrors)
        }
      }
    }
  }

  return (
    <div className="registration-container app-container">
      <div className="registration-card">
        <h2 className="registration-title">
          <Lock size={24} className="lock-icon" /> AURASECURE
        </h2>
        <p className="registration-subtitle">Create your safety monitoring account</p>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              className={errors.fullName ? 'input-error' : ''}
              value={formData.fullName} 
              onChange={handleChange} 
              required 
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              className={errors.username ? 'input-error' : ''}
              value={formData.username} 
              onChange={handleChange} 
              required 
              placeholder="Choose a username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              className={errors.email ? 'input-error' : ''}
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input 
              type="tel" 
              name="contactNumber" 
              className={errors.contactNumber ? 'input-error' : ''}
              value={formData.contactNumber} 
              onChange={handleChange} 
              required 
              placeholder="Enter contact number"
            />
            {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                className={errors.password ? 'input-error' : ''}
                value={formData.password} 
                onChange={handleChange} 
                required 
                placeholder="Create a password"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-btn register-submit">Register</button>
        </form>
        
        <div className="form-footer">
          <button className="login-link-btn" onClick={() => navigate('/login')}>
            Already have an account? <span>Login</span>
          </button>
          <button className="back-btn-link" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Registration
