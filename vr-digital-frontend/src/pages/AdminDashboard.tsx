import { useEffect, useState } from 'react'
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  FileCheck,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
  XCircle
} from 'lucide-react'
import { apiRequest, getStoredUser } from '../utils/api'

type Resource = 'users' | 'appointments' | 'cases' | 'reviews' | 'wallets' | 'availability'
type UserRole = 'all' | 'lawyer' | 'client' | 'admin'
type RecordValue = Record<string, any>

const resourceLabels: Record<Resource, string> = {
  users: 'Users & Profiles',
  appointments: 'Appointments',
  cases: 'Cases',
  reviews: 'Reviews',
  wallets: 'Wallets',
  availability: 'Availability'
}

const API_ORIGIN = (import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001/api`).replace(/\/api\/?$/, '')

const avatarUrl = (avatar: string) => (avatar?.startsWith('http') ? avatar : avatar ? `${API_ORIGIN}${avatar}` : '')
const docUrl = (doc: string) => (doc?.startsWith('http') ? doc : doc ? `${API_ORIGIN}${doc}` : '')
const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U'

export default function AdminDashboard() {
  const user = getStoredUser()
  const [stats, setStats] = useState<RecordValue>({})
  const [resource, setResource] = useState<Resource>('users')
  const [records, setRecords] = useState<RecordValue[]>([])
  const [error, setError] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserModal, setSelectedUserModal] = useState<RecordValue | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const load = async (selected: Resource = resource) => {
    try {
      const [overview, listing] = await Promise.all([
        apiRequest('/admin/overview'),
        apiRequest(`/admin/${selected}`)
      ])
      setStats(overview.stats || {})
      setRecords(listing.records || [])
      setError('')
    } catch (err: any) {
      setError(err.message || 'Unable to load admin data')
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') load()
  }, [resource])

  const update = async (id: string, updates: RecordValue) => {
    try {
      setActionLoading(true)
      const res = await apiRequest(`/admin/${resource}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      })
      if (selectedUserModal && selectedUserModal._id === id && res.record) {
        setSelectedUserModal(res.record)
      }
      await load()
    } catch (err: any) {
      alert(err.message || 'Failed to update record')
    } finally {
      setActionLoading(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this record?')) return
    try {
      setActionLoading(true)
      await apiRequest(`/admin/${resource}/${id}`, { method: 'DELETE' })
      if (selectedUserModal && selectedUserModal._id === id) {
        setSelectedUserModal(null)
      }
      await load()
    } catch (err: any) {
      alert(err.message || 'Failed to delete record')
    } finally {
      setActionLoading(false)
    }
  }

  if (user?.role !== 'admin') {
    return (
      <main className="container" style={{ padding: '4rem 1.25rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          <Shield size={44} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Access Required</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            This operations dashboard is restricted to administrator and platform owner accounts.
          </p>
        </div>
      </main>
    )
  }

  const metricIcons: Record<string, any> = {
    users: Users,
    lawyers: BriefcaseBusiness,
    clients: Users,
    appointments: Calendar,
    cases: FileText,
    reviews: BarChart3,
    wallets: CreditCard
  }

  // Filter users by role and search query
  const filteredRecords = records.filter((rec) => {
    if (resource !== 'users') return true

    // Role filter
    if (userRoleFilter !== 'all' && rec.role !== userRoleFilter) {
      return false
    }

    // Search filter
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const nameMatch = rec.name?.toLowerCase().includes(q)
    const emailMatch = rec.email?.toLowerCase().includes(q)
    const phoneMatch = rec.phone?.toLowerCase().includes(q)
    const cityMatch = rec.city?.toLowerCase().includes(q)
    const specMatch = Array.isArray(rec.specialization) && rec.specialization.some((s: string) => s.toLowerCase().includes(q))
    const barMatch = rec.barCouncil?.toLowerCase().includes(q)

    return nameMatch || emailMatch || phoneMatch || cityMatch || specMatch || barMatch
  })

  // Role count helpers
  const countLawyers = records.filter((r) => r.role === 'lawyer').length
  const countClients = records.filter((r) => r.role === 'client').length
  const countAdmins = records.filter((r) => r.role === 'admin').length

  const renderRoleBadge = (role: string) => {
    if (role === 'lawyer') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '0.25rem 0.65rem',
            borderRadius: 999,
            fontSize: '0.75rem',
            fontWeight: 700,
            background: 'rgba(234, 88, 12, 0.12)',
            color: '#c2410c',
            border: '1px solid rgba(234, 88, 12, 0.25)'
          }}
        >
          <BriefcaseBusiness size={12} /> Lawyer
        </span>
      )
    }
    if (role === 'client') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '0.25rem 0.65rem',
            borderRadius: 999,
            fontSize: '0.75rem',
            fontWeight: 700,
            background: 'rgba(13, 148, 136, 0.12)',
            color: '#0f766e',
            border: '1px solid rgba(13, 148, 136, 0.25)'
          }}
        >
          <Users size={12} /> Client
        </span>
      )
    }
    if (role === 'admin') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '0.25rem 0.65rem',
            borderRadius: 999,
            fontSize: '0.75rem',
            fontWeight: 700,
            background: 'rgba(124, 58, 237, 0.12)',
            color: '#6d28d9',
            border: '1px solid rgba(124, 58, 237, 0.25)'
          }}
        >
          <Shield size={12} /> Admin
        </span>
      )
    }
    return <span className="badge badge-info">{role || 'User'}</span>
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ padding: '0 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{user.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
            <Shield size={14} color="var(--primary)" /> Administrator
          </div>
        </div>

        <ul className="sidebar-nav">
          {(Object.keys(resourceLabels) as Resource[]).map((key) => {
            const Icon = metricIcons[key] || FileText
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => {
                    setResource(key)
                    setSearchQuery('')
                  }}
                  className={resource === key ? 'active' : ''}
                  style={{
                    width: '100%',
                    border: 0,
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    padding: '0.65rem 0.5rem',
                    fontWeight: resource === key ? 700 : 500
                  }}
                >
                  <Icon size={18} /> {resourceLabels[key]}
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>Operations Control</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
              Manage users, verify lawyer profiles, and oversee portal activity.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {Object.keys(metricIcons).map((key) => {
            const Icon = metricIcons[key]
            const labelTitle = key === 'users' ? 'Total Users' : key.charAt(0).toUpperCase() + key.slice(1)
            return (
              <div className="stat-card" key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="label" style={{ textTransform: 'capitalize' }}>{labelTitle}</div>
                  <div className="value">{stats[key] ?? 0}</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light, #f1f5f9)', display: 'grid', placeItems: 'center' }}>
                  <Icon size={20} color="var(--primary)" />
                </div>
              </div>
            )
          })}
        </div>

        {error && (
          <div style={{ color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <XCircle size={18} /> {error}
          </div>
        )}

        {/* Resource Card */}
        <div className="card" style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--border)', borderRadius: 12 }}>
          {/* Header Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{resourceLabels[resource]}</h2>
              <span className="badge badge-info" style={{ background: '#e2e8f0', color: '#334155', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.8rem' }}>
                {filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            {/* Users Search and Role Filters */}
            {resource === 'users' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* Search Input */}
                <div style={{ position: 'relative', minWidth: 220 }}>
                  <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search name, email, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      paddingLeft: '2rem',
                      paddingRight: '1rem',
                      paddingTop: '0.45rem',
                      paddingBottom: '0.45rem',
                      fontSize: '0.85rem',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      outline: 'none',
                      width: '100%'
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Role Filter Tabs */}
                <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: 8, gap: 2 }}>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('all')}
                    style={{
                      border: 0,
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: 6,
                      cursor: 'pointer',
                      background: userRoleFilter === 'all' ? '#fff' : 'transparent',
                      color: userRoleFilter === 'all' ? 'var(--text)' : 'var(--text-muted)',
                      boxShadow: userRoleFilter === 'all' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    All ({records.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('lawyer')}
                    style={{
                      border: 0,
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: userRoleFilter === 'lawyer' ? '#fff' : 'transparent',
                      color: userRoleFilter === 'lawyer' ? '#c2410c' : 'var(--text-muted)',
                      boxShadow: userRoleFilter === 'lawyer' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    <BriefcaseBusiness size={13} /> Lawyers ({countLawyers})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('client')}
                    style={{
                      border: 0,
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: userRoleFilter === 'client' ? '#fff' : 'transparent',
                      color: userRoleFilter === 'client' ? '#0f766e' : 'var(--text-muted)',
                      boxShadow: userRoleFilter === 'client' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    <Users size={13} /> Clients ({countClients})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('admin')}
                    style={{
                      border: 0,
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: userRoleFilter === 'admin' ? '#fff' : 'transparent',
                      color: userRoleFilter === 'admin' ? '#6d28d9' : 'var(--text-muted)',
                      boxShadow: userRoleFilter === 'admin' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    <Shield size={13} /> Admins ({countAdmins})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Records Table */}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {resource === 'users' && (
                    <>
                      <th style={{ width: 60 }}>Photo</th>
                      <th>User & Role Profile</th>
                      <th>Contact & City</th>
                      <th>Profile Details & Credentials</th>
                      <th>Account Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {resource === 'appointments' && (
                    <>
                      <th>Participants</th>
                      <th>Type & Fee</th>
                      <th>Case / Notes</th>
                      <th>Schedule Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {resource === 'cases' && (
                    <>
                      <th>Case Title</th>
                      <th>Client Profile</th>
                      <th>Lawyer Profile</th>
                      <th>Next Hearing</th>
                      <th>Status & Progress</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {resource === 'reviews' && (
                    <>
                      <th>Rating & Comment</th>
                      <th>Lawyer</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {resource === 'wallets' && (
                    <>
                      <th>Owner</th>
                      <th>Balance</th>
                      <th>Currency</th>
                      <th>Updated</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {resource === 'availability' && (
                    <>
                      <th>Lawyer</th>
                      <th>Video Fee</th>
                      <th>In-Person Fee</th>
                      <th>Cities Served</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* USERS TABLE ROWS */}
                {resource === 'users' &&
                  filteredRecords.map((record) => {
                    const isLawyer = record.role === 'lawyer'
                    const isClient = record.role === 'client'
                    const specs = Array.isArray(record.specialization) ? record.specialization : []

                    return (
                      <tr key={record._id} style={{ transition: 'background 0.15s' }}>
                        {/* Avatar */}
                        <td>
                          <div
                            onClick={() => setSelectedUserModal(record)}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: '50%',
                              overflow: 'hidden',
                              display: 'grid',
                              placeItems: 'center',
                              background: isLawyer ? 'rgba(234, 88, 12, 0.12)' : isClient ? 'rgba(13, 148, 136, 0.12)' : 'var(--primary-light)',
                              color: isLawyer ? '#c2410c' : isClient ? '#0f766e' : 'var(--primary)',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: isLawyer ? '2px solid rgba(234, 88, 12, 0.3)' : '2px solid transparent'
                            }}
                            title="Click to view full profile"
                          >
                            {avatarUrl(record.avatar) ? (
                              <img src={avatarUrl(record.avatar)} alt={`${record.name || 'User'} avatar`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              initials(record.name)
                            )}
                          </div>
                        </td>

                        {/* Name & Role Profile */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span
                              onClick={() => setSelectedUserModal(record)}
                              style={{ fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', color: 'var(--text)' }}
                              title="View user profile"
                            >
                              {record.name || 'Unnamed User'}
                            </span>
                            {renderRoleBadge(record.role)}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}>
                            {isLawyer && (
                              record.verified ? (
                                <span style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
                                  <CheckCircle2 size={12} /> Verified Lawyer
                                </span>
                              ) : (
                                <span style={{ color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
                                  <Clock size={12} /> Verification Pending
                                </span>
                              )
                            )}
                            {isClient && (
                              <span style={{ color: 'var(--text-muted)' }}>Registered Client</span>
                            )}
                          </div>
                        </td>

                        {/* Contact & City */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text)', fontSize: '0.85rem' }}>
                            <Mail size={13} color="var(--text-muted)" /> {record.email || 'No email'}
                          </div>
                          {record.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 3 }}>
                              <Phone size={12} /> {record.phone}
                            </div>
                          )}
                          {record.city && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 3 }}>
                              <MapPin size={12} /> {record.city}
                            </div>
                          )}
                        </td>

                        {/* Profile Details & Credentials */}
                        <td>
                          {isLawyer ? (
                            <div style={{ display: 'grid', gap: 3, fontSize: '0.8rem' }}>
                              {specs.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                  {specs.slice(0, 3).map((spec: string) => (
                                    <span
                                      key={spec}
                                      style={{
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        padding: '1px 6px',
                                        borderRadius: 4,
                                        fontSize: '0.72rem',
                                        color: '#334155',
                                        fontWeight: 500
                                      }}
                                    >
                                      {spec}
                                    </span>
                                  ))}
                                  {specs.length > 3 && (
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>+{specs.length - 3} more</span>
                                  )}
                                </div>
                              )}
                              <div style={{ color: 'var(--text-muted)', display: 'flex', gap: 10 }}>
                                {record.experience ? <span><strong>{record.experience}</strong> yrs exp</span> : null}
                                {record.fee ? <span><strong>PKR {record.fee}</strong>/fee</span> : null}
                                {record.barCouncil ? <span>Bar: <strong>{record.barCouncil}</strong></span> : null}
                              </div>
                            </div>
                          ) : isClient ? (
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              <div>Client Profile</div>
                              {record.createdAt && <div style={{ fontSize: '0.75rem' }}>Joined: {new Date(record.createdAt).toLocaleDateString()}</div>}
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>System Administrator</div>
                          )}
                        </td>

                        {/* Status */}
                        <td>
                          {record.isActive !== false ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.2rem 0.55rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>
                              <Check size={12} /> Active
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.2rem 0.55rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, background: '#fee2e2', color: '#b91c1c' }}>
                              <X size={12} /> Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                            {/* View Full Profile Button */}
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => setSelectedUserModal(record)}
                              title="View Full Profile Details"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            >
                              <Eye size={14} /> Profile
                            </button>

                            {/* Verify Toggle for Lawyers */}
                            {isLawyer && (
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => update(record._id, { verified: !record.verified })}
                                title={record.verified ? 'Revoke Lawyer Verification' : 'Verify Lawyer Profile'}
                                style={{
                                  padding: '0.35rem 0.6rem',
                                  fontSize: '0.8rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  color: record.verified ? '#15803d' : '#d97706',
                                  borderColor: record.verified ? '#86efac' : '#fde68a'
                                }}
                              >
                                <FileCheck size={14} /> {record.verified ? 'Verified' : 'Verify'}
                              </button>
                            )}

                            {/* Activate / Deactivate Toggle */}
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => update(record._id, { isActive: !record.isActive })}
                              title={record.isActive !== false ? 'Deactivate User' : 'Activate User'}
                              style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                            >
                              {record.isActive !== false ? <UserX size={14} color="#dc2626" /> : <UserCheck size={14} color="#16a34a" />}
                            </button>

                            {/* Delete User */}
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => remove(record._id)}
                              title="Delete User"
                              style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', color: '#b91c1c' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                {/* APPOINTMENTS TABLE ROWS */}
                {resource === 'appointments' &&
                  records.map((record) => (
                    <tr key={record._id}>
                      <td>
                        <div style={{ display: 'grid', gap: '0.5rem', minWidth: 220 }}>
                          {[
                            { label: 'Lawyer', person: record.lawyer, isLawyer: true },
                            { label: 'Client', person: record.client, isLawyer: false }
                          ].map(({ label, person, isLawyer }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  flexShrink: 0,
                                  borderRadius: '50%',
                                  overflow: 'hidden',
                                  display: 'grid',
                                  placeItems: 'center',
                                  background: isLawyer ? 'rgba(234, 88, 12, 0.12)' : 'rgba(13, 148, 136, 0.12)',
                                  color: isLawyer ? '#c2410c' : '#0f766e',
                                  fontSize: '0.75rem',
                                  fontWeight: 700
                                }}
                              >
                                {avatarUrl(person?.avatar) ? (
                                  <img src={avatarUrl(person?.avatar)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  initials(person?.name)
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                  {label}: {person?.name || 'Unknown'}
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{person?.email || 'Email unavailable'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{record.type || 'Consultation'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {record.fee !== undefined ? `PKR ${record.fee}` : 'Standard fee'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{record.caseName || 'General Consultation'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{record.notes || 'No extra notes'}</div>
                      </td>
                      <td>
                        <div>{record.date ? new Date(record.date).toLocaleDateString() : 'TBD'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{record.time || ''}</div>
                      </td>
                      <td>
                        <span className={`badge ${record.status === 'confirmed' ? 'badge-success' : record.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                          {record.status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-outline" onClick={() => remove(record._id)} title="Delete appointment">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* CASES TABLE ROWS */}
                {resource === 'cases' &&
                  records.map((record) => (
                    <tr key={record._id}>
                      <td style={{ fontWeight: 700, minWidth: 160 }}>{record.title || 'Untitled Case'}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{record.client?.name || 'Client unavailable'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{record.client?.email || ''}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{record.lawyer?.name || 'Lawyer unavailable'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{record.lawyer?.specialization?.join(', ') || record.lawyer?.email || ''}</div>
                      </td>
                      <td>{record.nextHearing ? new Date(record.nextHearing).toLocaleDateString() : 'Not scheduled'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="badge badge-info">{record.status || 'Open'}</span>
                          {record.progress !== undefined && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{record.progress}%</span>}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-outline" onClick={() => remove(record._id)} title="Delete case">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* REVIEWS TABLE ROWS */}
                {resource === 'reviews' &&
                  records.map((record) => (
                    <tr key={record._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#d97706' }}>★ {record.rating || 5} / 5</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>"{record.comment || 'No comment'}"</div>
                      </td>
                      <td>{record.lawyer?.name || record.lawyerName || record.lawyer || '-'}</td>
                      <td>{record.client?.name || record.clientName || record.client || '-'}</td>
                      <td>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '-'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-outline" onClick={() => remove(record._id)} title="Delete review">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* WALLETS TABLE ROWS */}
                {resource === 'wallets' &&
                  records.map((record) => (
                    <tr key={record._id}>
                      <td>{record.user?.name || record.user?.email || record.user || record._id}</td>
                      <td style={{ fontWeight: 700, fontSize: '1rem', color: '#047857' }}>
                        PKR {record.balance !== undefined ? record.balance.toLocaleString() : 0}
                      </td>
                      <td>{record.currency || 'PKR'}</td>
                      <td>{record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : '-'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-outline" onClick={() => remove(record._id)} title="Delete wallet">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* AVAILABILITY TABLE ROWS */}
                {resource === 'availability' &&
                  records.map((record) => (
                    <tr key={record._id}>
                      <td style={{ fontWeight: 600 }}>{record.lawyer?.name || record.lawyer?.email || record.lawyer || record._id}</td>
                      <td>PKR {record.feeVideo || '-'}</td>
                      <td>PKR {record.feeInPerson || '-'}</td>
                      <td>{Array.isArray(record.cities) ? record.cities.join(', ') : '-'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-outline" onClick={() => remove(record._id)} title="Delete availability">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Users size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No records found matching your filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* USER PROFILE MODAL DIALOG */}
      {selectedUserModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 9999
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedUserModal(null)
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 680,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              padding: 0,
              border: '1px solid var(--border)'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--border)',
                background: selectedUserModal.role === 'lawyer' ? 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)' : 'linear-gradient(135deg, #f0fdfa 0%, #fff 100%)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'grid',
                    placeItems: 'center',
                    background: selectedUserModal.role === 'lawyer' ? '#ffedd5' : '#ccfbf1',
                    color: selectedUserModal.role === 'lawyer' ? '#c2410c' : '#0f766e',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                  }}
                >
                  {avatarUrl(selectedUserModal.avatar) ? (
                    <img src={avatarUrl(selectedUserModal.avatar)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    initials(selectedUserModal.name)
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{selectedUserModal.name || 'Unnamed User'}</h2>
                    {renderRoleBadge(selectedUserModal.role)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                    {selectedUserModal.role === 'lawyer' && (
                      selectedUserModal.verified ? (
                        <span style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 700 }}>
                          <CheckCircle2 size={14} /> Verified Lawyer
                        </span>
                      ) : (
                        <span style={{ color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 700 }}>
                          <Clock size={14} /> Unverified (Needs Verification)
                        </span>
                      )
                    )}

                    <span style={{ fontSize: '0.8rem', color: selectedUserModal.isActive !== false ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
                      ● {selectedUserModal.isActive !== false ? 'Active Account' : 'Inactive Account'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserModal(null)}
                style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'grid', gap: '1.5rem' }}>
              {/* Profile Contact & Basic Details */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Contact & Location
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{selectedUserModal.email || 'None'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{selectedUserModal.phone || 'None'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>City / Region</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{selectedUserModal.city || 'Not specified'}</div>
                  </div>
                  {selectedUserModal.location && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Address / Office</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{selectedUserModal.location}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* LAWYER-SPECIFIC PROFILE SECTION */}
              {selectedUserModal.role === 'lawyer' && (
                <>
                  {/* Practice & Legal Credentials */}
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Legal Practice & Credentials
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bar Council Number</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{selectedUserModal.barCouncil || 'Not Provided'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Experience</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{selectedUserModal.experience ? `${selectedUserModal.experience} Years` : '0 Years'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consultation Fee</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#047857' }}>PKR {selectedUserModal.fee ? selectedUserModal.fee.toLocaleString() : 0}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating & Reviews</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#d97706' }}>
                          ★ {selectedUserModal.rating || 0} ({selectedUserModal.reviewsCount || 0} reviews)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  {Array.isArray(selectedUserModal.specialization) && selectedUserModal.specialization.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Areas of Law / Specializations
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {selectedUserModal.specialization.map((spec: string) => (
                          <span
                            key={spec}
                            style={{
                              background: '#ffedd5',
                              color: '#9a3412',
                              border: '1px solid #fed7aa',
                              padding: '0.3rem 0.75rem',
                              borderRadius: 20,
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education & Qualifications */}
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Education & Academic Background
                    </h3>
                    <div style={{ display: 'grid', gap: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <GraduationCap size={16} color="var(--primary)" />
                        <span><strong>Law Degree / Education:</strong> {selectedUserModal.education || selectedUserModal.lawInstitution || 'Not Specified'}</span>
                      </div>
                      {selectedUserModal.intermediateCollege && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <BookOpen size={16} color="var(--primary)" />
                          <span><strong>Intermediate:</strong> {selectedUserModal.intermediateCollege}</span>
                        </div>
                      )}
                      {selectedUserModal.matricSchool && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Building size={16} color="var(--primary)" />
                          <span><strong>Matriculation:</strong> {selectedUserModal.matricSchool}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Case Track Record & Bank Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>Case Track Record</h4>
                      <div style={{ fontSize: '0.85rem', display: 'grid', gap: 4 }}>
                        <div>Cases Handled: <strong>{selectedUserModal.casesHandled ?? 0}</strong></div>
                        <div>Cases Cleared: <strong>{selectedUserModal.casesCleared ?? 0}</strong></div>
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>Bank / Settlement Info</h4>
                      <div style={{ fontSize: '0.85rem', display: 'grid', gap: 4 }}>
                        <div>Bank: <strong>{selectedUserModal.bankProvider || 'Not provided'}</strong></div>
                        <div>Account: <strong>{selectedUserModal.bankAccountNumber || 'Not provided'}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {selectedUserModal.bio && (
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Professional Bio
                      </h3>
                      <p style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                        {selectedUserModal.bio}
                      </p>
                    </div>
                  )}

                  {/* Qualification Document */}
                  {selectedUserModal.qualificationDocument && (
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#065f46' }}>
                        <FileCheck size={20} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Qualification Document Attached</div>
                          <div style={{ fontSize: '0.75rem' }}>Degree / License verification file</div>
                        </div>
                      </div>
                      <a
                        href={docUrl(selectedUserModal.qualificationDocument)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                        style={{ background: '#fff', fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </>
              )}

              {/* CLIENT-SPECIFIC PROFILE SECTION */}
              {selectedUserModal.role === 'client' && (
                <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '1.25rem', borderRadius: 10 }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: '#0f766e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users size={18} /> Client Account Overview
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#134e4a', lineHeight: 1.5 }}>
                    This user is registered as a Client on WakeelHub. They can search for certified lawyers, book video/in-person appointments, track legal cases, and submit reviews.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer / Actions */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--border)',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedUserModal.role === 'lawyer' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={actionLoading}
                    onClick={() => update(selectedUserModal._id, { verified: !selectedUserModal.verified })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.85rem',
                      background: selectedUserModal.verified ? '#d97706' : '#15803d'
                    }}
                  >
                    <FileCheck size={16} />
                    {selectedUserModal.verified ? 'Revoke Lawyer Verification' : 'Verify & Approve Lawyer'}
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={actionLoading}
                  onClick={() => update(selectedUserModal._id, { isActive: !selectedUserModal.isActive })}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
                >
                  {selectedUserModal.isActive !== false ? <UserX size={16} color="#dc2626" /> : <UserCheck size={16} color="#16a34a" />}
                  {selectedUserModal.isActive !== false ? 'Deactivate Account' : 'Activate Account'}
                </button>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedUserModal(null)}
                style={{ fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}