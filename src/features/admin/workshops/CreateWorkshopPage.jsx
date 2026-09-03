import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { createAdminWorkshop, getInstructors, uploadWorkshopImage } from '../../../lib/api.js';
import { pushToast } from '../../../lib/actionBus.js';
import { Plus, Trash2, ArrowLeft, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export function CreateWorkshopPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [instructors, setInstructors] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadWorkshopImage(file);
      if (res.data?.imageUrl) {
        setFormData(prev => ({ ...prev, imageUrl: res.data.imageUrl }));
        pushToast("Image uploaded successfully!", "success");
      }
    } catch (err) {
      console.error(err);
      pushToast(err.message || "Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    blurb: '',
    about: '',
    track: 'AI Engineering',
    format: 'In person',
    startTime: '',
    endTime: '',
    totalSeats: 30,
    isFree: false,
    priceAmount: 0,
    imageUrl: '',
    host: '',
    prerequisites: '',
    status: 'Draft',
    featured: false
  });

  const [agenda, setAgenda] = useState([{ time: '0:00', label: '' }]);
  const [takeaways, setTakeaways] = useState(['']);
  const [forWho, setForWho] = useState(['']);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await getInstructors();
      setInstructors(res.data?.instructors || []);
    } catch (err) {
      console.error(err);
      pushToast("Failed to fetch instructors", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Dynamic Array Handlers
  const handleArrayChange = (setter, index, value) => {
    setter(prev => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };
  
  const handleAgendaChange = (index, field, value) => {
    setAgenda(prev => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };

  const removeArrayItem = (setter, index) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        price: { amount: Number(formData.priceAmount), currency: 'INR' },
        agenda: agenda.filter(a => a.time && a.label),
        takeaways: takeaways.filter(t => t.trim() !== ''),
        forWho: forWho.filter(f => f.trim() !== ''),
      };

      await createAdminWorkshop(payload);
      pushToast("Workshop created successfully", "success");
      navigate('/admin/workshops');
    } catch (err) {
      console.error(err);
      pushToast(err.message || "Failed to create workshop", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell title="Create Workshop">
      <div className="mb-4">
        <button onClick={() => navigate('/admin/workshops')} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to workshops
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-8 rounded-xl border border-slate-200 bg-white p-6 md:p-8">
        
        {/* Basic Details */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-widest text-slate-400 uppercase">Basic Details</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Title *</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. Build a RAG chatbot..." />
            </div>
            
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Blurb (Short desc) *</label>
              <input required maxLength={200} name="blurb" value={formData.blurb} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold">About (Long desc) *</label>
              <textarea required rows={4} name="about" value={formData.about} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Track *</label>
              <select name="track" value={formData.track} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white">
                <option value="AI Engineering">AI Engineering</option>
                <option value="Cloud Engineering">Cloud Engineering</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Future Engineering">Future Engineering</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Format *</label>
              <select name="format" value={formData.format} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white">
                <option value="In person">In person</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Schedule & Capacity */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-widest text-slate-400 uppercase">Schedule & Economics</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">Start Time *</label>
              <input required type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">End Time *</label>
              <input required type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Total Seats *</label>
              <input required type="number" min="1" name="totalSeats" value={formData.totalSeats} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            
            <div>
              <label className="mb-1 block flex items-center gap-2 text-xs font-semibold">
                <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} /> Is Free?
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500">₹</span>
                <input disabled={formData.isFree} type="number" min="0" name="priceAmount" value={formData.priceAmount} onChange={handleChange} className="w-full rounded-lg border border-slate-300 pl-7 pr-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-400" />
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Assets & Host */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-widest text-slate-400 uppercase">Assets & Host</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Cover Image *</label>
              
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors border border-slate-300">
                  {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> : <Upload className="h-4 w-4 text-slate-600" />}
                  {uploadingImage ? "Uploading..." : "Upload Image File"}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploadingImage} />
                </label>
                <span className="text-xs text-slate-400">OR enter Image URL directly below:</span>
              </div>

              <input required name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="https://..." />

              {formData.imageUrl && (
                <div className="mt-3 relative w-full h-44 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img src={formData.imageUrl} alt="Cover Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Instructor (Host) *</label>
              <select required name="host" value={formData.host} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white">
                <option value="" disabled>Select an instructor...</option>
                {instructors.map(inst => (
                  <option key={inst._id} value={inst._id}>{inst.name || 'Unknown'} - {inst.role || 'Instructor'}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Dynamic Arrays */}
        <section className="space-y-6">
          <h2 className="text-sm font-semibold tracking-widest text-slate-400 uppercase">Content & Structure</h2>
          
          {/* Agenda */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold">Agenda</label>
            {agenda.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input placeholder="e.g. 0:00" value={item.time} onChange={(e) => handleAgendaChange(idx, 'time', e.target.value)} className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono" />
                <input placeholder="Label" value={item.label} onChange={(e) => handleAgendaChange(idx, 'label', e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <button type="button" onClick={() => removeArrayItem(setAgenda, idx)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => setAgenda([...agenda, { time: '', label: '' }])} className="text-xs font-semibold text-[var(--accent-blue-deep)]">+ Add Agenda Item</button>
          </div>

          {/* Takeaways */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold">Takeaways</label>
            {takeaways.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={item} onChange={(e) => handleArrayChange(setTakeaways, idx, e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <button type="button" onClick={() => removeArrayItem(setTakeaways, idx)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => setTakeaways([...takeaways, ''])} className="text-xs font-semibold text-[var(--accent-blue-deep)]">+ Add Takeaway</button>
          </div>

          {/* For Who */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold">Target Audience (For Who)</label>
            {forWho.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={item} onChange={(e) => handleArrayChange(setForWho, idx, e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <button type="button" onClick={() => removeArrayItem(setForWho, idx)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => setForWho([...forWho, ''])} className="text-xs font-semibold text-[var(--accent-blue-deep)]">+ Add Audience</button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold">Prerequisites</label>
            <input name="prerequisites" value={formData.prerequisites} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. A laptop, Node installed..." />
          </div>
        </section>

        <hr className="border-slate-100" />
        
        {/* Publish & Status */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 rounded border-slate-300" /> Featured
            </label>
            <select name="status" value={formData.status} onChange={handleChange} className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="rounded-lg bg-[#1E1B4B] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Workshop'}
          </button>
        </section>

      </form>
    </AdminShell>
  );
}
