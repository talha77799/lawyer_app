import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStoredUser, apiRequest } from '../utils/api'

type Review = { _id: string; rating: number; comment: string; createdAt: string; client?: { name?: string } }

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = getStoredUser()
  const lawyerId = user?._id || user?.id

  useEffect(() => {
    if (!lawyerId) { setError('Please log in again to view your reviews.'); setLoading(false); return }
    apiRequest(`/reviews/lawyer/${lawyerId}`).then(({ data }) => setReviews(data || [])).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [lawyerId])

  const average = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0.0'
  if (loading) return <main className="container" style={{ padding: '3rem 1.25rem' }}><p>Loading reviews...</p></main>
  return <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 800 }}>
    <Link to="/lawyer-dashboard" style={{ color: 'var(--primary)' }}>← Back to dashboard</Link>
    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '1rem 0 0.35rem' }}>Reviews</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>See what clients say about your legal service.</p>
    {error && <div className="alert-error">{error}</div>}
    <div className="stats-grid" style={{ marginBottom: '1.5rem' }}><div className="stat-card"><div className="label">Average rating</div><div className="value">{average} ★</div></div><div className="stat-card"><div className="label">Total reviews</div><div className="value">{reviews.length}</div></div></div>
    <div className="card" style={{ padding: '1.25rem' }}>{!reviews.length ? <p style={{ color: 'var(--text-muted)' }}>No reviews have been submitted yet.</p> : reviews.map((review) => <article key={review._id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{review.client?.name || 'Client'}</strong><span style={{ color: 'var(--warning)' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div><p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>{review.comment || 'No written comment.'}</p><small style={{ color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</small></article>)}</div>
  </main>
}
