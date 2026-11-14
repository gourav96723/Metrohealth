import React, { useState } from 'react';
import { User, Mail, Shield, Trash2, Check, AlertCircle, Lock, Camera, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, refreshUser, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [age, setAge] = useState<number | ''>(user?.age ?? '');
  const [gender, setGender] = useState(user?.gender || 'prefer_not_to_say');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await api.updateMe({
        full_name: fullName,
        age: age === '' ? undefined : Number(age),
        gender,
      });
      await refreshUser();
      setSuccessMsg('Profile updated successfully.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = prompt(
      'WARNING: This will permanently delete your account and all associated assessment records.\nType "DELETE" to confirm:'
    );
    if (confirmText !== 'DELETE') {
      alert('Account deletion cancelled.');
      return;
    }

    try {
      await api.deleteAccount();
      alert('Your account and assessment data have been permanently removed.');
      logout();
      onNavigate('login');
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Profile & Privacy Settings</h1>
          <p className="text-xs text-slate-500">Manage your profile, view data protection standards, and control your data.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info Form */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            Personal Information
          </h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Account ID)</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                >
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow transition disabled:bg-slate-300"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Privacy & Camera Transparency */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <Camera className="w-4 h-4" />
              <span>Camera Privacy Guarantee</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              HealthSense AI computes pose landmark calculations locally in your web browser. <strong>We do not save, record, or stream your webcam video</strong> to any database or third-party cloud.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Shield className="w-4 h-4 text-brand-600" />
              <span>Security & Ownership</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              All assessment records are encrypted and protected by user-isolated server authorization tokens. No other user can access your logs.
            </p>
          </div>

          {/* Account Deletion */}
          <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-6 shadow-sm space-y-3">
            <span className="font-bold text-xs text-rose-900 block">Danger Zone</span>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              Permanently delete your profile, assessment history, and scheduled consultation requests.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
