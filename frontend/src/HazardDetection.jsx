import { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, ShieldCheck, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function HazardDetection() {
  const navigate = useNavigate();
  const [gasLevel, setGasLevel] = useState('');
  const [smokeLevel, setSmokeLevel] = useState('');
  const [temperature, setTemperature] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [predictionReason, setPredictionReason] = useState('');
  const [predictionStatement, setPredictionStatement] = useState('');
  const [messageType, setMessageType] = useState(''); // 'error' or 'success'
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const validateInput = (name, value) => {
    let error = null;
    const numValue = parseFloat(value);

    if (value && isNaN(numValue)) {
      error = 'Only numbers are allowed.';
    } else if (value) {
      switch (name) {
        case 'gasLevel':
          if (numValue < 0) error = 'Cannot be negative.';
          else if (numValue > 1000) error = 'Must be between 0 and 1000.';
          break;
        case 'smokeLevel':
          if (numValue < 0) error = 'Cannot be negative.';
          else if (numValue > 100) error = 'Must be between 0 and 100.';
          break;
        case 'temperature':
          if (numValue < -50 || numValue > 100) error = 'Must be between -50°C and 100°C.';
          break;
        default:
          break;
      }
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (setter, name) => e => {
    const { value } = e.target;
    setter(value);
    validateInput(name, value);
  };

  const handleDetectHazard = () => {
    // Check for any empty field
    if (!gasLevel || !smokeLevel || !temperature) {
      setMessageType('error');
      setMessage('Please fill the info below');
      setTimeout(() => setMessage(''), 4000);
      return;
    }

    if (Object.values(errors).some(error => error !== null)) {
      setMessageType('error');
      setMessage('Please fix the errors before submitting.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const sensorData = {
      user: user.id,
      gas_level: parseFloat(gasLevel) || 0,
      smoke_level: parseFloat(smokeLevel) || 0,
      temperature: parseFloat(temperature) || 0,
    };

    axios.post('http://localhost:8000/api/predict/', sensorData)
      .then(response => {
        setPrediction(response.data.prediction);
        setPredictionReason(response.data.reason);
        setPredictionStatement(response.data.statement);
        if (response.data.error) {
          setMessageType('error');
          setMessage(response.data.error);
        } else {
          setMessageType('success');
          setMessage('Prediction successful!');
        }
        setTimeout(() => setMessage(''), 5000);
      })
      .catch(error => {
        console.error('Error making prediction:', error);
        setMessageType('error');
        setMessage('Error: Could not get prediction.');
        setTimeout(() => setMessage(''), 3000);
      });
  };

  const getStatusIcon = () => {
    switch (prediction) {
      case 'Alarm': return <AlertCircle size={40} color="#dc3545" />;
      case 'Warning': return <AlertTriangle size={40} color="#ffc107" />;
      case 'Safe': return <ShieldCheck size={40} color="#28a745" />;
      default: return null;
    }
  };

  const isButtonDisabled = Object.values(errors).some(error => error !== null);

  return (
    <div className="hazard-detection-container app-container">
      <div className="hazard-detection-card">
        <h1 className="hazard-detection-title">Safety Check</h1>
        <p className="forecasting-desc">Analyze real-time sensor data for potential hazards</p>
        {message && <p className={`submission-message ${messageType}`}>{message}</p>}
        
        {prediction && (
          <div className={`prediction-summary ${prediction.toLowerCase()}`}>
            <div className="prediction-header">
              {getStatusIcon()}
              <h2 className={`prediction-status ${prediction.toLowerCase()}`}>{prediction} Status</h2>
            </div>
            <p className="prediction-reason">{predictionReason}</p>
            <div className="prediction-statement-box">
              <p className="prediction-statement">{predictionStatement}</p>
            </div>
            {(prediction === 'Alarm' || prediction === 'Warning') && (
              <button 
                className="send-alerts-link-btn" 
                onClick={() => navigate('/send-alerts', { state: { prediction, reason: predictionReason } })}
              >
                <Send size={18} /> Send Alerts
              </button>
            )}
          </div>
        )}

        <div className="registration-form horizontal-form">
          <div className="form-group">
            <label>Gas Level</label>
            <input type="text" value={gasLevel} onChange={handleInputChange(setGasLevel, 'gasLevel')} placeholder="0 - 1000" />
            {errors.gasLevel && <p className="error-text">{errors.gasLevel}</p>}
          </div>
          <div className="form-group">
            <label>Smoke Level</label>
            <input type="text" value={smokeLevel} onChange={handleInputChange(setSmokeLevel, 'smokeLevel')} placeholder="0 - 100" />
            {errors.smokeLevel && <p className="error-text">{errors.smokeLevel}</p>}
          </div>
          <div className="form-group">
            <label>Temperature</label>
            <input type="text" value={temperature} onChange={handleInputChange(setTemperature, 'temperature')} placeholder="-50 - 100" />
            {errors.temperature && <p className="error-text">{errors.temperature}</p>}
          </div>
        </div>
        <button className="detect-hazard-btn register-submit" onClick={handleDetectHazard} disabled={isButtonDisabled}>Detect Hazard</button>
      </div>
    </div>
  );
}

export default HazardDetection;
