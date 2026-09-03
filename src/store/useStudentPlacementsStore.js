import { create } from 'zustand';
import { getStudentPlacementProfile, getStudentJobs, getStudentApplications, applyStudentJob } from '../lib/api.js';
import { pushToast } from '../lib/action-bus.js';

export const useStudentPlacementsStore = create((set) => ({
  profile: null,
  jobs: [],
  applications: [],
  loading: true,

  fetchData: async () => {
    set({ loading: true });
    try {
      const [profRes, jobsRes, appsRes] = await Promise.all([
        getStudentPlacementProfile(),
        getStudentJobs(),
        getStudentApplications()
      ]);
      
      const mappedApps = appsRes.data.map(app => ({
        id: app._id,
        company: app.job?.company || 'Unknown',
        role: app.job?.role || 'Unknown',
        stage: app.stage,
        lastUpdate: `${Math.floor((new Date() - new Date(app.updatedAt)) / (1000 * 60 * 60 * 24))}d ago`
      }));

      set({
        profile: profRes.data,
        jobs: jobsRes.data,
        applications: mappedApps,
        loading: false
      });
    } catch {
      pushToast("Failed to fetch placement data");
      set({ loading: false });
    }
  },

  applyForJob: async (jobId, companyName) => {
    try {
      await applyStudentJob(jobId);
      pushToast(`Successfully applied to ${companyName}!`);
      // Refetch pipeline applications to show the new one immediately
      const appsRes = await getStudentApplications();
      const mappedApps = appsRes.data.map(app => ({
        id: app._id,
        company: app.job?.company || 'Unknown',
        role: app.job?.role || 'Unknown',
        stage: app.stage,
        lastUpdate: `${Math.floor((new Date() - new Date(app.updatedAt)) / (1000 * 60 * 60 * 24))}d ago`
      }));
      set({ applications: mappedApps });
    } catch (err) {
      pushToast(err.message || "Failed to apply to job");
    }
  }
}));
