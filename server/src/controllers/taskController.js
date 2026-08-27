import crypto from "crypto";
import pool from "../db/index.js";

export async function getTasks(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

  const userId = req.user.id;
  const status = req.query.status || "all";
  const priority = req.query.priority || "all";
  const category = req.query.category || "all";
  const search = (req.query.search || "").trim();
  const sortBy = req.query.sortBy || "order_index";
  const sortOrder = (req.query.sortOrder || "asc").toLowerCase() === "desc" ? "DESC" : "ASC";
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "50", 10)));
  const overdueOnly = req.query.overdue === "true";

  try {
    let conditions = ["user_id = $1"];
    let params = [userId];
    let paramIdx = 2;

    if (status !== "all") {
      conditions.push(`status = $${paramIdx}`);
      params.push(status);
      paramIdx++;
    }
    if (priority !== "all") {
      conditions.push(`priority = $${paramIdx}`);
      params.push(priority);
      paramIdx++;
    }
    if (category !== "all") {
      conditions.push(`category = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }
    if (search) {
      conditions.push(`(title ILIKE $${paramIdx} OR description ILIKE $${paramIdx})`);
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (overdueOnly) {
      conditions.push(`due_date < NOW() AND status != 'completed'`);
    }

    const whereClause = conditions.join(" AND ");

    // Determine sort
    let orderClause;
    const validSortColumns = {
      dueDate: "due_date",
      title: "title",
      createdAt: "created_at",
      orderIndex: "order_index",
      order_index: "order_index",
    };

    if (sortBy === "priority") {
      orderClause = `CASE priority
        WHEN 'urgent' THEN 4
        WHEN 'high' THEN 3
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 1
        ELSE 0 END ${sortOrder}`;
    } else {
      const col = validSortColumns[sortBy] || "order_index";
      orderClause = `${col} ${sortOrder}`;
    }

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*)::int as count FROM tasks WHERE ${whereClause}`,
      params
    );
    const total = countResult.rows[0]?.count || 0;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    // Fetch tasks
    const taskResult = await pool.query(
      `SELECT * FROM tasks WHERE ${whereClause}
       ORDER BY ${orderClause}, created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    return res.json({
      success: true,
      data: taskResult.rows.map((t) => ({
        id: t.id,
        userId: t.user_id,
        title: t.title,
        description: t.description,
        dueDate: t.due_date ? new Date(t.due_date).toISOString() : null,
        priority: t.priority,
        status: t.status,
        category: t.category,
        subtasks: t.subtasks || [],
        tags: t.tags || [],
        orderIndex: t.order_index,
        createdAt: new Date(t.created_at).toISOString(),
        updatedAt: new Date(t.updated_at).toISOString(),
      })),
      pagination: { total, page, limit, totalPages },
    });
  } catch (error) {
    console.error("getTasks error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
}

export async function createTask(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

  try {
    const {
      title,
      description,
      dueDate,
      priority = "medium",
      status = "pending",
      category = "personal",
      subtasks = [],
      tags = [],
    } = req.body;

    const trimmedTitle = typeof title === "string" ? title.trim() : "";
    if (!trimmedTitle) {
      return res.status(400).json({ success: false, error: "Task title is required" });
    }

    let parsedDueDate = null;
    if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d.getTime())) parsedDueDate = d;
    }

    const taskId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO tasks (id, user_id, title, description, due_date, priority, status, category, subtasks, tags, order_index, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, NOW(), NOW())`,
      [
        taskId,
        req.user.id,
        trimmedTitle,
        typeof description === "string" ? description.trim() : null,
        parsedDueDate,
        priority,
        status,
        category,
        JSON.stringify(subtasks),
        JSON.stringify(tags),
      ]
    );

    const created = await pool.query("SELECT * FROM tasks WHERE id = $1 LIMIT 1", [taskId]);
    const t = created.rows[0];

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        id: t.id,
        userId: t.user_id,
        title: t.title,
        description: t.description,
        dueDate: t.due_date ? new Date(t.due_date).toISOString() : null,
        priority: t.priority,
        status: t.status,
        category: t.category,
        subtasks: t.subtasks || [],
        tags: t.tags || [],
        orderIndex: t.order_index,
        createdAt: new Date(t.created_at).toISOString(),
        updatedAt: new Date(t.updated_at).toISOString(),
      },
    });
  } catch (error) {
    console.error("createTask error:", error);
    return res.status(500).json({ success: false, error: "Failed to create task" });
  }
}

