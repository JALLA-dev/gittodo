import { useState } from "react";

export function TaskCard({ task, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const isCompleted = task.status === "completed";

  const handleUpdate = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdate(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleUpdate();
    if (e.key === "Escape") {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="prototype-edit-row">
        <input
          type="text"
          className="prototype-edit-input"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button className="prototype-btn-update" onClick={handleUpdate}>Update</button>
        <button className="prototype-btn-cancel" onClick={() => { setEditTitle(task.title); setIsEditing(false); }}>Cancel</button>
      </div>
    );
  }

  return (
    <div className={`prototype-task-item ${isCompleted ? "completed" : ""}`}>
      <button
        className={`task-checkbox ${isCompleted ? "checked" : ""}`}
        onClick={() => onToggle(task.id)}
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      >
        {isCompleted && (
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontWeight: "bold" }}>check</span>
        )}
      </button>

      <span 
        className={`task-text ${isCompleted ? "completed" : ""}`} 
        style={{ flex: 1, fontSize: "16px", color: isCompleted ? "var(--outline)" : "var(--on-surface)" }}
      >
        {task.title}
      </span>

      {!isCompleted && (
        <span className="prototype-inbox-pill">Inbox</span>
      )}
      
      <div style={{ display: "flex", gap: "8px" }}>
        <button className="prototype-action-btn" onClick={() => setIsEditing(true)} aria-label="Edit">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
        </button>
        <button className="prototype-action-btn delete" onClick={() => onDelete(task.id)} aria-label="Delete">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
        </button>
      </div>
    </div>
  );
}
