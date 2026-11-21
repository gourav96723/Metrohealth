import React from 'react';
import {
  Users,
  Award,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Activity
} from 'lucide-react';

interface ConsultantsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ConsultantsPage: React.FC<ConsultantsPageProps> = ({ onNavigate }) => {
  const consultants = [
    {
      id: 'dr_rajesh_sharma',
      name: 'Dr. Rajesh Kumar Sharma',
      title: 'Senior Orthopaedic & Sports Physiotherapist',
      qualifications: 'MBBS, MS (Orthopaedics - AIIMS New Delhi), Fellowship in Sports Rehab (UK)',
      experience: '16 Years Clinical Experience',
      clinic: 'MetroHealth Super Speciality Hospital, New Delhi',
      rating: 4.96,
      reviewCount: 342,
      specialties: ['Shoulder Impingement', 'Rotator Cuff Rehab', 'ACL/Knee Ligament', 'Sports Mobility'],
      availableDays: 'Mon, Wed, Fri',
      availableHours: '09:30 AM - 04:30 PM',
      consultationFee: '₹999 / Session',
      bio: 'Dr. Rajesh Kumar Sharma specializes in active joint recovery, restoring biomechanical symmetry, and athletic conditioning using evidence-based manual therapy and functional exercise protocols.',
    },
    {
      id: 'dr_rashmi_sharma',
      name: 'Dr. Rashmi Sharma',
      title: 'Chief Spine Rehabilitation & Posture Specialist',
      qualifications: 'BPT, MPT (Neuro-Spine Rehabilitation - Manipal), Certified Postural Alignment Specialist',
      experience: '14 Years Clinical Experience',
      clinic: 'MetroHealth Super Speciality Hospital, New Delhi',
      rating: 4.98,
      reviewCount: 418,
      specialties: ['Cervical Spondylosis', 'Lumbar Disc Prolapse', 'Sciatica', 'Pelvic Postural Alignment'],
      availableDays: 'Tue, Thu, Sat',
      availableHours: '10:00 AM - 05:30 PM',
      consultationFee: '₹1,199 / Session',
      bio: 'Dr. Rashmi Sharma has guided thousands of patients through non-surgical spine recovery and computer-vision assisted postural restoration.',
    },
    {
      id: 'dr_ganpat_yadav',
      name: 'Dr. Ganpat Yadav',
      title: 'Consultant Joint Mobility & Musculoskeletal Rehab',
      qualifications: 'MBBS, D.Ortho, Certified Manual Physical Therapist (CMPT - AIIMS)',
      experience: '12 Years Clinical Experience',
      clinic: 'MetroHealth Super Speciality Hospital, New Delhi',
      rating: 4.92,
      reviewCount: 289,
      specialties: ['Patellofemoral Pain', 'Frozen Shoulder', 'Thoracic Kyphosis', 'Repetitive Strain Injury'],
      availableDays: 'Mon, Tue, Thu, Fri',
      availableHours: '09:00 AM - 04:00 PM',
      consultationFee: '₹899 / Session',
      bio: 'Dr. Ganpat Yadav focuses on kinetic chain corrections, targeted myofascial release, and joint stabilization exercises.',
    },
  ];

  const handleBookDoctor = (doc: typeof consultants[0]) => {
    onNavigate('appointments', {
      doctorName: doc.name,
      specialty: doc.title,
      clinic: doc.clinic,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
            <span>MetroHealth Clinical Faculty (India)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hospital Physiotherapy Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Meet our dedicated physical therapists and spine specialists at MetroHealth Super Speciality Hospital, New Delhi.
            Schedule in-person or telehealth consultations with your AI assessment history pre-shared.
          </p>
        </div>

        <button
          onClick={() => onNavigate('appointments')}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Consultation Slot</span>
        </button>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {consultants.map((doc) => (
          <div
            key={doc.id}
            className="bg-[#0c1626]/85 rounded-3xl border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-xl shadow-xl transition flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 sm:p-6 space-y-4">
              {/* Doctor Avatar & Badges */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 flex items-center justify-center font-black text-base shadow-md shadow-teal-500/20">
                    {doc.name.split(' ')[1]?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white leading-tight">{doc.name}</h2>
                    <p className="text-[11px] font-semibold text-teal-400 mt-0.5">{doc.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200">{doc.rating}</span>
                      <span className="text-[10px] text-slate-400">({doc.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Qualifications */}
              <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-3">{doc.bio}</p>

              <div className="p-3 bg-[#060e1a]/80 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-200">
                  <Award className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  <span className="font-semibold">{doc.experience}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{doc.clinic}</span>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Clinical Focus
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {doc.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 font-semibold text-[10px] border border-teal-500/30"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule & Fee */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">Days</p>
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-teal-400" />
                    <span>{doc.availableDays}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-semibold">Consultation Fee</p>
                  <p className="text-xs font-black text-cyan-400">{doc.consultationFee}</p>
                </div>
              </div>
            </div>

            {/* Book Consultation Button */}
            <div className="p-4 bg-[#080f1d] border-t border-slate-800">
              <button
                onClick={() => handleBookDoctor(doc)}
                className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hospital Referral Guarantee */}
      <div className="bg-[#0c1626]/85 p-6 rounded-3xl border border-cyan-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-teal-500/20 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Integrated Hospital Electronic Medical Record (EMR)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              When you book through MetroHealth, your latest AI posture analysis, cervical and shoulder symmetry angles,
              and symptom logs are directly synchronized with your doctor's clinical dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
