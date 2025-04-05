import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { FaMicrophoneSlash } from 'react-icons/fa';
import { FaStop } from 'react-icons/fa';

const ChatInterface = ({ messages, onSendMessage, isLoading, selectedCaseType }) => {
  const messagesEndRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Scroll to bottom of messages
  useEffect(() => {
    // Only scroll if we're in desktop mode and there are messages
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
        body: JSON.stringify({ 
          message: text,
          caseType: selectedCaseType || 'Difficult Conversation',
          history: messages.map(msg => ({
            sender: msg.sender,
            text: msg.text
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from OpenAI');
      }
      
      const data = await response.json();
      
      // The response will be handled by the parent component
      // through the onSendMessage callback
    } catch (error) {
      console.error('Error processing voice message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="chat-container">
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
      
      <div className="voice-input-container">
        {isRecording ? (
          <div className="recording-indicator">
            <div className="recording-pulse"></div>
            <p className="recording-text">Listening... {transcript}</p>
          </div>
        ) : (
          <p className="voice-instruction">Press the microphone button to start speaking</p>
        )}
        
        <div className="voice-controls">
          {isRecording ? (
            <button 
              className="voice-button stop-button" 
              onClick={stopRecording}
              aria-label="Stop recording"
            >
              <FaStop />
            </button>
          ) : (
            <button 
              className="voice-button record-button" 
              onClick={startRecording}
              disabled={isProcessing}
              aria-label="Start recording"
            >
              <FaMicrophone />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 