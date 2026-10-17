import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting.current) return;

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    submitting.current = true;
    setLoading(true);
    setError('');

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        company: formData.company,
        role: 'client',
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#8b5cf6', '#ec4899'],
      });

      navigate('/portal');
    } catch (err) {
      const message = err.message || '';
      if (/email rate limit exceeded|over_email_send_rate_limit/i.test(message)) {
        setError(
          'Supabase has limited outgoing authentication emails. This limit counts email sends and can happen even before any clients have registered. Configure a custom SMTP provider in Supabase Dashboard → Authentication → SMTP Settings, then review Authentication → Rate Limits. If this address was already submitted, try signing in before retrying.'
        );
      } else {
        setError(message || 'Failed to create account. Please try again.');
      }
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Client Account — NexVion AI Labs</title>
        <meta name="description" content="Register your client account to book and manage autonomous AI and full-stack services." />
      </Helmet>

      <div className="pt-36 pb-28 min-h-screen max-w-content mx-auto px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-8 md:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CLIENT ONBOARDING</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Client Account
              </h1>
              <p className="text-xs text-muted mt-1.5">
                Book AI models, full-stack systems, and communicate in real time with our lead engineers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Alex Vance"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">Work Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@enterprise.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">Company / Project Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Nova AI Dynamics"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">Password * (Min 6 chars)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Client Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
