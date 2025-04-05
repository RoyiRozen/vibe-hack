import React from 'react';

const VitalSignsDisplay = ({ vitals, alerts }) => {
  return (
    <div className="vital-signs-panel">
      <h3>Vital Signs</h3>
      <div className={`vital ${alerts.hr ? 'alert' : ''}`}>
        <span className="label">HR:</span>
        <span className="value">{vitals.hr} bpm</span>
      </div>
      <div className={`vital ${alerts.bp ? 'alert' : ''}`}>
        <span className="label">BP:</span>
        <span className="value">{vitals.bp} mmHg</span>
      </div>
      <div className={`vital ${alerts.spo2 ? 'alert' : ''}`}>
        <span className="label">SpO2:</span>
        <span className="value">{vitals.spo2}%</span>
      </div>
    </div>
  );
};

export default VitalSignsDisplay; 