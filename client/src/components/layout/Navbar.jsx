import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-sky-700 flex items-center justify-center text-white font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-900">
              VISION<span className="text-sky-700 font-semibold">GUARD</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <Link to="/dashboard" className="hover:text-slate-900 transition">Dashboard</Link>
          <Link to="/live-monitoring" className="hover:text-slate-900 transition">Live Cameras</Link>
          <Link to="/inspections" className="hover:text-slate-900 transition">Inspections</Link>
          <Link to="/incidents" className="hover:text-slate-900 transition">Risk Events</Link>
          <Link to="/site-map" className="hover:text-slate-900 transition">Site Map</Link>
          <Link to="/reports" className="hover:text-slate-900 transition">Reports</Link>
          <Link to="/analytics" className="hover:text-slate-900 transition">Analytics</Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link to="/dashboard" className="vg-btn-secondary text-xs py-1.5 px-3">
            Operations Console
          </Link>
          <Link to="/inspections/new" className="vg-btn-primary text-xs py-1.5 px-3">
            <span>New Audit</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 text-slate-600 hover:text-slate-900"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-3 text-xs">
          <div className="flex flex-col space-y-2 text-slate-600 font-semibold">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-slate-900">Dashboard</Link>
            <Link to="/live-monitoring" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-slate-900">Live Cameras</Link>
            <Link to="/inspections" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-slate-900">Inspections</Link>
            <Link to="/incidents" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-slate-900">Risk Events</Link>
            <Link to="/site-map" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-slate-900">Site Map</Link>
            <Link to="/reports" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-slate-900">Reports</Link>
          </div>
          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="vg-btn-secondary justify-center">
              Dashboard
            </Link>
            <Link to="/inspections/new" onClick={() => setIsMobileMenuOpen(false)} className="vg-btn-primary justify-center">
              New Inspection
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

