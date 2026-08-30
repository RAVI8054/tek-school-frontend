import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginStudent as apiLoginStudent, logoutStudent as apiLogoutStudent, refreshAuthToken } from '../lib/api.js';

const StudentAuthContext = createContext();

export function StudentAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Listen for 401 from API globally
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const res = await refreshAuthToken();
        if (mounted && res?.data?.user && res.data.user.role === 'student') {
          setUser(res.data.user);
        }
      } catch {
        // Expected if no cookie or expired cookie, ignore
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };
    
    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth:student_unauthorized', handleUnauthorized);
    return () => {
      mounted = false;
      window.removeEventListener('auth:student_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiLoginStudent({ email, password });
      
      const userData = res.data.user;

      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = useCallback(async () => {
    try {
      await apiLogoutStudent();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isInitializing,
  };

  return (
    <StudentAuthContext.Provider value={value}>
      {children}
    </StudentAuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
// eslint-disable-next-line react/only-export-components
export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error('useStudentAuth must be used within an StudentAuthProvider');
  }
  return context;
}
