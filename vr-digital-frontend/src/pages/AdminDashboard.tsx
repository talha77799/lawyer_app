import { useEffect, useState } from 'react'
import { BarChart3, BriefcaseBusiness, Calendar, Check, CreditCard, FileText, Shield, Trash2, Users } from 'lucide-react'
import { apiRequest, getStoredUser } from '../utils/api'

type Resource = 'users' | 'appointments' | 'cases' | 'reviews' | 'wallets' | 'availability'
type RecordValue = Record<string, any>
const resourceLabels: Record<Resource, string> = { users: 'Users', appointments: 'Appointments', cases: 'Cases', reviews: 'Reviews', wallets: 'Wallets', availability: 'Availability' }

export default function AdminDashboard() {
  const user = getStoredUser()
  const [stats, setStats] = useState<RecordValue>({})
  const [resource, setResource] = useState<Resource>('users')
  const [records, setRecords] = useState<RecordValue[]>([])
  const [error, setError] = useState('')
  const load = async (selected: Resource = resource) => {
    try {
      const [overview, listing] = await Promise.all([apiRequest('/admin/overview'), apiRequest(`/admin/${selected}`)])
      setStats(overview.stats || {}); setRecords(listing.records || []); setError('')
    } catch (err: any) { setError(err.message || 'Unable to load admin data') }
  }
  useEffect(() => { if (user?.role === 'admin') load() }, [resource])
  const update = async (id: string, updates: RecordValue) => { await apiRequest(`/admin/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }); load() }
  const remove = async (id: string) => { if (!window.confirm('Delete this record permanently?')) return; await apiRequest(`/admin/${resource}/${id}`, { method: 'DELETE' }); load() }

  if (user?.role !== 'admin') return <main className="container" style={{ padding: '4rem 1.25rem' }}><div className="card" style={{ padding: '2rem', textAlign: 'center' }}><Shield size={36} color="var(--primary)" /><h1>Admin access required</h1><p>Sign in with the company owner account to continue.</p></div></main>
  const metricIcons: Record<string, any> = { users: Users, lawyers: BriefcaseBusiness, clients: Users, appointments: Calendar, cases: FileText, reviews: BarChart3, wallets: CreditCard }
  return <div className="dashboard-layout"><aside className="sidebar"><div style={{ padding: '0 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}><div style={{ fontWeight: 700 }}>{user.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Company Owner</div></div><ul className="sidebar-nav">{(Object.keys(resourceLabels) as Resource[]).map((key) => <li key={key}><button type="button" onClick={() => setResource(key)} className={resource === key ? 'active' : ''} style={{ width: '100%', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center', padding: '0.65rem 0.5rem' }}><Users size={18} /> {resourceLabels[key]}</button></li>)}</ul></aside><main className="dashboard-main"><h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Operations control</h1><div className="stats-grid">{Object.keys(metricIcons).map((key) => { const Icon = metricIcons[key]; return <div className="stat-card" key={key}><div className="label">{key}</div><div className="value">{stats[key] ?? 0}</div><Icon size={18} color="var(--primary)" /></div> })}</div>{error && <div style={{ color: '#991b1b', background: '#fef2f2', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>}<div className="card" style={{ padding: '1.25rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}><h2 style={{ margin: 0 }}>{resourceLabels[resource]}</h2><span className="badge badge-info">{records.length} records</span></div><div className="table-wrap"><table><thead><tr><th>Record</th><th>Details</th><th>Status</th><th>Actions</th></tr></thead><tbody>{records.map((record) => <tr key={record._id}><td style={{ fontWeight: 600 }}>{record.name || record.title || record.lawyerName || record._id.slice(-8)}</td><td>{record.email || record.clientName || record.comment || record.description || (record.balance !== undefined ? `PKR ${record.balance}` : '-')}</td><td>{record.isActive !== undefined ? <span className={record.isActive ? 'badge badge-success' : 'badge badge-warning'}>{record.isActive ? 'Active' : 'Inactive'}</span> : <span className="badge badge-info">{record.status || record.role || 'Managed'}</span>}</td><td style={{ display: 'flex', gap: 8 }}>{resource === 'users' && <button className="btn btn-outline" onClick={() => update(record._id, { isActive: !record.isActive })}><Check size={15} /> {record.isActive ? 'Deactivate' : 'Activate'}</button>}<button className="btn btn-outline" onClick={() => remove(record._id)} title="Delete record"><Trash2 size={15} /></button></td></tr>)}</tbody></table></div>{records.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No records found.</p>}</div></main></div>
}