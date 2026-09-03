import { useState, useEffect } from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import { Modal, GhostBtn } from '../../../../components/ui/Modal.jsx';

export function CreateJobModal({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    role: '', company: '', track: '', location: '', salary: '', 
    skills: '', about: '', responsibilities: '', requirements: '', benefits: '', logoDomain: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      // eslint-disable-next-line
      setFormData({
        role: initialData.role || '',
        company: initialData.company || '',
        track: initialData.track || '',
        location: initialData.location || '',
        salary: initialData.salary || '',
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : (initialData.skills || ''),
        about: initialData.about || '',
        responsibilities: initialData.responsibilities || '',
        requirements: initialData.requirements || '',
        benefits: initialData.benefits || '',
        logoDomain: initialData.logoDomain || '',
      });
    } else if (open) {
      // Reset when opening fresh
      // eslint-disable-next-line
      setFormData({
        role: '', company: '', track: '', location: '', salary: '', 
        skills: '', about: '', responsibilities: '', requirements: '', benefits: '', logoDomain: ''
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await onSubmit(payload);
      onClose();
      // Reset form
      setFormData({
        role: '', company: '', track: '', location: '', salary: '', 
        skills: '', about: '', responsibilities: '', requirements: '', benefits: '', logoDomain: ''
      });
    } catch {
      // Error is usually handled and toasted by the store function
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <GhostBtn onClick={onClose} disabled={loading}>Cancel</GhostBtn>
      <button 
        type="submit" 
        form="createJobForm"
        disabled={loading}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2D5FA8] px-4 py-2 text-xs font-bold text-white hover:bg-[#1E1B4B] disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (initialData ? 'Save Changes' : 'Create Job')}
      </button>
    </>
  );

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title={initialData ? "Edit Job" : "Add New Job"}
      eyebrow={<span className="pill-tag bg-blue-100 text-blue-700"><Briefcase className="h-3 w-3" /> {initialData ? 'Update Posting' : 'Job Posting'}</span>}
      footer={footer}
    >
      <form id="createJobForm" onSubmit={handleSubmit} className="mt-4 grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Role</label>
            <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm" placeholder="e.g. Backend Engineer" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Company</label>
            <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm" placeholder="e.g. Innovate LLC" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Track</label>
            <input required value={formData.track} onChange={e => setFormData({...formData, track: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm" placeholder="e.g. Full Stack" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Location</label>
            <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm" placeholder="e.g. Remote" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Salary</label>
            <input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm" placeholder="e.g. $80k - $100k" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Logo Domain</label>
            <input value={formData.logoDomain} onChange={e => setFormData({...formData, logoDomain: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm" placeholder="e.g. innovate.com" />
          </div>
        </div>
        
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Skills (comma separated)</label>
          <input required value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm" placeholder="Node.js, MongoDB" />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">About</label>
          <textarea required value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm min-h-[60px]" placeholder="Company description..." />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Responsibilities</label>
          <textarea required value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm min-h-[60px]" placeholder="Job responsibilities..." />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Requirements</label>
          <textarea required value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm min-h-[60px]" placeholder="3+ years experience..." />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Benefits</label>
          <textarea value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm min-h-[60px]" placeholder="Health, Vision..." />
        </div>
      </form>
    </Modal>
  );
}
