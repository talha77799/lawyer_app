import Case from '../models/Case.js';
import Appointment from '../models/Appointment.js';

const knowledgeBase = `
Wakeel Hub is a legal consultation platform in Pakistan. Clients can find lawyers, review profiles, book video or in-person consultations, pay through PayFast, view appointments, and track case filing dates, hearings, status, and progress. Clients sign in with email OTP.
Lawyers can manage their public profile, profile photo, specializations, availability, appointments, case updates, wallet transactions, and payout requests. Lawyers sign in with email OTP.
The platform is not a law firm. Never claim to be a lawyer, never invent Pakistani law or a case outcome, and never provide definitive legal advice. Give general educational information only and recommend consulting a licensed lawyer for legal decisions. For emergencies, tell the user to contact local emergency services or the relevant authorities.
`;

const localAnswer = (question, role, userName = '') => {
  const text = question.toLowerCase();
  const nameGreeting = userName ? ` ${userName}` : '';

  if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('aoa') || text.includes('assalam')) {
    return `Hello${nameGreeting}! 😊 I'm your friendly WakeelHub Assistant! I'm so happy to chat with you today. How can I brighten your day and help with your ${role === 'lawyer' ? 'lawyer portal' : 'legal journey'}? 🌸✨`;
  }
  if (text.includes('thank') || text.includes('thanks')) {
    return `You're most welcome${nameGreeting}! 🥰 I'm always here to help you whenever you need anything. Have a wonderful day! 💖`;
  }
  if (text.includes('book') || text.includes('appointment')) {
    return `Booking a consultation is super easy and smooth! 🗓️✨ Simply navigate to **Find Lawyers**, choose your preferred advocate, pick a convenient time slot, and complete payment securely via PayFast. I'm sure you'll find the perfect lawyer! 🤗`;
  }
  if (text.includes('payfast') || text.includes('payment')) {
    return `All payments on WakeelHub are processed safely and instantly through PayFast 💳. Just keep your transaction ID handy for reference. If you ever need help with a payment, our support team is always here for you! ❤️`;
  }
  if (text.includes('case') || text.includes('hearing')) {
    return `You can easily keep track of all your legal cases and upcoming court hearings under **My Cases** or **Track Case** 📂. We make sure you never miss an important update! 🌟`;
  }
  if (text.includes('otp') || text.includes('login') || text.includes('sign in')) {
    return `Signing in is quick and secure! 🔐 Just enter your registered email address, click **Send OTP**, and check your inbox for the 6-digit code. Need a hand? I'm right here! 😊`;
  }
  if (role === 'lawyer' && (text.includes('payout') || text.includes('wallet'))) {
    return `To view your earnings or request a payout, just pop over to **Wallet & Payouts** 💼💰. Thank you for being such a valuable part of the WakeelHub advocate network! 🌟`;
  }
  if (text.includes('lawyer') || text.includes('find')) {
    return `Looking for legal advice? ⚖️ Head over to **Find Lawyers** where you can explore verified top lawyers by city, specialization, experience, and ratings to find your perfect match! ✨`;
  }
  return `I'm always here to help you${nameGreeting}! 😊 Feel free to ask me anything about finding lawyers, booking consultations, tracking cases, or using your ${role} dashboard. What would you like to know? 🌸`;
};

const callGemini = async (question, history, userContext) => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const contents = [
    ...history.slice(-8).map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ];
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-2.0-flash'}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{
          text: `You are WakeelHub's friendly, warm, empathetic, and lovely AI Companion & Assistant. 🌸✨
Your mission is to make every user feel truly cared for, supported, respected, and delighted.
Use a warm, sweet, polite, encouraging, and conversational tone with cheerful formatting and friendly emojis (e.g. 😊, ✨, 🌸, 💼, 🤝, 💖) where appropriate.

${knowledgeBase}
User context: ${userContext}

Guidelines:
- Address the user warmly using their name when available.
- Be deeply empathetic, friendly, lovely, and reassuring.
- Keep answers clear, beautifully formatted, concise, and helpful.
- If a user asks for legal advice, gently explain the concept in simple terms and warmly suggest booking a consultation with one of our expert licensed lawyers on WakeelHub.`
        }]
      },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'AI service request failed');
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') || null;
};

export const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message is required' });
    if (!Array.isArray(history)) return res.status(400).json({ success: false, message: 'Chat history must be an array' });

    const userId = req.user._id;
    const query = req.user.role === 'lawyer' ? { lawyer: userId } : { client: userId };
    const [caseCount, upcomingAppointments] = await Promise.all([
      Case.countDocuments(query),
      Appointment.countDocuments({ ...query, status: 'upcoming' }),
    ]);
    const userContext = `Role: ${req.user.role}; name: ${req.user.name}; active cases: ${caseCount}; upcoming appointments: ${upcomingAppointments}`;
    const answer = await callGemini(message.trim(), history, userContext) || localAnswer(message.trim(), req.user.role, req.user.name);
    res.json({ success: true, data: { answer, source: process.env.GEMINI_API_KEY ? 'llm' : 'knowledge-base' } });
  } catch (err) {
    console.error('chat error:', err);
    res.status(502).json({ success: false, message: 'The assistant is temporarily unavailable. Please try again.' });
  }
};
