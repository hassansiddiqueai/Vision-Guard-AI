import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  ClipboardList,
  AlertTriangle,
  MapPin,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobile = false, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Cameras', path: '/live-monitoring', icon: Camera },
    { name: 'Inspections', path: '/inspections', icon: ClipboardList },
    { name: 'Risk Events', path: '/incidents', icon: AlertTriangle },
    { name: 'Site Map', path: '/site-map', icon: MapPin },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
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
    <aside className="h-full w-56 bg-slate-900 border-r border-slate-800 flex flex-col justify-between select-none text-slate-400">
      {/* Top Header & Navigation */}
      <div className="overflow-y-auto">
        {/* Brand */}
        <div className="h-14 px-4 flex items-center border-b border-slate-800">
          <NavLink to="/dashboard" onClick={handleNavClick} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center text-white">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-xs tracking-wider text-white">
                VISIONGUARD
              </span>
              <p className="text-[9px] text-slate-400 font-mono tracking-wider">SAFETY CONTROL</p>
            </div>
          </NavLink>
        </div>

        {/* Main Navigation */}
        <div className="p-2 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom: System Status & User Profile */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-900 shrink-0 text-xs">
        {/* System Status Indicator */}
        <div className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-[10px]">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            CV Engine Online
          </span>
          <span className="text-slate-500 font-mono">v2.4</span>
        </div>

        {/* User Card */}
        <div className="px-2 py-1.5 rounded bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
          <NavLink
            to="/profile"
            onClick={handleNavClick}
            className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-90 transition"
          >
            <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <User className="w-3 h-3" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-white truncate">
                {user?.name || 'Safety Inspector'}
              </p>
              <p className="text-[9px] text-slate-400 truncate">
                {user?.role || 'Safety Supervisor'}
              </p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1 rounded text-slate-400 hover:text-red-400 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

