import { useEffect } from "react";
import { useTasks } from "../context/TaskContext.jsx";
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from "../lib/constants.js";

export function AnalyticsView() {
  const { tasks, stats, refreshStats } = useTasks();

  useEffect(() => {
    refreshStats();
  }, []);

  const overview = stats || {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100) : 0,
  };

  // Priority breakdown
  const priorityBreakdown = Object.keys(PRIORITY_CONFIG).map((key) => ({
    ...PRIORITY_CONFIG[key],
    key,
    count: tasks.filter((t) => t.priority === key).length,
  }));

  // Category breakdown
  const categoryBreakdown = Object.keys(CATEGORY_CONFIG).map((key) => ({
    ...CATEGORY_CONFIG[key],
    key,
    count: tasks.filter((t) => t.category === key).length,
  }));

  return (
    <div>
      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{overview.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--priority-low)" }}>{overview.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--cat-work)" }}>{overview.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--outline)" }}>{overview.pending}</div>
          <div className="stat-label">To Do</div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="stat-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span className="text-label-sm" style={{ color: "var(--on-surface-variant)" }}>Completion Rate</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)" }}>{overview.completionRate}%</span>
        </div>
        <div style={{ height: 8, background: "var(--surface-container-high)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${overview.completionRate}%`,
              background: "var(--primary)",
              borderRadius: "var(--radius-full)",
              transition: "width 500ms ease",
            }}
          />
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="stat-card" style={{ marginBottom: 24 }}>
        <h3 className="text-label-sm" style={{ color: "var(--on-surface-variant)", marginBottom: 16 }}>Priority Distribution</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {priorityBreakdown.map((p) => (
            <div key={p.key} className="flex items-center gap-3">
              <span className={`chip-priority ${p.className}`} style={{ minWidth: 60, textAlign: "center" }}>{p.label}</span>
              <div style={{ flex: 1, height: 6, background: "var(--surface-container-high)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: tasks.length > 0 ? `${(p.count / tasks.length) * 100}%` : "0%",
                    background: p.color,
                    borderRadius: "var(--radius-full)",
                    transition: "width 500ms ease",
                  }}
                />
              </div>
              <span className="text-label-sm" style={{ color: "var(--on-surface-variant)", minWidth: 24, textAlign: "right" }}>{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="stat-card">
        <h3 className="text-label-sm" style={{ color: "var(--on-surface-variant)", marginBottom: 16 }}>Categories</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {categoryBreakdown.filter((c) => c.count > 0).map((c) => (
            <div
              key={c.key}
              style={{
                padding: 16,
                borderRadius: "var(--radius-lg)",
                background: `${c.color}12`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800, color: c.color }}>{c.count}</div>
              <div className="text-label-xs" style={{ color: c.color }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
