import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Cctv,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Settings,
  LogOut,
  Shield,
  Activity,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobile = false, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Inspections',
      path: '/inspections',
      icon: ClipboardList,
    },
    {
      name: 'New Inspection',
      path: '/inspections/new',
      icon: PlusCircle,
      highlight: true,
    },
    {
      name: 'Live Monitoring',
      path: '/monitoring',
      icon: Cctv,
      badge: 'SIM',
    },
    {
      name: 'Hazards',
      path: '/hazards',
      icon: AlertTriangle,
    },
    {
      name: 'Compliance',
      path: '/compliance',
      icon: ShieldCheck,
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: FileText,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="h-full w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between select-none text-slate-300">
      {/* Top Brand Section */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
          <NavLink to="/dashboard" onClick={handleNavClick} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5 font-sans">
                VISION<span className="text-sky-400">GUARD</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">SAFETY CONTROL CENTER</p>
            </div>
          </NavLink>
        </div>

        {/* Quick Launch CTA */}
        <div className="p-3">
          <NavLink
            to="/inspections/new"
            onClick={handleNavClick}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ New Inspection</span>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-1 space-y-0.5">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Control Center
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800/90 text-white border-l-2 border-sky-400 font-semibold pl-2.5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-sky-400' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: System Status & User Profile */}
      <div className="p-3 border-t border-slate-850 space-y-3 bg-slate-950">
        {/* System Health Telemetry */}
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span>System Status</span>
            <span className="text-[10px] text-slate-400">42ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              AI Engine
            </span>
            <span className="text-emerald-400 font-medium">Online</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Vision API
            </span>
            <span className="text-emerald-400 font-medium">Connected</span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <NavLink
            to="/profile"
            onClick={handleNavClick}
            className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-85 transition"
          >
            <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold text-xs shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user?.name || 'Inspector'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.role || 'Safety Auditor'}
              </p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
