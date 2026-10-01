import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your work email address.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-md bg-sky-700 flex items-center justify-center text-white font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            VISION<span className="text-sky-700 font-semibold">GUARD</span>
          </span>
        </Link>

        <h1 className="text-center text-xl font-bold text-slate-900 tracking-tight">
          Reset Safety Operations Password
        </h1>
        <p className="mt-1 text-center text-xs text-slate-500">
          Enter your authorized enterprise email to receive secure recovery credentials
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="vg-card p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded-md bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Recovery Instructions Dispatched</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                If an authorized safety account is registered for <strong className="text-slate-800">{email}</strong>, a secure reset token has been sent.
              </p>
              <div className="pt-3">
                <Link to="/login" className="vg-btn-primary w-full justify-center text-xs py-2">
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Work Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="inspector@company.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-sky-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full vg-btn-primary justify-center py-2.5 text-xs font-bold"
              >
                {loading ? 'Verifying Account...' : 'Send Recovery Link'}
              </button>

              <div className="pt-2 text-center">
                <Link to="/login" className="text-xs text-slate-500 hover:text-slate-900 font-medium">
                  &larr; Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
