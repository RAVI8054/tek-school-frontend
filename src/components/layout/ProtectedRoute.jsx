import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';


export function ProtectedRoute({ allowedRoles }) {
  const { user, isInitializing } = useAuthStore();

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

  if (!user) {
    // Not logged in
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role === 'student') {
    // Explicitly block students from admin/staff routes
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-600 mb-6">
          Your role ({user.role}) does not have permission to access the admin portal.
        </p>
        <button 
          onClick={() => {
            localStorage.removeItem('tek_admin_user');
            localStorage.removeItem('tek_admin_token');
            window.location.href = '/admin/login';
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition"
        >
          Sign out and try another account
        </button>
      </div>
    );
  }

  return <Outlet />;
}
