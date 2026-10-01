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
    <div className="min-h-screen bg-[#0B1220] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded bg-[#22C7E8]/10 border border-[#22C7E8]/30 flex items-center justify-center text-[#22C7E8]">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-semibold text-lg text-[#F1F5F9]">
            VISION<span className="text-[#22C7E8]">GUARD</span>
          </span>
        </Link>

        <h1 className="text-center text-[20px] font-semibold text-[#F1F5F9]">
          Sign In to Safety Portal
        </h1>
        <p className="mt-0.5 text-center text-[13px] text-[#94A3B8]">
          Enter credentials to access visual inspection data
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="vg-card p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center gap-2 text-[12px] text-[#EF4444]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-[13px]">
            <div>
              <label className="block text-[#94A3B8] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="inspector@visionguard.ai"
                className="w-full py-2 px-3 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9] focus:outline-none focus:border-[#22C7E8]"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2 pl-3 pr-9 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9] focus:outline-none focus:border-[#22C7E8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#F1F5F9]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full vg-btn-primary justify-center py-2 text-[13px] mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-3 border-t border-[#243247]">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full vg-btn-secondary justify-center py-2 text-[12px]"
            >
              Quick Demo Access (Inspector)
            </button>
          </div>

          <p className="text-center text-[12px] text-[#94A3B8] pt-1">
            Need an account?{' '}
            <Link to="/register" className="text-[#22C7E8] hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
