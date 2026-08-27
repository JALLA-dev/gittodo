import { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext.jsx";

export function TaskModal({ isOpen, onClose, taskToEdit, initialStatus = "pending" }) {
  const { createTask, updateTask } = useTasks();
  const isEditing = !!taskToEdit;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [category, setCategory] = useState("personal");
  const [tagsInput, setTagsInput] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title || "");
        setDescription(taskToEdit.description || "");
        setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.slice(0, 16) : "");
        setPriority(taskToEdit.priority || "medium");
        setStatus(taskToEdit.status || "pending");
        setCategory(taskToEdit.category || "personal");
        setTagsInput((taskToEdit.tags || []).join(", "));
        setSubtasks(taskToEdit.subtasks || []);
      } else {
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("medium");
        setStatus(initialStatus);
        setCategory("personal");
        setTagsInput("");
        setSubtasks([]);
      }
      setSubtaskInput("");
    }
  }, [isOpen, taskToEdit, initialStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const taskData = {
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
      priority,
      status,
      category,
      tags,
      subtasks,
    };

    if (isEditing) {
      await updateTask(taskToEdit.id, taskData);
    } else {
      await createTask(taskData);
    }

    setSubmitting(false);
    onClose();
  };

  const addSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([...subtasks, {
      id: Math.random().toString(36).substring(2, 9),
      title: subtaskInput.trim(),
      completed: false,
    }]);
    setSubtaskInput("");
  };

  const removeSubtask = (id) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit Task" : "Create New Task"}</h2>
          <button className="modal-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                className="form-input"
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                className="form-textarea"
                placeholder="Add details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Priority + Status */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <select id="task-priority" className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="task-status">Status</label>
                <select id="task-status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Category + Due Date */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="task-category">Category</label>
                <select id="task-category" className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="shopping">Shopping</option>
                  <option value="health">Health & Fitness</option>
                  <option value="finance">Finance</option>
                  <option value="other">General</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="task-due">Due Date</label>
                <input
                  id="task-due"
                  className="form-input"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-tags">Tags (comma-separated)</label>
              <input
                id="task-tags"
                className="form-input"
                type="text"
                placeholder="design, urgent, frontend"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            {/* Subtasks */}
            <div className="form-group">
              <label className="form-label">Subtasks / Checklist</label>
              <div className="flex gap-2" style={{ marginBottom: 8 }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Add a subtask..."
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubtask(); } }}
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-secondary btn-sm" onClick={addSubtask}>Add</button>
              </div>
              {subtasks.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {subtasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-2" style={{ fontSize: 14, color: "var(--on-surface-variant)" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: st.completed ? "var(--priority-low)" : "var(--outline)" }}>
                        {st.completed ? "check_circle" : "circle"}
                      </span>
                      <span style={{ flex: 1, textDecoration: st.completed ? "line-through" : "none" }}>{st.title}</span>
                      <button
                        type="button"
                        onClick={() => removeSubtask(st.id)}
                        style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer", padding: 2 }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting || !title.trim()}>
              {submitting ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
