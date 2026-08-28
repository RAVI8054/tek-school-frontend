import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginStudent as apiLoginStudent, logoutStudent as apiLogoutStudent } from '../lib/api.js';

const StudentAuthContext = createContext();

export function StudentAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('tek_student_user');
    if (storedUser) {
      try { return JSON.parse(storedUser); } catch { return null; }
    }
    return null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tek_student_token'));
  const [isInitializing] = useState(false);

  // Listen for 401 from API globally
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('tek_student_user');
      localStorage.removeItem('tek_student_token');
    };
    window.addEventListener('auth:student_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:student_unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiLoginStudent({ email, password });
      
      const userData = res.data.user;
      const authToken = res.token;

      setUser(userData);
      setToken(authToken);

      localStorage.setItem('tek_student_user', JSON.stringify(userData));
      localStorage.setItem('tek_student_token', authToken);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = useCallback(async () => {
    try {
      if (token) {
        await apiLogoutStudent();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('tek_student_user');
      localStorage.removeItem('tek_student_token');
    }
  }, [token]);

  const value = {
    user,
    token,
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
