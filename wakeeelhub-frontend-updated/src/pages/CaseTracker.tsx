import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, FileText, User, Clock, ArrowRight } from 'lucide-react'
import { apiRequest } from '../utils/api'

type LegalCase = {
  _id: string
  title: string
  status: 'filed' | 'hearing' | 'judgment' | 'closed'
  progress: number
  filedDate: string
  nextHearing?: string
  description: string
  updatedAt?: string
  lawyer?: { name?: string; specialization?: string[] }
}

const statusSteps = ['filed', 'hearing', 'judgment', 'closed']

export default function CaseTracker() {
  const [cases, setCases] = useState<LegalCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/cases').then(({ data }) => setCases(data || [])).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [])

  if (loading) return <main className="container" style={{ padding: '3rem 1.25rem' }}><p>Loading your cases...</p></main>

  return (
    <main className="container" style={{ padding: '2rem 1.25rem', maxWidth: 900 }}>
      <Link to="/dashboard" style={{ color: 'var(--primary)' }}>← Back to dashboard</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', margin: '1rem 0 1.5rem' }}>
        <div><h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>Track Your Cases</h1><p style={{ color: 'var(--text-muted)' }}>See case progress, recent updates, and upcoming hearings.</p></div>
        <Link to="/lawyers" className="btn btn-primary"><User size={17} /> Book a lawyer</Link>
      </div>
      {error && <div className="alert-error">{error}</div>}
      {!error && !cases.length && <div className="card" style={{ padding: '2rem', textAlign: 'center' }}><FileText size={34} color="var(--text-muted)" /><h3 style={{ margin: '0.75rem 0 0.35rem' }}>No cases yet</h3><p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Find a lawyer to start your legal matter.</p><Link to="/lawyers" className="btn btn-primary">Find a lawyer <ArrowRight size={16} /></Link></div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {cases.map((legalCase) => {
          const stepIndex = statusSteps.indexOf(legalCase.status)
          return <article key={legalCase._id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}><div><h3 style={{ fontWeight: 700, marginBottom: 6 }}>{legalCase.title}</h3><div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}><span><User size={14} style={{ verticalAlign: 'middle' }} /> {legalCase.lawyer?.name || 'Assigned lawyer'}</span><span><Calendar size={14} style={{ verticalAlign: 'middle' }} /> Filed: {legalCase.filedDate}</span>{legalCase.nextHearing && <span><Clock size={14} style={{ verticalAlign: 'middle' }} /> Hearing: {legalCase.nextHearing}</span>}</div></div><span className="badge badge-warning" style={{ textTransform: 'capitalize' }}>{legalCase.status}</span></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{legalCase.description || 'No case description provided.'}</p>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>{statusSteps.map((step, index) => <div key={step} style={{ flex: 1, display: 'flex', alignItems: 'center' }}><div style={{ width: 28, height: 28, borderRadius: '50%', background: index <= stepIndex ? 'var(--primary)' : '#e2e8f0', color: index <= stepIndex ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{index + 1}</div>{index < statusSteps.length - 1 && <div style={{ flex: 1, height: 3, background: index < stepIndex ? 'var(--primary)' : '#e2e8f0' }} />}</div>)}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{statusSteps.map((step) => <span key={step}>{step}</span>)}</div>
            <div style={{ marginTop: '1rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}><span>Overall progress</span><strong>{legalCase.progress}%</strong></div><div style={{ background: '#e2e8f0', borderRadius: 4, height: 10, overflow: 'hidden' }}><div style={{ width: `${legalCase.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: 4 }} /></div></div>
            {legalCase.updatedAt && <div style={{ borderTop: '1px solid var(--border)', marginTop: '1rem', paddingTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Last updated: {new Date(legalCase.updatedAt).toLocaleString()}</div>}
          </article>
        })}
      </div>
    </main>
  )
}
