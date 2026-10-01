import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#243247] bg-[#0F172A]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#22C7E8]/10 border border-[#22C7E8]/30 flex items-center justify-center text-[#22C7E8]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-wide text-[#F1F5F9]">
              VISION<span className="text-[#22C7E8]">GUARD</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#94A3B8]">
          <Link to="/how-it-works" className="hover:text-[#F1F5F9] transition">How It Works</Link>
          <Link to="/capabilities" className="hover:text-[#F1F5F9] transition">Capabilities</Link>
          <Link to="/inspection-engine" className="hover:text-[#F1F5F9] transition">Inspection Engine</Link>
          <Link to="/live-demo" className="hover:text-[#F1F5F9] transition">Live Demo</Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link to="/dashboard" className="vg-btn-secondary text-[12px] py-1 px-3">
            Dashboard
          </Link>
          <Link to="/inspections/new" className="vg-btn-primary text-[12px] py-1 px-3">
            Start Inspection
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 text-[#94A3B8] hover:text-[#F1F5F9]"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#243247] bg-[#0F172A] px-4 py-3 space-y-3 text-[13px]">
          <div className="flex flex-col space-y-2 text-[#94A3B8]">
            <Link to="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-[#F1F5F9]">
              How It Works
            </Link>
            <Link to="/capabilities" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-[#F1F5F9]">
              Capabilities
            </Link>
            <Link to="/inspection-engine" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-[#F1F5F9]">
              Inspection Engine
            </Link>
            <Link to="/live-demo" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-[#F1F5F9]">
              Live Demo
            </Link>
          </div>
          <div className="pt-2 border-t border-[#243247] flex flex-col gap-2">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="vg-btn-secondary justify-center">
              Dashboard
            </Link>
            <Link to="/inspections/new" onClick={() => setIsMobileMenuOpen(false)} className="vg-btn-primary justify-center">
              Start Inspection
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
