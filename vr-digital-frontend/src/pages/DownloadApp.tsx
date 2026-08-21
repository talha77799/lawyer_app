import { Download, ExternalLink, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'

const androidUrl = import.meta.env.VITE_ANDROID_APP_URL
const iosUrl = import.meta.env.VITE_IOS_APP_URL

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function DownloadApp() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    const handleInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const installWebApp = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
    setInstallPrompt(null)
  }

  return (
    <main className="container" style={{ padding: '3rem 1.25rem', maxWidth: 640 }}>
      <div className="card" style={{ padding: '2rem' }}>
        <Smartphone size={42} color="var(--primary)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Download VR-Digital</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Use the VR-Digital mobile app to find lawyers, manage appointments, and track your cases.
        </p>

        <button className="btn btn-primary" type="button" onClick={installWebApp} disabled={!installPrompt || installed} style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <Download size={17} /> {installed ? 'Web App Installed' : installPrompt ? 'Install Web App' : 'Web App Ready'}
        </button>

        {androidUrl ? (
          <a className="btn btn-outline" href={androidUrl} target="_blank" rel="noreferrer" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <ExternalLink size={17} /> Open Google Play
          </a>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>Android listing will appear after the Play Store release.</p>
        )}

        {iosUrl ? (
          <a className="btn btn-outline" href={iosUrl} target="_blank" rel="noreferrer" style={{ width: '100%', justifyContent: 'center' }}>
            <ExternalLink size={17} /> Open App Store
          </a>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>iOS App Store link will appear after the app is published.</p>
        )}
        {!installPrompt && !installed && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>On supported browsers, use the browser menu and choose “Install app” or “Add to Home Screen”.</p>}
      </div>
    </main>
  )
}