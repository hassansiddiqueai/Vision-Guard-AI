import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  Camera,
  ClipboardList,
  AlertTriangle,
  MapPin,
  FileText,
  BarChart3,
  Users,
  Building,
  Settings,
  LogOut,
  Shield,
  User,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInspections } from '../../context/InspectionContext';

export const Sidebar = ({ isMobile = false, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { systemHealth } = useInspections();
  const navigate = useNavigate();

  const overviewNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Cameras', path: '/live-cameras', icon: Radio },
    { name: 'Cameras', path: '/cameras', icon: Camera },
    { name: 'Inspections', path: '/inspections', icon: ClipboardList },
    { name: 'Risk Events', path: '/risk-events', icon: AlertTriangle },
    { name: 'Site Map', path: '/site-map', icon: MapPin },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const managementNav = [
    { name: 'Team & Roles', path: '/team', icon: Users },
    { name: 'Sites', path: '/sites', icon: Building },
    { name: 'Settings', path: '/settings', icon: Settings },
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
    <aside className="h-full w-60 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between select-none text-slate-400">
      {/* Top Header & Navigation */}
      <div className="overflow-y-auto">
        {/* Brand */}
        <div className="h-14 px-4 flex items-center border-b border-slate-800">
          <NavLink to="/dashboard" onClick={handleNavClick} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs tracking-wider text-white">
                VISIONGUARD
              </span>
              <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">Safety Operations</p>
            </div>
          </NavLink>
        </div>

        {/* Overview Navigation */}
        <div className="p-3 space-y-1">
          <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Overview
          </p>
          {overviewNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition ${
                    isActive
                      ? 'bg-sky-700 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          {/* Management Section */}
          <div className="pt-3">
            <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Management
            </p>
            {managementNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition ${
                      isActive
                        ? 'bg-sky-700 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: System Status & User Profile */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-[#0B1220] shrink-0 text-xs">
        {/* System Health Status Pill */}
        <div className="px-2.5 py-2 rounded-md bg-slate-900 border border-slate-800 text-[10px] space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM STATUS
            </span>
            <span className="text-emerald-400 font-mono">100% OK</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Cameras &bull; CV Engine &bull; Alert Gateway
          </p>
        </div>

        {/* User Card */}
        <div className="px-2 py-1.5 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-between">
          <NavLink
            to="/profile"
            onClick={handleNavClick}
            className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-90 transition"
          >
            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 font-bold text-[10px]">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-white truncate">
                {user?.name || 'Marcus Vance'}
              </p>
              <p className="text-[9px] text-slate-400 truncate">
                {user?.role || 'Safety Supervisor'}
              </p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};


