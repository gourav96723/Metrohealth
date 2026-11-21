import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Modern Glassmorphism App Navigation (Top Horizontal Glass Bar + Slim Floating Left Dock)
import { ModernAppNavigation } from './components/ModernAppNavigation';

// Therapist Specialist Components
import { TherapistDashboardPage } from './pages/TherapistDashboardPage';
import { TherapistPatientsPage } from './pages/TherapistPatientsPage';
import { TherapistBiomechanicsPage } from './pages/TherapistBiomechanicsPage';
import { TherapistPrescriptionPage } from './pages/TherapistPrescriptionPage';
import { TherapistSchedulePage } from './pages/TherapistSchedulePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CameraAssessmentPage } from './pages/CameraAssessmentPage';
import { SymptomAssessmentPage } from './pages/SymptomAssessmentPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ConsultantsPage } from './pages/ConsultantsPage';
import { MyExercisesPage } from './pages/MyExercisesPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PrivacyTermsPage } from './pages/PrivacyTermsPage';

import { MovementInput } from './types';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const token = localStorage.getItem('healthsense_token');
    return token ? 'dashboard' : 'login';
  });
  const [pageParams, setPageParams] = useState<any>({});

  // Assessment workflow state shared between Camera and Questionnaire
  const [currentMovementData, setCurrentMovementData] = useState<MovementInput | null>(null);
  const [currentTargetArea, setCurrentTargetArea] = useState<string>('neck');
  const [currentTargetSide, setCurrentTargetSide] = useState<string>('both');

  const therapistPages = [
    'therapist-dashboard',
    'therapist-patients',
    'therapist-biomechanics',
    'therapist-prescriptions',
    'therapist-schedule',
    'admin-dashboard',
  ];

  const portalPages = [
    'dashboard',
    'assessment',
    'symptoms',
    'results',
    'records',
    'history',
    'my-exercises',
    'appointments',
    'consultants',
    'profile',
    'settings',
    'exercises',
    ...therapistPages,
  ];

  // Auto-route on login status change
  React.useEffect(() => {
    if (user) {
      if (currentPage === 'login' || currentPage === 'register' || currentPage === 'landing') {
        if (user.role === 'admin') {
          setCurrentPage('admin-dashboard');
        } else if (user.role === 'therapist') {
          setCurrentPage('therapist-dashboard');
        } else {
          setCurrentPage('dashboard');
        }
      }
    } else {
      if (currentPage === 'landing' || portalPages.includes(currentPage)) {
        setCurrentPage('login');
      }
    }
  }, [user]);

  const isPortalLayout = Boolean(user && portalPages.includes(currentPage));

  const handleNavigate = (page: string, params: any = {}) => {
    // If attempting to access authenticated pages without user
    if (!user && !['login', 'register', 'privacy'].includes(page)) {
      setCurrentPage('login');
      return;
    }

    if (user && ['login', 'register', 'landing'].includes(page)) {
      if (user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else if (user.role === 'therapist') {
        setCurrentPage('therapist-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
      return;
    }

    setPageParams(params);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScanDone = (
    movement: MovementInput | null,
    confirmedArea: string,
    confirmedSide: string
  ) => {
    setCurrentMovementData(movement);
    setCurrentTargetArea(confirmedArea);
    setCurrentTargetSide(confirmedSide);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#061222] via-[#08172b] to-[#0b1e33] text-slate-100 selection:bg-teal-500 selection:text-white">
      {isPortalLayout ? (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#061222] via-[#08172b] to-[#0b1e33]">
          {/* 1. Top Horizontal Glass Navigation & 2. Slim Floating Left Dock */}
          <ModernAppNavigation
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />

          {/* Main Full-Width Content Container (pl-24 leaves room for floating left dock) */}
          <main className="flex-1 w-full lg:pl-24 px-4 sm:px-6 lg:pr-8 py-5">
            {/* Doctor / Therapist Specialized Portal Pages */}
            {currentPage === 'therapist-dashboard' && (
              <TherapistDashboardPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'therapist-patients' && (
              <TherapistPatientsPage onNavigate={handleNavigate} params={pageParams} />
            )}

            {currentPage === 'therapist-biomechanics' && (
              <TherapistBiomechanicsPage />
            )}

            {currentPage === 'therapist-prescriptions' && (
              <TherapistPrescriptionPage onNavigate={handleNavigate} params={pageParams} />
            )}

            {currentPage === 'therapist-schedule' && (
              <TherapistSchedulePage onNavigate={handleNavigate} />
            )}

            {/* Hospital Administrator Management Portal */}
            {currentPage === 'admin-dashboard' && (
              <AdminDashboardPage onNavigate={handleNavigate} />
            )}

            {/* Patient Core Portal Pages */}
            {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}

            {/* Assessment Step 1: Guided Movement & Camera Scan */}
            {currentPage === 'assessment' && (
              <CameraAssessmentPage
                onNavigate={handleNavigate}
                onScanDone={handleScanDone}
              />
            )}

            {/* Assessment Step 2: 8-Point Structured Health Questionnaire */}
            {currentPage === 'symptoms' && (
              <SymptomAssessmentPage
                movementData={currentMovementData}
                targetArea={currentTargetArea}
                targetSide={currentTargetSide}
                onNavigate={handleNavigate}
              />
            )}

            {/* Assessment Step 3: Biomechanical Findings & Results */}
            {currentPage === 'results' && (
              <ResultsPage
                assessmentId={pageParams.assessmentId}
                onNavigate={handleNavigate}
              />
            )}

            {/* Clinical Records & History */}
            {(currentPage === 'records' || currentPage === 'history') && (
              <HistoryPage onNavigate={handleNavigate} />
            )}

            {/* Personalized 3-Day Exercise Plan */}
            {currentPage === 'my-exercises' && (
              <MyExercisesPage onNavigate={handleNavigate} />
            )}

            {/* Doctor Directory & Specialists */}
            {currentPage === 'consultants' && (
              <ConsultantsPage onNavigate={handleNavigate} />
            )}

            {/* Appointments & Rescheduling */}
            {currentPage === 'appointments' && (
              <AppointmentsPage onNavigate={handleNavigate} params={pageParams} />
            )}

            {/* General Exercises Library */}
            {currentPage === 'exercises' && (
              <ExercisesPage onNavigate={handleNavigate} />
            )}

            {/* Profile Page */}
            {currentPage === 'profile' && (
              <ProfilePage onNavigate={handleNavigate} />
            )}

            {/* Account Settings */}
            {currentPage === 'settings' && (
              <SettingsPage onNavigate={handleNavigate} />
            )}

            {/* Terms & Privacy */}
            {currentPage === 'privacy' && (
              <PrivacyTermsPage onNavigate={handleNavigate} />
            )}
          </main>
        </div>
      ) : currentPage === 'login' || currentPage === 'register' ? (
        /* Standalone Modern Full-Screen Auth Layout (Exact Layout Preserved per Rule 2) */
        <main className="flex-1 w-full min-h-screen">
          {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {currentPage === 'register' && (
            <RegisterPage
              onNavigate={handleNavigate}
              initialRole={pageParams?.role || 'patient'}
            />
          )}
        </main>
      ) : (
        /* Other Public Pages with Standard Top Navbar & Footer */
        <>
          <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

          <main className="flex-1">
            {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
            {currentPage === 'privacy' && <PrivacyTermsPage onNavigate={handleNavigate} />}
            {currentPage === 'consultants' && <ConsultantsPage onNavigate={handleNavigate} />}
            {currentPage === 'exercises' && <ExercisesPage onNavigate={handleNavigate} />}
          </main>

          <Footer onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
