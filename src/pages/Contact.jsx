import { Helmet } from 'react-helmet-async';
import { Linkedin, Mail, Phone } from 'lucide-react';
import { contactDetails } from '../lib/contactData';

const contactMethods = [
  {
    label: 'Email',
    value: contactDetails.emails[0],
    href: `mailto:${contactDetails.emails[0]}`,
    Icon: Mail,
  },
  {
    label: 'Email',
    value: contactDetails.emails[1],
    href: `mailto:${contactDetails.emails[1]}`,
    Icon: Mail,
  },
  {
    label: 'Phone',
    value: contactDetails.phone,
    href: `tel:${contactDetails.phone}`,
    Icon: Phone,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/company/nex-vion',
    href: contactDetails.linkedIn,
    Icon: Linkedin,
    external: true,
  },
];

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact NexVion | Contact Information</title>
        <meta
          name="description"
          content="Contact NexVion by email, phone, or LinkedIn."
        />
      </Helmet>

      <div className="pt-36 pb-28 max-w-content mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Contact information
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed">
            Get in touch with us directly using the details below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
          {contactMethods.map(({ label, value, href, Icon, external }) => (
            <a
              key={href}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="flex items-center gap-5 rounded-3xl bg-[#0b0f1d] border border-white/5 p-7 shadow-xl hover:border-cyan-400/30 transition-colors"
            >
              <span className="flex w-12 h-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-white/70 mb-1">
                  {label}
                </span>
                <span className="block break-all text-sm font-medium text-white hover:text-cyan-300 transition-colors">
                  {value}
                </span>
              </span>
            </a>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted">
          More contact information will be added here in the future.
        </p>
      </div>
    </>
  );
}
