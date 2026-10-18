import { Link } from 'react-router-dom';
import { contactDetails } from '../../lib/contactData';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#05070f] py-14 text-xs font-sans">
      <div className="max-w-content mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-muted">
        {/* Left: Brand & Tagline */}
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">NexVion</h3>
          <p className="mt-1 text-xs text-muted">
            Building the Future Intelligence with AI
          </p>
        </div>

        {/* Center: Contact Details */}
        <div className="space-y-1">
          <p className="text-white/90">
            <span className="text-muted">Phone </span>
            <a href={`tel:${contactDetails.phone}`} className="hover:text-white transition-colors font-mono">
              {contactDetails.phone}
            </a>
          </p>
          {contactDetails.emails.map((email) => (
            <p key={email}>
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </p>
          ))}
          <p>
            <a
              href={contactDetails.linkedIn}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              linkedin.com/company/nex-vion
            </a>
          </p>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-2 text-xs">
          <Link to="/services" className="hover:text-white transition-colors">
            Services
          </Link>
          <span className="text-white/20">·</span>
          <Link to="/projects" className="hover:text-white transition-colors">
            Projects
          </Link>
          <span className="text-white/20">·</span>
          <Link to="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
