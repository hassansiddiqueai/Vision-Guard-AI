import React from 'react';
import { Shield, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-sky-700 flex items-center justify-center text-white font-bold">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-slate-900">
                VISION<span className="text-sky-700 font-semibold">GUARD</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-sm text-xs leading-relaxed">
              Industrial computer vision platform engineered for continuous safety monitoring, OSHA/ISO compliance verification, and critical hazard mitigation across high-risk environments.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Vision Inference Subsystem Operational</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
              Operations
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link to="/dashboard" className="hover:text-slate-900 transition">
                  Safety Dashboard
                </Link>
              </li>
              <li>
                <Link to="/live-monitoring" className="hover:text-slate-900 transition">
                  Live CCTV Feeds
                </Link>
              </li>
              <li>
                <Link to="/inspections" className="hover:text-slate-900 transition">
                  Inspections Register
                </Link>
              </li>
              <li>
                <Link to="/incidents" className="hover:text-slate-900 transition">
                  Risk & Incidents
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
              Standards
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5 font-medium text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
                <span>OSHA 1926 & ISO 45001</span>
              </li>
              <li>Dual-Verification Hazard Engine</li>
              <li>Audit-Grade PDF & JSON Export</li>
              <li>Role-Based Access Control</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>© {new Date().getFullYear()} VisionGuard AI. Industrial Safety Monitoring Platform.</p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <Link to="/login" className="hover:text-slate-800">Inspector Portal</Link>
            <Link to="/settings" className="hover:text-slate-800">System Telemetry</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};


