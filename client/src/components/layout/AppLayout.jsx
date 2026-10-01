import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Plus, Bell, Search, ChevronRight, X, Bot, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInspections } from '../../context/InspectionContext';
import { SafetyAssistantDrawer } from '../common/SafetyAssistantDrawer';

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { inspections, setIsAssistantOpen } = useInspections();

  // Route metadata
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return { title: 'Operations Dashboard', section: 'Safety Operations' };
    if (path === '/inspections/new' || path === '/inspect') return { title: 'New Audit Inspection', section: 'Inspections' };
    if (path.startsWith('/inspections/') || path.startsWith('/inspection/')) return { title: 'Inspection Diagnostics', section: 'Inspections' };
    if (path.startsWith('/inspections') || path === '/history') return { title: 'Inspection Logs', section: 'Audits' };
    if (path.startsWith('/live-monitoring') || path.startsWith('/monitoring')) return { title: 'Live CCTV Matrix', section: 'Continuous Monitoring' };
    if (path.startsWith('/site-map') || path.startsWith('/map')) return { title: 'Site Risk Map', section: 'Job Sites' };
    if (path.startsWith('/incidents') || path.startsWith('/hazards')) return { title: 'Risk Events & Incidents', section: 'Incident Management' };
    if (path.startsWith('/analytics')) return { title: 'Risk Analytics', section: 'Intelligence' };
    if (path.startsWith('/reports')) return { title: 'Audit Reports', section: 'Compliance' };
    if (path.startsWith('/profile')) return { title: 'Inspector Profile', section: 'Account' };
    if (path.startsWith('/settings')) return { title: 'System Settings', section: 'Administration' };
    return { title: 'Control Center', section: 'VisionGuard' };
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
    <div className="min-h-screen bg-slate-50 flex text-slate-900 antialiased">
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-56 max-w-[85vw] h-full shadow-xl">
            <Sidebar isMobile onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Light Top Bar */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>{pageInfo.section}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold">{pageInfo.title}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Clean Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:block relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audits, hazards..."
                className="w-48 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 transition"
              />
            </form>

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAssistantOpen(true)}
              title="Open AI Safety Assistant"
              className="p-1.5 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Bot className="w-4 h-4 text-sky-600" />
              <span className="hidden md:inline">Assistant</span>
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition border border-slate-200"
                title="Active Alerts"
              >
                <Bell className="w-4 h-4" />
                {criticalFindings.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-[9px] font-mono font-bold flex items-center justify-center text-white">
                    {criticalFindings.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-3 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-900">
                      Active Hazard Alerts
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {criticalFindings.length === 0 ? (
                      <p className="text-xs text-slate-500 py-2 text-center">No active alerts.</p>
                    ) : (
                      criticalFindings.map((f, i) => (
                        <Link
                          key={i}
                          to={`/inspections/${f.inspectionId}`}
                          onClick={() => setShowNotifications(false)}
                          className="block p-2 rounded bg-slate-50 border border-slate-200 hover:border-slate-300 transition text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-900 truncate">{f.label}</span>
                            <span className="text-[10px] text-red-600 font-bold">{f.severity}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{f.site}</p>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* + New Inspection Button */}
            {location.pathname !== '/inspections/new' && (
              <Link to="/inspections/new" className="vg-btn-primary text-xs">
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">New Inspection</span>
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global AI Safety Assistant Drawer */}
      <SafetyAssistantDrawer />
    </div>
  );
};

