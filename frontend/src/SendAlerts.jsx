import { useNavigate, useLocation } from 'react-router-dom';
import { Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import './App.css';

function SendAlerts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSent, setIsSent] = useState(false);
  
  // Data passed from HazardDetection.jsx if available
  const alertData = location.state || { prediction: 'N/A', reason: 'N/A' };

  const handleSend = () => {
    // Simulating sending alert
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
    }, 5000);
  };

  return (
    <div className="send-alerts-container">
      <div className="send-alerts-card">
        <div className="card-header">
          <button className="back-btn" onClick={() => navigate('/hazard-detection')}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="send-alerts-title">Emergency Alert Center</h1>
        </div>

        <div className="alert-details-box">
          <h2>Active Status: <span className={alertData.prediction.toLowerCase()}>{alertData.prediction}</span></h2>
          <p className="alert-reason-text"><strong>Context:</strong> {alertData.reason}</p>
        </div>

        <div className="alert-action-section">
          <p className="action-description">
            Send an immediate emergency notification to the safety team and facility management.
          </p>
          
          <button 
            className={`send-btn ${isSent ? 'sent' : ''}`} 
            onClick={handleSend}
            disabled={isSent}
          >
            {isSent ? (
              <>
                <CheckCircle size={20} /> Alerts Dispatched
              </>
            ) : (
              <>
                <Send size={20} /> Send Alerts Now
              </>
            )}
          </button>
          
          {isSent && <p className="success-msg">Emergency protocols activated. Help is on the way.</p>}
        </div>
      </div>
    </div>
  );
}

export default SendAlerts;
