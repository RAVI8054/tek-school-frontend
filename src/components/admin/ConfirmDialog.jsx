import { Modal, PrimaryBtn, GhostBtn } from '../ui/Modal.jsx';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
}) {
  const footer = (
    <>
      <GhostBtn onClick={onClose}>{cancelLabel}</GhostBtn>
      {destructive ? (
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className="inline-flex items-center gap-1.5 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground shadow-[0_10px_25px_-12px_var(--coral)] hover:opacity-95"
        >
          {confirmLabel}
        </button>
      ) : (
        <PrimaryBtn onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</PrimaryBtn>
      )}
    </>
  );

  const eyebrow = destructive ? (
    <span className="pill-tag -rotate-2 bg-coral/20 text-coral mb-2">
      <AlertTriangle className="h-3 w-3" /> Destructive
    </span>
  ) : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      eyebrow={eyebrow}
      footer={footer}
      size="sm"
    >
      <div className="text-muted-foreground text-sm">
        {typeof message === 'string' ? <p>{message}</p> : message}
      </div>
    </Modal>
  );
}
