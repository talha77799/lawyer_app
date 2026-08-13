import { Link, useLocation } from 'react-router-dom'
import { Download, User } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          VR<span>.</span>Digital
        </Link>
        <ul className="nav-links">
          <li><Link to="/lawyers" className={isActive('/lawyers')}>Find Lawyers</Link></li>
          <li><Link to="/cases" className={isActive('/cases')}>Track Case</Link></li>
          <li><Link to="/calendar" className={isActive('/calendar')}>Calendar</Link></li>
          <li><Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link></li>
          <li><Link to="/join-as-lawyer" className={isActive('/join-as-lawyer')}>Join as Lawyer</Link></li>
        </ul>
        <div className="nav-actions">
          <a href="#" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Download size={16} /> Download App
          </a>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <User size={16} /> Login / Sign Up
          </Link>
        </div>
        <button className="mobile-menu-btn">☰</button>
      </div>
    </nav>
  )
}
