import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001/api`
const passwordRequirementsMessage = 'Password must be at least 10 characters and include an uppercase letter, a lowercase letter, and a special character'

type Role = 'client' | 'lawyer'

type SignupForm = {
  name: string
  email: string
  phone: string
  city: string
  password: string
  confirmPassword: string
  matricSchool: string
  intermediateCollege: string
  lawInstitution: string
  casesHandled: string
  casesCleared: string
  bankAccountNumber: string
  bankProvider: string
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
    matricSchool: '',
    intermediateCollege: '',
    lawInstitution: '',
    casesHandled: '',
    casesCleared: '',
    bankAccountNumber: '',
    bankProvider: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qualificationDocument, setQualificationDocument] = useState<File | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)

  const updateField = (field: keyof SignupForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (
      form.password.length < 10
      || !/[A-Z]/.test(form.password)
      || !/[a-z]/.test(form.password)
      || !/[^A-Za-z0-9]/.test(form.password)
    ) {
      setError(passwordRequirementsMessage)
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
      if (role === 'lawyer') {
        requestBody.append('matricSchool', form.matricSchool.trim())
        requestBody.append('intermediateCollege', form.intermediateCollege.trim())
        requestBody.append('lawInstitution', form.lawInstitution.trim())
        requestBody.append('casesHandled', form.casesHandled)
        requestBody.append('casesCleared', form.casesCleared)
        requestBody.append('bankAccountNumber', form.bankAccountNumber.trim())
        requestBody.append('bankProvider', form.bankProvider)
      }
      if (qualificationDocument) requestBody.append('qualificationDocument', qualificationDocument)
      if (profilePhoto) requestBody.append('avatar', profilePhoto)

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
        {/* Sign In / Sign Up Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
          <Link
            to="/login"
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              fontWeight: 600,
              fontSize: '1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              borderBottom: '3px solid transparent',
              marginBottom: '-2px',
              cursor: 'pointer',
            }}
          >
            Sign In
          </Link>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              fontWeight: 700,
              fontSize: '1rem',
              background: 'none',
              borderBottom: '3px solid var(--primary)',
              marginBottom: '-2px',
              color: 'var(--primary)',
              cursor: 'pointer',
            }}
          >
            Sign Up
          </button>
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem', textAlign: 'center' }}>
          Create Your Account
        </h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          Join WakeelHub and get started
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

          <div className="form-group">
            <label htmlFor="signup-profile-photo">Profile photo</label>
            <input id="signup-profile-photo" name="avatar" type="file" required accept="image/png,image/jpeg" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} />
            <small style={{ color: 'var(--text-muted)' }}>PNG or JPG up to 5 MB. This photo will appear on your profile.</small>
          </div>

          {role === 'lawyer' && (
            <>
              <div className="form-group">
                <label htmlFor="signup-matric-school">Matric school</label>
                <input id="signup-matric-school" required value={form.matricSchool} onChange={(e) => updateField('matricSchool', e.target.value)} placeholder="School name" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="signup-intermediate-college">Intermediate college</label>
                  <input id="signup-intermediate-college" required value={form.intermediateCollege} onChange={(e) => updateField('intermediateCollege', e.target.value)} placeholder="College name" />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-law-institution">Law university / institution</label>
                  <input id="signup-law-institution" required value={form.lawInstitution} onChange={(e) => updateField('lawInstitution', e.target.value)} placeholder="LLB institution" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="signup-cases-handled">Cases handled</label>
                  <input id="signup-cases-handled" type="number" min="0" required value={form.casesHandled} onChange={(e) => updateField('casesHandled', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-cases-cleared">Cases successfully cleared</label>
                  <input id="signup-cases-cleared" type="number" min="0" required value={form.casesCleared} onChange={(e) => updateField('casesCleared', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="signup-qualification">Law certificate / degree</label>
                <input id="signup-qualification" type="file" required accept="application/pdf,image/png,image/jpeg" onChange={(e) => setQualificationDocument(e.target.files?.[0] || null)} />
                <small style={{ color: 'var(--text-muted)' }}>PDF, PNG, or JPG up to 5 MB</small>
              </div>
              <div className="form-group">
                <label htmlFor="signup-bank-provider">Payment bank / wallet</label>
                <select id="signup-bank-provider" required value={form.bankProvider} onChange={(e) => updateField('bankProvider', e.target.value)}>
                  <option value="">Select provider</option>
                  {['EasyPaisa', 'JazzCash', 'HBL', 'UBL', 'MCB', 'Meezan Bank', 'Bank Alfalah', 'Other'].map((provider) => <option key={provider}>{provider}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="signup-bank-account">Bank account number for receiving payments</label>
                <input id="signup-bank-account" required value={form.bankAccountNumber} onChange={(e) => updateField('bankAccountNumber', e.target.value)} placeholder="Account number / IBAN" />
              </div>
            </>
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
            <input id="signup-password" type="password" required minLength={10} value={form.password} onChange={(e) => updateField('password', e.target.value)} />
            <small style={{ color: 'var(--text-muted)' }}>Use at least 10 characters with an uppercase letter, lowercase letter, and special character.</small>
          </div>

          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <input id="signup-confirm-password" type="password" required minLength={10} value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="Re-enter your password" />
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
