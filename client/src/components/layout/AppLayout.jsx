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
import { BackgroundAtmosphere } from '../common/BackgroundAtmosphere';

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
    <div className="min-h-screen bg-[#0B1120] flex text-slate-100 antialiased font-sans relative overflow-x-hidden">
      {/* Background Atmosphere with Radar & Interactive Photo Nodes */}
      <BackgroundAtmosphere variant="dark" />

      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-60 max-w-[85vw] h-full shadow-2xl">
            <Sidebar isMobile onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Enterprise Top Bar (Dark Industrial Header) */}
        <header className="sticky top-0 z-30 h-14 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className="font-medium text-slate-400">{pageInfo.section}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-bold tracking-tight">{pageInfo.title}</span>
            </div>

            {/* Current Site Selector */}
            <div className="flex items-center gap-1.5 pl-2 sm:border-l sm:border-slate-800">
              <Building className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold py-1 px-2.5 rounded-md outline-none cursor-pointer transition focus:ring-1 focus:ring-sky-500"
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
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cameras, hazards..."
                className="w-52 pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-slate-950 transition"
              />
            </form>

            {/* System Status Indicator */}
            <div className="relative">
              <button
                onClick={() => setShowHealthPopover(!showHealthPopover)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-800/80 text-xs text-emerald-300 font-semibold transition shadow-xs"
                title="Vision Engine Status"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[11px] hidden sm:inline font-mono">Vision Engine Online</span>
                <ChevronDown className="w-3 h-3 text-emerald-400 hidden sm:inline" />
              </button>

              {showHealthPopover && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] border border-slate-700 rounded-md shadow-2xl z-50 p-3 space-y-2.5 text-slate-200">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      Vision Engine Telemetry
                    </span>
                    <button onClick={() => setShowHealthPopover(false)} className="text-slate-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Vision Engine Pipeline</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Online (Active)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Inference Latency</span>
                      <span className="text-slate-200 font-mono font-bold">84ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Active Camera Feeds</span>
                      <span className="text-slate-200 font-mono font-bold">18/18 Online</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Active Incidents Badge */}
            <Link
              to="/incidents"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-950/60 hover:bg-red-950 border border-red-800/80 text-xs font-bold text-red-300 transition shadow-xs"
              title="Active Incidents"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="hidden sm:inline">Incidents:</span>
              <span className="w-4 h-4 rounded bg-red-600 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                {incidents.filter((i) => i.status !== 'CLOSED').length}
              </span>
            </Link>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition border border-slate-700"
                title="Incident Notifications"
              >
                <Bell className="w-4 h-4" />
                {activeAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[9px] font-mono font-bold flex items-center justify-center text-white">
                    {activeAlerts.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0F172A] border border-slate-700 rounded-md shadow-2xl z-50 p-3 space-y-2 text-slate-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">
                      Incident Alerts ({activeAlerts.length})
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {activeAlerts.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No active critical alerts.</p>
                    ) : (
                      activeAlerts.map((inc) => (
                        <Link
                          key={inc.id}
                          to="/incidents"
                          onClick={() => setShowNotifications(false)}
                          className="block p-2 rounded-md bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition text-xs space-y-0.5"
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-white truncate">{inc.hazard}</span>
                            <span className={inc.severity === 'CRITICAL' ? 'vg-badge-critical text-[10px]' : 'vg-badge-high text-[10px]'}>
                              {inc.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{inc.site} &bull; {inc.camera}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{inc.detectedAt}</p>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <Link
              to="/profile"
              className="flex items-center gap-1.5 p-1 rounded-md hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
              title="User Profile"
            >
              <div className="w-7 h-7 rounded bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.name?.charAt(0) || 'M'}
              </div>
            </Link>
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


