import { useNavigate } from 'react-router-dom';
import './App.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="header-container">
      <div className="logo" onClick={() => navigate('/dashboard')}>AURASECURE</div>
      <div className="navbar">
        <button className="nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="nav-btn" onClick={() => navigate('/hazard-detection')}>Hazard Detection</button>
        <button className="nav-btn">Forecasting</button>
        <button className="nav-btn">Send Alerts</button>
        <button className="logout-btn-header" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Header;
