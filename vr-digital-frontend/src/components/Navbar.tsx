import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Download, User, LogOut } from 'lucide-react'
import { getStoredUser } from '../utils/api'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = getStoredUser()
  const isAuthenticated = !!token

  const storedRole = String(user?.role || '').toLowerCase()
  const isLawyer = storedRole === 'lawyer' || location.pathname === '/lawyer-dashboard' || location.pathname.startsWith('/lawyer/')
  const isAdmin = storedRole === 'admin' || location.pathname === '/admin' || location.pathname.startsWith('/admin/')
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/signup/otp' || location.pathname === '/join-as-lawyer' || (!isAuthenticated && location.pathname === '/')

  const isActive = (path: string) => (location.pathname === path ? 'active' : '')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
    window.location.reload()
  }

  const dashboardPath = isAdmin ? '/admin' : isLawyer ? '/lawyer-dashboard' : '/dashboard'

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to={isAuthenticated ? '/' : '/login'} className="logo">
          <img src="/wakeelhub-logo-transparent.png" alt="Wakeel Hub" />
        </Link>

        <ul className="nav-links">
          {/* Public / client browsing links: only show when NOT on auth pages */}
          {!isAuthPage && !isLawyer && !isAdmin && (
            <>
              <li><Link to="/lawyers" className={isActive('/lawyers')}>Find Lawyers</Link></li>
              <li><Link to="/cases" className={isActive('/cases')}>Track Case</Link></li>
            </>
          )}

          {/* Lawyer specific links when authenticated */}
          {isAuthenticated && !isAuthPage && isLawyer && (
            <>
              <li><Link to="/lawyer/availability" className={isActive('/lawyer/availability')}>Availability</Link></li>
              <li><Link to="/lawyer/wallet" className={isActive('/lawyer/wallet')}>Wallet</Link></li>
              <li><Link to="/lawyer/reviews" className={isActive('/lawyer/reviews')}>Reviews</Link></li>
            </>
          )}

          {/* Calendar & Dashboard: ONLY show when authenticated AND NOT on signup/signin/auth pages */}
          {isAuthenticated && !isAuthPage && (
            <>
              <li><Link to="/calendar" className={isActive('/calendar')}>Calendar</Link></li>
              <li><Link to={dashboardPath} className={isActive(dashboardPath)}>Dashboard</Link></li>
            </>
          )}
        </ul>

        <div className="nav-actions">
          <Link to="/download-app" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Download size={16} /> Download App
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to={dashboardPath} className="btn btn-outline" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <User size={15} /> {user?.name || user?.username || 'Account'}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost"
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'var(--danger)' }}
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            !isAuthPage && (
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <User size={16} /> Login / Sign Up
              </Link>
            )
          )}
        </div>

        <button className="mobile-menu-btn">☰</button>
      </div>
    </nav>
  )
}
