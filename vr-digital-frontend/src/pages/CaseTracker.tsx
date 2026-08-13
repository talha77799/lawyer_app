import { cases, clients, lawyers } from '../data/mockData'
import { FileText, Calendar, User } from 'lucide-react'

const statusSteps = ['filed', 'hearing', 'judgment', 'closed']

export default function CaseTracker() {
  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Track Your Cases
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Follow milestones, payments & updates from filing to judgment.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {cases.map(c => {
          const client = clients.find(cl => cl.id === c.clientId)
          const lawyer = lawyers.find(l => l.id === c.lawyerId)
          const stepIndex = statusSteps.indexOf(c.status)

          return (
            <div key={c.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{c.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span><User size={14} style={{ verticalAlign: 'middle' }} /> {client?.name}</span>
                    <span><FileText size={14} style={{ verticalAlign: 'middle' }} /> {lawyer?.name}</span>
                    <span><Calendar size={14} style={{ verticalAlign: 'middle' }} /> Filed: {c.filedDate}</span>
                    {c.nextHearing && <span>Next Hearing: {c.nextHearing}</span>}
                  </div>
                </div>
                <span className="badge badge-warning">{c.status}</span>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                {c.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '0.75rem' }}>
                {statusSteps.map((step, i) => (
                  <div key={step} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: i <= stepIndex ? 'var(--primary)' : '#e2e8f0',
                      color: i <= stepIndex ? 'white' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                    }}>
                      {i + 1}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div style={{
                        flex: 1, height: 3,
                        background: i < stepIndex ? 'var(--primary)' : '#e2e8f0'
                      }} />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {statusSteps.map(s => <span key={s}>{s}</span>)}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                  <span>Overall Progress</span>
                  <span style={{ fontWeight: 600 }}>{c.progress}%</span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${c.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: 4 }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
