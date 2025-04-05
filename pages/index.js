import React, { useState } from 'react';
import Head from 'next/head';
import VitalSignsDisplay from '../components/VitalSignsDisplay';
import CommunicationGuide from '../components/CommunicationGuide';
import ChatInterface from '../components/ChatInterface';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [vitals, setVitals] = useState({
    timestamp: new Date().toISOString(),
    heartRate: { value: 72, alert: false },
    bloodPressure: { value: '120/80', alert: false },
    oxygenSaturation: { value: 98, alert: false },
    temperature: { value: 37.0, alert: false },
    alerts: []
  });

  const handleSendMessage = async (message) => {
    setIsLoading(true);
    
    // Add user message
    const userMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add AI response
      const aiMessage = {
        sender: 'ai',
        text: 'Thank you for your message. I am here to help.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update vitals (simulated)
      setVitals(prev => ({
        ...prev,
        timestamp: new Date().toISOString(),
        heartRate: { value: 75, alert: false },
        bloodPressure: { value: '118/78', alert: false },
        oxygenSaturation: { value: 97, alert: false },
        temperature: { value: 36.9, alert: false },
        alerts: []
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div className="app">
      <Head>
        <title>Medical Communication Training | PEARLS Method</title>
        <meta name="description" content="Practice medical communication using the PEARLS method" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Medical Communication Training</h1>
          <nav className="header-nav">
            <a href="#" className="header-link">Home</a>
            <a href="#" className="header-link">About</a>
            <a href="#" className="header-link">Resources</a>
            <a href="#" className="header-link">Contact</a>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="chat-area">
          <ChatInterface 
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
        
        <aside className="sidebar">
          <div className="patient-card">
            <div className="patient-header">
              <h2 className="patient-name">Mr. John Martinez</h2>
              <p className="patient-id">ID: 12345</p>
            </div>
            
            <div className="patient-info">
              <div className="info-item">
                <span className="info-label">Age:</span>
                <span className="info-value">45 years</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gender:</span>
                <span className="info-value">Male</span>
              </div>
              <div className="info-item">
                <span className="info-label">Mode:</span>
                <span className="info-value">Training</span>
              </div>
            </div>
          </div>
          
          <VitalSignsDisplay vitals={vitals} />
          
          <CommunicationGuide 
            currentStep={currentStep}
            onNextStep={handleNextStep}
          />
        </aside>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Medical Communication Training. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 