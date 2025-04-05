import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { FaMicrophoneSlash } from 'react-icons/fa';
import { FaStop } from 'react-icons/fa';
import { FaVideo } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaVolumeUp } from 'react-icons/fa';
import { FaHeartbeat } from 'react-icons/fa';

const ARInterface = ({ messages, onSendMessage, isLoading, patientData, vitalSigns }) => {
  const messagesEndRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    // Only scroll if we're in AR mode and there are messages
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;
        
        setTranscript(transcriptText);
        
        if (result.isFinal) {
          handleSendVoiceMessage(transcriptText);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start();
        }
      };

      setMediaRecorder(recognition);
    }
  }, []);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsPlayingAudio(false);
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
      setTranscript('');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSendVoiceMessage = async (text) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    
    // Send the message to the parent component
    onSendMessage(text);
    
    // Clear the transcript
    setTranscript('');
    
    // Process with OpenAI API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from OpenAI');
      }
      
      const data = await response.json();
      
      // Play audio response if available
      if (data.audioUrl) {
        playAudioResponse(data.audioUrl);
      }
      
      // The response will be handled by the parent component
      // through the onSendMessage callback
    } catch (error) {
      console.error('Error processing voice message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudioResponse = async (audioUrl) => {
    if (audioRef.current) {
      setIsPlayingAudio(true);
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlayingAudio(false);
      });
    }
  };

  const toggleVitals = () => {
    setShowVitals(!showVitals);
    if (showPatientInfo) setShowPatientInfo(false);
  };

  const togglePatientInfo = () => {
    setShowPatientInfo(!showPatientInfo);
    if (showVitals) setShowVitals(false);
  };

  return (
    <div className="ar-container">
      {/* Main AR View */}
      <div className="ar-main-view">
        <div className="ar-patient-view">
          {/* Patient video feed would go here */}
          <div className="patient-placeholder">
            <img src="/bg.png" alt="Patient Background" className="patient-image" />
          </div>
          
          {/* Microphone overlay */}
          <div className="ar-microphone-overlay">
            {isRecording ? (
              <div className="recording-indicator">
                <div className="recording-pulse"></div>
                <p className="recording-text">Listening... {transcript}</p>
              </div>
            ) : (
              <button 
                className="ar-microphone-button" 
                onClick={startRecording}
                disabled={isProcessing || isPlayingAudio}
                aria-label="Start recording"
              >
                <FaMicrophone />
              </button>
            )}
            
            {isRecording && (
              <button 
                className="ar-stop-button" 
                onClick={stopRecording}
                aria-label="Stop recording"
              >
                <FaStop />
              </button>
            )}
            
            {isPlayingAudio && (
              <div className="audio-playing-indicator">
                <FaVolumeUp />
                <p>Playing response...</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Overlay Controls */}
        <div className="ar-controls">
          <button 
            className="ar-control-button"
            onClick={toggleVitals}
            aria-label="Toggle vitals"
          >
            <FaHeartbeat />
          </button>
          <button 
            className="ar-control-button"
            onClick={togglePatientInfo}
            aria-label="Show patient info"
          >
            <FaInfoCircle />
          </button>
        </div>
        
        {/* Vitals Pop-up */}
        {showVitals && (
          <div className="ar-vitals-popup">
            <div className="popup-header">
              <h3>Vital Signs</h3>
              <button 
                className="popup-close-button"
                onClick={toggleVitals}
                aria-label="Close vitals"
              >
                ×
              </button>
            </div>
            <div className="vitals-content">
              <div className="vital-sign">
                <span>Heart Rate:</span>
                <span>{vitalSigns.heartRate} bpm</span>
              </div>
              <div className="vital-sign">
                <span>Blood Pressure:</span>
                <span>{vitalSigns.bloodPressure}</span>
              </div>
              <div className="vital-sign">
                <span>Oxygen Saturation:</span>
                <span>{vitalSigns.oxygenSaturation}%</span>
              </div>
              <div className="vital-sign">
                <span>Temperature:</span>
                <span>{vitalSigns.temperature}°F</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Patient Info Pop-up */}
        {showPatientInfo && (
          <div className="ar-patient-popup">
            <div className="popup-header">
              <h3>Patient Information</h3>
              <button 
                className="popup-close-button"
                onClick={togglePatientInfo}
                aria-label="Close patient info"
              >
                ×
              </button>
            </div>
            <div className="patient-info-content">
              <p><strong>Name:</strong> {patientData.name}</p>
              <p><strong>Age:</strong> 65</p>
              <p><strong>Chief Complaint:</strong> {patientData.chiefComplaint}</p>
              <p><strong>History:</strong> {patientData.history}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Communication Interface */}
      <div className="ar-communication">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === 'user' ? 'user-message' : 'ai-message'
              }`}
            >
              <div className="message-content">
                <p className="message-text">{message.text}</p>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="loading-spinner">
              <div className="spinner-dot"></div>
              <div className="spinner-dot"></div>
              <div className="spinner-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ARInterface; 