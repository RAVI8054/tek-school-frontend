import { Sparkles } from 'lucide-react';
import { Modal, GhostBtn } from '../../../../components/ui/Modal.jsx';

export function AiSourceModal({ open, onClose, onSelect }) {
  return (
    <Modal open={open} onClose={onClose} tone="navy"
      eyebrow={<span className="pill-tag -rotate-2 bg-lavender/50"><Sparkles className="h-3 w-3" /> Agentic AI</span>}
      title="Source verified HR contacts"
      footer={<GhostBtn onClick={onClose}>Cancel</GhostBtn>}>
      <p>Pick a hiring vertical. The AI cross-references LinkedIn, company careers, and past placement partners to surface verified HRs — with email, phone, and confidence score.</p>
      <div className="mt-3 grid gap-2">
        {[
          "AI / ML Engineering roles in Bengaluru",
          "Cloud & DevOps roles at Indian unicorns",
          "Backend / Full-stack roles (2-5 yrs)",
        ].map((t) => (
          <button key={t} onClick={() => onSelect(t)} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50">
            <span>{t}</span>
            <Sparkles className="h-3.5 w-3.5 text-coral" />
          </button>
        ))}
      </div>
    </Modal>
  );
}
