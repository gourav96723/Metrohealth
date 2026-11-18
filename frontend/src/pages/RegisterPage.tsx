import React, { useState } from 'react';
import {
  Activity,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileHeart,
  ChevronLeft,
  Stethoscope,
  Award,
  Building2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialRole?: 'patient' | 'therapist';
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, initialRole = 'patient' }) => {
  const { register } = useAuth();
  const [role, setRole] = useState<'patient' | 'therapist'>(initialRole);

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Patient fields
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('prefer_not_to_say');
  const [medicalNotes, setMedicalNotes] = useState('');

  // Therapist / Doctor fields
  const [specialization, setSpecialization] = useState('Senior Orthopaedic & Sports Physiotherapist');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [clinicHospital, setClinicHospital] = useState('MetroHealth Super Speciality Hospital, New Delhi');
  const [experienceYears, setExperienceYears] = useState<number | ''>(8);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) {
      setError(
        role === 'therapist'
          ? 'Please acknowledge the clinical practitioner code of conduct and ethics agreement.'
          : 'Please acknowledge the hospital clinical guidance and privacy agreement before proceeding.'
      );
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (role === 'therapist' && !licenseNumber.trim()) {
      setError('Please provide your Medical Council / Physiotherapy Registration Number.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      if (role === 'therapist') {
        await register({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          phone_number: phoneNumber.trim() || undefined,
          role: 'therapist',
          specialization: specialization.trim(),
          license_number: licenseNumber.trim(),
          clinic_hospital: clinicHospital.trim(),
          experience_years: experienceYears ? Number(experienceYears) : undefined,
        });
      } else {
        await register({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          phone_number: phoneNumber.trim() || undefined,
          role: 'patient',
          age: age ? Number(age) : undefined,
          gender,
          medical_notes: medicalNotes.trim() || undefined,
        });
      }
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060e19] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden selection:bg-teal-500 selection:text-white">
      {/* Background 3D Medical Scene with Subtle Breathing Motion */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 w-full h-full opacity-35"
          style={{
            backgroundImage: `url('/assets/posture_bg_hd.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060e19]/90 via-[#060e19]/70 to-[#060e19]/95" />
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full space-y-6">
        {/* Back to sign in */}
        <button
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>

        {/* Form Container */}
        <div className="bg-[#0e172e]/85 border border-slate-800/80 rounded-3xl p-7 sm:p-9 backdrop-blur-xl shadow-2xl space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg shadow-teal-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-white">MetroHealth</span>
                <span className="text-teal-400 text-xl font-bold leading-none">+</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {role === 'therapist'
                ? 'Register certified clinical practitioner credentials for patient triage & rehab management'
                : 'Create your confidential hospital record for AI posture analysis & recovery'}
            </p>
          </div>

          {/* Role Switcher Pill: [ Patient Record ]  [ Therapist / Clinical Practitioner ] */}
          <div className="p-1 rounded-2xl bg-[#060e1a]/90 border border-slate-700/60 grid grid-cols-2 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                role === 'patient'
                  ? 'bg-gradient-to-r from-teal-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Record</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('therapist')}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                role === 'therapist'
                  ? 'bg-gradient-to-r from-teal-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Therapist / Doctor</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {role === 'therapist' ? 'Doctor / Practitioner Full Name *' : 'Full Legal Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'therapist' ? 'Dr. Rajesh Sharma, MS (Ortho)' : 'Aarav Sharma'}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'therapist' ? 'dr.rajesh@metrohealth.ai' : 'aarav@example.com'}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 96537 66889"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Role-Specific Fields */}
            {role === 'therapist' ? (
              <>
                {/* Medical License & Years of Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Registration / License No. *
                    </label>
                    <div className="relative">
                      <Award className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="MCI-84729-D or DPT-9921"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Clinical Experience (Years)
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value ? Number(e.target.value) : '')}
                        placeholder="10"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Specialization & Hospital/Clinic */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Clinical Specialization
                    </label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    >
                      <option value="Senior Orthopaedic & Sports Physiotherapist">
                        Senior Orthopaedic & Sports Physiotherapist
                      </option>
                      <option value="Spine Rehabilitation & Posture Specialist">
                        Spine Rehabilitation & Posture Specialist
                      </option>
                      <option value="Neurological Rehabilitation Specialist">
                        Neurological Rehabilitation Specialist
                      </option>
                      <option value="Cardiopulmonary & Geriatric Physical Therapist">
                        Cardiopulmonary & Geriatric Physical Therapist
                      </option>
                      <option value="Paediatric & Musculoskeletal Specialist">
                        Paediatric & Musculoskeletal Specialist
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Hospital / Clinic Affiliation
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={clinicHospital}
                        onChange={(e) => setClinicHospital(e.target.value)}
                        placeholder="MetroHealth Super Speciality Hospital, New Delhi"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Age</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Years"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non_binary">Non-binary</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Optional Medical Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Relevant Medical History / Notes (Optional)
                  </label>
                  <div className="relative">
                    <FileHeart className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <textarea
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      rows={2}
                      placeholder="e.g. Desk work 8 hours daily, occasional neck stiffness..."
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Password with Visibility Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Create Password * (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-[11px] text-slate-400 leading-relaxed">
                  {role === 'therapist'
                    ? 'I declare that I am a registered medical practitioner / certified physical therapist and will exercise clinical discretion in evaluating AI posture telemetry.'
                    : 'I understand that MetroHealth AI provides educational movement guidance and posture insights, not a replacement for medical diagnosis by an orthopedic doctor or physician.'}
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {loading
                  ? 'Registering Credentials...'
                  : role === 'therapist'
                  ? 'Complete Practitioner Registration'
                  : 'Complete Patient Registration'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="font-bold text-teal-400 hover:text-teal-300 hover:underline"
              >
                Sign In Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
