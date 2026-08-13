import { Link } from 'react-router-dom'
import { cities, practiceAreas } from '../data/mockData'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ color: 'white', marginBottom: '1rem' }}>
              VR<span style={{ color: 'var(--primary)' }}>.</span>Digital
            </div>
            <p style={{ fontSize: '0.9rem', maxWidth: '280px' }}>
              Book appointments with the best lawyers and legal experts across Pakistan.
              Online video consultations and in-person chamber visits.
            </p>
          </div>
          <div>
            <h4>Major Cities</h4>
            <ul>
              {cities.slice(0, 8).map(c => (
                <li key={c}><Link to={`/lawyers?city=${c}`}>{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Practice Areas</h4>
            <ul>
              {practiceAreas.slice(0, 8).map(p => (
                <li key={p}><Link to={`/lawyers?area=${encodeURIComponent(p)}`}>{p}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Get the App</h4>
            <ul>
              <li>Bar Council Verified Lawyers</li>
              <li>Authentic & updated information</li>
              <li>Reliable Customer Support</li>
              <li>7 days a week</li>
              <li>Secure Online Payment</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 VR-Digital. All rights reserved. | Inspired by modern legal tech platforms.
        </div>
      </div>
    </footer>
  )
}
