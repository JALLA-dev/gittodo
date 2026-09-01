import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { Navbar } from "./Navbar.jsx";
import { ListView } from "./ListView.jsx";
import { AuthView } from "./AuthView.jsx";

export function AppDashboard() {
  const { user, loading } = useAuth();
  const { tasks, createTask } = useTasks();

  const [quickAddText, setQuickAddText] = useState("");

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading TaskFlow...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickAddText.trim()) return;
    await createTask({ title: quickAddText.trim() });
    setQuickAddText("");
  };

  const now = new Date();
  const currentDay = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(now);
  const currentYear = now.getFullYear().toString();

  return (
    <>
      {/* Background Scene */}
      <div className="bg-scene">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAisqX5eCn9BoKumOsx_cruqYsb1fSHPHrcR9WLrqxA0LjHpvF8KaBY1qWesMUF5gpc7HwSLMmTWSxWgDhTas66ZcI1hv135qHfmE7LCCUtS9GlieCQfZr1l39hGwAePKxxHpyvemX7AkxbwvAoA0dEpPEZPdqOIB1er7lQ1YVM2i__UVrEbP2v6V3owjG2VMXZk0lic9z-1tAfghp67JbGs-EcPx2essqkH-JrdL2lyLMZwBY5si72"
          alt="Mountain landscape"
        />
        <div className="bg-scene-overlay" />
      </div>

      <div className="app-layout">
        <Navbar />

        <main className="main-content">
          <div className="focus-canvas">
            <div className="main-card prototype-card">
              <div className="main-card-inner">
                {/* Header */}
                <div className="card-header prototype-header">
                  <div>
                    <h2 className="card-header-day">{currentDay}</h2>
                    <p className="card-header-year">{currentYear}</p>
                  </div>
                  <div className="card-header-count">
                    <span className="count">{tasks.length}</span>
                    <span className="label">tasks</span>
                  </div>
                </div>

                {/* Quick Add Input */}
                <form className="task-input-form prototype-input-form" onSubmit={handleQuickAdd}>
                  <label className="sr-only" htmlFor="quick-add">Write todo...</label>
                  <input
                    id="quick-add"
                    className="task-input prototype-input"
                    type="text"
                    placeholder="Write todo..."
                    value={quickAddText}
                    onChange={(e) => setQuickAddText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="task-input-btn prototype-add-btn"
                    disabled={!quickAddText.trim()}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
                  </button>
                </form>

                {/* List View */}
                <ListView />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
