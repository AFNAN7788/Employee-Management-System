import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({ title, message, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content !max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-4"
          style={{ background: 'rgba(239, 68, 68, 0.15)' }}
        >
          <AlertTriangle size={26} className="text-red-400" />
        </div>

        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-sm text-slate-400 mt-2">{message}</p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="btn btn-ghost" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
