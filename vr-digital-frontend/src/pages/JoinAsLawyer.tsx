import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function JoinAsLawyer() {
  const [submitted, setSubmitted] = useState(false)
  const [, setQualificationDocument] = useState<File | null>(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: 'Lahore', gender: 'Male',
    specialization: '', experience: '', barCouncil: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 480, margin: '0 auto', padding: '2.5rem' }}>
          <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h2>Registration Received!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            Our team will review your details and contact you within 5–6 working days for verification.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem', maxWidth: 640 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Register as a Lawyer
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Share your details and our team will guide you through onboarding, verification, and listing on VR-Digital.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { title: 'Reach clients nationwide', desc: 'Get discovered by city, category & consultation type' },
          { title: 'Online & in-person', desc: 'Offer video and chamber visits with your schedule' },
          { title: 'Secure payments', desc: 'Track earnings and request payouts in one wallet' },
          { title: 'Verified badge', desc: 'Bar verification helps you stand out as trusted' },
        ].map(b => (
          <div key={b.title} className="card" style={{ padding: '1rem' }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{b.title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{b.desc}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '1.75rem' }}>
        <div className="form-group">
          <label>Full Name</label>
          <input name="name" required value={form.name} onChange={handleChange} placeholder="Adv. Your Name" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone / WhatsApp</label>
            <input name="phone" required value={form.phone} onChange={handleChange} placeholder="+92 3xx xxxxxxx" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>City</label>
            <select name="city" value={form.city} onChange={handleChange}>
              {['Lahore','Karachi','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="form-group">
            <label>Experience (years)</label>
            <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Primary Specialization</label>
          <input name="specialization" required value={form.specialization} onChange={handleChange} placeholder="e.g. Family Law, Criminal Defense" />
        </div>
        <div className="form-group">
          <label>Bar Council</label>
          <input name="barCouncil" required value={form.barCouncil} onChange={handleChange} placeholder="e.g. Punjab Bar Council" />
        </div>
        <div className="form-group">
          <label>Law Certificate / Degree</label>
          <input name="qualificationDocument" type="file" required accept="application/pdf,image/png,image/jpeg" onChange={(e) => setQualificationDocument(e.target.files?.[0] || null)} />
          <small style={{ color: 'var(--text-muted)' }}>PDF, PNG, or JPG up to 5 MB</small>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
          Submit Registration
        </button>
      </form>
    </div>
  )
}
