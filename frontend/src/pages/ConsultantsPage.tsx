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
      id: 'dr_sarah_jenkins',
      name: 'Dr. Sarah Jenkins, DPT',
      title: 'Lead Musculoskeletal & Sports Physiotherapist',
      qualifications: 'Doctor of Physical Therapy (DPT), Board Certified Orthopedic Specialist (OCS), CSCS',
      experience: '12 Years Clinical Experience',
      clinic: 'MetroHealth Sports Medicine & Rehabilitation Clinic',
      rating: 4.92,
      reviewCount: 184,
      specialties: ['Shoulder Impingement', 'Rotator Cuff Rehab', 'Knee Patellofemoral', 'Sports Movement'],
      availableDays: 'Mon, Wed, Fri',
      availableHours: '09:00 AM - 04:00 PM',
      consultationFee: '$85 / Session',
      bio: 'Dr. Jenkins specializes in active joint recovery, restoring biomechanical symmetry, and athletic conditioning using evidence-based manual therapy and functional exercise protocols.',
    },
    {
      id: 'dr_marcus_vance',
      name: 'Dr. Marcus Vance, PT, OCS',
      title: 'Senior Spine & Lumbar Rehabilitation Specialist',
      qualifications: 'PT, DPT, Fellow of the American Academy of Orthopaedic Manual Physical Therapists (FAAOMPT)',
      experience: '15 Years Clinical Experience',
      clinic: 'MetroHealth Spine & Vertebral Institute',
      rating: 4.96,
      reviewCount: 238,
      specialties: ['Cervical Radiculopathy', 'Lumbar Disc Herniation', 'Sciatica', 'Pelvic Postural Alignment'],
      availableDays: 'Tue, Thu, Sat',
      availableHours: '10:00 AM - 05:00 PM',
      consultationFee: '$95 / Session',
      bio: 'Dr. Vance has guided over 3,000 patients through non-surgical spine recovery. He works closely with orthopedic surgeons to provide comprehensive spinal assessments and rehabilitation.',
    },
    {
      id: 'dr_emily_thorne',
      name: 'Dr. Emily Thorne, DPT, CMPT',
      title: 'Ergonomic Posture & Occupational Health Consultant',
      qualifications: 'Doctor of Physical Therapy (DPT), Certified Manual Physical Therapist (CMPT)',
      experience: '9 Years Clinical Experience',
      clinic: 'MetroHealth Occupational Health & Ergonomics Center',
      rating: 4.88,
      reviewCount: 142,
      specialties: ['Forward Head Posture', 'Thoracic Kyphosis', 'Desk Ergonomics', 'Repetitive Strain Injury'],
      availableDays: 'Mon - Fri',
      availableHours: '08:30 AM - 02:30 PM',
      consultationFee: '$80 / Session',
      bio: 'Dr. Thorne focuses on modern posture dysfunctions caused by extended workstation use, combining targeted myofascial release with postural stabilization exercises.',
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>MetroHealth Clinical Faculty</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Hospital Physiotherapy Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Meet our board-certified physical therapists and spine specialists. Schedule in-person or
            telehealth consultations with your AI assessment history pre-shared.
          </p>
        </div>

        <button
          onClick={() => onNavigate('appointments')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>View All Slots</span>
        </button>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {consultants.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
          >
            <div className="p-6 space-y-5">
              {/* Doctor Avatar & Badges */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-teal-600/20">
                    {doc.name.split(' ')[1]?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-tight">{doc.name}</h2>
                    <p className="text-xs font-semibold text-teal-700 mt-0.5">{doc.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-800">{doc.rating}</span>
                      <span className="text-[11px] text-slate-400">({doc.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Qualifications */}
              <p className="text-xs text-slate-600 leading-relaxed">{doc.bio}</p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Award className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                  <span className="font-semibold">{doc.experience}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{doc.clinic}</span>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Clinical Focus
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {doc.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 font-semibold text-[10px] border border-teal-200/60"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule & Fee */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold">Available Days</p>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-teal-600" />
                    <span>{doc.availableDays}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-semibold">Standard Consultation</p>
                  <p className="text-xs font-extrabold text-teal-700">{doc.consultationFee}</p>
                </div>
              </div>
            </div>

            {/* Book Consultation Button */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100">
              <button
                onClick={() => handleBookDoctor(doc)}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <span>Book with {doc.name.split(',')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hospital Referral Guarantee */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-3xl border border-teal-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Integrated Hospital Electronic Medical Record
            </h3>
            <p className="text-xs text-slate-600">
              When you book through MetroHealth, your latest AI posture analysis, range of motion angles,
              and symptom logs are directly synchronized with your doctor's clinical dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
