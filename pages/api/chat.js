import OpenAI from 'openai';

// Ensure your OpenAI API key is set as an environment variable in Vercel
if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key is not set in environment variables');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, caseType } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return res.status(500).json({ 
        error: 'OpenAI API key is not configured',
        details: 'Please set the OPENAI_API_KEY environment variable in your Vercel project settings.'
      });
    }

    // Initialize OpenAI API with the newer format
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Get conversation history from the request
    const conversationHistory = req.body.history || [];
    
    // Format messages for OpenAI
    const formattedMessages = conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Add the current message
    formattedMessages.push({
      role: 'user',
      content: message
    });

    // Determine system prompt based on case type
    let systemPrompt = "You are a medical communication assistant helping healthcare providers practice patient communication. You simulate a patient named Mr. John Martinez, a 65-year-old male. Respond as if you are the patient, based on the current step in the PEARLS communication framework. Keep responses concise and realistic.";
    
    if (caseType === 'Difficult Conversation') {
      systemPrompt = "You are a medical communication assistant helping healthcare providers practice difficult conversations. You simulate a patient named Mr. John Martinez, a 65-year-old male who is non-adherent to medication and lifestyle changes. Respond as if you are the patient, expressing frustration and resistance to medical advice. Keep responses concise and realistic.";
    } else if (caseType === 'Patient-Centered Communication') {
      systemPrompt = "You are a medical communication assistant helping healthcare providers practice patient-centered communication. You simulate a patient named Mr. John Martinez, a 65-year-old male with multiple chronic conditions. Respond as if you are the patient, sharing your concerns, values, and preferences. Keep responses concise and realistic.";
    } else if (caseType === 'Breaking Bad News') {
      systemPrompt = "You are a medical communication assistant helping healthcare providers practice breaking bad news. You simulate a patient named Mr. John Martinez, a 65-year-old male who has just been diagnosed with a serious condition. Respond as if you are the patient, expressing emotions like shock, denial, anger, or sadness. Keep responses concise and realistic.";
    } else if (caseType === 'Conflict Resolution') {
      systemPrompt = "You are a medical communication assistant helping healthcare providers practice conflict resolution. You simulate a patient named Mr. John Martinez, a 65-year-old male who is upset about his care or treatment plan. Respond as if you are the patient, expressing frustration, anger, or dissatisfaction. Keep responses concise and realistic.";
    } else if (caseType === 'End-of-Life Discussion') {
      systemPrompt = "You are a medical communication assistant helping healthcare providers practice end-of-life discussions. You simulate a patient named Mr. John Martinez, a 65-year-old male with a terminal condition. Respond as if you are the patient, sharing your thoughts, fears, and wishes about end-of-life care. Keep responses concise and realistic.";
    }

    console.log('Sending request to OpenAI API with case type:', caseType);
    
    // Call OpenAI API for chat completion with the newer format
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...formattedMessages
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    // Extract the response
    const aiResponse = completion.choices[0].message.content;
    console.log('Received response from OpenAI:', aiResponse.substring(0, 50) + '...');

    // Generate audio for the response
    let audioUrl = null;
    try {
      console.log('Generating audio for response:', aiResponse.substring(0, 50) + '...');
      
      // Use the OpenAI API to generate speech
      const audioResponse = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: aiResponse
      });
      
      // Get the audio data as an ArrayBuffer
      const audioData = await audioResponse.arrayBuffer();
      
      // Convert to base64
      const base64Audio = Buffer.from(audioData).toString('base64');
      audioUrl = `data:audio/mp3;base64,${base64Audio}`;
      
      console.log('Audio generated successfully, length:', base64Audio.length);
    } catch (audioError) {
      console.error('Error generating audio:', audioError);
      // Continue without audio if there's an error
    }

    // Return the response with audio URL if available
    return res.status(200).json({ 
      message: aiResponse,
      audioUrl: audioUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 