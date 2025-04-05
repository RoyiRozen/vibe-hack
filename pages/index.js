import React, { useState, useEffect } from 'react';
import VitalSignsDisplay from '../components/VitalSignsDisplay';
import CommunicationGuide from '../components/CommunicationGuide';
import ChatInterface from '../components/ChatInterface';
import pearlsData from '../data/pearls.json';

export default function Home() {
  const [vitals, setVitals] = useState({ hr: 85, bp: '120/80', spo2: 98 });
  const [alerts, setAlerts] = useState({ hr: false, bp: false, spo2: false });
  const [pearlsSteps] = useState(pearlsData.steps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Are my test results back yet? I've been waiting here for quite a while, and nobody has told me anything. I just want to know what's happening with this pain. It's not getting better with the medication like it did last time." }
  ]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setAlerts({
      hr: vitals.hr > 100 || vitals.hr < 50,
      spo2: vitals.spo2 < 92,
      bp: false,
    });
  }, [vitals]);

  const goToNextStep = () => {
    setCurrentStepIndex((prevIndex) => (prevIndex + 1) % pearlsSteps.length);
  };

  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim() || isSending) return;

    const newMessage = { sender: 'user', text: userMessage };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: updatedMessages.slice(-4)
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: data.reply }]);

    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prevMessages) => [...prevMessages, { 
        sender: 'ai', 
        text: "I'm having trouble understanding. Could you please repeat that?" 
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const triggerAnxiety = () => {
    setVitals(prevVitals => ({ ...prevVitals, hr: 110 }));
    setMessages(prevMessages => [...prevMessages, {
      sender: 'ai',
      text: "My heart feels like it's racing... Is that normal? I'm really starting to worry about what's going on here. The pain isn't getting any better, and now my heart is acting up too. I need to know what's happening with my test results."
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Emergency Department - Patient Communication</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isSending={isSending}
            />
          </div>
          
          <div className="space-y-4">
            <VitalSignsDisplay vitals={vitals} alerts={alerts} />
            <CommunicationGuide
              currentStep={pearlsSteps[currentStepIndex]}
              goToNextStep={goToNextStep}
            />
          </div>
        </div>

        <button
          onClick={triggerAnxiety}
          className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Trigger Anxiety (↑HR)
        </button>
      </div>
    </div>
  );
} 