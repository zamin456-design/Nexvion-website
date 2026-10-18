import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, UserRoundPlus, X } from 'lucide-react';
import { contactDetails } from '../lib/contactData';

export default function ServiceBookingOptionsModal({
  service,
  onClose,
  onCreateAccount,
  hasAccount,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const emailSubject = encodeURIComponent(`Booking enquiry: ${service.name}`);
  const emailBody = encodeURIComponent(
    `Hello NexVion,\n\nI would like to book ${service.name}. Please share the next steps.\n`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-black/80 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-options-title"
        className="relative my-auto w-full max-w-lg rounded-3xl bg-[#0b0f1d] border border-white/15 p-6 md:p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close booking options"
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 text-muted hover:text-white transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <p className="text-xs font-semibold tracking-wide text-cyan-300 uppercase">
          {service.name}
        </p>
        <h2
          id="booking-options-title"
          className="mt-2 pr-10 text-2xl font-bold text-white tracking-tight"
        >
          How would you like to book?
        </h2>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Choose what works best for you. Contact us directly or create an account to manage this and future services.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 className="text-sm font-semibold text-white">Contact us directly</h3>
          <p className="mt-1 text-xs text-muted">
            Email us about {service.name} or call our team.
          </p>
          <div className="mt-4 space-y-3">
            {contactDetails.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}?subject=${emailSubject}&body=${emailBody}`}
                className="flex items-center gap-3 text-sm text-cyan-300 hover:text-cyan-200 transition-colors break-all"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                {email}
              </a>
            ))}
            <a
              href={`tel:${contactDetails.phone}`}
              className="flex items-center gap-3 text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              {contactDetails.phone}
            </a>
          </div>
          <Link
            to="/contact"
            onClick={onClose}
            className="mt-4 inline-block text-xs font-semibold text-white/70 hover:text-white transition-colors"
          >
            View all contact details
          </Link>
        </div>

        <button
          type="button"
          onClick={onCreateAccount}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] px-5 py-3 text-xs font-bold text-[#08060d] shadow-md shadow-yellow-950/20 hover:opacity-95 transition-all"
        >
          <UserRoundPlus className="w-4 h-4" aria-hidden="true" />
          {hasAccount ? 'Continue to your account' : 'Create an account to book'}
        </button>
        <p className="mt-3 text-center text-[11px] text-muted">
          Your account keeps booking details and future project updates in one place.
        </p>
      </section>
    </div>
  );
}
