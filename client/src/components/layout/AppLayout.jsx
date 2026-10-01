import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Sparkles } from 'lucide-react';

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Route title helper
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return { title: 'Dashboard Overview', code: 'MOD-01' };
    if (path.startsWith('/inspect')) return { title: 'New Visual Inspection', code: 'AI-SCAN' };
    if (path.startsWith('/inspection/')) return { title: 'Inspection Diagnostic Report', code: 'RPT-AI' };
    if (path.startsWith('/history')) return { title: 'Inspection Logs & Audit History', code: 'LOG-02' };
    if (path.startsWith('/analytics')) return { title: 'Risk & Hazard Analytics', code: 'METRICS' };
    if (path.startsWith('/profile')) return { title: 'Auditor Profile & Credentials', code: 'ID-09' };
    if (path.startsWith('/settings')) return { title: 'System & Engine Settings', code: 'CONF-00' };
    return { title: 'VisionGuard Intelligence', code: 'CORE' };
  };

  const pageInfo = getPageTitle();

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
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl">
            <Sidebar isMobile onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-850 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {pageInfo.code}
                </span>
                <h1 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
                  {pageInfo.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-3">
            {/* System Engine Status */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">VISION ENGINE ONLINE</span>
            </div>

            {/* Direct Quick Launch Inspection */}
            {location.pathname !== '/inspect' && (
              <Link
                to="/inspect"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inspect Image</span>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
