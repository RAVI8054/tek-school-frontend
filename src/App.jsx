import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './features/landing/LandingPage.jsx';
import { AboutPage } from './features/landing/AboutPage.jsx';
import { ContactPage } from './features/landing/ContactPage.jsx';
import { CoursesPage } from './features/landing/CoursesPage.jsx';
import { LoginPage } from './features/auth/LoginPage.jsx';
import { SignInPanel } from './components/layout/SignInPanel.jsx';
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
import { ContentPage } from './features/admin/ContentPage.jsx';
import { AssignmentsPage } from './features/admin/AssignmentsPage.jsx';
import { DashboardShell } from './components/dashboard/DashboardShell.jsx';
import { DashboardOverview } from './features/dashboard/DashboardOverview.jsx';

// Placeholder
const Placeholder = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">{title} Placeholder</h1>
  </div>
);

function App() {
  return (
    <>
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/programs/:track" element={<ProgramTrack />} />
      <Route path="/campus" element={<CampusHub />} />
      <Route path="/campus/college" element={<CampusCollege />} />
      <Route path="/student" element={<LoginPage />} />
      <Route path="/campus/school" element={<CampusSchool />} />
      <Route path="/campus/ai-lab" element={<CampusAILab />} />
      
      {/* Admin Routes - Each page includes its own AdminShell */}
      <Route path="/admin">
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<StudentsPage />} />
        {/* Fill other admin routes with placeholders for now */}
        <Route path="cohorts" element={<CohortsPage />} />
        <Route path="instructors" element={<InstructorsPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="enquiries" element={<EnquiriesPage />} />
        <Route path="placements" element={<PlacementsPage />} />
        <Route path="outreach" element={<OutreachPage />} />
        <Route path="pages" element={<PagesPage />} />
        <Route path="studio" element={<StudioPage />} />
        <Route path="marketing" element={<Placeholder title="Campaigns" />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
      </Route>

      {/* Student Dashboard Routes - DashboardShell uses an Outlet */}
      <Route path="/dashboard" element={<DashboardShell />}>
        <Route index element={<DashboardOverview />} />
        <Route path="learning" element={<Placeholder title="Learning" />} />
        <Route path="course" element={<Placeholder title="Course" />} />
        <Route path="profile" element={<Placeholder title="Profile" />} />
        <Route path="placements" element={<Placeholder title="Placements" />} />
        <Route path="community" element={<Placeholder title="Community" />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
        <Route path="help" element={<Placeholder title="Help center" />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <SignInPanel />
    </>
  );
}

export default App;