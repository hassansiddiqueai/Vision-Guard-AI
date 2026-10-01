import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Radio,
  CheckCircle2,
  Lock,
  ArrowRight,
  HardHat,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
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
      setError('Please enter your work email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Authentication failed. Please check credentials or use Quick Demo Access.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role = 'Safety Supervisor') => {
    demoLogin(role);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
      {/* Left Side: Industrial Operations Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B1220] border-r border-slate-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Subtle Grid Texture */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wider text-white">VISIONGUARD</span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Industrial Safety Platform</p>
            </div>
          </div>
        </div>

        {/* Center Operational Value Description */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-sky-400 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AI CCTV SURVEILLANCE &bull; OSHA COMPLIANT</span>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight leading-snug">
            Continuous Visual Safety Operations & Risk Mitigation
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            VisionGuard connects to live IP cameras across high-risk industrial sites to detect hazardous conditions, structural anomalies, and PPE non-compliance in real time.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-md bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Real-Time Inference
              </p>
              <p className="text-[11px] text-slate-400">Sub-100ms multi-camera spatial tracking.</p>
            </div>
            <div className="p-3 rounded-md bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Corrective Workflow
              </p>
              <p className="text-[11px] text-slate-400">Enforces field verification & audit trail.</p>
            </div>
          </div>
        </div>

        {/* Bottom Platform Tag */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 font-mono pt-6 border-t border-slate-800/60">
          <span>SECURE INDUSTRIAL SAFETY MONITORING</span>
          <span>SYSTEM TIER 1 CERTIFIED</span>
        </div>
      </div>

      {/* Right Side: Enterprise Login Form */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex flex-col justify-center px-6 sm:px-12 lg:px-16 text-slate-900">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Mobile Brand */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-md bg-sky-700 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900">
              VISION<span className="text-sky-700">GUARD</span>
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Safety Control Center Login
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authenticate using authorized enterprise safety inspector credentials
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supervisor@visionguard.ai"
                className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-md text-slate-900 text-xs focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-sky-700 hover:underline font-semibold text-[11px]">
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 pl-3 pr-9 bg-white border border-slate-300 rounded-md text-slate-900 text-xs focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none transition"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>Remember this terminal</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full vg-btn-primary justify-center py-2.5 text-xs font-bold shadow-xs"
            >
              {loading ? 'Validating Token...' : 'Authenticate & Enter Operations Center'}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Fast Demo Access for Hackathon Judges
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('Safety Supervisor')}
                className="vg-btn-secondary justify-center py-2 text-xs font-semibold"
              >
                Safety Supervisor
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('Safety Manager')}
                className="vg-btn-secondary justify-center py-2 text-xs font-semibold"
              >
                Site Manager
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 pt-2">
            Need an enterprise account?{' '}
            <Link to="/signup" className="text-sky-700 hover:underline font-bold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
