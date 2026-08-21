import { appointments, cases, clients, lawyers } from '../data/mockData'
import { Calendar, Users, Wallet, Star, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStoredUser } from '../utils/api'

const lawyer = lawyers[0] // Demo as Adv. Ayesha Khan

export default function LawyerDashboard() {
  const signedInUser = getStoredUser()
  const lawyerName = signedInUser?.name || signedInUser?.username || lawyer.name
  const myAppts = appointments.filter(a => a.lawyerId === lawyer.id)
  const myCases = cases.filter(c => c.lawyerId === lawyer.id)
  const upcoming = myAppts.filter(a => a.status === 'upcoming')
  const earnings = myAppts.reduce((s, a) => s + a.fee, 0)

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ padding: '0 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700 }}>{lawyerName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lawyer Dashboard</div>
        </div>
        <ul className="sidebar-nav">
          <li><a href="#" className="active"><Users size={18} /> Overview</a></li>
          <li><Link to="/lawyer/availability"><Calendar size={18} /> Availability</Link></li>
          <li><Link to="/lawyer/wallet"><Wallet size={18} /> Wallet &amp; Payouts</Link></li>
          <li><Link to="/lawyer/reviews"><Star size={18} /> Reviews</Link></li>
          <li><Link to="/lawyer/profile"><Clock size={18} /> My Profile</Link></li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Welcome back, {lawyerName}
        </h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="label">Today's Appointments</div>
            <div className="value">{upcoming.length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Active Cases</div>
            <div className="value">{myCases.length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Total Earnings</div>
            <div className="value" style={{ fontSize: '1.35rem' }}>Rs. {earnings.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="label">Rating</div>
            <div className="value">{lawyer.rating} ★</div>
            <div className="change">{lawyer.reviews} reviews</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Upcoming Bookings</h3>
            {upcoming.map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.clientName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {a.date} at {a.time} • {a.type === 'video' ? 'Video' : 'In-person'}
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Rs. {a.fee.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Recent Clients</h3>
            {clients.slice(0, 4).map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.city} • {c.cases} cases</div>
                </div>
                <span className="badge badge-info">{c.phone.slice(-4)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Case Progress Overview</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Next Hearing</th>
                </tr>
              </thead>
              <tbody>
                {myCases.map(c => {
                  const client = clients.find(cl => cl.id === c.clientId)
                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.title}</td>
                      <td>{client?.name}</td>
                      <td><span className="badge badge-warning">{c.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, background: '#e2e8f0', height: 6, borderRadius: 3 }}>
                            <div style={{ width: `${c.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.8rem' }}>{c.progress}%</span>
                        </div>
                      </td>
                      <td>{c.nextHearing || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
