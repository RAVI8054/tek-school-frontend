import { useState, useEffect } from 'react';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { PipelineBoard } from '../../../components/admin/PipelineBoard.jsx';
import { Sparkles, Loader2, Ban, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApolloHRContacts } from './components/ApolloHRContacts.jsx';
import { HiringPartnersSection } from './components/HiringPartnersSection.jsx';
import { AiSourceModal } from './components/AiSourceModal.jsx';
import { ContactOutreachModal } from './components/ContactOutreachModal.jsx';
import { useAdminPlacementsStore } from '../../../store/useAdminPlacementsStore.js';

const STAGES = ["Applied","Screening","Interview","Offer","Placed"];
const TINT = { Applied: "#94A3B8", Screening: "#5BA4E8", Interview: "#2D5FA8", Offer: "#F4A261", Placed: "#10B981" };

export function PlacementsPage() {
  const { 
    items, partners, loading, aiState, 
    fetchData, moveStage, runAiFetch, clearAiContacts 
  } = useAdminPlacementsStore();

  const [aiOpen, setAiOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AdminShell title="Placements" actions={
      <div className="flex items-center gap-2">
        <Link to="/admin/placements/jobs" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <Briefcase className="h-3.5 w-3.5" /> Jobs
        </Link>
        <Link to="/admin/placements/rejected" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <Ban className="h-3.5 w-3.5" /> View Rejected
        </Link>
        <button onClick={() => setAiOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-lavender/40 px-3 py-1.5 text-xs font-semibold text-[#1E1B4B] hover:bg-lavender/60">
          <Sparkles className="h-3.5 w-3.5" /> AI: find HR contacts
        </button>
      </div>
    }>
      <p className="mb-3 text-xs text-slate-500">Drag cards between stages to update. Use the AI copilot to source verified HR contacts and open new placement channels.</p>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <PipelineBoard
            stages={STAGES}
            items={items}
            tint={TINT}
            onMove={moveStage}
            renderCard={(i) => (
              <div className="relative group">
                <div className="pr-6">
                  <p className="font-semibold text-slate-800 line-clamp-1">{i.student}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{i.role} · {i.company}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{i.updatedDays}d ago</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); moveStage(i.id, 'Rejected'); }}
                  className="absolute top-0 right-0 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Reject Candidate"
                >
                  <Ban className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          />

          <ApolloHRContacts
            error={aiState.error}
            fetching={aiState.fetching}
            contacts={aiState.contacts}
            note={aiState.note}
            onClear={clearAiContacts}
            onSelectContact={setSelectedContact}
          />

          <HiringPartnersSection partners={partners} />

          <AiSourceModal
            open={aiOpen}
            onClose={() => setAiOpen(false)}
            onSelect={(target) => { setAiOpen(false); runAiFetch(target); }}
          />

          <ContactOutreachModal
            selectedContact={selectedContact}
            onClose={() => setSelectedContact(null)}
          />
        </>
      )}
    </AdminShell>
  );
}

