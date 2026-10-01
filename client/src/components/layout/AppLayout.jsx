import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import {
  Menu,
  Plus,
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  X,
  Bot,
  Shield,
  Activity,
  Building,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInspections } from '../../context/InspectionContext';
import { SafetyAssistantDrawer } from '../common/SafetyAssistantDrawer';
import { DemoScenarioToolbar } from '../common/DemoScenarioToolbar';

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHealthPopover, setShowHealthPopover] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    sites,
    selectedSite,
    setSelectedSite,
    systemHealth,
    incidents,
    setIsAssistantOpen
  } = useInspections();

  // Route metadata
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return { title: 'Safety Operations Center', section: 'Operations' };
    if (path.startsWith('/live-cameras') || path.startsWith('/live-monitoring') || path.startsWith('/monitoring')) return { title: 'Live CCTV Control Center', section: 'Monitoring' };
    if (path === '/cameras') return { title: 'Camera Management', section: 'CCTV Network' };
    if (path === '/inspections/new' || path === '/inspect') return { title: 'New Safety Audit', section: 'Inspections' };
    if (path.startsWith('/inspections/') || path.startsWith('/inspection/')) return { title: 'Inspection Diagnostics', section: 'Inspections' };
    if (path.startsWith('/inspections') || path === '/history') return { title: 'Inspection Records', section: 'Inspections' };
    if (path.startsWith('/site-map') || path.startsWith('/map')) return { title: 'Site Risk Map', section: 'Facilities' };
    if (path.startsWith('/risk-events') || path.startsWith('/incidents') || path.startsWith('/hazards')) return { title: 'Risk Event Center', section: 'Incident Management' };
    if (path.startsWith('/reports')) return { title: 'Safety & Audit Reports', section: 'Compliance' };
    if (path.startsWith('/analytics')) return { title: 'Safety Analytics', section: 'Intelligence' };
    if (path === '/sites') return { title: 'Site Management', section: 'Facilities' };
    if (path === '/team') return { title: 'Team & Role Access', section: 'Organization' };
    if (path.startsWith('/profile')) return { title: 'Inspector Profile', section: 'Account' };
    if (path.startsWith('/settings')) return { title: 'System Telemetry & Settings', section: 'Administration' };
    return { title: 'Safety Operations Center', section: 'VisionGuard' };
  };

  const pageInfo = getPageInfo();

  // Unresolved Critical / High Incidents
  const activeAlerts = incidents
    .filter((i) => i.status !== 'CLOSED' && (i.severity === 'CRITICAL' || i.severity === 'HIGH'))
    .slice(0, 6);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/risk-events?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 antialiased font-sans">
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
          <div className="relative z-10 w-60 max-w-[85vw] h-full shadow-xl">
            <Sidebar isMobile onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enterprise Top Bar */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-400">{pageInfo.section}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-900 font-bold tracking-tight">{pageInfo.title}</span>
            </div>

            {/* Current Site Selector */}
            <div className="flex items-center gap-1.5 pl-2 sm:border-l sm:border-slate-200">
              <Building className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold py-1 px-2.5 rounded-md outline-none cursor-pointer transition focus:ring-1 focus:ring-sky-600"
              >
                <option value="All Sites">All Monitored Sites</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Global Search */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cameras, hazards, events..."
                className="w-52 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white transition"
              />
            </form>

            {/* System Health Status Popover Button */}
            <div className="relative">
              <button
                onClick={() => setShowHealthPopover(!showHealthPopover)}
                className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold transition"
                title="System Health & Telemetry"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] hidden md:inline">Systems OK</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showHealthPopover && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-md shadow-lg z-50 p-3 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      Platform Health
                    </span>
                    <button onClick={() => setShowHealthPopover(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Camera Ingestion Stream</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span>AI Neural CV Engine</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 85ms Latency
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Real-Time Alert Gateway</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Telemetry Database</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Synced
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAssistantOpen(true)}
              title="Open AI Safety Assistant"
              className="p-1.5 sm:px-2.5 py-1.5 rounded-md bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Bot className="w-3.5 h-3.5 text-sky-700" />
              <span className="hidden md:inline">Safety AI</span>
            </button>

            {/* Real-time Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition border border-slate-200"
                title="Active Safety Alerts"
              >
                <Bell className="w-4 h-4" />
                {activeAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[9px] font-mono font-bold flex items-center justify-center text-white">
                    {activeAlerts.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-md shadow-xl z-50 p-3 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">
                      Live Incident Notifications ({activeAlerts.length})
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {activeAlerts.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No active critical alerts.</p>
                    ) : (
                      activeAlerts.map((inc) => (
                        <Link
                          key={inc.id}
                          to="/risk-events"
                          onClick={() => setShowNotifications(false)}
                          className="block p-2 rounded-md bg-slate-50 border border-slate-200 hover:border-slate-300 transition text-xs space-y-0.5"
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-900 truncate">{inc.hazard}</span>
                            <span className={inc.severity === 'CRITICAL' ? 'vg-badge-critical text-[10px]' : 'vg-badge-high text-[10px]'}>
                              {inc.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{inc.site} &bull; {inc.camera}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{inc.detectedAt}</p>
                        </Link>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-center">
                    <Link
                      to="/risk-events"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-sky-700 hover:underline font-bold"
                    >
                      View All Risk Events &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* + New Inspection Button */}
            {location.pathname !== '/inspections/new' && (
              <Link to="/inspections/new" className="vg-btn-primary text-xs py-1.5 px-3">
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">New Audit</span>
              </Link>
            )}
          </div>
        </header>

        {/* Global Demo Scenario Quick Bar (Only on Dashboard or Live Monitoring) */}
        {(location.pathname === '/dashboard' || location.pathname === '/live-cameras' || location.pathname === '/live-monitoring') && (
          <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2">
            <DemoScenarioToolbar />
          </div>
        )}

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


