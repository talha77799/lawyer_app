import { Link, useParams } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'

const officeAddress = 'Bahria Phase 7, Islamabad, Pakistan'
const contactNumber = '+92 334 8654822'
const contactEmail = 'info@vr-digital.co'

const services = [
  'Lawyer discovery and profile comparison',
  'Video and in-person legal consultations',
  'Appointment scheduling and calendar reminders',
  'Case progress and hearing-date tracking',
  'Secure consultation payments through PayFast',
  'Lawyer availability, wallet, and payout management',
]

const policyContent: Record<string, { title: string; intro: string; sections: Array<{ heading: string; body: string }> }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This policy explains how WakeelHub handles information shared when you use our website and legal consultation services.',
    sections: [
      { heading: 'Information we collect', body: 'We collect account details, contact information, profile information, appointment details, case information you choose to provide, payment references, and technical information needed to operate and secure the service.' },
      { heading: 'How we use information', body: 'We use information to create accounts, verify email addresses, connect clients with lawyers, manage appointments, process payments, provide support, improve the platform, and prevent fraud or misuse.' },
      { heading: 'Sharing and retention', body: 'Relevant appointment and case information is shared with the assigned user when needed to provide the service. We do not sell personal information. We retain information only as long as reasonably necessary for service, legal, security, and dispute-resolution purposes.' },
      { heading: 'Your choices', body: 'You may request correction or deletion of eligible account information by contacting support. Do not upload information that you are not authorized to share.' },
    ],
  },
  refunds: {
    title: 'Return and Refund Policy',
    intro: 'WakeelHub provides digital appointment and consultation services rather than physical products.',
    sections: [
      { heading: 'Cancellations', body: 'A client should contact support as soon as possible if an appointment needs to be cancelled or rescheduled. Refund eligibility depends on the appointment status, cancellation timing, and whether the consultation has started.' },
      { heading: 'Refund review', body: 'Payment disputes are reviewed using the appointment record and PayFast transaction ID. Approved refunds are sent through the original payment channel where supported by the payment provider.' },
      { heading: 'Non-refundable situations', body: 'A completed consultation, a missed appointment without prior notice, or a payment made outside the WakeelHub booking flow may not qualify for a refund.' },
      { heading: 'Requesting help', body: `Send the account email, appointment date, and PayFast transaction ID to ${contactEmail}. We aim to review requests promptly.` },
    ],
  },
  shipping: {
    title: 'Shipping and Service Policy',
    intro: 'WakeelHub does not ship physical products. Our service is delivered digitally through the website and scheduled consultations.',
    sections: [
      { heading: 'Digital service delivery', body: 'Account access, lawyer profiles, appointment confirmations, payment records, and case-tracking features are delivered through the WakeelHub platform.' },
      { heading: 'Video consultations', body: 'After a confirmed booking, clients and lawyers should use the appointment details and be available at the selected time. Service quality can depend on the user’s device and internet connection.' },
      { heading: 'In-person consultations', body: 'The lawyer’s listed office or chamber location is provided for an in-person appointment. Clients should confirm practical arrival details with the lawyer before attending.' },
      { heading: 'Service issues', body: `For access, scheduling, or delivery problems, contact ${contactNumber} or ${contactEmail} with the appointment details.` },
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    intro: 'By using WakeelHub, you agree to use the platform lawfully and to provide accurate account information.',
    sections: [
      { heading: 'Platform role', body: 'WakeelHub is a technology platform that helps clients discover and schedule independent legal professionals. WakeelHub is not a law firm and does not itself provide legal advice or guarantee a legal outcome.' },
      { heading: 'Accounts and conduct', body: 'Keep login information secure, use only your own account, provide truthful information, and do not misuse the platform, upload unlawful content, impersonate another person, or interfere with service operation.' },
      { heading: 'Lawyer and client relationship', body: 'A consultation is a professional relationship between the client and the selected lawyer. Users should independently confirm that a lawyer is suitable for their matter and should not rely on platform information as a substitute for legal advice.' },
      { heading: 'Payments and changes', body: 'Consultation fees are shown before booking and are processed through PayFast. We may update platform features, policies, or service availability as the product evolves, while preserving applicable user rights.' },
    ],
  },
}

export default function LegalPage() {
  const { type = 'privacy' } = useParams()
  const policyKey = ({ 'privacy-policy': 'privacy', 'refund-policy': 'refund', 'shipping-policy': 'shipping', 'terms-and-conditions': 'terms' } as Record<string, string>)[type] || type
  const policy = policyContent[policyKey] || policyContent.privacy

  return (
    <main className="container legal-page" style={{ padding: '2.5rem 1.25rem', maxWidth: 900 }}>
      <Link to="/" style={{ color: 'var(--primary)' }}>← Back to WakeelHub</Link>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '1rem 0 0.5rem' }}>{policy.title}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{policy.intro}</p>
      {policy.sections.map((section) => (
        <section key={section.heading} className="card legal-section" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{section.heading}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{section.body}</p>
        </section>
      ))}

      <section className="card" style={{ padding: '1.25rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>WakeelHub Services</h2>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)' }}>
          {services.map((service) => <li key={service} style={{ marginBottom: '0.45rem' }}>{service}</li>)}
        </ul>
        <div style={{ display: 'grid', gap: '0.55rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          <div><MapPin size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />{officeAddress}</div>
          <div><Phone size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />{contactNumber}</div>
          <div><Mail size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />{contactEmail}</div>
        </div>
      </section>
    </main>
  )
}
