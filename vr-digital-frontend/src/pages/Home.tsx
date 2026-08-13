import { Link, useNavigate } from 'react-router-dom'
import { Search, Calendar, Video, FileText, Scale, Home as HomeIcon, Briefcase, Users, Shield, Gavel } from 'lucide-react'
import { lawyers, practiceAreas, cities } from '../data/mockData'
import LawyerCard from '../components/LawyerCard'
import { useState } from 'react'

const practiceIcons: Record<string, any> = {
  'Family Law': Users,
  'Criminal Defense': Shield,
  'Property & Real Estate': HomeIcon,
  'Civil Litigation': Gavel,
  'Corporate Law': Briefcase,
  'Taxation': Scale,
}

export default function Home() {
  const navigate = useNavigate()
  const [city, setCity] = useState('Lahore')
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/lawyers?city=${city}&q=${encodeURIComponent(query)}`)
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div>
            <div className="verified-badge">
              ✓ 1200+ verified lawyers
            </div>
            <h1>
              Find and Book the <span className="highlight">Best Lawyers</span> near you
            </h1>
            <p>
              Book appointments with verified lawyers across Pakistan. Online video consultations
              and in-person chamber visits — anytime, anywhere.
            </p>
            <form className="search-box" onSubmit={handleSearch}>
              <select value={city} onChange={e => setCity(e.target.value)}>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="text"
                placeholder="Search lawyer by services..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <Search size={18} /> Search
              </button>
            </form>
            <div className="popular-tags">
              <span>Popular:</span>
              {['Family Law', 'Property', 'Tax', 'Bail / FIR', 'Corporate Law', 'Civil Litigation'].map(t => (
                <span key={t} className="tag" onClick={() => navigate(`/lawyers?area=${encodeURIComponent(t)}`)}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="icon-circle">⚖️</div>
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Justice at your fingertips</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                Connect with bar-verified advocates in under 30 seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="features-strip">
          <div className="feature-card">
            <h3><Calendar size={20} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} /> Lawyer Booking</h3>
            <p>Book a lawyer for your case with transparent fees and instant confirmation.</p>
            <Link to="/lawyers" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Book Now</Link>
          </div>
          <div className="feature-card">
            <h3><Video size={20} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} /> Video Consultation</h3>
            <p>Consult online from home with verified lawyers available right now.</p>
            <span className="badge badge-success">03 Lawyers online</span>
          </div>
          <div className="feature-card">
            <h3><FileText size={20} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} /> Track Your Case</h3>
            <p>Follow milestones, payments & updates from filing to judgment.</p>
            <Link to="/cases" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>View Progress</Link>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Consult best lawyers online</h2>
            <Link to="/lawyers">View All →</Link>
          </div>
          <div className="lawyer-grid">
            {lawyers.slice(0, 4).map(l => <LawyerCard key={l.id} lawyer={l} />)}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>Top Practice Areas</h2>
          </div>
          <div className="practice-grid">
            {practiceAreas.slice(0, 12).map(area => {
              const Icon = practiceIcons[area] || Scale
              return (
                <Link key={area} to={`/lawyers?area=${encodeURIComponent(area)}`} className="practice-item">
                  <div className="icon"><Icon size={22} /></div>
                  <h4>{area}</h4>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Find lawyers by city</h2>
          </div>
          <div className="cities-grid">
            {cities.map(c => (
              <Link key={c} to={`/lawyers?city=${c}`} className="city-chip">{c}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>How it works</h2>
          </div>
          <div className="steps">
            {[
              { num: 1, title: 'Search', desc: 'Find lawyers by city, specialization or name' },
              { num: 2, title: 'Compare', desc: 'View profiles, ratings, fees and availability' },
              { num: 3, title: 'Book', desc: 'Choose video or in-person and pick a slot' },
              { num: 4, title: 'Consult', desc: 'Meet your lawyer and track your case progress' },
            ].map(s => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
