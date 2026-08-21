import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../utils/api'

type Appointment = {
  _id: string
  lawyerName: string
  date: string
  time: string
  type: 'video' | 'in-person'
  status: string
  fee: number
}

type Transaction = {
  _id: string
  type: string
  amount: number
  description: string
  status: string
  createdAt: string
}

type Wallet = { balance: number; currency: string; transactions: Transaction[] }

export default function Payments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([apiRequest('/appointments'), apiRequest('/wallet')])
      .then(([appointmentResponse, walletResponse]) => {
        setAppointments(appointmentResponse.data || [])
        setWallet(walletResponse.data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const totalBooked = appointments.reduce((sum, appointment) => sum + appointment.fee, 0)
  const completed = appointments.filter((appointment) => appointment.status === 'completed')
  const transactionTotal = (wallet?.transactions || [])
    .filter((transaction) => transaction.type === 'credit')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  if (loading) return <main className="container" style={{ padding: '3rem 1.25rem' }}><p>Loading payments...</p></main>

  return (
    <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 980 }}>
      <Link to="/dashboard" style={{ color: 'var(--primary)' }}>← Back to dashboard</Link>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '1rem 0 0.35rem' }}>Payments</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Review your consultation charges and payment activity.</p>
      {error && <div className="alert-error">{error}</div>}

      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card"><div className="label">Booked consultation fees</div><div className="value" style={{ fontSize: '1.35rem' }}>PKR {totalBooked.toLocaleString()}</div></div>
        <div className="stat-card"><div className="label">Completed sessions</div><div className="value">{completed.length}</div></div>
        <div className="stat-card"><div className="label">Wallet balance</div><div className="value" style={{ fontSize: '1.35rem' }}>PKR {(wallet?.balance || 0).toLocaleString()}</div></div>
        <div className="stat-card"><div className="label">Recorded credits</div><div className="value" style={{ fontSize: '1.35rem' }}>PKR {transactionTotal.toLocaleString()}</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '1.5rem' }}>
        <section className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ marginBottom: '0.35rem' }}>Consultation charges</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Fees attached to your appointments.</p>
          {!appointments.length ? <p style={{ color: 'var(--text-muted)' }}>No appointments yet. <Link to="/lawyers" style={{ color: 'var(--primary)' }}>Find a lawyer</Link></p> : appointments.map((appointment) => <div key={appointment._id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}><div><strong>{appointment.lawyerName}</strong><div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{appointment.date} at {appointment.time} · {appointment.type === 'video' ? 'Video' : 'In-person'}</div></div><div style={{ textAlign: 'right' }}><strong>PKR {appointment.fee.toLocaleString()}</strong><div><span className={`badge ${appointment.status === 'completed' ? 'badge-success' : appointment.status === 'cancelled' ? 'badge-danger' : 'badge-info'}`}>{appointment.status}</span></div></div></div>)}</section>

        <section className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ marginBottom: '0.35rem' }}>Payment activity</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Wallet transactions recorded on your account.</p>
          {!wallet?.transactions?.length ? <p style={{ color: 'var(--text-muted)' }}>No wallet transactions recorded yet.</p> : wallet.transactions.slice().reverse().map((transaction) => <div key={transaction._id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}><div><strong>{transaction.description || transaction.type}</strong><div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(transaction.createdAt).toLocaleDateString()} · {transaction.status}</div></div><strong style={{ color: transaction.type === 'credit' ? 'var(--success)' : 'var(--danger)' }}>{transaction.type === 'credit' ? '+' : '-'}PKR {transaction.amount.toLocaleString()}</strong></div>)}
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fffbeb', borderRadius: 8, color: '#92400e', fontSize: '0.8rem' }}>Online card payment processing is not configured yet. Appointment fees shown here come from your bookings.</div>
        </section>
      </div>
    </main>
  )
}
