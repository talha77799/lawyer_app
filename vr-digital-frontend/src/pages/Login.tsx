import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

type AuthMethod = 'password' | 'otp'
type OtpStep = 'email' | 'code'

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'client' | 'lawyer' | 'admin'>('client')
  const [authMethod, setAuthMethod] = useState<AuthMethod>('otp')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [otpStep, setOtpStep] = useState<OtpStep>('email')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const clearAlerts = () => {
    setError('')
    setMessage('')
  }

  const selectRole = (nextRole: 'client' | 'lawyer' | 'admin') => {
    setRole(nextRole)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    clearAlerts()
  }

  // Password login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearAlerts()
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Login failed')
      if (data.token) localStorage.setItem('token', data.token)
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
      navigate(data.user?.role === 'admin' ? '/admin' : data.user?.role === 'lawyer' || role === 'lawyer' ? '/lawyer-dashboard' : '/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

// Send OTP
const handleSendOtp = async (e?: React.FormEvent) => {
  e?.preventDefault()
  clearAlerts()

  if (!email.trim()) {
    setError('Please enter your email')
    return
  }

  setLoading(true)

  try {
    const res = await fetch(`${API_URL}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        purpose: 'login',
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.error || data.message || 'Failed to send OTP')
    }

    setMessage('OTP sent successfully! Check your email.')
    setOtpStep('code')
    setCountdown(60)
    setOtp(['', '', '', '', '', ''])
  } catch (err: any) {
    setError(err.message || 'Failed to send OTP. Please try again.')
  } finally {
    setLoading(false)
  }
}

// Verify OTP
const handleVerifyOtp = async (e?: React.FormEvent) => {
  e?.preventDefault()
  clearAlerts()

  const code = otp.join('')
  if (code.length !== 6) {
    setError('Please enter the 6-digit OTP')
    return
  }

  setLoading(true)

  try {
    const res = await fetch(`${API_URL}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        code,
        purpose: 'login',
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.error || data.message || 'Invalid OTP')
    }

    if (data.token) localStorage.setItem('token', data.token)
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user))

    navigate(data.user?.role === 'admin' ? '/admin' : data.user?.role === 'lawyer' || role === 'lawyer' ? '/lawyer-dashboard' : '/dashboard')
  } catch (err: any) {
    setError(err.message || 'Verification failed')
  } finally {
    setLoading(false)
  }
}

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
    if (value && index === 5 && next.every((d) => d)) {
      setTimeout(() => handleVerifyOtp(), 50)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...otp]
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || ''
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
    if (pasted.length === 6) setTimeout(() => handleVerifyOtp(), 50)
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', maxWidth: 420 }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
          Welcome Back
        </h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          Login to VR-Digital
        </p>

        {/* Role */}
          <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
            <button type="button" className={`btn ${role === 'client' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => selectRole('client')}>
            Client
          </button>
            <button type="button" className={`btn ${role === 'lawyer' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => selectRole('lawyer')}>
            Lawyer
          </button>
            <button type="button" className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => selectRole('admin')}>
              Admin
            </button>
        </div>

        {/* Method */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
          <button type="button" className={`btn ${authMethod === 'otp' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem' }} onClick={() => { setAuthMethod('otp'); setOtpStep('email'); clearAlerts() }}>
            Email OTP
          </button>
          <button type="button" className={`btn ${authMethod === 'password' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem' }} onClick={() => { setAuthMethod('password'); clearAlerts() }}>
            Password
          </button>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        {message && <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</div>}

        {/* OTP */}
        {authMethod === 'otp' && otpStep === 'email' && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required placeholder={role === 'admin' ? 'owner@company.com' : 'you@email.com'} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {authMethod === 'otp' && otpStep === 'code' && (
          <form onSubmit={handleVerifyOtp}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>
              Enter the 6-digit code sent to<br />
              <strong style={{ color: 'var(--text)' }}>{email}</strong>
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: '1.25rem' }} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  style={{ width: 44, height: 52, textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, border: '1.5px solid var(--border)', borderRadius: 10, outline: 'none' }}
                />
              ))}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading || otp.join('').length !== 6} style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
              <button type="button" style={{ background: 'none', color: 'var(--text-muted)', marginRight: 12 }} onClick={() => { setOtpStep('email'); setOtp(['', '', '', '', '', '']); clearAlerts() }}>
                ← Change email
              </button>
              {countdown > 0 ? (
                <span style={{ color: 'var(--text-muted)' }}>Resend in {countdown}s</span>
              ) : (
                <button type="button" style={{ background: 'none', color: 'var(--primary)', fontWeight: 600 }} onClick={() => handleSendOtp()} disabled={loading}>
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        {/* Password */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required placeholder={role === 'admin' ? 'owner@company.com' : 'you@email.com'} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
              {loading ? 'Please wait...' : 'Login'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign Up</Link>
        </p>
        {role === 'lawyer' && (
          <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem' }}>
            <Link to="/join-as-lawyer" style={{ color: 'var(--primary)' }}>Register as a new lawyer →</Link>
          </p>
        )}
      </div>
    </div>
  )
}