import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import pearls from '../data/pearls.json';

const CommunicationGuide = ({ currentStep, onNextStep, onPreviousStep, pearls }) => {
  if (!pearls || !pearls.steps) {
    return null;
  }

  const currentPearlStep = pearls.steps[currentStep];
  const isLastStep = currentStep === pearls.steps.length - 1;

  return (
    <div className="communication-guide">
      <div className="guide-header">
        <h3 className="guide-title">Communication Guide</h3>
        <div className="step-indicator">
          Step {currentStep + 1} of {pearls.steps.length}
        </div>
      </div>
      
      <div className="guide-content">
        <h4 className="step-name">{currentPearlStep.name}</h4>
        <p className="step-description">{currentPearlStep.description}</p>
        <div className="example-container">
          <h5 className="example-title">Example:</h5>
          <p className="example-text">{currentPearlStep.example}</p>
        </div>
      </div>
      
      <div className="guide-navigation">
        <button 
          className="guide-button back-button" 
          onClick={onPreviousStep}
          disabled={currentStep === 0}
          aria-label="Previous step"
        >
          <FaArrowLeft /> Back
        </button>
        
        <button 
          className="guide-button next-button" 
          onClick={onNextStep}
          disabled={isLastStep}
          aria-label="Next step"
        >
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CommunicationGuide; 