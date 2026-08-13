import { useParams, Link } from 'react-router-dom'
import { lawyers } from '../data/mockData'
import { Star, MapPin, Clock, CheckCircle, Video, Building, Languages, GraduationCap } from 'lucide-react'

export default function LawyerProfile() {
  const { id } = useParams()
  const lawyer = lawyers.find(l => l.id === id)

  if (!lawyer) {
    return <div className="container" style={{ padding: '3rem' }}>Lawyer not found.</div>
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div className="profile-header">
          <img src={lawyer.photo} alt={lawyer.name} className="profile-avatar" />
          <div className="profile-details" style={{ flex: 1 }}>
            <h1>
              {lawyer.name}
              {lawyer.verified && (
                <CheckCircle size={22} style={{ color: 'var(--success)', marginLeft: 8, verticalAlign: 'middle' }} />
              )}
            </h1>
            <div className="rating-stars" style={{ marginBottom: '0.5rem' }}>
              {'★'.repeat(Math.floor(lawyer.rating))}{'☆'.repeat(5 - Math.floor(lawyer.rating))}
              <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>
                {lawyer.rating} ({lawyer.reviews} reviews)
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {lawyer.specialization.map(s => (
                <span key={s} className="badge badge-warning">{s}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span><MapPin size={16} style={{ verticalAlign: 'middle' }} /> {lawyer.location}, {lawyer.city}</span>
              <span><Clock size={16} style={{ verticalAlign: 'middle' }} /> {lawyer.experience} years experience</span>
              {lawyer.online && <span className="badge badge-success">● Available Online</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="fee" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              Rs. {lawyer.fee.toLocaleString()}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>per session</div>
            </div>
            <Link to={`/book/${lawyer.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Book Appointment
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.75rem' }}>About</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{lawyer.bio}</p>

            <h3 style={{ marginBottom: '0.75rem' }}>Education</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={18} /> {lawyer.education}
            </p>

            <h3 style={{ marginBottom: '0.75rem' }}>Bar Council</h3>
            <p style={{ color: 'var(--text-muted)' }}>{lawyer.barCouncil}</p>
          </div>

          <div>
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>Consultation Types</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Video size={18} color="var(--primary)" /> Video Consultation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Building size={18} color="var(--primary)" /> In-person Chamber Visit
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>Languages</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                <Languages size={18} /> {lawyer.languages.join(', ')}
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>Next Available Slots</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {lawyer.availability.map(slot => (
                  <span key={slot} className="badge badge-info">{slot}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
