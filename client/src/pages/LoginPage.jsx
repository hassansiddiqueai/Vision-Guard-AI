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
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const backgroundScenes = [
    {
      title: 'Scaffolding & Rebar Work Tier 6',
      site: 'Apex Tower Project',
      image: '/assets/construction-site-bg.jpg',
      hazard: 'ELEVATED REBAR WORK • TIE-OFF REQUIRED',
      status: 'CRITICAL HAZARD',
      color: 'border-red-500 text-red-400 bg-red-950/60',
    },
    {
      title: 'Excavation Trench Bed',
      site: 'Eastside Medical Phase 2',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop',
      hazard: 'IMPACT DOWEL SHIELD VERIFIED',
      status: 'MONITORED',
      color: 'border-amber-500 text-amber-400 bg-amber-950/60',
    },
    {
      title: 'Heavy Equipment Logistics Yard',
      site: 'Harbor Gateway Logistics',
      image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1600&auto=format&fit=crop',
      hazard: 'MACHINERY SWING RADIUS 1.2M',
      status: 'PROXIMITY WARNING',
      color: 'border-orange-500 text-orange-400 bg-orange-950/60',
    },
    {
      title: '480V Transformer Bay',
      site: 'Substation 4 Infrastructure',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1600&auto=format&fit=crop',
      hazard: 'EGRESS CLEARANCE COMPLIANT',
      status: 'COMPLIANT',
      color: 'border-emerald-500 text-emerald-400 bg-emerald-950/60',
    },
  ];

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

  const currentScene = backgroundScenes[activePhotoIdx];

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
      {/* Left Side: Industrial Operations Showcase with Interactive Photo Backdrop & Telemetry Animation */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#080E1A] border-r border-slate-800 flex-col justify-between p-12 relative overflow-hidden select-none">
        {/* Real Industrial Photo Background with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0 transition-opacity duration-700">
          <img
            src={currentScene.image}
            alt={currentScene.title}
            className="w-full h-full object-cover opacity-30 filter brightness-75 contrast-125 transition-transform duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080E1A] via-[#080E1A]/80 to-[#080E1A]/50" />
          <div className="absolute inset-0 vg-dark-grid opacity-50 pointer-events-none" />
          
          {/* Animated Scanning Beam */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400/20 to-transparent h-28 w-full animate-scanline pointer-events-none" />

          {/* Rotating Radar Crosshair */}
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 pointer-events-none opacity-20">
            <div className="absolute inset-0 vg-radar-circle animate-hud-spin" />
            <div className="absolute inset-8 vg-radar-circle" />
            <div className="absolute inset-0 origin-center animate-radar">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-sky-400/30 to-transparent rounded-tl-full" />
            </div>
          </div>
        </div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold shadow-md shadow-sky-900/50">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wider text-white">VISIONGUARD</span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Industrial Safety Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>RADAR ACTIVE</span>
          </div>
        </div>

        {/* Center Operational Value Description */}
        <div className="relative z-10 space-y-5 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-sky-400 text-xs font-mono shadow-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{currentScene.site} &bull; {currentScene.title}</span>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight leading-snug">
            Continuous Visual Safety Operations & Risk Mitigation
          </h1>

          {/* Realtime Detection Overlay Pill */}
          <div className={`p-2.5 rounded border text-xs font-mono flex items-center justify-between ${currentScene.color}`}>
            <span className="font-bold">{currentScene.hazard}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-bold">
              {currentScene.status}
            </span>
          </div>

          {/* Interactive Background Photo Scene Switcher */}
          <div className="pt-2 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Interactive Camera Backdrop:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {backgroundScenes.map((scene, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-12 rounded overflow-hidden border transition relative group cursor-pointer ${
                    activePhotoIdx === idx
                      ? 'border-sky-400 ring-2 ring-sky-500/50 shadow-md'
                      : 'border-slate-700/80 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={scene.image} alt={scene.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition" />
                  <span className="absolute bottom-0.5 left-1 text-[8px] font-mono font-bold text-white bg-black/70 px-1 rounded">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Platform Tag */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-6 border-t border-slate-800/80">
          <span>SECURE INDUSTRIAL SAFETY MONITORING</span>
          <span className="text-emerald-400 font-bold">● SYSTEM ONLINE</span>
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
