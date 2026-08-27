import { useTasks } from "../context/TaskContext.jsx";
import { TaskCard } from "./TaskCard.jsx";

export function ListView() {
  const { tasks, loading, toggleTask, updateTask, deleteTask } = useTasks();

  if (loading) {
    return (
      <div className="task-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="task-item prototype-task-item" style={{ padding: 20 }}>
            <div className="skeleton skeleton-circle" style={{ width: 24, height: 24 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text short" style={{ margin: 0 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="material-symbols-outlined">task</span>
        <p className="text-body-lg">No tasks yet.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={toggleTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      ))}
    </div>
  );
}
