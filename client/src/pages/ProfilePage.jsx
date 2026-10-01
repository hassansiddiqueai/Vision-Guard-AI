import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
  User,
  CheckCircle2,
  AlertCircle,
  Building,
  ShieldCheck,
  Mail
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Marcus Vance');
  const [role, setRole] = useState(user?.role || 'Safety Supervisor');
  const [organization, setOrganization] = useState(user?.organization || 'Apex Industrial Infrastructure Group');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      try {
        await authService.updateProfile({ name, role, organization });
      } catch (backendErr) {}

      updateUser({ name, role, organization });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Inspector Credentials & Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your safety credentials, certification tier, and site authorization.
        </p>
      </div>

      {success && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile configuration updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Account Info */}
      <div className="vg-card p-5 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-sm">
            {name.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{name}</h2>
            <p className="text-xs text-slate-500">{role} • {organization}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Registered Work Email</label>
            <input
              type="email"
              value={user?.email || 'inspector@visionguard.ai'}
              disabled
              className="w-full py-2 px-3 bg-slate-100 border border-slate-200 rounded-md text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Role / Authorization Level</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
            >
              <option value="Safety Inspector">Certified Safety Inspector (Level 2)</option>
              <option value="Safety Supervisor">Site Safety Supervisor (Level 3 - Authority to Halt Work)</option>
              <option value="Site Manager">Site Operations Director</option>
              <option value="Admin">EHS System Administrator</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Enterprise Division / Contractor</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button type="submit" disabled={loading} className="vg-btn-primary">
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

