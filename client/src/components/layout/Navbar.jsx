import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Menu, X, ArrowRight, Cctv } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1">
              VISION<span className="text-sky-400">GUARD</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 font-mono border border-sky-500/20 font-medium">
                AI
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
          <Link to="/how-it-works" className="hover:text-sky-400 transition">How It Works</Link>
          <Link to="/capabilities" className="hover:text-sky-400 transition">Capabilities</Link>
          <Link to="/inspection-engine" className="hover:text-sky-400 transition">Inspection Engine</Link>
          <Link to="/live-demo" className="hover:text-sky-400 transition">Live Demo</Link>
          <Link to="/live-monitoring" className="hover:text-sky-400 transition flex items-center gap-1 text-sky-400 font-bold">
            <Cctv className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/dashboard"
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/inspections/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Inspection</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-4 text-xs font-semibold">
          <div className="flex flex-col space-y-3 text-slate-300">
            <Link
              to="/how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-sky-400"
            >
              How It Works
            </Link>
            <Link
              to="/capabilities"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-sky-400"
            >
              Capabilities
            </Link>
            <Link
              to="/inspection-engine"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-sky-400"
            >
              Inspection Engine
            </Link>
            <Link
              to="/live-demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-sky-400"
            >
              Live Demo
            </Link>
            <Link
              to="/live-monitoring"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 text-sky-400 font-bold"
            >
              Live Camera Feed
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
            >
              Dashboard
            </Link>
            <Link
              to="/inspections/new"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg bg-sky-500 text-slate-950 font-bold"
            >
              Start Inspection
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
