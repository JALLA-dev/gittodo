import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useToast } from "./ToastContext.jsx";

const TaskContext = createContext(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const initialFilters = {
  status: "all",
  priority: "all",
  category: "all",
  search: "",
  sortBy: "orderIndex",
  sortOrder: "asc",
  page: 1,
  limit: 50,
  overdue: false,
};

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFiltersState] = useState(initialFilters);
  const [activeView, setActiveView] = useState("list");
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setStats(null);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status && filters.status !== "all") params.set("status", filters.status);
      if (filters.priority && filters.priority !== "all") params.set("priority", filters.priority);
      if (filters.category && filters.category !== "all") params.set("category", filters.category);
      if (filters.search) params.set("search", filters.search);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.overdue) params.set("overdue", "true");

      const res = await fetch(`${API_BASE_URL}/api/tasks?${params.toString()}`, {
        credentials: "include",
      });
      const json = await res.json();

      if (json.success) {
        setTasks(json.data || []);
        if (json.pagination) setPagination(json.pagination);
      } else {
        toast.error(json.error || "Failed to load tasks");
      }
    } catch {
      toast.error("Network error while loading tasks");
    } finally {
      setLoading(false);
    }
  }, [user, filters, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const refreshStats = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/stats`, { credentials: "include" });
      const json = await res.json();
      if (json.success && json.data) setStats(json.data.overview);
    } catch { /* ignore */ }
  };

  const setFilters = (newFilters) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const resetFilters = () => setFiltersState(initialFilters);

  const toggleSelectTask = (id) => {
    setSelectedTaskIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedTaskIds.length === tasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(tasks.map((t) => t.id));
    }
  };

  const clearSelection = () => setSelectedTaskIds([]);

  const createTask = async (taskData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(taskData),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Failed to create task");
        return null;
      }
      toast.success("Task created successfully!");
      await fetchTasks();
      return json.data;
    } catch {
      toast.error("Network error while creating task");
      return null;
    }
  };

  const updateTask = async (id, taskData) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...taskData, updatedAt: new Date().toISOString() } : t));
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(taskData),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Failed to update task");
        await fetchTasks();
        return false;
      }
      toast.success("Task updated!");
      await fetchTasks();
      return true;
    } catch {
      toast.error("Error updating task");
      await fetchTasks();
      return false;
    }
  };

  const deleteTask = async (id) => {
    const prevTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSelectedTaskIds((prev) => prev.filter((i) => i !== id));
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Failed to delete task");
        setTasks(prevTasks);
        return false;
      }
      toast.success("Task deleted");
      await fetchTasks();
      return true;
    } catch {
      toast.error("Error deleting task");
      setTasks(prevTasks);
      return false;
    }
  };

  const toggleTask = async (id) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === id) {
        const nextStatus = t.status === "completed" ? "pending" : "completed";
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${id}/toggle`, {
        method: "PATCH",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Failed to toggle task");
        await fetchTasks();
        return false;
      }
      toast.success(json.message || "Task updated");
      await fetchTasks();
      return true;
    } catch {
      toast.error("Network error toggling task");
      await fetchTasks();
      return false;
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === taskId) {
        const updatedSubtasks = (t.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/subtask`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "toggle", subtaskId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        await fetchTasks();
        return false;
      }
      return true;
    } catch {
      await fetchTasks();
      return false;
    }
  };

  const addSubtask = async (taskId, title) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/subtask`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "add", title }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error("Failed to add subtask");
        return false;
      }
      toast.success("Subtask added");
      await fetchTasks();
      return true;
    } catch {
      toast.error("Network error adding subtask");
      return false;
    }
  };

  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/subtask`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "delete", subtaskId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error("Failed to delete subtask");
        return false;
      }
      toast.success("Subtask removed");
      await fetchTasks();
      return true;
    } catch {
      toast.error("Network error removing subtask");
      return false;
    }
  };

  const reorderTasks = async (items) => {
    setTasks((prev) => {
      const copy = [...prev];
      for (const item of items) {
        const found = copy.find((t) => t.id === item.id);
        if (found) {
          if (item.status) found.status = item.status;
          if (typeof item.orderIndex === "number") found.orderIndex = item.orderIndex;
        }
      }
      return copy;
    });
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        await fetchTasks();
        return false;
      }
      return true;
    } catch {
      await fetchTasks();
      return false;
    }
  };

  const batchDelete = async (ids) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "delete", ids }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Batch delete failed");
        return false;
      }
      toast.success(`Deleted ${ids.length} tasks`);
      setSelectedTaskIds([]);
      await fetchTasks();
      return true;
    } catch {
      toast.error("Network error performing batch delete");
      return false;
    }
  };

  const batchComplete = async (ids) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "complete", ids }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Batch complete failed");
        return false;
      }
      toast.success(`Completed ${ids.length} tasks`);
      setSelectedTaskIds([]);
      await fetchTasks();
      return true;
    } catch {
      toast.error("Network error performing batch complete");
      return false;
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks, loading, stats, pagination, filters, activeView, selectedTaskIds,
      setActiveView, setFilters, resetFilters, toggleSelectTask, selectAll, clearSelection,
      fetchTasks, createTask, updateTask, deleteTask, toggleTask, toggleSubtask,
      addSubtask, deleteSubtask, reorderTasks, batchDelete, batchComplete, refreshStats,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
