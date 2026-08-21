import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

type Role = 'client' | 'lawyer'

type SignupOtpState = {
  email?: string
  role?: Role
}

export default function SignupOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state || {}) as SignupOtpState
  const email = state.email?.trim().toLowerCase() || ''
  const role = state.role === 'lawyer' ? 'lawyer' : 'client'

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      navigate('/signup', { replace: true })
      return
    }

    void sendOtp()
  }, [email, navigate])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown])

  const sendOtp = async () => {
    if (!email || sending || countdown > 0) return
    setSending(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'register' }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Unable to send verification code')
      }

      setMessage('Verification code sent. Check your email.')
      setOtp(['', '', '', '', '', ''])
      setCountdown(60)
      otpRefs.current[0]?.focus()
    } catch (err: any) {
      setError(err.message || 'Unable to send verification code')
    } finally {
      setSending(false)
    }
  }

  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter the 6-digit verification code')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, purpose: 'register' }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Invalid verification code')
      }

      if (data.token) localStorage.setItem('token', data.token)
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
      navigate(role === 'lawyer' ? '/lawyer-dashboard' : '/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const updateOtp = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', maxWidth: 420 }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
          Verify Your Email
        </h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          Enter the 6-digit code sent to<br />
          <strong style={{ color: 'var(--text)' }}>{email}</strong>
        </p>

        {error && <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        {message && <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</div>}

        <form onSubmit={verifyOtp}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: '1.25rem' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => { otpRefs.current[index] = element }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => updateOtp(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                style={{ width: 44, height: 52, textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, border: '1.5px solid var(--border)', borderRadius: 10, outline: 'none' }}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || otp.join('').length !== 6} style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
          {countdown > 0 ? (
            <span style={{ color: 'var(--text-muted)' }}>Resend in {countdown}s</span>
          ) : (
            <button type="button" style={{ background: 'none', color: 'var(--primary)', fontWeight: 600 }} onClick={() => void sendOtp()} disabled={sending}>
              {sending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
