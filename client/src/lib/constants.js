export const PRIORITY_CONFIG = {
  urgent: { label: "Urgent", color: "#f43f5e", className: "urgent" },
  high: { label: "High", color: "#f59e0b", className: "high" },
  medium: { label: "Medium", color: "#3b82f6", className: "medium" },
  low: { label: "Low", color: "#10b981", className: "low" },
};

export const STATUS_CONFIG = {
  pending: { label: "To Do", className: "pending" },
  in_progress: { label: "In Progress", className: "in_progress" },
  completed: { label: "Completed", className: "completed" },
};

export const CATEGORY_CONFIG = {
  work: { label: "Work", color: "#6366f1", className: "work" },
  personal: { label: "Personal", color: "#ec4899", className: "personal" },
  shopping: { label: "Shopping", color: "#10b981", className: "shopping" },
  health: { label: "Health & Fitness", color: "#f97316", className: "health" },
  finance: { label: "Finance", color: "#06b6d4", className: "finance" },
  other: { label: "General", color: "#8b5cf6", className: "other" },
};

export function formatDueDate(dateString) {
  if (!dateString) return { text: "No due date", isOverdue: false, isToday: false, formatted: "" };

  const due = new Date(dateString);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const tomorrow = new Date(startOfToday);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59);

  const isOverdue = due < startOfToday;
  const isToday = due >= startOfToday && due <= endOfToday;
  const isTomorrow = due > endOfToday && due <= endOfTomorrow;

  let text = "";
  if (isOverdue) {
    const diffDays = Math.ceil((startOfToday.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    text = diffDays === 1 ? "Overdue by 1 day" : `Overdue by ${diffDays} days`;
  } else if (isToday) {
    text = "Due Today";
  } else if (isTomorrow) {
    text = "Due Tomorrow";
  } else {
    text = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const formatted = due.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return { text, isOverdue, isToday, formatted };
}
