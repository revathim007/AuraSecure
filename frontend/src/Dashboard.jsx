import { useNavigate } from 'react-router-dom'
import './App.css'

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">AURASECURE Dashboard</h1>
        <p className="dashboard-msg">Dashboard</p>
        <div className="user-info">
          <p>Welcome, <strong>{user.fullName || 'User'}</strong>!</p>
          <p>Email: {user.email}</p>
          <p>Contact: {user.contactNumber}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Dashboard
