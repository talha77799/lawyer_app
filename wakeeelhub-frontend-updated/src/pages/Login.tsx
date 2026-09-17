import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, User, Briefcase, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react'

import { API_URL } from '../utils/api'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type AuthMethod = 'password' | 'otp'
type OtpStep = 'email' | 'code'

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'client' | 'lawyer' | 'admin'>('client')
  const [authMethod, setAuthMethod] = useState<AuthMethod>('otp')
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
    setAuthMethod(nextRole === 'admin' ? 'password' : 'otp')
    setOtpStep('email')
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

  const ValidationIcon = ({ value, valid }: { value: string; valid: boolean }) => {
    if (!value) return null
    return valid ? (
      <CheckCircle2 size={18} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--success)' }} />
    ) : (
      <XCircle size={18} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--danger)' }} />
    )
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', maxWidth: 440 }}>
      <div className="card" style={{ padding: '2rem' }}>
        {/* Sign In / Sign Up Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
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
            Sign In
          </button>
          <Link
            to="/signup"
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
            Sign Up
          </Link>
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem', textAlign: 'center' }}>
          Welcome Back
        </h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          Login to your WakeelHub account
        </p>

        {/* Role */}
        {role !== 'admin' ? (
          <>
            <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 12, padding: 4, gap: 4, marginBottom: '0.75rem' }}>
              <button
                type="button"
                onClick={() => selectRole('client')}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '0.6rem', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.9rem',
                  background: role === 'client' ? 'var(--card)' : 'transparent',
                  color: role === 'client' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: role === 'client' ? 'var(--shadow)' : 'none',
                  transition: 'all .15s',
                }}
              >
                <User size={16} /> Client
              </button>
              <button
                type="button"
                onClick={() => selectRole('lawyer')}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '0.6rem', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.9rem',
                  background: role === 'lawyer' ? 'var(--card)' : 'transparent',
                  color: role === 'lawyer' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: role === 'lawyer' ? 'var(--shadow)' : 'none',
                  transition: 'all .15s',
                }}
              >
                <Briefcase size={16} /> Lawyer
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              We&apos;ll email you a one-time code — no password needed
            </p>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
              <ShieldCheck size={16} /> Admin Login
            </span>
            <button
              type="button"
              onClick={() => selectRole('client')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              ← Back
            </button>
          </div>
        )}

        {error && <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        {message && <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</div>}

        {/* OTP */}
        {role !== 'admin' && authMethod === 'otp' && otpStep === 'email' && !isForgotPasswordMode && (
          <form onSubmit={handleSendOtp} autoComplete="off">
            {/* Hidden dummy fields to absorb Chrome autofill */}
            <input type="text" name="prevent_autofill" id="prevent_autofill" style={{ display: 'none' }} tabIndex={-1} />
            <input type="password" name="prevent_autofill_pass" id="prevent_autofill_pass" style={{ display: 'none' }} tabIndex={-1} />
            <div className="form-group">
              <label>Email</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  required 
                  autoComplete="new-email"
                  name="login_email_field"
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingRight: '2.5rem', width: '100%' }}
                />
                <ValidationIcon value={email} valid={EMAIL_REGEX.test(email.trim())} />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  name="login_pass_field"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '2.75rem', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="https://www.wakeelhub.com/accounts/password/reset/?hl=en-in"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 0.4,
                  padding: '0.85rem',
                  background: 'transparent',
                  border: '1.5px solid var(--primary)',
                  color: 'var(--primary)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Forgot Password
              </a>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading || !email.trim() || !password.trim()} 
                style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}
              >
                {loading ? 'Please wait...' : 'Enter'}
              </button>
            </div>
          </form>
        )}

        {/* OTP - Forgot Password Mode */}
        {role !== 'admin' && authMethod === 'otp' && otpStep === 'email' && isForgotPasswordMode && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Email</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingRight: '2.5rem', width: '100%' }}
                />
                <ValidationIcon value={email} valid={EMAIL_REGEX.test(email.trim())} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordMode(false)
                  clearAlerts()
                }}
                style={{
                  flex: 0.4,
                  padding: '0.85rem',
                  background: 'transparent',
                  border: '1.5px solid var(--border)',
                  color: 'var(--text-muted)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ← Back
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading || !email.trim()} 
                style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {role !== 'admin' && authMethod === 'otp' && otpStep === 'code' && (
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
        {role === 'admin' && authMethod === 'password' && (
          <form onSubmit={handlePasswordSubmit} autoComplete="off">
            <input type="text" style={{ display: 'none' }} tabIndex={-1} />
            <input type="password" style={{ display: 'none' }} tabIndex={-1} />
            <div className="form-group">
              <label>Email</label>
              <input type="email" required autoComplete="new-email" name="admin_email_field" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  name="admin_pass_field"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '2.75rem', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
        {role !== 'admin' && (
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem' }}>
            <button
              type="button"
              onClick={() => selectRole('admin')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Admin login
            </button>
          </p>
        )}
      </div>
    </div>
  )
}