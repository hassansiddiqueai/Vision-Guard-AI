import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    demoLogin('Safety Supervisor');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          Industrial Safety Control Portal
        </h1>
        <p className="mt-1 text-center text-xs text-slate-500">
          Enter credentials to access telemetry, inspections, and hazard monitoring
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

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supervisor@visionguard.ai"
                className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2 pl-3 pr-9 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full vg-btn-primary justify-center py-2.5 text-xs font-bold mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Operations Console'}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full vg-btn-secondary justify-center py-2 text-xs font-semibold"
            >
              Fast Demo Access (Site Supervisor Role)
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 pt-1">
            Need an account?{' '}
            <Link to="/register" className="text-sky-700 hover:underline font-semibold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

