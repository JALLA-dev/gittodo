import { useState } from "react";

export function ExportModal({ isOpen, onClose }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const res = await fetch(`/api/tasks/export?format=${format}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tasks.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    } catch {
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h2>Export Tasks</h2>
          <button className="modal-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="modal-body">
          <p className="text-body-md" style={{ color: "var(--on-surface-variant)", marginBottom: 20 }}>
            Download your tasks in your preferred format.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              className="btn btn-secondary btn-lg w-full"
              onClick={() => handleExport("csv")}
              disabled={exporting}
              style={{ justifyContent: "flex-start" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--priority-low)" }}>table_chart</span>
              CSV Spreadsheet
            </button>
            <button
              className="btn btn-secondary btn-lg w-full"
              onClick={() => handleExport("json")}
              disabled={exporting}
              style={{ justifyContent: "flex-start" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--primary)" }}>data_object</span>
              JSON Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
