import React from 'react';
import { FaHeartbeat } from 'react-icons/fa';

const VitalSignsDisplay = ({ vitals, onVitalClick }) => {
  // Format the timestamp in a way that's consistent between server and client
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleVitalClick = (vitalName) => {
    if (onVitalClick) {
      onVitalClick(vitalName);
    }
  };

  return (
    <div className="vitals-container">
      <div className="vitals-header">
        <FaHeartbeat />
        <h3>Vital Signs</h3>
        <span className="vitals-time">
          Last updated: {vitals?.timestamp ? formatTime(vitals.timestamp) : 'N/A'}
        </span>
      </div>
      
      <div className="vitals-grid">
        <div className="vital-item">
          <span className="vital-label">Heart Rate</span>
          <span className="vital-value">{vitals?.heartRate || 'N/A'} bpm</span>
        </div>
        
        <div className="vital-item">
          <span className="vital-label">Blood Pressure</span>
          <span className="vital-value">{vitals?.bloodPressure || 'N/A'}</span>
        </div>
        
        <div className="vital-item">
          <span className="vital-label">Oxygen Saturation</span>
          <span className="vital-value">{vitals?.oxygenSaturation || 'N/A'}%</span>
        </div>
        
        <div className="vital-item">
          <span className="vital-label">Temperature</span>
          <span className="vital-value">{vitals?.temperature || 'N/A'}°F</span>
        </div>
      </div>
      
      {vitals?.alerts?.length > 0 && (
        <div className="vital-alert">
          {vitals.alerts.map((alert, index) => (
            <p key={index} className="vital-alert-text">{alert}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default VitalSignsDisplay; 