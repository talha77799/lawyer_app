export const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001/api`
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '')

export const getAssetUrl = (assetPath?: string) => {
  if (!assetPath) return ''
  return assetPath.startsWith('http') ? assetPath : `${API_ORIGIN}${assetPath}`
}

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

export const apiRequest = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  const headers = new Headers(options.headers)
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}
