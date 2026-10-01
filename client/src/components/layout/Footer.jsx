import React from 'react';
import { Shield, Radio, Activity, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-850 bg-slate-950/90 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Vision<span className="text-cyan-400">Guard</span> AI
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Autonomous visual inspection and hazard detection platform designed for industrial sites, construction safety, critical equipment, and infrastructure audits.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>INSPECTION CORE ONLINE — LATENCY 42MS</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/inspect" className="hover:text-cyan-400 transition">
                  New Visual Inspection
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition">
                  Operational Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-cyan-400 transition">
                  Inspection Logs
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-cyan-400 transition">
                  Risk Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Standards & Security
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                <span>OSHA & ISO Safety Auditing</span>
              </li>
              <li>Explainable Vision AI Diagnostics</li>
              <li>Zero-Trust API Security</li>
              <li>Multi-Format Telemetry Export</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VisionGuard AI. "See What Humans Miss." Built for Hackathon.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] text-slate-600">ENGINE V2.4.0</span>
            <Link to="/login" className="hover:text-slate-400">Portal Login</Link>
            <Link to="/register" className="hover:text-slate-400">Register</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
