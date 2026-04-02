import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, AlertTriangle, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import './App.css';

function Forecasting() {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const fetchForecast = () => {
    if (!user) {
      setError('Please login to view forecasting.');
      return;
    }

    setLoading(true);
    setError(null);
    
    axios.post('http://localhost:8000/api/forecast/', { user: user.id })
      .then(response => {
        setForecastData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Forecast Error:', err);
        setError(err.response?.data?.error || 'Could not fetch forecasting data. Ensure you have submitted sensor data recently.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Alarm': return <AlertCircle size={40} color="#dc3545" />;
      case 'Warning': return <AlertTriangle size={40} color="#ffc107" />;
      case 'Safe': return <ShieldCheck size={40} color="#28a745" />;
      default: return null;
    }
  };

  return (
    <div className="forecasting-container app-container">
      <div className="forecasting-card">
        <div className="forecasting-header">
          <Clock size={32} color="#a291cf" />
          <h1 className="forecasting-title">Future Outlook</h1>
        </div>
        
        <p className="forecasting-desc">
          Proactive hazard projection based on historical trends
        </p>

        {loading ? (
          <div className="loading-container">
            <RefreshCw className="spinner" size={40} color="#a291cf" />
            <p>Analyzing trends and predicting future states...</p>
          </div>
        ) : error ? (
          <div className="error-box">
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchForecast}>Retry Analysis</button>
          </div>
        ) : forecastData ? (
          <div className="forecast-results">
            <div className="forecast-metrics">
              <div className="metric-item">
                <label>Forecasted Gas</label>
                <span>{forecastData.forecast.gas_level} ppm</span>
              </div>
              <div className="metric-item">
                <label>Forecasted Smoke</label>
                <span>{forecastData.forecast.smoke_level}%</span>
              </div>
              <div className="metric-item">
                <label>Forecasted Temp</label>
                <span>{forecastData.forecast.temperature}°C</span>
              </div>
            </div>

            <div className={`prediction-summary ${forecastData.prediction.toLowerCase()}`}>
              <div className="prediction-header">
                {getStatusIcon(forecastData.prediction)}
                <h2 className={`prediction-status ${forecastData.prediction.toLowerCase()}`}>
                  {forecastData.prediction} Forecast
                </h2>
              </div>
              <p className="prediction-reason">{forecastData.reason}</p>
              <div className="prediction-statement-box">
                <p className="prediction-statement">{forecastData.statement}</p>
              </div>
            </div>
            
            <button className="refresh-btn" onClick={fetchForecast}>
              <RefreshCw size={18} /> Update Forecast
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Forecasting;
