import { Link } from 'react-router-dom'
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react'
import { Lawyer } from '../data/mockData'

export default function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <Link to={`/lawyers/${lawyer.id}`} className="lawyer-card">
      <div className="lawyer-card-body">
        <div className="lawyer-header">
          <img src={lawyer.photo} alt={lawyer.name} className="lawyer-avatar" />
          <div className="lawyer-info">
            <h3>
              {lawyer.name}
              {lawyer.verified && (
                <CheckCircle size={14} style={{ color: 'var(--success)', marginLeft: 4, display: 'inline' }} />
              )}
            </h3>
            <div className="spec">{lawyer.specialization.slice(0, 2).join(' • ')}</div>
            {lawyer.online && (
              <span className="badge badge-success" style={{ marginTop: 4 }}>
                ● Online
              </span>
            )}
          </div>
        </div>
        <div className="lawyer-meta">
          <span><Star size={14} fill="var(--primary)" color="var(--primary)" /> {lawyer.rating} ({lawyer.reviews})</span>
          <span><MapPin size={14} /> {lawyer.city}</span>
          <span><Clock size={14} /> {lawyer.experience} yrs</span>
        </div>
        <div className="lawyer-footer">
          <div className="fee">
            Rs. {lawyer.fee.toLocaleString()} <small>/ session</small>
          </div>
          <span className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
            Book
          </span>
        </div>
      </div>
    </Link>
  )
}
