import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../utils/api'

type Transaction = { _id: string; type: string; amount: number; description: string; status: string; createdAt: string }
type Wallet = { balance: number; currency: string; transactions: Transaction[] }

export default function WalletPayouts() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const load = () => apiRequest('/wallet').then(({ data }) => setWallet(data)).catch((err) => setError(err.message)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const requestPayout = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError(''); setNotice('')
    try { const { data, message } = await apiRequest('/wallet/payout', { method: 'POST', body: JSON.stringify({ amount: Number(amount) }) }); setWallet(data); setAmount(''); setNotice(message || 'Payout requested.') }
    catch (err: any) { setError(err.message) } finally { setSaving(false) }
  }

  if (loading) return <main className="container" style={{ padding: '3rem 1.25rem' }}><p>Loading wallet...</p></main>
  return <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 900 }}>
    <Link to="/lawyer-dashboard" style={{ color: 'var(--primary)' }}>← Back to dashboard</Link>
    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '1rem 0 0.35rem' }}>Wallet &amp; Payouts</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Track your available earnings and payout requests.</p>
    {error && <div className="alert-error">{error}</div>}{notice && <div className="alert-success">{notice}</div>}
    <div className="stats-grid" style={{ marginBottom: '1.5rem' }}><div className="stat-card"><div className="label">Available balance</div><div className="value">{wallet?.currency} {(wallet?.balance || 0).toLocaleString()}</div></div><div className="stat-card"><div className="label">Transactions</div><div className="value">{wallet?.transactions?.length || 0}</div></div></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 0.8fr) 1.2fr', gap: '1.5rem' }}>
      <form className="card" style={{ padding: '1.25rem' }} onSubmit={requestPayout}><h3 style={{ marginBottom: '1rem' }}>Request payout</h3><div className="form-group"><label htmlFor="payout-amount">Amount (PKR)</label><input id="payout-amount" type="number" min="1" max={wallet?.balance || 0} required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" /></div><button className="btn btn-primary" disabled={saving}>{saving ? 'Submitting...' : 'Request payout'}</button></form>
      <div className="card" style={{ padding: '1.25rem' }}><h3 style={{ marginBottom: '1rem' }}>Transaction history</h3>{!wallet?.transactions?.length ? <p style={{ color: 'var(--text-muted)' }}>No transactions yet.</p> : wallet.transactions.slice().reverse().map((transaction) => <div key={transaction._id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}><div><strong>{transaction.description || transaction.type}</strong><div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(transaction.createdAt).toLocaleDateString()} · {transaction.status}</div></div><strong style={{ color: transaction.type === 'payout' ? 'var(--danger)' : 'var(--success)' }}>{transaction.type === 'payout' ? '-' : '+'}{transaction.amount.toLocaleString()} PKR</strong></div>)}</div>
    </div>
  </main>
}
