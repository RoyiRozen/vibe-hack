import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ChatInterface from '../components/ChatInterface';
import ARInterface from '../components/ARInterface';
import CommunicationGuide from '../components/CommunicationGuide';
import VitalSignsDisplay from '../components/VitalSignsDisplay';
import { FaDesktop, FaGlasses, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import pearls from '../data/pearls.json';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    oxygenSaturation: 98,
    temperature: 98.6,
  });
  const [selectedCaseType, setSelectedCaseType] = useState('Difficult Conversation');
  const [interfaceMode, setInterfaceMode] = useState('desktop'); // 'desktop' or 'ar'
  const [caseTypeIndex, setCaseTypeIndex] = useState(0);
  
  const caseTypes = [
    'Difficult Conversation',
    'Patient-Centered Communication',
    'Breaking Bad News',
    'Conflict Resolution',
    'End-of-Life Discussion',
  ];
  
  const patientData = {
    name: 'John Martinez',
    age: 65,
    chiefComplaint: 'Chest pain and shortness of breath',
    history: 'Patient presented with sudden onset of chest pain and shortness of breath. No previous cardiac history. Smoker for 20 years.',
  };
  
  useEffect(() => {
    // Initialize chat with welcome message
    setMessages([
      {
        sender: 'ai',
        text: `Hello, I'm ${patientData.name}. I've been having chest pain and trouble breathing. Can you help me?`,
        timestamp: new Date(),
      },
    ]);
  }, [selectedCaseType]);
  
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage = {
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: text,
          caseType: selectedCaseType,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from OpenAI');
      }
      
      const data = await response.json();
      
      // Add AI response
      const aiMessage = {
        sender: 'ai',
        text: data.message,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      // Simulate vital signs changes based on conversation
      if (text.toLowerCase().includes('pain') || text.toLowerCase().includes('anxiety')) {
        setVitals((prev) => ({
          ...prev,
          heartRate: Math.min(prev.heartRate + 5, 120),
          bloodPressure: '130/85',
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        sender: 'ai',
        text: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < pearls.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleCaseTypeChange = (caseType) => {
    setSelectedCaseType(caseType);
    setMessages([]);
    setCurrentStep(0);
    setVitals({
      heartRate: 72,
      bloodPressure: '120/80',
      oxygenSaturation: 98,
      temperature: 98.6,
    });
  };
  
  const toggleInterfaceMode = () => {
    // Prevent scrolling when switching modes
    window.scrollTo(0, 0);
    setInterfaceMode(interfaceMode === 'desktop' ? 'ar' : 'desktop');
  };
  
  const handlePreviousCaseType = () => {
    const newIndex = (caseTypeIndex - 1 + caseTypes.length) % caseTypes.length;
    setCaseTypeIndex(newIndex);
    handleCaseTypeChange(caseTypes[newIndex]);
  };
  
  const handleNextCaseType = () => {
    const newIndex = (caseTypeIndex + 1) % caseTypes.length;
    setCaseTypeIndex(newIndex);
    handleCaseTypeChange(caseTypes[newIndex]);
  };
  
  return (
    <div className="app-container">
      <Head>
        <title>CareView - Medical Communication Training</title>
        <meta name="description" content="Practice medical communication skills with AI-powered patient simulations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="app-header">
        <div className="header-content">
          <Link href="/" className="logo">
            <h1 className="stylized-title">CareView</h1>
          </Link>
          <nav className="main-nav">
            <Link href="/about" className="nav-link">About</Link>
            <button 
              className="interface-toggle"
              onClick={toggleInterfaceMode}
              aria-label="Toggle interface mode"
            >
              {interfaceMode === 'desktop' ? (
                <>
                  <FaGlasses />
                  <span>Switch to AR</span>
                </>
              ) : (
                <>
                  <FaDesktop />
                  <span>Switch to Desktop</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        <div className="case-selector">
          <h2 className="case-title">Case Type</h2>
          <div className="case-navigation">
            <button 
              className="case-nav-button"
              onClick={handlePreviousCaseType}
              aria-label="Previous case type"
            >
              <FaChevronLeft />
            </button>
            <div className="current-case-type">
              {selectedCaseType}
            </div>
            <button 
              className="case-nav-button"
              onClick={handleNextCaseType}
              aria-label="Next case type"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        
        {interfaceMode === 'desktop' ? (
          <div className="content-container">
            <div className="chat-section">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
            
            <div className="sidebar">
              <div className="patient-header">
                <div className="patient-image-container">
                  <Image
                    src="/JohnMartinez.png"
                    alt="Patient"
                    width={150}
                    height={150}
                    className="patient-image"
                  />
                </div>
                <div className="patient-info">
                  <h2>{patientData.name}</h2>
                  <p>Age: 65</p>
                  <p>Chief Complaint: {patientData.chiefComplaint}</p>
                </div>
              </div>
              
              <VitalSignsDisplay vitals={vitals} />
              
              <CommunicationGuide
                currentStep={currentStep}
                onNextStep={handleNextStep}
                onPreviousStep={handlePreviousStep}
              />
            </div>
          </div>
        ) : (
          <ARInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            patientData={patientData}
            vitalSigns={vitals}
          />
        )}
      </main>
    </div>
  );
} 