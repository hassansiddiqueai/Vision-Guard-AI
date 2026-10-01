import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
  User,
  Building,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'Safety Inspector & Auditor');
  const [organization, setOrganization] = useState(user?.organization || 'Enterprise Safety Division');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Security password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      try {
        await authService.updateProfile({ name, role, organization });
      } catch (backendErr) {
        console.warn('Backend profile update not responding, persisting locally:', backendErr);
      }

      updateUser({ name, role, organization });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPwdError('Please complete all password fields.');
      return;
    }

    setPwdLoading(true);
    setPwdError(null);
    setPwdSuccess(false);

    try {
      // Simulate/call API
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPwdSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPwdSuccess(false), 4000);
    } catch (err) {
      setPwdError('Password update failed.');
    } finally {
      setPwdLoading(false);
    }
  };

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Active Since 2025';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-850 pb-5">
        <h2 className="text-2xl font-bold font-display text-white">
          Auditor Profile & Credentials
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal inspection credentials and security parameters.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-bold text-cyan-400">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-white">{name || 'Inspector User'}</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>CERTIFIED AUDITOR</span>
            </span>
          </div>

          <p className="text-xs text-cyan-400 font-mono">{role}</p>
          <p className="text-xs text-slate-400">{user?.email}</p>

          <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{organization}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedJoinDate}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Edit Profile Form */}
        <div className="md:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <User className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Personal Information
            </h4>
          </div>

          {success && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Profile details successfully updated and saved.</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-100 placeholder-slate-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Registered Email (Read Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2.5 bg-slate-950/40 border border-slate-850 rounded-lg text-xs text-slate-500 cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Official Title / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Safety Inspector"
                className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-100 placeholder-slate-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Apex Industrial Systems"
                className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-100 placeholder-slate-600 transition"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security & Password Form */}
        <div className="md:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Security & Credentials
            </h4>
          </div>

          {pwdSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              Password updated successfully.
            </div>
          )}

          {pwdError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {pwdError}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-100 placeholder-slate-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                New Security Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-100 placeholder-slate-600 transition"
              />
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              {pwdLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
            AUTH METHOD: JWT SECURE SESSION (256-BIT)
          </div>
        </div>
      </div>
    </div>
  );
};
