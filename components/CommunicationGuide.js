import React from 'react';

const CommunicationGuide = ({ currentStep, goToNextStep }) => {
  return (
    <div className="communication-guide-panel">
      <h2>PEARLS Communication Guide</h2>
      <div className="step-content">
        <h3>{currentStep.name}</h3>
        <p className="description">{currentStep.description}</p>
        <p className="example">Example: {currentStep.example}</p>
      </div>
      <button onClick={goToNextStep} className="next-step-btn">
        Next Step
      </button>
    </div>
  );
};

export default CommunicationGuide; 