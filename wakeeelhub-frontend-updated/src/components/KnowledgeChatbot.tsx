import { useState } from 'react'
import { Bot, MessageCircle, Send, X } from 'lucide-react'
import { apiRequest } from '../utils/api'

type ChatRole = 'client' | 'lawyer'
type ChatMessage = { id: number; from: 'bot' | 'user'; text: string }

export default function KnowledgeChatbot({ role }: { role: ChatRole }) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: 'bot', text: `Hi. I can help with your ${role} portal and common platform questions.` },
  ])

  const ask = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const userMessage = { id: Date.now(), from: 'user' as const, text: trimmed }
    setMessages((current) => [...current, userMessage])
    setQuestion('')
    setLoading(true)
    try {
      const history = [...messages, userMessage].map((message) => ({ role: message.from === 'bot' ? 'assistant' : 'user', content: message.text }))
      const response = await apiRequest('/chat', { method: 'POST', body: JSON.stringify({ message: trimmed, history }) })
      setMessages((current) => [...current, { id: Date.now() + 1, from: 'bot', text: response.data.answer }])
    } catch (error: any) {
      setMessages((current) => [...current, { id: Date.now() + 1, from: 'bot', text: error.message || 'The assistant is temporarily unavailable. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="knowledge-chatbot">
      {open && (
        <section className="knowledge-chatbot-panel" aria-label="Knowledge assistant">
          <header className="knowledge-chatbot-header">
            <div><Bot size={18} /><strong>WakeelHub Assistant</strong></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant"><X size={18} /></button>
          </header>
          <div className="knowledge-chatbot-messages" aria-live="polite">
            {messages.map((message) => <div key={message.id} className={`knowledge-chatbot-message ${message.from}`}>{message.text}</div>)}
            {loading && <div className="knowledge-chatbot-message bot">Thinking...</div>}
          </div>
          <div className="knowledge-chatbot-suggestions">
            <button type="button" onClick={() => ask(role === 'lawyer' ? 'How do I request a payout?' : 'How do I book a consultation?')}>
              {role === 'lawyer' ? 'Payout help' : 'Book a consultation'}
            </button>
            <button type="button" onClick={() => ask('How do I track a case?')}>Track a case</button>
          </div>
          <form className="knowledge-chatbot-form" onSubmit={(event) => { event.preventDefault(); ask(question) }}>
            <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question..." aria-label="Ask the assistant" />
            <button type="submit" aria-label="Send question"><Send size={17} /></button>
          </form>
          <small className="knowledge-chatbot-disclaimer">General platform guidance only, not legal advice.</small>
        </section>
      )}
      <button type="button" className="knowledge-chatbot-toggle" onClick={() => setOpen((current) => !current)} aria-label={open ? 'Close assistant' : 'Open assistant'}>
        {open ? <X size={21} /> : <MessageCircle size={21} />}
      </button>
    </div>
  )
}
