import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, FileText } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from 'date-fns'
import { apiRequest, getStoredUser } from '../utils/api'
import { currentUser } from '../data/mockData'

type Appointment = { _id: string; lawyerName: string; date: string; time: string; type: 'video' | 'in-person'; status: string; fee: number }
type LegalCase = { _id: string; clientId: string; title: string; status: string; progress: number; filedDate: string; nextHearing?: string; description: string; lawyer?: { name?: string } }
type Event = { id: string; date: string; label: string; detail: string; kind: 'appointment' | 'case' }

export default function CalendarPage() {
  const signedInUser = getStoredUser()
  const clientId = signedInUser?.id || signedInUser?._id || currentUser.id
  const clientName = signedInUser?.name || signedInUser?.username || currentUser.name
  const [current, setCurrent] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [cases, setCases] = useState<LegalCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const start = startOfMonth(current)
  const end = endOfMonth(current)
  const days = eachDayOfInterval({ start, end })
  const startPad = getDay(start)

  useEffect(() => {
    Promise.all([apiRequest('/appointments'), apiRequest('/cases')])
      .then(([appointmentResponse, caseResponse]) => {
        setAppointments(appointmentResponse.data || [])
        setCases(caseResponse.data || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const events: Event[] = [
    ...appointments.map((appointment) => ({
      id: `appointment-${appointment._id}`,
      date: appointment.date,
      label: `${appointment.time} ${appointment.type === 'video' ? 'Video' : 'In-person'}`,
      detail: `${appointment.lawyerName} · ${appointment.status}`,
      kind: 'appointment' as const,
    })),
    ...cases.flatMap((legalCase) => [
      { id: `filed-${legalCase._id}`, date: legalCase.filedDate, label: 'Case filed', detail: legalCase.title, kind: 'case' as const },
      ...(legalCase.nextHearing ? [{ id: `hearing-${legalCase._id}`, date: legalCase.nextHearing, label: 'Next hearing', detail: legalCase.title, kind: 'case' as const }] : []),
    ]),
  ]

  const eventsForDay = (day: Date) => events.filter((event) => isSameDay(new Date(`${event.date}T00:00:00`), day))
  const clientBookedCases = cases.filter((legalCase) => legalCase.clientId === clientId || legalCase.clientId === currentUser.id)

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading) return <main className="container" style={{ padding: '3rem 1.25rem' }}><p>Loading your calendar...</p></main>

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <Link to="/dashboard" style={{ color: 'var(--primary)' }}>← Back to dashboard</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1rem' }}>Case & Appointment Calendar</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Track hearings, case filing dates, and lawyer appointments.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-ghost" onClick={() => setCurrent(subMonths(current, 1))}>
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontWeight: 700, minWidth: 140, textAlign: 'center' }}>
            {format(current, 'MMMM yyyy')}
          </span>
          <button className="btn btn-ghost" onClick={() => setCurrent(addMonths(current, 1))}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="calendar-grid">
          {weekDays.map(d => (
            <div key={d} className="calendar-day header">{d}</div>
          ))}
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} className="calendar-day" style={{ visibility: 'hidden' }} />
          ))}
          {days.map(day => {
            const events = eventsForDay(day)
            const isToday = isSameDay(day, new Date())
            return (
              <div key={day.toISOString()} className={`calendar-day ${isToday ? 'today' : ''}`}>
                <div className="day-num">{format(day, 'd')}</div>
                {events.map((event) => (
                  <div key={event.id} className="event-dot" title={event.detail} style={{ background: event.kind === 'case' ? '#dbeafe' : undefined, color: event.kind === 'case' ? '#1e40af' : undefined }}>
                    {event.label}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {error && <div className="alert-error" style={{ marginTop: '1rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span><CalendarIcon size={14} style={{ verticalAlign: 'middle', color: 'var(--primary)' }} /> Appointments</span>
        <span><FileText size={14} style={{ verticalAlign: 'middle', color: 'var(--info)' }} /> Case dates</span>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Your Case Dates &amp; Appointments</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Event</th>
                <th>Case / Lawyer</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {events.sort((a, b) => a.date.localeCompare(b.date)).map((event) => {
                const appointment = appointments.find((item) => `appointment-${item._id}` === event.id)
                const legalCase = cases.find((item) => event.id.endsWith(item._id))
                return <tr key={event.id}>
                    <td>{event.date}</td>
                    <td>{appointment?.time || '—'}</td>
                    <td><span className={`badge ${event.kind === 'case' ? 'badge-info' : 'badge-warning'}`}>{event.label}</span></td>
                    <td>{legalCase?.title || appointment?.lawyerName || '—'}</td>
                    <td><span className="badge badge-info">{legalCase?.status || appointment?.status}</span></td>
                    <td>{legalCase?.description || (appointment ? `PKR ${appointment.fee.toLocaleString()}` : event.detail)}</td>
                  </tr>
              })}
              {!events.length && <tr><td colSpan={6} style={{ color: 'var(--text-muted)' }}>No case dates or appointments found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Booked Cases for {clientName}</h3>
        {clientBookedCases.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>No booked cases found for this client.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {clientBookedCases.map((legalCase) => (
              <div key={legalCase._id} style={{ padding: '0.9rem 1rem', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{legalCase.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {legalCase.nextHearing ? `Next hearing: ${legalCase.nextHearing}` : `Filed: ${legalCase.filedDate}`}
                    </div>
                  </div>
                  <span className="badge badge-info">{legalCase.status}</span>
                </div>
                <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {legalCase.lawyer?.name ? `Lawyer: ${legalCase.lawyer.name}` : 'Lawyer assigned'}
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: 4, height: 8, overflow: 'hidden', marginTop: '0.85rem' }}>
                  <div style={{ width: `${legalCase.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{legalCase.progress}% complete</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
