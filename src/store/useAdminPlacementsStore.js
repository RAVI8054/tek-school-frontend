import { create } from 'zustand';
import { getAdminApplications, getAdminJobs, getAdminHiringPartners, updateAdminApplicationStage, createAdminJob, updateAdminJob } from '../lib/api.js';
import { pushToast } from '../lib/action-bus.js';
import { HR_CONTACTS } from '../lib/outreachData.js';

// Mocking Apollo HR Contacts API
const findHRContacts = async ({ target }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        contacts: HR_CONTACTS.slice(0, 4),
        note: `Found matching contacts for ${target}`
      });
    }, 1500);
  });
};

export const useAdminPlacementsStore = create((set, get) => ({
  items: [],
  jobs: [],
  partners: [],
  loading: true,

  aiState: {
    fetching: false,
    contacts: [],
    note: null,
    error: null,
  },

  fetchData: async () => {
    set({ loading: true });
    try {
      const [appsRes, jobsRes, partnersRes] = await Promise.all([
        getAdminApplications(),
        getAdminJobs(),
        getAdminHiringPartners()
      ]);
      
      const mappedItems = appsRes.data.map(app => ({
        id: app._id,
        student: app.student?.name || 'Unknown',
        role: app.job?.role || 'Unknown',
        company: app.job?.company || 'Unknown',
        stage: app.stage,
        updatedDays: Math.floor((new Date() - new Date(app.updatedAt)) / (1000 * 60 * 60 * 24))
      }));

      const jobsWithIndex = jobsRes.data.map((job, idx) => ({ ...job, serialNumber: idx + 1 }));

      set({
        items: mappedItems,
        jobs: jobsWithIndex,
        partners: partnersRes.data,
        loading: false
      });
    } catch {
      pushToast("Failed to fetch placement data");
      set({ loading: false });
    }
  },

  moveStage: async (id, to) => {
    const { items } = get();
    const currentItem = items.find(i => i.id === id);
    if (!currentItem) return;

    // Optimistic update
    set({ items: items.map(x => x.id === id ? { ...x, stage: to } : x) });
    
    try {
      const payload = { stage: to };
      if (to === 'Rejected') {
        payload.rejectedAtStage = currentItem.stage;
      }
      await updateAdminApplicationStage(id, payload);
      pushToast(`Moved to ${to}`);
    } catch {
      // Revert on error
      set({ items: items.map(x => x.id === id ? { ...x, stage: currentItem.stage } : x) });
      pushToast("Failed to update stage");
    }
  },

  addJob: async (jobData) => {
    try {
      const res = await createAdminJob(jobData);
      set(state => ({
        jobs: [res.data, ...state.jobs]
      }));
      pushToast('Job created successfully');
    } catch (err) {
      pushToast(err.message || 'Failed to create job');
      throw err; // throw to be caught by the modal
    }
  },

  updateJob: async (id, jobData) => {
    try {
      const res = await updateAdminJob(id, jobData);
      set(state => ({
        jobs: state.jobs.map(j => (j._id === id || j.id === id) ? { ...j, ...res.data } : j)
      }));
      pushToast('Job updated successfully');
    } catch (err) {
      pushToast(err.message || 'Failed to update job');
      throw err;
    }
  },

  runAiFetch: async (target) => {
    set({ aiState: { fetching: true, contacts: [], note: null, error: null } });
    try {
      const res = await findHRContacts({ target });
      set({ aiState: { fetching: false, contacts: res.contacts, note: res.note ?? null, error: null } });
      pushToast(`Apollo: sourced ${res.contacts.length} live HR contacts`);
    } catch (e) {
      const msg = String(e?.message || e);
      set({ aiState: { fetching: false, contacts: [], note: null, error: msg } });
      pushToast("Apollo request failed — see panel for details");
    }
  },

  clearAiContacts: () => {
    set(state => ({ aiState: { ...state.aiState, contacts: [] } }));
  }
}));
