import { useNavigate } from 'react-router-dom';
import { Lock, LogOut } from 'lucide-react';
import './App.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="header-container">
      <div className="logo" onClick={() => navigate('/dashboard')}>
        <Lock size={20} className="lock-icon" /> AURASECURE
      </div>
      <div className="nav-links">
        <button className="nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="nav-btn" onClick={() => navigate('/hazard-detection')}>Hazard Detection</button>
        <button className="nav-btn" onClick={() => navigate('/forecasting')}>Forecasting</button>
        <button className="nav-btn" onClick={() => navigate('/send-alerts')}>Send Alerts</button>
      </div>
      <button className="logout-btn-header" onClick={handleLogout}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}

export default Header;
