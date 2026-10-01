import React from 'react';
import { Shield, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-[#243247] bg-[#0B1220] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#111C2E] border border-[#243247] flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-semibold text-base text-white">
                VISION<span className="text-cyan-400">GUARD</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Industrial visual inspection and hazard detection platform designed for construction safety, facility compliance, and workplace risk monitoring.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Inspection Engine Online</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/inspect" className="hover:text-cyan-400 transition">
                  New Inspection
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-cyan-400 transition">
                  Inspections
                </Link>
              </li>
              <li>
                <Link to="/hazards" className="hover:text-cyan-400 transition">
                  Hazard Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Standards & Security
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
                <span>OSHA 1926 & ISO 45001 Compliance</span>
              </li>
              <li>Explainable Vision Diagnostics</li>
              <li>Audit-Grade PDF & JSON Export</li>
              <li>Enterprise Role Access Control</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#243247] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VisionGuard. Enterprise Safety Control Center.</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-300">Inspector Login</Link>
            <Link to="/register" className="hover:text-slate-300">Register</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

