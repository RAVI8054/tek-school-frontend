import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginAdmin as apiLoginAdmin, logoutAdmin as apiLogoutAdmin, refreshAuthToken } from '../lib/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize from cookie on mount
  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      try {
        const res = await refreshAuthToken();
        // Check if the restored session is actually an admin/staff session
        if (mounted && res?.data?.user && res.data.user.role !== 'student') {
          setUser(res.data.user);
        }
      } catch {
        // Expected if no cookie or expired cookie, ignore
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };
    
    initAuth();

    // Listen for 401 from API
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      mounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await apiLoginAdmin({ email, password });
      
      const userData = res.data.user;

      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogoutAdmin();
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
// eslint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
