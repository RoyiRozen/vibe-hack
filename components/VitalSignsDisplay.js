import React from 'react';

const VitalSignsDisplay = ({ vitals }) => {
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

  return (
    <div className="vitals-card">
      <div className="vitals-header">
        <h3 className="vitals-title">Vital Signs</h3>
        <span className="vitals-time">
          Last updated: {vitals?.timestamp ? formatTime(vitals.timestamp) : 'N/A'}
        </span>
      </div>
      
      <div className="vitals-list">
        <button className={`vital-button ${vitals?.heartRate?.alert ? 'vital-alert' : ''}`}>
          <span className="vital-label">Heart Rate</span>
          <span className={`vital-value ${vitals?.heartRate?.alert ? 'vital-alert-text' : ''}`}>
            {vitals?.heartRate?.value || 'N/A'} bpm
          </span>
        </button>
        
        <button className={`vital-button ${vitals?.bloodPressure?.alert ? 'vital-alert' : ''}`}>
          <span className="vital-label">Blood Pressure</span>
          <span className={`vital-value ${vitals?.bloodPressure?.alert ? 'vital-alert-text' : ''}`}>
            {vitals?.bloodPressure?.value || 'N/A'} mmHg
          </span>
        </button>
        
        <button className={`vital-button ${vitals?.oxygenSaturation?.alert ? 'vital-alert' : ''}`}>
          <span className="vital-label">Oxygen Saturation</span>
          <span className={`vital-value ${vitals?.oxygenSaturation?.alert ? 'vital-alert-text' : ''}`}>
            {vitals?.oxygenSaturation?.value || 'N/A'}%
          </span>
        </button>
        
        <button className={`vital-button ${vitals?.temperature?.alert ? 'vital-alert' : ''}`}>
          <span className="vital-label">Temperature</span>
          <span className={`vital-value ${vitals?.temperature?.alert ? 'vital-alert-text' : ''}`}>
            {vitals?.temperature?.value || 'N/A'}°C
          </span>
        </button>
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