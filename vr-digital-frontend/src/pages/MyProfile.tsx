import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, getStoredUser } from '../utils/api'

type Profile = { name: string; email: string; phone: string; city: string; bio: string; specialization: string[] | string; experience: number; fee: number; languages: string[] | string; education: string; barCouncil: string; location: string }

const initialProfile: Profile = { name: '', email: '', phone: '', city: '', bio: '', specialization: [], experience: 0, fee: 0, languages: [], education: '', barCouncil: '', location: '' }

export default function MyProfile() {
  const [profile, setProfile] = useState<Profile>({ ...initialProfile, ...getStoredUser() })
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/auth/me').then(({ user }) => setProfile((current) => ({ ...current, ...user }))).catch((err) => setError(err.message))
  }, [])

  const update = (field: keyof Profile, value: string | number | string[]) => setProfile((current) => ({ ...current, [field]: value }))
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(''); setNotice('')
    try {
      const specialization = typeof profile.specialization === 'string' ? profile.specialization.split(',').map((item) => item.trim()).filter(Boolean) : profile.specialization
      const languages = typeof profile.languages === 'string' ? profile.languages.split(',').map((item) => item.trim()).filter(Boolean) : profile.languages
      const { user } = await apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify({ ...profile, specialization, languages }) })
      setProfile((current) => ({ ...current, ...user })); localStorage.setItem('user', JSON.stringify(user)); setNotice('Profile updated successfully.')
    } catch (err: any) { setError(err.message) } finally { setLoading(false) }
  }

  return <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 850 }}>
    <Link to="/lawyer-dashboard" style={{ color: 'var(--primary)' }}>← Back to dashboard</Link>
    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '1rem 0 0.35rem' }}>My Profile</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Keep your public lawyer profile and consultation details up to date.</p>
    {error && <div className="alert-error">{error}</div>}{notice && <div className="alert-success">{notice}</div>}
    <form className="card" style={{ padding: '1.5rem' }} onSubmit={save}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className="form-group"><label htmlFor="profile-name">Full name</label><input id="profile-name" required value={profile.name} onChange={(e) => update('name', e.target.value)} /></div><div className="form-group"><label htmlFor="profile-email">Email</label><input id="profile-email" type="email" disabled value={profile.email} /></div><div className="form-group"><label htmlFor="profile-phone">Phone</label><input id="profile-phone" value={profile.phone || ''} onChange={(e) => update('phone', e.target.value)} /></div><div className="form-group"><label htmlFor="profile-city">City</label><input id="profile-city" value={profile.city || ''} onChange={(e) => update('city', e.target.value)} /></div></div>
      <div className="form-group"><label htmlFor="profile-specialization">Specializations</label><input id="profile-specialization" value={Array.isArray(profile.specialization) ? profile.specialization.join(', ') : profile.specialization} onChange={(e) => update('specialization', e.target.value)} placeholder="Family Law, Civil Litigation" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className="form-group"><label htmlFor="profile-experience">Experience (years)</label><input id="profile-experience" type="number" min="0" value={profile.experience || 0} onChange={(e) => update('experience', Number(e.target.value))} /></div><div className="form-group"><label htmlFor="profile-fee">Base consultation fee (PKR)</label><input id="profile-fee" type="number" min="0" value={profile.fee || 0} onChange={(e) => update('fee', Number(e.target.value))} /></div></div>
      <div className="form-group"><label htmlFor="profile-bio">About you</label><textarea id="profile-bio" rows={4} value={profile.bio || ''} onChange={(e) => update('bio', e.target.value)} placeholder="Describe your practice and experience" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className="form-group"><label htmlFor="profile-languages">Languages</label><input id="profile-languages" value={Array.isArray(profile.languages) ? profile.languages.join(', ') : profile.languages} onChange={(e) => update('languages', e.target.value)} placeholder="Urdu, English" /></div><div className="form-group"><label htmlFor="profile-bar">Bar council</label><input id="profile-bar" value={profile.barCouncil || ''} onChange={(e) => update('barCouncil', e.target.value)} /></div></div>
      <div className="form-group"><label htmlFor="profile-location">Office / chamber location</label><input id="profile-location" value={profile.location || ''} onChange={(e) => update('location', e.target.value)} /></div>
      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save profile'}</button>
    </form>
  </main>
}
