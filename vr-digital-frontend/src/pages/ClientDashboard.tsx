import { Link } from 'react-router-dom'
import { appointments, cases, currentUser, lawyers } from '../data/mockData'
import { Calendar, FileText, CreditCard, User, Clock, Video, MapPin } from 'lucide-react'

export default function ClientDashboard() {
  const myAppointments = appointments.filter(a => a.clientId === currentUser.id)
  const myCases = cases.filter(c => c.clientId === currentUser.id)
  const upcoming = myAppointments.filter(a => a.status === 'upcoming')

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ padding: '0 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700 }}>{currentUser.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Client Account</div>
        </div>
        <ul className="sidebar-nav">
          <li><a href="#" className="active"><User size={18} /> Overview</a></li>
          <li><Link to="/calendar"><Calendar size={18} /> Calendar</Link></li>
          <li><Link to="/cases"><FileText size={18} /> My Cases</Link></li>
          <li><a href="#"><CreditCard size={18} /> Payments</a></li>
          <li><Link to="/lawyers"><Clock size={18} /> Book Lawyer</Link></li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Welcome back, {currentUser.name.split(' ')[0]}
        </h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="label">Upcoming Appointments</div>
            <div className="value">{upcoming.length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Active Cases</div>
            <div className="value">{myCases.length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Completed Sessions</div>
            <div className="value">{myAppointments.filter(a => a.status === 'completed').length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Total Spent</div>
            <div className="value" style={{ fontSize: '1.35rem' }}>
              Rs. {myAppointments.reduce((s, a) => s + a.fee, 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Upcoming Appointments</h3>
            {upcoming.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No upcoming appointments. <Link to="/lawyers" style={{ color: 'var(--primary)' }}>Book one</Link></p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcoming.map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.lawyerName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: 12, marginTop: 4 }}>
                        <span><Calendar size={14} style={{ verticalAlign: 'middle' }} /> {a.date}</span>
                        <span><Clock size={14} style={{ verticalAlign: 'middle' }} /> {a.time}</span>
                        {a.type === 'video' ? <span><Video size={14} style={{ verticalAlign: 'middle' }} /> Video</span> : <span><MapPin size={14} style={{ verticalAlign: 'middle' }} /> In-person</span>}
                      </div>
                    </div>
                    <span className="badge badge-info">{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>My Cases</h3>
            {myCases.map(c => (
              <div key={c.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Status: <span className="badge badge-warning">{c.status}</span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${c.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{c.progress}% complete</div>
              </div>
            ))}
            <Link to="/cases" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>View all cases →</Link>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Recommended Lawyers</h3>
          <div className="lawyer-grid">
            {lawyers.filter(l => l.online).slice(0, 3).map(l => (
              <div key={l.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <img src={l.photo} alt="" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{l.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.specialization[0]} • Rs. {l.fee.toLocaleString()}</div>
                </div>
                <Link to={`/book/${l.id}`} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Book</Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
