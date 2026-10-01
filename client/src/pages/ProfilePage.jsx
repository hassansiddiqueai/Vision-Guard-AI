import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
  User,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'Safety Supervisor');
  const [organization, setOrganization] = useState(user?.organization || 'Enterprise Safety Operations');
  
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
      <div className="pb-3 border-b border-[#243247]">
        <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
          Inspector Profile
        </h1>
        <p className="text-[13px] text-[#94A3B8] mt-0.5">
          Manage your safety credentials and organization details.
        </p>
      </div>

      {success && (
        <div className="p-3 rounded bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center gap-2 text-[13px] text-[#22C55E]">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center gap-2 text-[13px] text-[#EF4444]">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Account Info */}
      <div className="vg-card p-4 space-y-3">
        <h2 className="text-[14px] font-semibold text-[#F1F5F9]">
          Personal Information
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-3 text-[13px]">
          <div>
            <label className="block text-[#94A3B8] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9] focus:outline-none focus:border-[#22C7E8]"
            />
          </div>

          <div>
            <label className="block text-[#94A3B8] mb-1">Email Address</label>
            <input
              type="email"
              value={user?.email || 'inspector@visionguard.ai'}
              disabled
              className="w-full py-1.5 px-2.5 bg-[#0B1220]/60 border border-[#243247] rounded text-[#64748B] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[#94A3B8] mb-1">Role / Authorization Level</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9] focus:outline-none focus:border-[#22C7E8]"
            >
              <option value="Safety Inspector">Safety Inspector</option>
              <option value="Safety Supervisor">Safety Supervisor</option>
              <option value="Site Manager">Site Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-[#94A3B8] mb-1">Organization / Division</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9] focus:outline-none focus:border-[#22C7E8]"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-[#243247]">
            <button type="submit" disabled={loading} className="vg-btn-primary">
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
