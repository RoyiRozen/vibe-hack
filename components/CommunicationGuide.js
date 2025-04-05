import React from 'react';
import pearls from '../data/pearls.json';

const CommunicationGuide = ({ currentStep, onNextStep }) => {
  // Safety checks for pearls data
  if (!pearls || !Array.isArray(pearls.steps) || pearls.steps.length === 0) {
    return (
      <div className="guide-card">
        <div className="guide-header">
          <h3 className="guide-title">Communication Guide</h3>
        </div>
        <div className="step-content">
          <p>Loading communication steps...</p>
        </div>
      </div>
    );
  }

  // Ensure currentStep is within bounds
  const safeCurrentStep = Math.min(Math.max(0, currentStep), pearls.steps.length - 1);
  const step = pearls.steps[safeCurrentStep];

  if (!step) {
    return (
      <div className="guide-card">
        <div className="guide-header">
          <h3 className="guide-title">Communication Guide</h3>
        </div>
        <div className="step-content">
          <p>No steps available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-card">
      <div className="guide-header">
        <h3 className="guide-title">Communication Guide</h3>
        <div className="step-indicator">
          <span className="step-number">{safeCurrentStep + 1}</span>
          <span className="step-total">/{pearls.steps.length}</span>
        </div>
      </div>
      
      <div className="step-content">
        <div className="step-name">
          <div className="step-circle">{step.name.charAt(0)}</div>
          <h4 className="step-title">{step.name}</h4>
        </div>
        
        <p className="step-description">{step.description}</p>
        
        {step.example && (
          <div className="step-example">
            <h5 className="example-title">Example:</h5>
            <p className="example-text">{step.example}</p>
          </div>
        )}
        
        <button 
          className="next-step-button"
          onClick={onNextStep}
          disabled={safeCurrentStep === pearls.steps.length - 1}
        >
          <span className="next-step-text">
            {safeCurrentStep === pearls.steps.length - 1 ? 'Complete' : 'Next Step'}
          </span>
          <svg 
            className="next-step-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CommunicationGuide; 