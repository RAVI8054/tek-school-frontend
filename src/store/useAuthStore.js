import { create } from 'zustand';
import { loginAdmin as apiLoginAdmin, logoutAdmin as apiLogoutAdmin, refreshAuthToken } from '../lib/api.js';

export const useAuthStore = create((set) => ({
  user: null,
  isInitializing: true,

  login: async (email, password) => {
    try {
      const res = await apiLoginAdmin({ email, password });
      const userData = res.data.user;
      set({ user: userData });
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  },

  logout: async () => {
    try {
      await apiLogoutAdmin();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ user: null });
    }
  },
}));

// Setup auth initialization and unauthorized listeners
let authInitialized = false;

export const initAdminAuth = async () => {
  if (authInitialized) return;
  authInitialized = true;
  
  try {
    const res = await refreshAuthToken();
    // Check if the restored session is actually an admin/staff session
    if (res?.data?.user && res.data.user.role !== 'student') {
      useAuthStore.setState({ user: res.data.user });
    }
  } catch {
    // Expected if no cookie or expired cookie, ignore
  } finally {
    useAuthStore.setState({ isInitializing: false });
  }

  // Listen for 401 from API globally
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.setState({ user: null });
  });
};

// Start initialization immediately
if (typeof window !== 'undefined') {
  initAdminAuth();
}
