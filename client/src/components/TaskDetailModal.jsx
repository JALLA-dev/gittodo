import { useTasks } from "../context/TaskContext.jsx";
import { PRIORITY_CONFIG, CATEGORY_CONFIG, STATUS_CONFIG, formatDueDate } from "../lib/constants.js";

export function TaskDetailModal({ isOpen, task, onClose, onEdit, onDeleteRequest }) {
  const { toggleSubtask } = useTasks();

  if (!isOpen || !task) return null;

  const dueInfo = formatDueDate(task.dueDate);
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const category = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.other;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const subtasks = task.subtasks || [];
  const tags = task.tags || [];
  const completedSubs = subtasks.filter((s) => s.completed).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ flex: 1, paddingRight: 16 }}>{task.title}</h2>
          <button className="modal-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">
          {/* Meta chips */}
          <div className="flex items-center gap-2" style={{ flexWrap: "wrap", marginBottom: 16 }}>
            <span className={`chip-priority ${priority.className}`}>{priority.label}</span>
            <span className={`chip-category ${category.className}`}>{category.label}</span>
            <span className="chip">
              <span className={`status-dot ${task.status}`} style={{ marginRight: 6 }} />
              {status.label}
            </span>
          </div>

          {/* Due date */}
          {task.dueDate && (
            <div className={`due-date ${dueInfo.isOverdue ? "overdue" : dueInfo.isToday ? "today" : "normal"}`} style={{ marginBottom: 16, fontSize: 14 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>schedule</span>
              {dueInfo.formatted} — {dueInfo.text}
            </div>
          )}

          {/* Description */}
          {task.description && (
            <div style={{ marginBottom: 20 }}>
              <h4 className="text-label-sm" style={{ color: "var(--on-surface-variant)", marginBottom: 6 }}>Description</h4>
              <p className="text-body-md" style={{ color: "var(--on-surface)", whiteSpace: "pre-wrap" }}>{task.description}</p>
            </div>
          )}

          {/* Subtasks */}
          {subtasks.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 className="text-label-sm" style={{ color: "var(--on-surface-variant)", marginBottom: 8 }}>
                Checklist ({completedSubs}/{subtasks.length})
              </h4>
              <div style={{ height: 4, background: "var(--surface-container-high)", borderRadius: "var(--radius-full)", overflow: "hidden", marginBottom: 12 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${subtasks.length > 0 ? (completedSubs / subtasks.length) * 100 : 0}%`,
                    background: "var(--primary)",
                    borderRadius: "var(--radius-full)",
                    transition: "width 300ms ease",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {subtasks.map((st) => (
                  <button
                    key={st.id}
                    className="flex items-center gap-3"
                    onClick={() => toggleSubtask(task.id, st.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "6px 0",
                      color: st.completed ? "var(--outline)" : "var(--on-surface)",
                      fontSize: 14,
                      textDecoration: st.completed ? "line-through" : "none",
                      transition: "all 200ms ease",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: st.completed ? "var(--primary)" : "var(--outline-variant)" }}>
                      {st.completed ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    {st.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h4 className="text-label-sm" style={{ color: "var(--on-surface-variant)", marginBottom: 8 }}>Tags</h4>
              <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                {tags.map((tag) => (
                  <span key={tag} className="chip">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div style={{ borderTop: "1px solid var(--surface-variant)", paddingTop: 12, marginTop: 8 }}>
            <p className="text-label-xs" style={{ color: "var(--outline)" }}>
              Created: {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-danger btn-sm" onClick={() => onDeleteRequest?.(task)}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
            Delete
          </button>
          <button className="btn btn-primary" onClick={() => onEdit?.(task)}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
}
