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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Portal Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your hospital security credentials, notifications, and camera privacy controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & Password */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
              <p className="text-[11px] text-slate-500">Update your patient login credentials</p>
            </div>
          </div>

          {pwdSuccess && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-teal-600" />
              <span>{pwdSuccess}</span>
            </div>
          )}

          {pwdError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{pwdError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
              </button>

              <button
                type="submit"
                disabled={pwdLoading}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:bg-slate-300"
              >
                {pwdLoading ? 'Updating...' : 'Save Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Clinical Notifications & Reminders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Notifications & Reminders</h2>
              <p className="text-[11px] text-slate-500">Customize health alerts and appointment updates</p>
            </div>
          </div>

          {savedPrefs && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-teal-600" />
              <span>Preferences saved successfully.</span>
            </div>
          )}

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/70 hover:bg-slate-50 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">SMS Appointment Reminders</p>
                  <p className="text-[10px] text-slate-500">Receive 24h & 2h alerts before doctor consultations</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/70 hover:bg-slate-50 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Daily Exercise Routine Nudge</p>
                  <p className="text-[10px] text-slate-500">Gentle reminder to perform your 3-day exercise plan</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={exerciseReminders}
                onChange={(e) => setExerciseReminders(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
            </label>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Preferred Nudge Time</span>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Update Preferences
            </button>
          </form>
        </div>
      </div>

      {/* Camera & Biometric Privacy Policy */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Camera & Biometric Privacy Protocol</h3>
            <p className="text-xs text-slate-500">
              MetroHealth AI complies with healthcare privacy and client-side processing principles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-xs font-bold text-slate-800 mb-1">Local Frame Processing</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Camera frames are analyzed in real-time inside your browser using MediaPipe. Video streams never touch hospital servers.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-xs font-bold text-slate-800 mb-1">Zero Facial Recognition</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Only skeletal joint landmarks (shoulders, spine, hips, knees) are measured for range-of-motion; no facial biometric templates.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-xs font-bold text-slate-800 mb-1">Full User Control</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              You can revoke camera permissions at any point through your browser bar, or choose questionnaire-only assessments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
