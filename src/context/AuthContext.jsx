import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginAdmin as apiLoginAdmin, logoutAdmin as apiLogoutAdmin } from '../lib/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('tek_admin_user');
    if (storedUser) {
      try { return JSON.parse(storedUser); } catch { return null; }
    }
    return null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tek_admin_token'));
  const [isInitializing] = useState(false); // No longer needed since localStorage is synchronous

  // Initialize from localStorage on mount
  useEffect(() => {
    // Listen for 401 from API
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      // Calls the backend /auth/login endpoint (without clientType to reject students)
      const res = await apiLoginAdmin({ email, password });
      
      const userData = res.data.user;
      const authToken = res.token;

      // Save to state
      setUser(userData);
      setToken(authToken);

      // Save to localStorage
      localStorage.setItem('tek_admin_user', JSON.stringify(userData));
      localStorage.setItem('tek_admin_token', authToken);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await apiLogoutAdmin();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('tek_admin_user');
      localStorage.removeItem('tek_admin_token');
    }
  }, [token]);

  // Make token available globally to api.js (via a getter if needed, but we can also just read localStorage directly there)
  // We'll read from localStorage directly in api.js to avoid circular dependencies.

  const value = {
    user,
    token,
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
