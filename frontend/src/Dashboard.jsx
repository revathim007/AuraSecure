import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Activity, 
  AlertCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Database, 
  Clock, 
  Bell,
  RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const fetchDashboardData = () => {
    if (!user.id) return;
    setLoading(true);
    axios.post('http://localhost:8000/api/dashboard-stats/', { user: user.id })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load dashboard statistics.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !data) return <div className="loading-screen"><RefreshCw className="spinner" /> Loading Dashboard...</div>;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const chartData = {
    labels: data?.trends.map(t => t.time) || [],
    datasets: [
      {
        label: 'Gas Level',
        data: data?.trends.map(t => t.gas) || [],
        borderColor: '#a291cf',
        backgroundColor: '#a291cf',
        tension: 0.3,
      },
      {
        label: 'Temperature',
        data: data?.trends.map(t => t.temp) || [],
        borderColor: '#c62828',
        backgroundColor: '#c62828',
        tension: 0.3,
      },
      {
        label: 'Smoke',
        data: data?.trends.map(t => t.smoke) || [],
        borderColor: '#7c7c9c',
        backgroundColor: '#7c7c9c',
        tension: 0.3,
      }
    ],
  };

  return (
    <div className="dashboard-wrapper app-container">
      <div className="dashboard-header-main">
        <h1 className="welcome-text">Safety <span>Overview</span></h1>
        <button className="refresh-stats-btn" onClick={fetchDashboardData}>
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      <div className="stats-grid">
        {/* Current Status Card */}
        <div className={`status-card ${data?.current_status.toLowerCase()}`}>
          <div className="card-icon">
            {data?.current_status === 'Safe' && <ShieldCheck size={32} />}
            {data?.current_status === 'Warning' && <AlertTriangle size={32} />}
            {data?.current_status === 'Alarm' && <AlertCircle size={32} />}
          </div>
          <div className="card-info">
            <h3>Current Status</h3>
            <p className="status-val">{data?.current_status}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-card">
          <Database size={24} color="#8B4513" />
          <div className="card-info">
            <h3>Total Records</h3>
            <p className="summary-val">{data?.summary.total}</p>
          </div>
        </div>
        <div className="summary-card">
          <AlertCircle size={24} color="#dc3545" />
          <div className="card-info">
            <h3>Alerts</h3>
            <p className="summary-val">{data?.summary.alerts}</p>
          </div>
        </div>
        <div className="summary-card">
          <AlertTriangle size={24} color="#ffc107" />
          <div className="card-info">
            <h3>Warnings</h3>
            <p className="summary-val">{data?.summary.warning}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        {/* Trend Chart */}
        <div className="chart-section">
          <div className="section-header">
            <Activity size={20} />
            <h2>Sensor Trends</h2>
          </div>
          <div className="chart-container-box">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* Alerts List */}
        <div className="alerts-section">
          <div className="section-header">
            <Bell size={20} />
            <h2>Recent Alerts</h2>
          </div>
          <div className="alerts-list">
            {data?.alerts.length > 0 ? (
              data.alerts.map((alert, idx) => (
                <div key={idx} className="alert-item-row">
                  <div className="alert-icon-wrapper">
                    <AlertCircle size={20} color="#c62828" />
                  </div>
                  <div className="alert-content">
                    <div className="alert-header-row">
                      <span className="alert-label">Alarm</span>
                      <span className="alert-time-stamp">{new Date(alert.time).toLocaleString()}</span>
                    </div>
                    <p className="alert-message-text">{alert.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data-msg">No recent alerts found.</p>
            )}
          </div>
        </div>

        {/* History Table */}
        <div className="history-section full-width">
          <div className="section-header">
            <Clock size={20} />
            <h2>Recent Sensor History</h2>
          </div>
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Gas Level</th>
                  <th>Smoke %</th>
                  <th>Temp °C</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.history.map((record, idx) => (
                  <tr key={idx}>
                    <td>{new Date(record.timestamp).toLocaleString()}</td>
                    <td>{record.gas}</td>
                    <td>{record.smoke}</td>
                    <td>{record.temp}</td>
                    <td>
                      <span className={`status-pill ${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
