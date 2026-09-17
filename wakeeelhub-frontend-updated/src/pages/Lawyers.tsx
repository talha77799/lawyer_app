import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { lawyers, cities, practiceAreas } from '../data/mockData'
import LawyerCard from '../components/LawyerCard'
import { Search } from 'lucide-react'

export default function Lawyers() {
  const [params] = useSearchParams()
  const [city, setCity] = useState(params.get('city') || '')
  const [area, setArea] = useState(params.get('area') || '')
  const [q, setQ] = useState(params.get('q') || '')
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [sort, setSort] = useState('rating')

  const filtered = useMemo(() => {
    let list = [...lawyers]
    if (city) list = list.filter(l => l.city === city)
    if (area) list = list.filter(l => l.specialization.some(s => s.toLowerCase().includes(area.toLowerCase())))
    if (q) {
      const lower = q.toLowerCase()
      list = list.filter(l =>
        l.name.toLowerCase().includes(lower) ||
        l.specialization.some(s => s.toLowerCase().includes(lower)) ||
        l.city.toLowerCase().includes(lower)
      )
    }
    if (onlineOnly) list = list.filter(l => l.online)
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'fee-low') list.sort((a, b) => a.fee - b.fee)
    if (sort === 'fee-high') list.sort((a, b) => b.fee - a.fee)
    if (sort === 'exp') list.sort((a, b) => b.experience - a.experience)
    return list
  }, [city, area, q, onlineOnly, sort])

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Find Verified Lawyers
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        {filtered.length} lawyers found
      </p>

      <div className="filters-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
          <input
            style={{ paddingLeft: 36, width: '100%' }}
            placeholder="Search by name or service..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <select value={city} onChange={e => setCity(e.target.value)}>
          <option value="">All Cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={area} onChange={e => setArea(e.target.value)}>
          <option value="">All Practice Areas</option>
          {practiceAreas.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="rating">Top Rated</option>
          <option value="fee-low">Fee: Low to High</option>
          <option value="fee-high">Fee: High to Low</option>
          <option value="exp">Most Experienced</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={onlineOnly} onChange={e => setOnlineOnly(e.target.checked)} />
          Online only
        </label>
      </div>

      <div className="lawyer-grid">
        {filtered.map(l => <LawyerCard key={l.id} lawyer={l} />)}
      </div>
      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
          No lawyers found matching your criteria.
        </p>
      )}
    </div>
  )
}
