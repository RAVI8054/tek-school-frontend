import { useState } from 'react';
import { Modal, GhostBtn } from './Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { pushToast } from '../../lib/action-bus';

/**
 * A highly reusable delete confirmation modal.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls if the modal is visible
 * @param {Function} props.onClose - Called when user cancels or after successful delete
 * @param {Function} props.onConfirm - Async function that handles the actual deletion
 * @param {string} [props.title] - Custom title (default: "Confirm Deletion")
 * @param {string} [props.description] - Custom description text
 * @param {string} [props.itemName] - Optional name of the item being deleted for clearer context
 * @param {string} [props.successMessage] - Optional toast message on success (default: "Successfully deleted!")
 */
export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this? This action cannot be undone.",
  itemName,
  successMessage = "Successfully deleted!",
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      pushToast(successMessage, "success");
      onClose();
    } catch (err) {
      pushToast(err.message || "Failed to delete item", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={isDeleting ? undefined : onClose}
      title={
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          {title}
        </div>
      }
      footer={
        <>
          <GhostBtn onClick={onClose} disabled={isDeleting}>
            Cancel
          </GhostBtn>
          <button
            disabled={isDeleting}
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </>
      }
    >
      <div className="text-slate-600">
        <p>{description}</p>
        {itemName && (
          <div className="mt-3 font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-center text-center">
            "{itemName}"
          </div>
        )}
      </div>
    </Modal>
  );
}
