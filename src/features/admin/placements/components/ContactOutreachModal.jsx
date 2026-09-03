import { Modal, PrimaryBtn, GhostBtn } from '../../../../components/ui/Modal.jsx';
import { pushToast } from '../../../../lib/actionBus.js';

export function ContactOutreachModal({ selectedContact, onClose }) {
  return (
    <Modal open={!!selectedContact} onClose={onClose}
      title={selectedContact ? `Reach out to ${selectedContact.name}` : ""}
      footer={<>
        <GhostBtn onClick={onClose}>Close</GhostBtn>
        <PrimaryBtn onClick={() => {
          pushToast(`Intro email sent to ${selectedContact?.name}`);
          onClose();
        }}>Send intro email</PrimaryBtn>
      </>}>
      {selectedContact && (
        <div className="space-y-2 text-sm">
          <p><b>{selectedContact.title}</b> · {selectedContact.company}</p>
          <p className="text-xs text-slate-500">Currently hiring for: {selectedContact.hiringFor.join(", ")}</p>
          <div className="rounded-lg bg-slate-50 p-3 text-xs">
            <p><b>Subject:</b> Introducing TekSchool — job-ready {selectedContact.hiringFor[0]}s</p>
            <p className="mt-2">Hi {selectedContact.name.split(" ")[0]}, I run partnerships at TekSchool. We've got a cohort graduating this month with hands-on experience shipping {selectedContact.hiringFor[0]} projects. Open to a 15-min intro this week?</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
