import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Plus } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-14 h-14 rounded-lg bg-[#111C2E] border border-[#243247] flex items-center justify-center text-red-400 mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 bg-[#111C2E] px-3 py-1 rounded border border-[#243247]">
            HTTP 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mt-4">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            The requested operations page or routing endpoint does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="vg-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>

          <Link
            to="/inspect"
            className="vg-btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Inspection</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

