import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Plus, Bell, Search, ChevronRight, X, User } from 'lucide-react';
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

  // Route metadata
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return { title: 'Overview', section: 'Control Center' };
    if (path === '/inspections/new' || path === '/inspect') return { title: 'New Inspection', section: 'Inspections' };
    if (path.startsWith('/inspections/') || path.startsWith('/inspection/')) return { title: 'Inspection Details', section: 'Inspections' };
    if (path.startsWith('/inspections') || path === '/history') return { title: 'Inspections', section: 'Control Center' };
    if (path.startsWith('/live-monitoring') || path.startsWith('/monitoring')) return { title: 'Live Monitoring', section: 'Control Center' };
    if (path.startsWith('/hazards')) return { title: 'Hazards', section: 'Control Center' };
    if (path.startsWith('/compliance')) return { title: 'Compliance', section: 'Control Center' };
    if (path.startsWith('/reports')) return { title: 'Reports', section: 'Control Center' };
    if (path.startsWith('/incidents')) return { title: 'Incidents', section: 'Control Center' };
    if (path.startsWith('/evidence')) return { title: 'Evidence', section: 'Control Center' };
    if (path.startsWith('/profile')) return { title: 'Profile', section: 'Account' };
    if (path.startsWith('/settings')) return { title: 'Settings', section: 'Administration' };
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
    <div className="min-h-screen bg-[#0B1220] flex text-[#F1F5F9] antialiased">
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-60 max-w-[85vw] h-full shadow-xl">
            <Sidebar isMobile onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Top Bar */}
        <header className="sticky top-0 z-30 h-14 bg-[#0F172A] border-b border-[#243247] px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-[13px] text-[#94A3B8]">
              <span>{pageInfo.section}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[#F1F5F9] font-medium">{pageInfo.title}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Clean Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:block relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inspections, hazards..."
                className="w-52 pl-8 pr-3 py-1.5 bg-[#0B1220] border border-[#243247] rounded-md text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#22C7E8] transition"
              />
            </form>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-md bg-[#1E293B] hover:bg-[#243247] text-[#94A3B8] hover:text-[#F1F5F9] transition border border-[#243247]"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {criticalFindings.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#EF4444] text-[9px] font-mono font-bold flex items-center justify-center text-white">
                    {criticalFindings.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-[#111C2E] border border-[#243247] rounded-lg shadow-xl z-50 p-3 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#243247]">
                    <span className="text-[12px] font-semibold text-[#F1F5F9]">
                      Active Hazard Alerts
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[#64748B] hover:text-[#F1F5F9]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {criticalFindings.length === 0 ? (
                      <p className="text-[12px] text-[#94A3B8] py-2 text-center">No active alerts.</p>
                    ) : (
                      criticalFindings.map((f, i) => (
                        <Link
                          key={i}
                          to={`/inspections/${f.inspectionId}`}
                          onClick={() => setShowNotifications(false)}
                          className="block p-2 rounded bg-[#0B1220] border border-[#243247] hover:border-[#384F70] transition text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[#F1F5F9] truncate">{f.label}</span>
                            <span className="text-[10px] text-[#EF4444] font-semibold">{f.severity}</span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">{f.site}</p>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* + New Inspection Button */}
            {location.pathname !== '/inspections/new' && (
              <Link to="/inspections/new" className="vg-btn-primary">
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
    </div>
  );
};
