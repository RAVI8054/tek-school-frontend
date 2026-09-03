import { Navigate, Outlet } from 'react-router-dom';
import { useStudentAuthStore } from '../../store/useStudentAuthStore.js';

export function StudentProtectedRoute() {
  const { user, isInitializing } = useStudentAuthStore();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'student') {
    // Not logged in or not a student
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