export async function getTaskById(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  const id = String(req.params.id);

  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2 LIMIT 1",
      [id, req.user.id]
    );

    if (!result.rows.length) return res.status(404).json({ success: false, error: "Task not found" });

    const t = result.rows[0];
    return res.json({
      success: true,
      data: {
        id: t.id,
        userId: t.user_id,
        title: t.title,
        description: t.description,
        dueDate: t.due_date ? new Date(t.due_date).toISOString() : null,
        priority: t.priority,
        status: t.status,
        category: t.category,
        subtasks: t.subtasks || [],
        tags: t.tags || [],
        orderIndex: t.order_index,
        createdAt: new Date(t.created_at).toISOString(),
        updatedAt: new Date(t.updated_at).toISOString(),
      },
    });
  } catch {
    return res.status(500).json({ success: false, error: "Failed to get task" });
  }
}

export async function updateTask(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  const id = String(req.params.id);

  try {
    const { title, description, dueDate, priority, status, category, subtasks, tags, orderIndex } = req.body;

    const setClauses = ["updated_at = NOW()"];
    const params = [];
    let paramIdx = 1;

    if (title) {
      setClauses.push(`title = $${paramIdx}`);
      params.push(title);
      paramIdx++;
    }
    if (description !== undefined) {
      setClauses.push(`description = $${paramIdx}`);
      params.push(description);
      paramIdx++;
    }
    if (dueDate !== undefined) {
      setClauses.push(`due_date = $${paramIdx}`);
      params.push(dueDate ? new Date(dueDate) : null);
      paramIdx++;
    }
    if (priority) {
      setClauses.push(`priority = $${paramIdx}`);
      params.push(priority);
      paramIdx++;
    }
    if (status) {
      setClauses.push(`status = $${paramIdx}`);
      params.push(status);
      paramIdx++;
    }
    if (category) {
      setClauses.push(`category = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }
    if (subtasks) {
      setClauses.push(`subtasks = $${paramIdx}`);
      params.push(JSON.stringify(subtasks));
      paramIdx++;
    }
    if (tags) {
      setClauses.push(`tags = $${paramIdx}`);
      params.push(JSON.stringify(tags));
      paramIdx++;
    }
    if (orderIndex !== undefined) {
      setClauses.push(`order_index = $${paramIdx}`);
      params.push(orderIndex);
      paramIdx++;
    }

    params.push(id, req.user.id);

    await pool.query(
      `UPDATE tasks SET ${setClauses.join(", ")} WHERE id = $${paramIdx} AND user_id = $${paramIdx + 1}`,
      params
    );

    const updated = await pool.query("SELECT * FROM tasks WHERE id = $1 LIMIT 1", [id]);
    const t = updated.rows[0];

    return res.json({
      success: true,
      message: "Task updated",
      data: t
        ? {
            id: t.id,
            userId: t.user_id,
            title: t.title,
            description: t.description,
            dueDate: t.due_date ? new Date(t.due_date).toISOString() : null,
            priority: t.priority,
            status: t.status,
            category: t.category,
            subtasks: t.subtasks || [],
            tags: t.tags || [],
            orderIndex: t.order_index,
            createdAt: new Date(t.created_at).toISOString(),
            updatedAt: new Date(t.updated_at).toISOString(),
          }
        : null,
    });
  } catch (error) {
    console.error("updateTask error:", error);
    return res.status(500).json({ success: false, error: "Failed to update task" });
  }
}

export async function deleteTask(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  const id = String(req.params.id);

  try {
    await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    return res.json({ success: true, message: "Task deleted", data: { id } });
  } catch {
    return res.status(500).json({ success: false, error: "Failed to delete task" });
  }
}

export async function toggleTask(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  const id = String(req.params.id);

  try {
    const result = await pool.query(
      "SELECT status FROM tasks WHERE id = $1 AND user_id = $2 LIMIT 1",
      [id, req.user.id]
    );

    if (!result.rows.length) return res.status(404).json({ success: false, error: "Task not found" });

    const newStatus = result.rows[0].status === "completed" ? "pending" : "completed";

    await pool.query(
      "UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2",
      [newStatus, id]
    );

    return res.json({
      success: true,
      message: `Task marked as ${newStatus}`,
      data: { id, status: newStatus },
    });
  } catch {
    return res.status(500).json({ success: false, error: "Failed to toggle task" });
  }
}

export async function updateSubtask(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  const id = String(req.params.id);

  try {
    const result = await pool.query(
      "SELECT subtasks FROM tasks WHERE id = $1 AND user_id = $2 LIMIT 1",
      [id, req.user.id]
    );

    if (!result.rows.length) return res.status(404).json({ success: false, error: "Task not found" });

    const currentSubtasks = result.rows[0].subtasks || [];
    const { action, subtaskId, title } = req.body;

    let updatedSubtasks = [...currentSubtasks];
    if (action === "toggle") {
      updatedSubtasks = currentSubtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
    } else if (action === "add") {
      if (!title || !String(title).trim()) {
        return res.status(400).json({ success: false, error: "Subtask title is required" });
      }
      updatedSubtasks.push({
        id: crypto.randomUUID(),
        title: String(title).trim(),
        completed: false,
      });
    } else if (action === "delete") {
      updatedSubtasks = currentSubtasks.filter((st) => st.id !== subtaskId);
    } else {
      return res.status(400).json({ success: false, error: "Invalid action" });
    }

    await pool.query(
      "UPDATE tasks SET subtasks = $1, updated_at = NOW() WHERE id = $2",
      [JSON.stringify(updatedSubtasks), id]
    );

    return res.json({
      success: true,
      message: "Subtask updated",
      data: { id, subtasks: updatedSubtasks },
    });
  } catch {
    return res.status(500).json({ success: false, error: "Failed to update subtask" });
  }
}

export async function reorderTasks(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ success: false, error: "Items array required" });
  }

  try {
    for (const item of items) {
      if (!item.id) continue;
      const setClauses = ["updated_at = NOW()"];
      const params = [];
      let paramIdx = 1;

      if (typeof item.orderIndex === "number") {
        setClauses.push(`order_index = $${paramIdx}`);
        params.push(item.orderIndex);
        paramIdx++;
      }
      if (item.status) {
        setClauses.push(`status = $${paramIdx}`);
        params.push(item.status);
        paramIdx++;
      }

      params.push(item.id, req.user.id);
      await pool.query(
        `UPDATE tasks SET ${setClauses.join(", ")} WHERE id = $${paramIdx} AND user_id = $${paramIdx + 1}`,
        params
      );
    }
    return res.json({ success: true, message: "Tasks reordered successfully" });
  } catch {
    return res.status(500).json({ success: false, error: "Failed to reorder tasks" });
  }
}

export async function batchTasks(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  const { action, ids } = req.body;

  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ success: false, error: "ids array required" });
  }

  try {
    // Build parameterized IN clause
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
    const userParam = `$${ids.length + 1}`;

    if (action === "delete") {
      await pool.query(
        `DELETE FROM tasks WHERE id IN (${placeholders}) AND user_id = ${userParam}`,
        [...ids, req.user.id]
      );
      return res.json({ success: true, message: `Deleted ${ids.length} tasks` });
    }
    if (action === "complete") {
      await pool.query(
        `UPDATE tasks SET status = 'completed', updated_at = NOW() WHERE id IN (${placeholders}) AND user_id = ${userParam}`,
        [...ids, req.user.id]
      );
      return res.json({ success: true, message: `Completed ${ids.length} tasks` });
    }
    return res.status(400).json({ success: false, error: "Unknown batch action" });
  } catch {
    return res.status(500).json({ success: false, error: "Batch operation failed" });
  }
}

export async function getStats(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

  try {
    const taskResult = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [req.user.id]);
    const activityResult = await pool.query(
      "SELECT * FROM activity_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10",
      [req.user.id]
    );

    const userTasks = taskResult.rows;
    const total = userTasks.length;
    const completed = userTasks.filter((t) => t.status === "completed").length;
    const inProgress = userTasks.filter((t) => t.status === "in_progress").length;
    const pending = userTasks.filter((t) => t.status === "pending").length;

    return res.json({
      success: true,
      data: {
        overview: {
          total,
          completed,
          inProgress,
          pending,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
        recentActivities: activityResult.rows,
      },
    });
  } catch {
    return res.status(500).json({ success: false, error: "Failed to get stats" });
  }
}

export async function exportTasks(req, res) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  const format = req.query.format || "csv";

  try {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [req.user.id]);
    const userTasks = result.rows;

    if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=tasks.json");
      return res.send(JSON.stringify(userTasks, null, 2));
    }

    const rows = userTasks.map(
      (t) => `"${t.id}","${t.title}","${t.status}","${t.priority}","${t.category}"`
    );
    const csv = ["ID,Title,Status,Priority,Category", ...rows].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=tasks.csv");
    return res.send(csv);
  } catch {
    return res.status(500).json({ success: false, error: "Export failed" });
  }
}
