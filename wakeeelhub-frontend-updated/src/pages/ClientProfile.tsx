import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, getAssetUrl, getStoredUser } from '../utils/api'

type ClientProfileData = {
  name: string
  email: string
  phone: string
  city: string
  avatar: string
}

export default function ClientProfile() {
  const stored = getStoredUser()
  const [profile, setProfile] = useState<ClientProfileData>({
    name: stored?.name || '',
    email: stored?.email || '',
    phone: stored?.phone || '',
    city: stored?.city || '',
    avatar: stored?.avatar || '',
  })
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)

  useEffect(() => {
    apiRequest('/auth/me')
      .then(({ user }) => setProfile((current) => ({ ...current, ...user })))
      .catch((err) => setError(err.message))
  }, [])

  const update = (field: keyof ClientProfileData, value: string) =>
    setProfile((current) => ({ ...current, [field]: value }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const requestBody = new FormData()
      requestBody.append('name', profile.name.trim())
      requestBody.append('phone', profile.phone.trim())
      requestBody.append('city', profile.city.trim())
      if (profilePhoto) requestBody.append('avatar', profilePhoto)

      const { user } = await apiRequest('/auth/profile', { method: 'PUT', body: requestBody })
      setProfile((current) => ({ ...current, ...user }))
      localStorage.setItem('user', JSON.stringify(user))
      setProfilePhoto(null)
      setNotice('Profile updated successfully. Your profile picture and phone number have been saved.')
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const previewUrl = profilePhoto
    ? URL.createObjectURL(profilePhoto)
    : profile.avatar
      ? getAssetUrl(profile.avatar)
      : ''

  const initials = (profile.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 560 }}>
      <Link to="/dashboard" style={{ color: 'var(--primary)' }}>
        ← Back to dashboard
      </Link>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '1rem 0 0.35rem' }}>My Profile</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Update your profile picture and phone number anytime. Changes are saved to your account immediately.
      </p>

      {error && (
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      {notice && (
        <div style={{ background: '#f0fdf4', color: '#166534', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>
          {notice}
        </div>
      )}

      <form className="card" style={{ padding: '1.5rem' }} onSubmit={save}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'grid',
              placeItems: 'center',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '1.4rem',
              flexShrink: 0,
            }}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label htmlFor="client-profile-photo">Profile picture</label>
            <input
              id="client-profile-photo"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
            />
            <small style={{ color: 'var(--text-muted)' }}>PNG or JPG up to 5 MB. Change anytime.</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="client-name">Full name</label>
          <input
            id="client-name"
            required
            value={profile.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="client-email">Email</label>
          <input id="client-email" type="email" disabled value={profile.email} />
          <small style={{ color: 'var(--text-muted)' }}>Email cannot be changed here.</small>
        </div>

        <div className="form-group">
          <label htmlFor="client-phone">Phone number</label>
          <input
            id="client-phone"
            type="tel"
            value={profile.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+92 3xx xxxxxxx"
          />
          <small style={{ color: 'var(--text-muted)' }}>You can update your phone number anytime.</small>
        </div>

        <div className="form-group">
          <label htmlFor="client-city">City</label>
          <input
            id="client-city"
            value={profile.city || ''}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Lahore"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </main>
  )
}
