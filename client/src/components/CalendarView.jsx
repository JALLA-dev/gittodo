import { useTasks } from "../context/TaskContext.jsx";
import { TaskCard } from "./TaskCard.jsx";

export function CalendarView({ onEditTask, onViewTask, onDeleteRequest }) {
  const { tasks, toggleTask } = useTasks();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const endOfTomorrow = new Date(startOfToday);
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 2);
  endOfTomorrow.setMilliseconds(-1);
  const endOfWeek = new Date(startOfToday);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const groups = [
    {
      label: "Overdue",
      icon: "warning",
      className: "overdue",
      tasks: tasks.filter((t) => {
        if (!t.dueDate || t.status === "completed") return false;
        return new Date(t.dueDate) < startOfToday;
      }),
    },
    {
      label: "Due Today",
      icon: "today",
      className: "today",
      tasks: tasks.filter((t) => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d >= startOfToday && d <= endOfToday;
      }),
    },
    {
      label: "Due Tomorrow",
      icon: "event",
      className: "",
      tasks: tasks.filter((t) => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d > endOfToday && d <= endOfTomorrow;
      }),
    },
    {
      label: "Next 7 Days",
      icon: "date_range",
      className: "",
      tasks: tasks.filter((t) => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d > endOfTomorrow && d <= endOfWeek;
      }),
    },
    {
      label: "Later",
      icon: "calendar_month",
      className: "",
      tasks: tasks.filter((t) => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate) > endOfWeek;
      }),
    },
    {
      label: "No Due Date",
      icon: "event_busy",
      className: "",
      tasks: tasks.filter((t) => !t.dueDate),
    },
  ];

  return (
    <div>
      {groups.map((group) => {
        if (group.tasks.length === 0) return null;
        return (
          <div key={group.label} className="calendar-group">
            <div className={`calendar-group-header ${group.className}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{group.icon}</span>
              {group.label}
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--on-surface-variant)", marginLeft: 4 }}>
                ({group.tasks.length})
              </span>
            </div>
            <div className="task-list">
              {group.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={onEditTask}
                  onView={onViewTask}
                  onDelete={onDeleteRequest}
                />
              ))}
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && (
        <div className="empty-state">
          <span className="material-symbols-outlined">event_busy</span>
          <p className="text-body-lg">No tasks scheduled. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
