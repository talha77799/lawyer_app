import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../utils/api'

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
type Day = { day: string; isActive: boolean; locationType: string; locationLabel: string; slots: { start: string; end: string }[] }

const emptySchedule = (): Day[] => days.map((day) => ({ day, isActive: day !== 'saturday' && day !== 'sunday', locationType: 'online', locationLabel: '', slots: [{ start: '09:00', end: '17:00' }] }))

export default function Availability() {
  const [feeVideo, setFeeVideo] = useState('')
  const [feeInPerson, setFeeInPerson] = useState('')
  const [cities, setCities] = useState('')
  const [schedule, setSchedule] = useState<Day[]>(emptySchedule())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/availability/me')
      .then(({ data }) => {
        setFeeVideo(data.feeVideo ? String(data.feeVideo) : '')
        setFeeInPerson(data.feeInPerson ? String(data.feeInPerson) : '')
        setCities((data.cities || []).join(', '))
        if (data.schedule?.length) setSchedule(data.schedule)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const updateDay = (index: number, changes: Partial<Day>) => setSchedule((current) => current.map((item, i) => i === index ? { ...item, ...changes } : item))

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError(''); setNotice('')
    try {
      await apiRequest('/availability/me', { method: 'PUT', body: JSON.stringify({ feeVideo: Number(feeVideo) || 0, feeInPerson: Number(feeInPerson) || 0, cities: cities.split(',').map((city) => city.trim()).filter(Boolean), schedule }) })
      setNotice('Availability saved successfully.')
    } catch (err: any) { setError(err.message) } finally { setSaving(false) }
  }

  if (loading) return <main className="container" style={{ padding: '3rem 1.25rem' }}><p>Loading availability...</p></main>

  return (
    <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 900 }}>
      <Link to="/lawyer-dashboard" style={{ color: 'var(--primary)' }}>← Back to dashboard</Link>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '1rem 0 0.35rem' }}>Availability</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Set your consultation fees, cities, and weekly appointment hours.</p>
      {error && <div className="alert-error">{error}</div>}{notice && <div className="alert-success">{notice}</div>}
      <form onSubmit={save}>
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Consultation details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label htmlFor="fee-video">Video fee (PKR)</label><input id="fee-video" type="number" min="0" value={feeVideo} onChange={(e) => setFeeVideo(e.target.value)} placeholder="5000" /></div>
            <div className="form-group"><label htmlFor="fee-person">In-person fee (PKR)</label><input id="fee-person" type="number" min="0" value={feeInPerson} onChange={(e) => setFeeInPerson(e.target.value)} placeholder="8000" /></div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}><label htmlFor="cities">Service cities</label><input id="cities" value={cities} onChange={(e) => setCities(e.target.value)} placeholder="Lahore, Islamabad" /><small style={{ color: 'var(--text-muted)' }}>Separate cities with commas.</small></div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Weekly schedule</h3>
          {schedule.map((item, index) => <div key={item.day} style={{ display: 'grid', gridTemplateColumns: '110px 90px 120px 1fr', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
            <strong style={{ textTransform: 'capitalize' }}>{item.day}</strong>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" checked={item.isActive} onChange={(e) => updateDay(index, { isActive: e.target.checked })} /> Active</label>
            <select value={item.locationType} onChange={(e) => updateDay(index, { locationType: e.target.value })}><option value="online">Online</option><option value="chamber">Chamber</option><option value="office">Office</option><option value="home">Home visit</option></select>
            <div style={{ display: 'flex', gap: 8 }}><input type="time" value={item.slots[0]?.start || ''} onChange={(e) => updateDay(index, { slots: [{ start: e.target.value, end: item.slots[0]?.end || '17:00' }] })} disabled={!item.isActive} /><input type="time" value={item.slots[0]?.end || ''} onChange={(e) => updateDay(index, { slots: [{ start: item.slots[0]?.start || '09:00', end: e.target.value }] })} disabled={!item.isActive} /></div>
          </div>)}
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: '1.25rem' }}>{saving ? 'Saving...' : 'Save availability'}</button>
        </div>
      </form>
    </main>
  )
}
