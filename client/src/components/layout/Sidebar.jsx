import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanEye,
  History,
  BarChart3,
  User,
  Settings,
  LogOut,
  Shield,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobile = false, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'New Inspection',
      path: '/inspect',
      icon: ScanEye,
      highlight: true,
      badge: 'AI Core',
    },
    {
      name: 'Inspection History',
      path: '/history',
      icon: History,
      badge: null,
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      badge: null,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      badge: null,
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
    <aside className="h-full w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between select-none">
      {/* Top Brand Section */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-850">
          <NavLink to="/dashboard" onClick={handleNavClick} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.35)]">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-white flex items-center gap-1">
                Vision<span className="text-cyan-400">Guard</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/20">
                  AI
                </span>
              </span>
            </div>
          </NavLink>
        </div>

        {/* Quick Launch Button */}
        <div className="px-4 pt-4 pb-2">
          <NavLink
            to="/inspect"
            onClick={handleNavClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ NEW INSPECTION</span>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-3 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-cyan-400'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {item.badge}
                      </span>
                    )}

                    {isActive && !item.badge && (
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Section & Logout */}
      <div className="p-3 border-t border-slate-850 bg-slate-950/60">
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <NavLink
            to="/profile"
            onClick={handleNavClick}
            className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs shrink-0 border border-cyan-400/40">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
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
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
