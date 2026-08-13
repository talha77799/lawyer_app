import { useParams, useNavigate } from 'react-router-dom'
import { lawyers } from '../data/mockData'
import { useState } from 'react'
import { Video, Building, CheckCircle } from 'lucide-react'

export default function BookAppointment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lawyer = lawyers.find(l => l.id === id)
  const [type, setType] = useState<'video' | 'in-person'>('video')
  const [slot, setSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  if (!lawyer) return <div className="container" style={{ padding: '3rem' }}>Lawyer not found.</div>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!slot) return alert('Please select a time slot')
    setDone(true)
  }

  if (done) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 480, margin: '0 auto', padding: '2.5rem' }}>
          <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Your {type} consultation with {lawyer.name} has been scheduled.
          </p>
          <p style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Slot: {slot}</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem', maxWidth: 640 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Book Appointment
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        with {lawyer.name} • Rs. {lawyer.fee.toLocaleString()} / session
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '1.75rem' }}>
        <div className="form-group">
          <label>Consultation Type</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              className={`btn ${type === 'video' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setType('video')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Video size={18} /> Video Call
            </button>
            <button
              type="button"
              className={`btn ${type === 'in-person' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setType('in-person')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Building size={18} /> In-person
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Select Time Slot</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {lawyer.availability.map(s => (
              <button
                key={s}
                type="button"
                className={`btn ${slot === s ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.5rem 1rem' }}
                onClick={() => setSlot(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Notes / Case Brief (optional)</label>
          <textarea
            rows={4}
            placeholder="Briefly describe your legal matter..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>Consultation Fee</span>
            <span style={{ fontWeight: 700 }}>Rs. {lawyer.fee.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Platform fee</span>
            <span>Rs. 0</span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
          Confirm & Pay Rs. {lawyer.fee.toLocaleString()}
        </button>
      </form>
    </div>
  )
}
