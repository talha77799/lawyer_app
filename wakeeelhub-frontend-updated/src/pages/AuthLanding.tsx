import { Link } from 'react-router-dom'
import { ArrowRight, LogIn, UserPlus } from 'lucide-react'

export default function AuthLanding() {
  return (
    <main className="container" style={{ padding: '4rem 1.25rem', maxWidth: 920 }}>
      <section className="card" style={{ padding: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center' }}>
        <p style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          WakeelHub
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
          Your legal help starts here
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 2.5rem' }}>
          Sign in to continue or create an account to connect with trusted legal professionals.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', maxWidth: 620, margin: '0 auto' }}>
          <Link to="/login" className="btn btn-primary" style={{ minHeight: 104, padding: '1.25rem', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
            <LogIn size={24} />
            <span style={{ fontSize: '1rem' }}>Sign in</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.85 }}>Access your account</span>
          </Link>
          <Link to="/signup" className="btn btn-outline" style={{ minHeight: 104, padding: '1.25rem', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
            <UserPlus size={24} />
            <span style={{ fontSize: '1rem' }}>Sign up</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>Create a new account</span>
          </Link>
        </div>

        <Link to="/join-as-lawyer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '2rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
          Are you a lawyer? Join WakeelHub <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  )
}