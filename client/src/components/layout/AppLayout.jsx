import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Plus, Bell, Search, Shield, ChevronRight, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInspections } from '../../context/InspectionContext';

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { inspections } = useInspections();

  // Route metadata helper
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return { title: 'Operational Overview', section: 'Control Center' };
    if (path === '/inspections/new' || path === '/inspect') return { title: 'New Visual Inspection', section: 'Inspections' };
    if (path.startsWith('/inspections/') || path.startsWith('/inspection/')) return { title: 'Inspection Diagnostics', section: 'Inspections' };
    if (path.startsWith('/inspections') || path === '/history') return { title: 'Inspection Records', section: 'Inspections' };
    if (path.startsWith('/monitoring')) return { title: 'Live Site Monitoring', section: 'Surveillance' };
    if (path.startsWith('/hazards')) return { title: 'Hazard Management Matrix', section: 'Safety Risk' };
    if (path.startsWith('/compliance')) return { title: 'Regulatory Compliance Audit', section: 'Standards' };
    if (path.startsWith('/reports')) return { title: 'Audit Report Generator', section: 'Documentation' };
    if (path.startsWith('/profile')) return { title: 'Inspector Credentials', section: 'Account' };
    if (path.startsWith('/settings')) return { title: 'System Parameters', section: 'Configuration' };
    return { title: 'VisionGuard Platform', section: 'System' };
  };

  const pageInfo = getPageInfo();

  // Critical alerts for notifications panel
  const criticalFindings = inspections
    .flatMap((insp) => (insp.findings || []).map((f) => ({ ...f, inspectionId: insp.id, site: insp.site })))
    .filter((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH')
    .slice(0, 5);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/inspections?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 antialiased">
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[85vw] h-full shadow-2xl">
            <Sidebar isMobile onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Control Bar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span>{pageInfo.section}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-200 font-semibold">{pageInfo.title}</span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Global Search */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:block relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inspections, hazards..."
                className="w-56 pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition"
              />
            </form>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition border border-slate-700/60"
                title="Active Hazard Alerts"
              >
                <Bell className="w-4 h-4" />
                {criticalFindings.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-mono font-bold flex items-center justify-center text-white">
                    {criticalFindings.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold font-mono text-slate-200 uppercase">
                      Urgent Hazard Alerts
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {criticalFindings.length === 0 ? (
                      <p className="text-xs text-slate-400 py-2 text-center">No active critical alerts.</p>
                    ) : (
                      criticalFindings.map((f, i) => (
                        <Link
                          key={i}
                          to={`/inspections/${f.inspectionId}`}
                          onClick={() => setShowNotifications(false)}
                          className="block p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-200">{f.label}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                              {f.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 truncate">{f.site}</p>
                        </Link>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-center">
                    <Link
                      to="/hazards"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-sky-400 hover:underline font-mono"
                    >
                      View All Hazard Logs →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Inspection Button */}
            {location.pathname !== '/inspections/new' && (
              <Link
                to="/inspections/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Inspection</span>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
