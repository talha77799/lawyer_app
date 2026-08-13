import { useState } from 'react'
import { appointments } from '../data/mockData'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from 'date-fns'

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date(2026, 7, 1))
  const start = startOfMonth(current)
  const end = endOfMonth(current)
  const days = eachDayOfInterval({ start, end })
  const startPad = getDay(start)

  const eventsForDay = (day: Date) =>
    appointments.filter(a => isSameDay(new Date(a.date), day))

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Calendar & Availability</h1>
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
            const isToday = isSameDay(day, new Date(2026, 7, 12))
            return (
              <div key={day.toISOString()} className={`calendar-day ${isToday ? 'today' : ''}`}>
                <div className="day-num">{format(day, 'd')}</div>
                {events.map(e => (
                  <div key={e.id} className="event-dot" title={`${e.lawyerName} / ${e.clientName} - ${e.time}`}>
                    {e.time} {e.type === 'video' ? 'Video' : 'In-person'}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Upcoming Events</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Lawyer</th>
                <th>Client</th>
                <th>Type</th>
                <th>Status</th>
                <th>Fee</th>
              </tr>
            </thead>
            <tbody>
              {appointments
                .filter(a => a.status === 'upcoming')
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(a => (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>{a.lawyerName}</td>
                    <td>{a.clientName}</td>
                    <td>{a.type === 'video' ? 'Video' : 'In-person'}</td>
                    <td><span className="badge badge-info">{a.status}</span></td>
                    <td>Rs. {a.fee.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
