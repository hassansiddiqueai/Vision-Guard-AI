import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Cctv,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Settings,
  LogOut,
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobile = false, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const controlCenterItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inspections', path: '/inspections', icon: ClipboardList },
    { name: 'Live Monitoring', path: '/live-monitoring', icon: Cctv },
    { name: 'Hazards', path: '/hazards', icon: AlertTriangle },
    { name: 'Compliance', path: '/compliance', icon: ShieldCheck },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  const adminItems = [
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
    <aside className="h-full w-60 bg-[#0F172A] border-r border-[#243247] flex flex-col justify-between select-none text-[#94A3B8]">
      {/* Top Header & Navigation */}
      <div className="overflow-y-auto">
        {/* Brand */}
        <div className="h-14 px-4 flex items-center border-b border-[#243247]">
          <NavLink to="/dashboard" onClick={handleNavClick} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#22C7E8]/10 border border-[#22C7E8]/30 flex items-center justify-center text-[#22C7E8]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-wide text-[#F1F5F9]">
                VISION<span className="text-[#22C7E8]">GUARD</span>
              </span>
              <p className="text-[10px] text-[#94A3B8] tracking-wider">Safety Control Center</p>
            </div>
          </NavLink>
        </div>

        {/* Main Navigation */}
        <div className="p-3 space-y-4">
          <div>
            <span className="px-2.5 text-[11px] font-medium uppercase tracking-wider text-[#64748B] block mb-1">
              Control Center
            </span>
            <nav className="space-y-0.5">
              {controlCenterItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                        isActive
                          ? 'bg-[#1E293B] text-[#F1F5F9] border-l-2 border-[#22C7E8]'
                          : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B]/60'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#22C7E8]' : 'text-[#64748B]'}`} />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="px-2.5 text-[11px] font-medium uppercase tracking-wider text-[#64748B] block mb-1">
              Administration
            </span>
            <nav className="space-y-0.5">
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                        isActive
                          ? 'bg-[#1E293B] text-[#F1F5F9] border-l-2 border-[#22C7E8]'
                          : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B]/60'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#22C7E8]' : 'text-[#64748B]'}`} />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom: System Status & User Profile */}
      <div className="p-3 border-t border-[#243247] space-y-2 bg-[#0F172A] shrink-0">
        {/* System Status Indicator */}
        <div className="px-2.5 py-1.5 rounded bg-[#111C2E] border border-[#243247] flex items-center justify-between text-[11px]">
          <span className="text-[#94A3B8] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            AI Engine Online
          </span>
          <span className="text-[#64748B] font-mono">v2.4</span>
        </div>

        {/* User Card */}
        <div className="px-2.5 py-1.5 rounded bg-[#111C2E] border border-[#243247] flex items-center justify-between">
          <NavLink
            to="/profile"
            onClick={handleNavClick}
            className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-85 transition"
          >
            <div className="w-6 h-6 rounded bg-[#1E293B] border border-[#243247] flex items-center justify-center text-[#22C7E8] shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-[#F1F5F9] truncate">
                {user?.name || 'Safety Inspector'}
              </p>
              <p className="text-[10px] text-[#94A3B8] truncate">
                {user?.role || 'Safety Supervisor'}
              </p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1 rounded text-[#64748B] hover:text-[#EF4444] transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
