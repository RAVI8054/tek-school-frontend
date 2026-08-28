import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './features/landing/LandingPage.jsx';
import { AboutPage } from './features/landing/AboutPage.jsx';
import { ContactPage } from './features/landing/ContactPage.jsx';
import { CoursesPage } from './features/landing/CoursesPage.jsx';

import { AdminLoginPage } from './features/auth/AdminLoginPage.jsx';
import { SignInPanel } from './components/layout/SignInPanel.jsx';
import { ProtectedRoute } from './components/layout/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { StudentAuthProvider } from './context/StudentAuthContext.jsx';
import { StudentProtectedRoute } from './components/layout/StudentProtectedRoute.jsx';
import { ProgramTrack } from './features/landing/ProgramTrack.jsx';
import { CampusHub } from './features/landing/CampusHub.jsx';
import { CampusCollege } from './features/landing/CampusCollege.jsx';
import { CampusSchool } from './features/landing/CampusSchool.jsx';
import { CampusAILab } from './features/landing/CampusAILab.jsx';

// Dashboards
import { AdminDashboard } from './features/admin/AdminDashboard.jsx';
import { StudentsPage } from './features/admin/StudentsPage.jsx';
import { CohortsPage } from './features/admin/CohortsPage.jsx';
import { InstructorsPage } from './features/admin/InstructorsPage.jsx';
import { FinancePage } from './features/admin/FinancePage.jsx';
import { StudioPage } from './features/admin/StudioPage.jsx';
import { PagesPage } from './features/admin/PagesPage.jsx';
import { OutreachPage } from './features/admin/OutreachPage.jsx';
import { PlacementsPage } from './features/admin/PlacementsPage.jsx';
import { EnquiriesPage } from './features/admin/EnquiriesPage.jsx';
import { AdmissionEnquiryPage } from './features/admin/enquiry/AdmissionEnquiryPage.jsx';
import { TekCampusEnquiryPage } from './features/admin/enquiry/TekCampusEnquiryPage.jsx';
import { ContentPage } from './features/admin/ContentPage.jsx';
import { AssignmentsPage } from './features/admin/AssignmentsPage.jsx';
import { DashboardShell } from './components/dashboard/DashboardShell.jsx';
import { DashboardOverview } from './features/dashboard/DashboardOverview.jsx';
// Student Dashboard
import LearningDashboard from './features/student/learning/LearningDashboard.jsx';
import CourseSyllabus from './features/student/course/CourseSyllabus.jsx';
import CourseClasses from './features/student/course/CourseClasses.jsx';
import Assignments from './features/student/course/Assignments.jsx';
import Resources from './features/student/course/Resources.jsx';
import LiveRoom from './features/student/live-room/LiveRoom.jsx';
import Community from './features/student/community/Community.jsx';
import CommunityLayout from './features/student/community/CommunityLayout.jsx';
import ChannelPage from './features/student/community/ChannelPage.jsx';
import Placements from './features/student/placements/Placements.jsx';
import StudentProfile from './features/student/profile/StudentProfile.jsx';
import Settings from './features/student/settings/Settings.jsx';
import HelpCenter from './features/student/help/HelpCenter.jsx';


// Placeholder
const Placeholder = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">{title} Placeholder</h1>
  </div>
);

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <StudentAuthProvider>
    <AuthProvider>
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/programs/:track" element={<ProgramTrack />} />
      <Route path="/campus" element={<CampusHub />} />
      <Route path="/campus/college" element={<CampusCollege />} />

      <Route path="/campus/school" element={<CampusSchool />} />
      <Route path="/campus/ai-lab" element={<CampusAILab />} />
      
      {/* Admin Login Route (Unprotected) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Routes - Protected for staff roles */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'admissions', 'instructor', 'finance']} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<StudentsPage />} />
        {/* Fill other admin routes with placeholders for now */}
        <Route path="cohorts" element={<CohortsPage />} />
        <Route path="instructors" element={<InstructorsPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="enquiries" element={<EnquiriesPage />}>
          <Route index element={<Navigate to="admission" replace />} />
          <Route path="admission" element={<AdmissionEnquiryPage />} />
          <Route path="tekcampus" element={<TekCampusEnquiryPage />} />
        </Route>
        <Route path="placements" element={<PlacementsPage />} />
        <Route path="outreach" element={<OutreachPage />} />
        <Route path="pages" element={<PagesPage />} />
        <Route path="studio" element={<StudioPage />} />
        <Route path="marketing" element={<Placeholder title="Campaigns" />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
      </Route>

      {/* Student Dashboard Routes - DashboardShell uses an Outlet */}
      <Route path="/dashboard" element={<StudentProtectedRoute />}>
        <Route element={<DashboardShell />}>
          <Route index element={<DashboardOverview />} />
          <Route path="learning" element={<LearningDashboard />} />
          <Route path="course" element={<CourseSyllabus />} />
          <Route path="classes" element={<CourseClasses />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="live-room" element={<LiveRoom />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="placements" element={<Placements />} />
          <Route path="community">
            <Route index element={<Community />} />
            <Route element={<CommunityLayout />}>
              <Route path=":channelId" element={<ChannelPage />} />
            </Route>
          </Route>
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<HelpCenter />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Toaster />
    <SignInPanel />
    </AuthProvider>
    </StudentAuthProvider>
  );
}

export default App;