import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sliders,
  Smartphone,
  Mail,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  // Preferences state
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [exerciseReminders, setExerciseReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [savedPrefs, setSavedPrefs] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSuccess(null);
    setPwdError(null);

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New password and confirmation do not match.');
      return;
    }

    setPwdLoading(true);
    try {
      const token = localStorage.getItem('healthsense_token');
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Password change failed.');
      }

      setPwdSuccess('Your portal password has been changed securely.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdError(err.message || 'Unable to update password. Please check your current password.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedPrefs(true);
    setTimeout(() => setSavedPrefs(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Account & Portal Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your hospital security credentials, SMS/email alerts, and camera privacy controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & Password */}
        <div className="bg-[#0c1626]/85 p-6 sm:p-7 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Change Password</h2>
              <p className="text-[11px] text-slate-400">Update your patient login credentials</p>
            </div>
          </div>

          {pwdSuccess && (
            <div className="p-3 bg-teal-950/60 border border-teal-500/40 rounded-xl text-xs text-teal-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-teal-400" />
              <span>{pwdSuccess}</span>
            </div>
          )}

          {pwdError && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{pwdError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 text-xs bg-[#060e1a] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 text-xs bg-[#060e1a] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 text-xs bg-[#060e1a] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-teal-400" />}
                <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
              </button>

              <button
                type="submit"
                disabled={pwdLoading}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 rounded-xl text-xs font-bold transition shadow-md shadow-teal-500/20 disabled:opacity-50"
              >
                {pwdLoading ? 'Updating...' : 'Save Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Clinical Notifications & Reminders */}
        <div className="bg-[#0c1626]/85 p-6 sm:p-7 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Alerts & Reminders</h2>
              <p className="text-[11px] text-slate-400">Manage daily posture exercise notifications</p>
            </div>
          </div>

          {savedPrefs && (
            <div className="p-3 bg-teal-950/60 border border-teal-500/40 rounded-xl text-xs text-teal-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-teal-400" />
              <span>Preferences saved successfully.</span>
            </div>
          )}

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#060e1a]/80 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Exercise Daily Reminders</span>
                <span className="text-[11px] text-slate-400 block">Prompt to perform prescribed exercises</span>
              </div>
              <input
                type="checkbox"
                checked={exerciseReminders}
                onChange={(e) => setExerciseReminders(e.target.checked)}
                className="w-4 h-4 accent-teal-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#060e1a]/80 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Doctor Appointment SMS</span>
                <span className="text-[11px] text-slate-400 block">Instant SMS alerts for consultations</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-teal-500 rounded"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 transition"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
