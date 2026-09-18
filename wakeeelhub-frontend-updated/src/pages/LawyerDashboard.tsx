import { useEffect, useState } from 'react'
import { appointments, cases, clients, lawyers } from '../data/mockData'
import { Calendar, Users, Wallet, Star, Clock, LogOut, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest, getAssetUrl, getStoredUser } from '../utils/api'
import KnowledgeChatbot from '../components/KnowledgeChatbot'

const lawyer = lawyers[0] // Demo as Adv. Ayesha Khan

export default function LawyerDashboard() {
  const navigate = useNavigate()
  const [signedInUser, setSignedInUser] = useState<any>(getStoredUser())
  const [checking, setChecking] = useState(false)

  const checkVerificationStatus = async () => {
    try {
      setChecking(true)
      const res = await apiRequest('/auth/me')
      if (res.user) {
        setSignedInUser(res.user)
        localStorage.setItem('user', JSON.stringify(res.user))
      }
    } catch (err) {
      console.error('Failed to update user profile:', err)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    // Initial fetch of user status
    checkVerificationStatus()

    // Poll every 5 seconds until verified
    const timer = setInterval(() => {
      checkVerificationStatus()
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const lawyerName = signedInUser?.name || signedInUser?.username || lawyer.name
  const lawyerAvatar = getAssetUrl(signedInUser?.avatar)
  const lawyerInitials = lawyerName.split(' ').map((part: string) => part[0]).slice(0, 2).join('').toUpperCase() || 'L'
  
  // If a real user is signed in, filter by their ID (which will yield empty arrays for new users against mock data)
  const currentLawyerId = signedInUser?._id || lawyer.id
  const myAppts = appointments.filter(a => a.lawyerId === currentLawyerId)
  const myCases = cases.filter(c => c.lawyerId === currentLawyerId)
  const upcoming = myAppts.filter(a => a.status === 'upcoming')
  const earnings = myAppts.reduce((s, a) => s + a.fee, 0)
  
  const rating = signedInUser?.rating || 0
  const reviewsCount = signedInUser?.reviews || 0

  const displayValue = (val: number) => val === 0 ? '------' : val;
  const displayEarnings = (val: number) => val === 0 ? '------' : `Rs. ${val.toLocaleString()}`;

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
    window.location.reload()
  }

  // If lawyer is not yet verified by Admin, display the pending screen
  if (signedInUser?.role === 'lawyer' && !signedInUser?.verified) {
    return (
      <div
        style={{
          minHeight: '85vh',
          backgroundColor: '#0d131f',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.25rem',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#161f30',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'left'
          }}
        >
          {/* Circular Check Icon with Gold Border */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '1.5px solid #d97706',
              display: 'grid',
              placeItems: 'center',
              marginBottom: '1.5rem',
              backgroundColor: 'rgba(217, 119, 6, 0.08)'
            }}
          >
            <Check size={24} color="#f59e0b" strokeWidth={2.5} />
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.25
            }}
          >
            Profile created
          </h1>

          {/* Subheading text */}
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.95rem',
              lineHeight: '1.55',
              marginBottom: '1.75rem'
            }}
          >
            Your enrollment has been received and your profile is now on file with Counsel Registry Pakistan.
          </p>

          {/* Verification Box with Left Border Accent */}
          <div
            style={{
              backgroundColor: '#0f172a',
              borderLeft: '4px solid #d97706',
              borderRadius: '8px',
              padding: '1.25rem 1.25rem',
              marginBottom: '2rem'
            }}
          >
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#f8fafc',
                marginBottom: '0.4rem'
              }}
            >
              Verification in progress
            </h3>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: 0
              }}
            >
              We're confirming your enrollment with the Bar Council and will notify you within 2 working days.
            </p>
          </div>

          {/* Done / Check Status Button */}
          <button
            type="button"
            onClick={checkVerificationStatus}
            disabled={checking}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              outline: 'none'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
          >
            {checking ? 'Checking Status...' : 'Done'}
          </button>

          {/* Auto status & Logout footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
              Checking verification status...
            </span>
            <button
              type="button"
              onClick={handleLogout}
              style={{ background: 'none', border: 0, color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ padding: '0 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 }}>
              {lawyerAvatar ? <img src={lawyerAvatar} alt={`${lawyerName} profile`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : lawyerInitials}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{lawyerName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lawyer Dashboard</div>
            </div>
          </div>
        </div>
        <ul className="sidebar-nav">
          <li><a href="#" className="active"><Users size={18} /> Overview</a></li>
          <li><Link to="/lawyer/availability"><Calendar size={18} /> Availability</Link></li>
          <li><Link to="/lawyer/wallet"><Wallet size={18} /> Wallet &amp; Payouts</Link></li>
          <li><Link to="/lawyer/reviews"><Star size={18} /> Reviews</Link></li>
          <li><Link to="/lawyer/profile"><Clock size={18} /> My Profile</Link></li>
          <li>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '0.65rem 0.75rem',
                color: 'var(--danger, #dc2626)',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                borderRadius: 8,
                textAlign: 'left',
              }}
            >
              <LogOut size={18} /> Logout
            </button>
          </li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Welcome back, {lawyerName}
        </h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="label">Today's Appointments</div>
            <div className="value">{displayValue(upcoming.length)}</div>
          </div>
          <div className="stat-card">
            <div className="label">Active Cases</div>
            <div className="value">{displayValue(myCases.length)}</div>
          </div>
          <div className="stat-card">
            <div className="label">Total Earnings</div>
            <div className="value" style={{ fontSize: '1.35rem' }}>{displayEarnings(earnings)}</div>
          </div>
          <div className="stat-card">
            <div className="label">Rating</div>
            <div className="value">{rating === 0 ? '------' : `${rating} ★`}</div>
            <div className="change">{reviewsCount === 0 ? '------' : `${reviewsCount} reviews`}</div>
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
                  <th>Case details</th>
                  <th>Client profile</th>
                  <th>Lawyer profile</th>
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
                      <td style={{ minWidth: 230 }}>
                        <div style={{ fontWeight: 600 }}>{c.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{c.description || 'No case details provided.'}</div>
                      </td>
                      <td style={{ minWidth: 170 }}>
                        <div style={{ fontWeight: 600 }}>{client?.name || 'Unknown client'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{client?.city || 'Location unavailable'} • {client?.cases ?? 0} cases handled</div>
                      </td>
                      <td style={{ minWidth: 180 }}>
                        <div style={{ fontWeight: 600 }}>{lawyer.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{lawyer.specialization[0]} • {lawyer.casesHandled ?? 0} cases handled</div>
                      </td>
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
      <KnowledgeChatbot role="lawyer" />
    </div>
  )
}
