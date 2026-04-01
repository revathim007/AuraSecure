import { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';
import './App.css';

function HazardDetection() {
  const [gasLevel, setGasLevel] = useState('');
  const [smokeLevel, setSmokeLevel] = useState('');
  const [temperature, setTemperature] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [predictionReason, setPredictionReason] = useState('');
  const [predictionStatement, setPredictionStatement] = useState('');
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
    if (Object.values(errors).some(error => error !== null)) {
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
        setMessage('Prediction successful!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error making prediction:', error);
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

  const isButtonDisabled = Object.values(errors).some(error => error !== null) || !gasLevel || !smokeLevel || !temperature;

  return (
    <div className="hazard-detection-container">
      <div className="hazard-detection-card">
        <h1 className="hazard-detection-title">Hazard Detection</h1>
        {message && <p className="submission-message">{message}</p>}
        
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
          </div>
        )}

        <div className="input-container">
          <div className="input-group">
            <label>Gas Level</label>
            <input type="text" value={gasLevel} onChange={handleInputChange(setGasLevel, 'gasLevel')} placeholder="0 - 1000" />
            {errors.gasLevel && <p className="error-text">{errors.gasLevel}</p>}
          </div>
          <div className="input-group">
            <label>Smoke Level</label>
            <input type="text" value={smokeLevel} onChange={handleInputChange(setSmokeLevel, 'smokeLevel')} placeholder="0 - 100" />
            {errors.smokeLevel && <p className="error-text">{errors.smokeLevel}</p>}
          </div>
          <div className="input-group">
            <label>Temperature</label>
            <input type="text" value={temperature} onChange={handleInputChange(setTemperature, 'temperature')} placeholder="-50 - 100" />
            {errors.temperature && <p className="error-text">{errors.temperature}</p>}
          </div>
        </div>
        <button className="detect-hazard-btn" onClick={handleDetectHazard} disabled={isButtonDisabled}>Detect Hazard</button>
      </div>
    </div>
  );
}

export default HazardDetection;
