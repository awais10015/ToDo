import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_LIST_ID,
  createEmptyTask,
  migrateTasks,
  nextDueDate,
  filterAndSearchTasks,
  allTagsFromTasks,
} from "../utils/taskModel";

const STORAGE_KEY = "tasks";
const UNDO_MS = 5000;

function loadTasksFromStorage(defaultListId) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return migrateTasks(JSON.parse(stored), defaultListId);
  } catch (e) {
    console.error("Failed to load tasks", e);
    return [];
  }
}

export function useTasks(activeListId) {
  const [tasks, setTasks] = useState([]);
  const [undo, setUndo] = useState(null);
  const hydrated = useRef(false);
  const isFirstRender = useRef(true);
  const undoTimer = useRef(null);

  useEffect(() => {
    const loaded = loadTasksFromStorage(DEFAULT_LIST_ID);
    setTasks(loaded);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const listTasks = useMemo(
    () => tasks.filter((t) => t.listId === activeListId),
    [tasks, activeListId]
  );

  const counts = useMemo(() => {
    const active = listTasks.filter((t) => !t.completed).length;
    const completed = listTasks.filter((t) => t.completed).length;
    return { total: listTasks.length, active, completed };
  }, [listTasks]);

  const tags = useMemo(() => allTagsFromTasks(listTasks), [listTasks]);

  const clearUndoTimer = useCallback(() => {
    if (undoTimer.current) {
      clearTimeout(undoTimer.current);
      undoTimer.current = null;
    }
  }, []);

  const scheduleUndo = useCallback(
    (task, message = "Task deleted") => {
      clearUndoTimer();
      setUndo({ task, message });
      undoTimer.current = setTimeout(() => {
        setUndo(null);
        undoTimer.current = null;
      }, UNDO_MS);
    },
    [clearUndoTimer]
  );

  const restoreUndo = useCallback(() => {
    if (!undo?.task) return;
    setTasks((prev) => [...prev, undo.task]);
    clearUndoTimer();
    setUndo(null);
  }, [undo, clearUndoTimer]);

  const dismissUndo = useCallback(() => {
    clearUndoTimer();
    setUndo(null);
  }, [clearUndoTimer]);

  const addTask = useCallback(
    (payload) => {
      const title = typeof payload === "string" ? payload : payload.title;
      const trimmed = title?.trim();
      if (!trimmed) return;

      const extra = typeof payload === "object" ? payload : {};
      const task = createEmptyTask({
        listId: activeListId,
        title: trimmed,
        dueAt: extra.dueAt ?? null,
        priority: extra.priority ?? "medium",
        tags: extra.tags ?? [],
        recurrence: extra.recurrence ?? "none",
        order: Date.now(),
      });
      setTasks((prev) => [...prev, task]);
    },
    [activeListId]
  );

  const toggleTask = useCallback((id) => {
    setTasks((prev) => {
      const next = [];
      let clone = null;
      for (const t of prev) {
        if (t.id !== id) {
          next.push(t);
          continue;
        }
        const completed = !t.completed;
        const updated = {
          ...t,
          completed,
          completedAt: completed ? Date.now() : null,
        };
        next.push(updated);
        if (completed && t.recurrence !== "none") {
          const due = nextDueDate(t.dueAt || Date.now(), t.recurrence);
          clone = createEmptyTask({
            listId: t.listId,
            title: t.title,
            dueAt: due,
            priority: t.priority,
            tags: [...t.tags],
            notes: t.notes,
            recurrence: t.recurrence,
            subtasks: t.subtasks.map((s) => ({ ...s, completed: false })),
            order: Date.now(),
          });
        }
      }
      if (clone) next.push(clone);
      return next;
    });
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev
        .map((t) => {
          if (t.id !== id) return t;
          const next = { ...t, ...updates };
          if (typeof next.title === "string") next.title = next.title.trim();
          return next;
        })
        .filter((t) => t.title.length > 0)
    );
  }, []);

  const deleteTask = useCallback(
    (id, { skipUndo } = {}) => {
      setTasks((prev) => {
        const task = prev.find((t) => t.id === id);
        if (task && !skipUndo) scheduleUndo(task);
        return prev.filter((t) => t.id !== id);
      });
    },
    [scheduleUndo]
  );

  const deleteTasks = useCallback(
    (ids) => {
      const idSet = new Set(ids);
      setTasks((prev) => prev.filter((t) => !idSet.has(t.id)));
    },
    []
  );

  const bulkComplete = useCallback((ids, completed = true) => {
    const idSet = new Set(ids);
    setTasks((prev) =>
      prev.map((t) =>
        idSet.has(t.id)
          ? { ...t, completed, completedAt: completed ? Date.now() : null }
          : t
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => t.listId !== activeListId || !t.completed));
  }, [activeListId]);

  const reorderTasks = useCallback(
    (orderedIds) => {
      const orderMap = new Map(orderedIds.map((id, i) => [id, i]));
      setTasks((prev) =>
        prev.map((t) => {
          if (t.listId !== activeListId) return t;
          const order = orderMap.get(t.id);
          if (order === undefined) return t;
          return { ...t, order };
        })
      );
    },
    [activeListId]
  );

  const deleteTasksForList = useCallback((listId) => {
    setTasks((prev) => prev.filter((t) => t.listId !== listId));
  }, []);

  const reassignTasksToList = useCallback((fromListId, toListId) => {
    setTasks((prev) =>
      prev.map((t) => (t.listId === fromListId ? { ...t, listId: toListId } : t))
    );
  }, []);

  const exportData = useCallback(
    (lists, activeId) => ({
      version: 1,
      exportedAt: Date.now(),
      lists,
      activeListId: activeId,
      tasks,
    }),
    [tasks]
  );

  const importData = useCallback((data, { replace = false } = {}) => {
    if (!data || !Array.isArray(data.tasks)) return false;
    const migrated = migrateTasks(data.tasks, DEFAULT_LIST_ID);
    setTasks(replace ? migrated : (prev) => [...prev, ...migrated]);
    return { lists: data.lists, activeListId: data.activeListId };
  }, []);

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const completedThisWeek = tasks.filter(
      (t) => t.completedAt && t.completedAt >= weekAgo
    ).length;
    const overdue = listTasks.filter(
      (t) => !t.completed && t.dueAt && t.dueAt < Date.now()
    ).length;
    return { completedThisWeek, overdue, totalCompleted: tasks.filter((t) => t.completed).length };
  }, [tasks, listTasks]);

  return {
    tasks,
    listTasks,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    deleteTasks,
    bulkComplete,
    clearCompleted,
    reorderTasks,
    deleteTasksForList,
    reassignTasksToList,
    counts,
    tags,
    undo,
    restoreUndo,
    dismissUndo,
    exportData,
    importData,
    stats,
  };
}

export { filterAndSearchTasks };
