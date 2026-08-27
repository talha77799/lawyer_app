import Case from '../models/Case.js';
import Appointment from '../models/Appointment.js';

const knowledgeBase = `
Wakeel Hub is a legal consultation platform in Pakistan. Clients can find lawyers, review profiles, book video or in-person consultations, pay through PayFast, view appointments, and track case filing dates, hearings, status, and progress. Clients sign in with email OTP.
Lawyers can manage their public profile, profile photo, specializations, availability, appointments, case updates, wallet transactions, and payout requests. Lawyers sign in with email OTP.
The platform is not a law firm. Never claim to be a lawyer, never invent Pakistani law or a case outcome, and never provide definitive legal advice. Give general educational information only and recommend consulting a licensed lawyer for legal decisions. For emergencies, tell the user to contact local emergency services or the relevant authorities.
`;

const localAnswer = (question, role) => {
  const text = question.toLowerCase();
  if (text.includes('book') || text.includes('appointment')) return 'To book a consultation, open Find Lawyers, choose a profile, select an available slot, and complete the PayFast payment. Keep the PayFast transaction ID for your records.';
  if (text.includes('payfast') || text.includes('payment')) return 'Consultation payments are made through PayFast. Keep your transaction ID and contact support with the appointment date if a payment is not reflected.';
  if (text.includes('case') || text.includes('hearing')) return 'Open My Cases or Track Case to see your case status, progress, filing date, and next hearing. The Calendar also displays important case dates.';
  if (text.includes('otp') || text.includes('login') || text.includes('sign in')) return 'Enter the email registered to your account, request one Email OTP, and enter the six-digit code. The code expires after 10 minutes.';
  if (role === 'lawyer' && (text.includes('payout') || text.includes('wallet'))) return 'Open Wallet & Payouts to review your available balance and submit a payout request. Keep your payment details current in My Profile.';
  if (text.includes('lawyer') || text.includes('find')) return 'Use Find Lawyers to compare city, specialization, rating, experience, availability, and consultation fee before booking.';
  return `I can help with ${role === 'lawyer' ? 'your profile, availability, appointments, cases, wallet, or payouts' : 'finding a lawyer, booking, PayFast payments, OTP sign-in, cases, or the calendar'}. Ask me a specific question.`;
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
      systemInstruction: { parts: [{ text: `You are Wakeel Hub Assistant.\n${knowledgeBase}\nUser context: ${userContext}\nAnswer clearly in 2-5 short paragraphs or bullets. Use the user's context only when relevant. If a question needs legal advice, explain the general concept and recommend a licensed lawyer.` }] },
      contents,
      generationConfig: { temperature: 0.25, maxOutputTokens: 500 },
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
    const answer = await callGemini(message.trim(), history, userContext) || localAnswer(message.trim(), req.user.role);
    res.json({ success: true, data: { answer, source: process.env.GEMINI_API_KEY ? 'llm' : 'knowledge-base' } });
  } catch (err) {
    console.error('chat error:', err);
    res.status(502).json({ success: false, message: 'The assistant is temporarily unavailable. Please try again.' });
  }
};
