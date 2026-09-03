import { create } from 'zustand';
import { loginStudent as apiLoginStudent, logoutStudent as apiLogoutStudent, refreshAuthToken } from '../lib/api.js';

export const useStudentAuthStore = create((set) => ({
  user: null,
  isInitializing: true,

  login: async (email, password) => {
    try {
      const res = await apiLoginStudent({ email, password });
      const userData = res.data.user;
      set({ user: userData });
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  },

  logout: async () => {
    try {
      await apiLogoutStudent();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ user: null });
    }
  },
}));

// Setup auth initialization and unauthorized listeners
let studentAuthInitialized = false;

export const initStudentAuth = async () => {
  if (studentAuthInitialized) return;
  studentAuthInitialized = true;
  
  try {
    const res = await refreshAuthToken();
    if (res?.data?.user && res.data.user.role === 'student') {
      useStudentAuthStore.setState({ user: res.data.user });
    }
  } catch {
    // Expected if no cookie or expired cookie, ignore
  } finally {
    useStudentAuthStore.setState({ isInitializing: false });
  }

  // Listen for 401 from API globally
  window.addEventListener('auth:student_unauthorized', () => {
    useStudentAuthStore.setState({ user: null });
  });
};

// Start initialization immediately
if (typeof window !== 'undefined') {
  initStudentAuth();
}
