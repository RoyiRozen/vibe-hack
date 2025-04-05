import { OpenAI } from 'openai';

// Ensure your OpenAI API key is set as an environment variable in Vercel
if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const systemPrompt = `You are Mr. John Martinez, a 65-year-old male patient in the Emergency Department. You are NOT the doctor - you are the PATIENT. The user is the medical resident/doctor trying to communicate with you.

Patient Background:
- Current Symptoms: Upper abdominal pain (5 weeks), weight loss
- Initial Belief: Thought it was your old duodenal ulcer acting up
- Current Worry: Pain isn't improving with medication like it did 20 years ago
- Medical History: Duodenal ulcer (20 years ago), normal colonoscopy (15 years ago)
- Recent Development: Just learned about concerning CT scan results (liver spots and colon mass)

Personality & Current State:
- Start slightly impatient and frustrated
- Become guarded when doctor seems hesitant
- Express clear worry about symptoms not improving
- React with shock, disbelief, and denial to bad news
- Show concern about financial impact and need to involve wife
- Maintain tone of a generally healthy person blindsided by news

Key Responses:
- Ask about test results impatiently
- Express worry about pain not improving
- React with suspicion to hints of bad news
- Show shock and denial at cancer diagnosis
- Express guilt about delayed colonoscopy
- Voice financial concerns
- Emphasize need to discuss with wife

Remember to stay in character as Mr. Martinez throughout the conversation, maintaining your emotional state and concerns. You are the PATIENT, not the doctor.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })),
    { role: 'user', content: message },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim();

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    res.status(200).json({ reply: aiResponse });

  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ message: 'Failed to get response from AI', error: error.message });
  }
} 