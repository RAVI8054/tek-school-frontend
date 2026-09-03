import { useEffect, useState } from 'react';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { OpenRolesSection } from './components/OpenRolesSection.jsx';
import { CreateJobModal } from './components/CreateJobModal.jsx';
import { useAdminPlacementsStore } from '../../../store/useAdminPlacementsStore.js';
import { Loader2, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function JobsPage() {
  const { jobs, loading, fetchData, addJob, updateJob } = useAdminPlacementsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AdminShell 
      title="Open Roles" 
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/placements" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Placements
          </Link>
          <button 
            onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D5FA8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1E1B4B]"
          >
            <Plus className="h-3.5 w-3.5" /> Add Job
          </button>
        </div>
      }
    >
      <p className="mb-3 text-xs text-slate-500">Manage all job postings, track applicant counts, and close or reopen roles.</p>
      {loading ? (
        <div className="flex h-32 items-center justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <OpenRolesSection 
          jobs={jobs} 
          onEdit={(job) => { setEditingJob(job); setIsModalOpen(true); }}
          onToggleStatus={(job) => updateJob(job._id || job.id, { status: job.status === 'Open' ? 'Closed' : 'Open' })}
        />
      )}
      
      <CreateJobModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingJob}
        onSubmit={(data) => {
          if (editingJob) {
            return updateJob(editingJob._id || editingJob.id, data);
          } else {
            return addJob(data);
          }
        }} 
      />
    </AdminShell>
  );
}
