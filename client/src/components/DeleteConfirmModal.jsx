export function DeleteConfirmModal({ isOpen, title, description, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2>{title || "Confirm Delete"}</h2>
          <button className="modal-close" onClick={onCancel}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--error)" }}>warning</span>
            <p className="text-body-md" style={{ color: "var(--on-surface-variant)" }}>{description}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={isDeleting}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
