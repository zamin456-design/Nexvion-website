import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactInquiry } from '../lib/supabase';
import confetti from 'canvas-confetti';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Business Website',
    message: '',
  });

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const services = [
    'Business Website',
    'Full-Stack Web App',
    'SaaS Product (MVP)',
    'AI Chatbot',
    'Automation & AI Agents',
    'RAG / LLM Solution',
    'Custom AI / ML Model',
    'Fine-Tuning (LLM)',
    'AI Video Generation',
    'Social Media Handling',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const res = await submitContactInquiry({
        name: formData.name,
        email: formData.email,
        service: formData.service,
        message: formData.message,
      });

      if (res.success) {
        setStatus('success');
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#fde047', '#f43f5e'],
        });
      }
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
      setStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact NexVion — Tell Us What You Want to Build</title>
        <meta 
          name="description" 
          content="Send a message and our team will reply. Have an account? Booking a service gets you a live chat with us." 
        />
      </Helmet>

      <div className="pt-36 pb-28 max-w-content mx-auto px-6 md:px-12 text-left">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Tell us what you want to build
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed">
            Send a message and our team will reply. Have an account? Booking a service gets you a live chat with us.
          </p>
        </div>

        {/* Main 2-Column Grid (Page 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
          
          {/* Left: Input Form */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0b0f1d] border border-white/5 p-8 md:p-10 shadow-xl">
            {status === 'success' ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Dispatched</h3>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Thank you, <strong className="text-white">{formData.name}</strong>. An engineer has received your message and will reply to <span className="text-cyan-300 font-mono">{formData.email}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setFormData({ name: '', email: '', service: 'Business Website', message: '' });
                  }}
                  className="mt-4 px-6 py-2 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-white/90 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-dark text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/90 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-dark text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/90 mb-2">
                    Service of interest
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#090d16] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {services.map((s) => (
                      <option key={s} value={s} className="bg-bg text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/90 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-dark text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-7 py-3 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 transition-all shadow-md shadow-yellow-950/20 hover:scale-[1.02] disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send message'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Phone, WhatsApp, LinkedIn Cards (Page 7) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Phone Card */}
            <div className="rounded-3xl bg-[#0b0f1d] border border-white/5 p-8 shadow-xl">
              <span className="text-xs font-semibold text-white/70 block mb-1">
                Phone
              </span>
              <a
                href="tel:03418921169"
                className="text-lg font-bold text-white hover:text-cyan-400 transition-colors font-mono"
              >
                03418921169
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="rounded-3xl bg-[#0b0f1d] border border-white/5 p-8 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white tracking-tight">
                WhatsApp
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Message us directly for quick questions.
              </p>
              <div>
                <a
                  href="https://wa.me/923418921169"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-6 py-2.5 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 transition-all shadow-md"
                >
                  Open WhatsApp
                </a>
              </div>
            </div>

            {/* LinkedIn Card */}
            <div className="rounded-3xl bg-[#0b0f1d] border border-white/5 p-8 shadow-xl">
              <span className="text-xs font-semibold text-white/70 block mb-1">
                LinkedIn
              </span>
              <a
                href="https://linkedin.com/company/nex-vion"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/90 hover:text-cyan-400 transition-colors"
              >
                linkedin.com/company/nex-vion
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
