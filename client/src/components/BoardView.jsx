import { useTasks } from "../context/TaskContext.jsx";
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from "../lib/constants.js";

const COLUMNS = [
  { status: "pending", label: "To Do", icon: "radio_button_unchecked", color: "#94a3b8" },
  { status: "in_progress", label: "In Progress", icon: "pending", color: "#6366f1" },
  { status: "completed", label: "Completed", icon: "check_circle", color: "#10b981" },
];

export function BoardView({ onOpenCreateModalWithStatus, onEditTask, onViewTask, onDeleteRequest }) {
  const { tasks, reorderTasks } = useTasks();

  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  const moveTask = (taskId, newStatus) => {
    reorderTasks([{ id: taskId, status: newStatus, orderIndex: 0 }]);
  };

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => {
        const colTasks = getColumnTasks(col.status);
        return (
          <div key={col.status} className="kanban-column">
            <div className="kanban-column-header">
              <div className="kanban-column-title">
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: col.color }}>{col.icon}</span>
                {col.label}
              </div>
              <span className="kanban-column-count">{colTasks.length}</span>
            </div>

            {colTasks.map((task) => {
              const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
              const category = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.other;
              return (
                <div
                  key={task.id}
                  className="kanban-task"
                  onClick={() => onViewTask?.(task)}
                >
                  <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                    <span className={`chip-priority ${priority.className}`} style={{ fontSize: 10 }}>
                      {priority.label}
                    </span>
                    <span className={`chip-category ${category.className}`} style={{ fontSize: 11 }}>
                      {category.label}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--on-surface)", marginBottom: 8 }}>
                    {task.title}
                  </div>
                  {/* Move actions */}
                  <div className="flex gap-1" style={{ marginTop: 8 }}>
                    {COLUMNS.filter((c) => c.status !== col.status).map((target) => (
                      <button
                        key={target.status}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 11, padding: "4px 8px" }}
                        onClick={(e) => { e.stopPropagation(); moveTask(task.id, target.status); }}
                      >
                        → {target.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {colTasks.length === 0 && (
              <div className="empty-state" style={{ padding: "24px 8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, opacity: 0.4 }}>inbox</span>
                <p style={{ fontSize: 13 }}>No tasks</p>
              </div>
            )}

            <button
              className="btn btn-ghost w-full"
              style={{ marginTop: 8, fontSize: 13 }}
              onClick={() => onOpenCreateModalWithStatus?.(col.status)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Add Task
            </button>
          </div>
        );
      })}
    </div>
  );
}
