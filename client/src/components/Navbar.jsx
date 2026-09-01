import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTasks } from "../context/TaskContext.jsx";

export function Navbar() {
  const { logout, user } = useAuth();
  const { filters, setFilters } = useTasks();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("today");

  const navItems = [
    { id: "today", icon: "today", label: "Today" },
    { id: "planned", icon: "event_note", label: "Planned" },
    { id: "important", icon: "star_outline", label: "Important" },
    { id: "completed", icon: "check_circle", label: "Completed" },
  ];

  return (
    <>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <span className="material-symbols-outlined fill">account_circle</span>
          </div>
          <div>
            <h2>Task Master</h2>
            <p>Peak Productivity</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveNav(item.id);
                setSidebarOpen(false);
                if (item.id === "completed") {
                  setFilters({ status: "completed" });
                } else if (item.id === "important") {
                  setFilters({ priority: "urgent" });
                } else {
                  setFilters({ status: "all", priority: "all" });
                }
              }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-badge" style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span className="material-symbols-outlined">account_circle</span>
            <span style={{ flex: 1, fontWeight: 600 }}>{user?.name || "Signed in"}</span>
          </div>

          <button className="sidebar-upgrade-btn">
            Upgrade to Pro
          </button>

          <button className="sidebar-nav-item">
            <span className="material-symbols-outlined">help_outline</span>
            <span>Help</span>
          </button>

          <button className="sidebar-nav-item" onClick={logout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 4 }}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1>Task Master</h1>
        </div>
      </header>
    </>
  );
}
