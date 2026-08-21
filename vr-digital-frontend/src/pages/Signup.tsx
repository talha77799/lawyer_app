import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

type Role = 'client' | 'lawyer'

type SignupForm = {
  name: string
  email: string
  phone: string
  city: string
  password: string
  confirmPassword: string
}

export default function Signup() {
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('client')
  const [form, setForm] = useState<SignupForm>({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qualificationDocument, setQualificationDocument] = useState<File | null>(null)

  const updateField = (field: keyof SignupForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const requestBody = new FormData()
      requestBody.append('name', form.name.trim())
      requestBody.append('email', form.email.trim().toLowerCase())
      requestBody.append('phone', form.phone.trim())
      requestBody.append('city', form.city.trim())
      requestBody.append('password', form.password)
      requestBody.append('role', role)
      if (qualificationDocument) requestBody.append('qualificationDocument', qualificationDocument)

      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        body: requestBody,
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to create your account')
      }

      if (data.token) localStorage.setItem('token', data.token)
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/signup/otp', {
        state: { email: form.email.trim().toLowerCase(), role },
      })
    } catch (err: any) {
      setError(err.message || 'Unable to create your account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', maxWidth: 480 }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
          Create Your Account
        </h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          Join VR-Digital and get started
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
          {(['client', 'lawyer'] as Role[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`btn ${role === option ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: 1, justifyContent: 'center', textTransform: 'capitalize' }}
              onClick={() => setRole(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-name">Full Name</label>
            <input id="signup-name" type="text" required value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Your full name" />
          </div>

          {role === 'lawyer' && (
            <div className="form-group">
              <label htmlFor="signup-qualification">Law certificate / degree</label>
              <input id="signup-qualification" type="file" required accept="application/pdf,image/png,image/jpeg" onChange={(e) => setQualificationDocument(e.target.files?.[0] || null)} />
              <small style={{ color: 'var(--text-muted)' }}>PDF, PNG, or JPG up to 5 MB</small>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@email.com" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="signup-phone">Phone</label>
              <input id="signup-phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+92 3xx xxxxxxx" />
            </div>
            <div className="form-group">
              <label htmlFor="signup-city">City</label>
              <input id="signup-city" type="text" value={form.city} onChange={(e) => updateField('city', e.target.value)} placeholder="Lahore" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" required minLength={6} value={form.password} onChange={(e) => updateField('password', e.target.value)} placeholder="At least 6 characters" />
          </div>

          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <input id="signup-confirm-password" type="password" required minLength={6} value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="Re-enter your password" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log In</Link>
        </p>
      </div>
    </div>
  )
}
