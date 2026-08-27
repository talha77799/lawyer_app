import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, getAssetUrl, getStoredUser } from '../utils/api'

type Profile = { name: string; email: string; phone: string; city: string; bio: string; avatar: string; qualificationDocument: string; specialization: string[] | string; experience: number; fee: number; languages: string[] | string; education: string; matricSchool: string; intermediateCollege: string; lawInstitution: string; casesHandled: number; casesCleared: number; barCouncil: string; location: string; bankProvider: string; bankAccountNumber: string }

const initialProfile: Profile = { name: '', email: '', phone: '', city: '', bio: '', avatar: '', qualificationDocument: '', specialization: [], experience: 0, fee: 0, languages: [], education: '', matricSchool: '', intermediateCollege: '', lawInstitution: '', casesHandled: 0, casesCleared: 0, barCouncil: '', location: '', bankProvider: '', bankAccountNumber: '' }

export default function MyProfile() {
  const [profile, setProfile] = useState<Profile>({ ...initialProfile, ...getStoredUser() })
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [qualificationDocument, setQualificationDocument] = useState<File | null>(null)

  useEffect(() => {
    apiRequest('/auth/me').then(({ user }) => setProfile((current) => ({ ...current, ...user }))).catch((err) => setError(err.message))
  }, [])

  const update = (field: keyof Profile, value: string | number | string[]) => setProfile((current) => ({ ...current, [field]: value }))
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(''); setNotice('')
    try {
      const specialization = typeof profile.specialization === 'string' ? profile.specialization.split(',').map((item) => item.trim()).filter(Boolean) : profile.specialization
      const languages = typeof profile.languages === 'string' ? profile.languages.split(',').map((item) => item.trim()).filter(Boolean) : profile.languages
      const requestBody = new FormData()
      Object.entries({ ...profile, specialization, languages }).forEach(([field, value]) => {
        if (field !== 'avatar' && field !== 'qualificationDocument') requestBody.append(field, Array.isArray(value) ? value.join(',') : String(value ?? ''))
      })
      if (profilePhoto) requestBody.append('avatar', profilePhoto)
      if (qualificationDocument) requestBody.append('qualificationDocument', qualificationDocument)
      const { user } = await apiRequest('/auth/profile', { method: 'PUT', body: requestBody })
      setProfile((current) => ({ ...current, ...user })); localStorage.setItem('user', JSON.stringify(user)); setNotice('Profile updated successfully.')
    } catch (err: any) { setError(err.message) } finally { setLoading(false) }
  }

  return <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 850 }}>
    <Link to="/lawyer-dashboard" style={{ color: 'var(--primary)' }}>← Back to dashboard</Link>
    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '1rem 0 0.35rem' }}>My Profile</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Keep your public lawyer profile and consultation details up to date.</p>
    {error && <div className="alert-error">{error}</div>}{notice && <div className="alert-success">{notice}</div>}
    <form className="card" style={{ padding: '1.5rem' }} onSubmit={save}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}><div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '1.3rem' }}>{profilePhoto ? <img src={URL.createObjectURL(profilePhoto)} alt="New profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : profile.avatar ? <img src={getAssetUrl(profile.avatar)} alt={`${profile.name} profile`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : profile.name.slice(0, 2).toUpperCase()}</div><div className="form-group" style={{ flex: 1, marginBottom: 0 }}><label htmlFor="profile-photo">Profile photo</label><input id="profile-photo" type="file" accept="image/png,image/jpeg" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} /><small style={{ color: 'var(--text-muted)' }}>PNG or JPG up to 5 MB</small></div></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className="form-group"><label htmlFor="profile-name">Full name</label><input id="profile-name" required value={profile.name} onChange={(e) => update('name', e.target.value)} /></div><div className="form-group"><label htmlFor="profile-email">Email</label><input id="profile-email" type="email" disabled value={profile.email} /></div><div className="form-group"><label htmlFor="profile-phone">Phone number</label><input id="profile-phone" value={profile.phone || ''} onChange={(e) => update('phone', e.target.value)} /></div><div className="form-group"><label htmlFor="profile-city">City</label><input id="profile-city" value={profile.city || ''} onChange={(e) => update('city', e.target.value)} /></div></div>
      <div className="form-group"><label htmlFor="profile-specialization">Specializations</label><input id="profile-specialization" value={Array.isArray(profile.specialization) ? profile.specialization.join(', ') : profile.specialization} onChange={(e) => update('specialization', e.target.value)} placeholder="Family Law, Civil Litigation" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className="form-group"><label htmlFor="profile-experience">Experience (years)</label><input id="profile-experience" type="number" min="0" value={profile.experience || 0} onChange={(e) => update('experience', Number(e.target.value))} /></div><div className="form-group"><label htmlFor="profile-fee">Base consultation fee (PKR)</label><input id="profile-fee" type="number" min="0" value={profile.fee || 0} onChange={(e) => update('fee', Number(e.target.value))} /></div></div>
      <div className="form-group"><label htmlFor="profile-bio">About you</label><textarea id="profile-bio" rows={4} value={profile.bio || ''} onChange={(e) => update('bio', e.target.value)} placeholder="Describe your practice and experience" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className="form-group"><label htmlFor="profile-cases-handled">Cases handled</label><input id="profile-cases-handled" type="number" min="0" value={profile.casesHandled || 0} onChange={(e) => update('casesHandled', Number(e.target.value))} /></div><div className="form-group"><label htmlFor="profile-cases-cleared">Cases successfully cleared</label><input id="profile-cases-cleared" type="number" min="0" value={profile.casesCleared || 0} onChange={(e) => update('casesCleared', Number(e.target.value))} /></div></div>
      <div className="form-group"><label htmlFor="profile-qualification">Law certificate / degree</label>{profile.qualificationDocument && <a href={getAssetUrl(profile.qualificationDocument)} target="_blank" rel="noreferrer" style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem' }}>View current certificate / degree</a>}<input id="profile-qualification" type="file" accept="application/pdf,image/png,image/jpeg" onChange={(e) => setQualificationDocument(e.target.files?.[0] || null)} /><small style={{ color: 'var(--text-muted)' }}>PDF, PNG, or JPG up to 5 MB</small></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className="form-group"><label htmlFor="profile-languages">Languages</label><input id="profile-languages" value={Array.isArray(profile.languages) ? profile.languages.join(', ') : profile.languages} onChange={(e) => update('languages', e.target.value)} placeholder="Urdu, English" /></div><div className="form-group"><label htmlFor="profile-bar">Bar council</label><input id="profile-bar" value={profile.barCouncil || ''} onChange={(e) => update('barCouncil', e.target.value)} /></div></div>
      <div className="form-group"><label htmlFor="profile-location">Office / chamber location</label><input id="profile-location" value={profile.location || ''} onChange={(e) => update('location', e.target.value)} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className="form-group"><label htmlFor="profile-bank-provider">Payment bank / wallet</label><select id="profile-bank-provider" required value={profile.bankProvider || ''} onChange={(e) => update('bankProvider', e.target.value)}><option value="">Select provider</option>{['EasyPaisa', 'JazzCash', 'HBL', 'UBL', 'MCB', 'Meezan Bank', 'Bank Alfalah', 'Other'].map((provider) => <option key={provider}>{provider}</option>)}</select></div><div className="form-group"><label htmlFor="profile-bank-account">Account number / IBAN</label><input id="profile-bank-account" required value={profile.bankAccountNumber || ''} onChange={(e) => update('bankAccountNumber', e.target.value)} placeholder="Account number / IBAN" /></div></div>
      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save profile'}</button>
    </form>
  </main>
}
