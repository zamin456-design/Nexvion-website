import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleMode, setRoleMode] = useState('client'); // 'client' | 'admin'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loggedUser = await login(email, password);
      const isUserAdmin = loggedUser.role === 'admin';

      if (roleMode === 'admin' && !isUserAdmin) {
        await logout();
        setError(
          'This account does not have the admin role yet. Promote it in Supabase SQL Editor, then sign in again.'
        );
        return;
      }
      
      if (isUserAdmin) {
        navigate('/admin');
      } else {
        navigate('/portal', {
          state: location.state?.serviceId
            ? { serviceId: location.state.serviceId }
            : undefined,
        });
      }
    } catch (err) {
      const message = err.message || '';
      setError(
        /email not confirmed|email_not_confirmed/i.test(message)
          ? 'Please confirm your email using the link we sent before signing in.'
          : message || 'Authentication failed. Please verify credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In — NexVion Client & Admin Portal</title>
        <meta name="description" content="Access your NexVion client dashboard or administrative management portal." />
      </Helmet>

      <div className="pt-36 pb-28 min-h-screen max-w-content mx-auto px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-8 md:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient lighting */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEXVION AUTH GATEWAY</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome to NexVion
              </h1>
              <p className="text-xs text-muted mt-1.5">
                Sign in to manage your AI builds or access administrative consoles.
              </p>
            </div>

            {location.state?.signupMessage && (
              <div className="mb-5 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{location.state.signupMessage}</span>
              </div>
            )}

            {/* Role Tab Selector */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10 mb-6 font-mono text-xs">
              <button
                type="button"
                onClick={() => setRoleMode('client')}
                className={`py-2 rounded-lg transition-all ${
                  roleMode === 'client'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30'
                    : 'text-muted hover:text-white'
                }`}
              >
                Client Portal
              </button>
              <button
                type="button"
                onClick={() => setRoleMode('admin')}
                className={`py-2 rounded-lg transition-all ${
                  roleMode === 'admin'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/30'
                    : 'text-muted hover:text-white'
                }`}
              >
                Admin Console
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter {roleMode === 'admin' ? 'Admin Portal' : 'Client Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer switcher */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-muted">
              Don't have a client account?{' '}
              <Link to="/signup" className="text-cyan-400 hover:underline font-semibold">
                Register as a Client
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
