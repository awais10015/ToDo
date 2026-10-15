export const PRIORITIES = ["low", "medium", "high"];
export const RECURRENCES = ["none", "daily", "weekly"];

export const DEFAULT_LIST_ID = "default";

export function createEmptyTask(overrides = {}) {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    listId: DEFAULT_LIST_ID,
    title: "",
    completed: false,
    createdAt: now,
    order: now,
    dueAt: null,
    priority: "medium",
    notes: "",
    tags: [],
    pinned: false,
    completedAt: null,
    subtasks: [],
    recurrence: "none",
    ...overrides,
  };
}

function normalizeSubtask(st) {
  if (!st || typeof st.title !== "string") return null;
  return {
    id: st.id ? String(st.id) : crypto.randomUUID(),
    title: st.title.trim(),
    completed: Boolean(st.completed),
  };
}

export function normalizeTask(item, index, defaultListId = DEFAULT_LIST_ID) {
  if (!item) return null;

  let base = null;
  if (typeof item.title === "string" && item.id) {
    base = { ...item };
  } else if (typeof item.task === "string") {
    base = {
      id: item.id ? String(item.id) : crypto.randomUUID(),
      title: item.task,
      completed: false,
      createdAt: item.createdAt ?? Date.now() + index,
    };
  }
  if (!base) return null;

  const title = String(base.title).trim();
  if (!title) return null;

  const subtasks = (Array.isArray(base.subtasks) ? base.subtasks : [])
    .map(normalizeSubtask)
    .filter(Boolean);

  return {
    id: String(base.id),
    listId: base.listId || defaultListId,
    title,
    completed: Boolean(base.completed),
    createdAt: typeof base.createdAt === "number" ? base.createdAt : Date.now() + index,
    order: typeof base.order === "number" ? base.order : Date.now() + index,
    dueAt: base.dueAt ?? null,
    priority: PRIORITIES.includes(base.priority) ? base.priority : "medium",
    notes: typeof base.notes === "string" ? base.notes : "",
    tags: Array.isArray(base.tags)
      ? base.tags.map((t) => String(t).trim()).filter(Boolean)
      : [],
    pinned: Boolean(base.pinned),
    completedAt: base.completedAt ?? null,
    subtasks,
    recurrence: RECURRENCES.includes(base.recurrence) ? base.recurrence : "none",
  };
}

export function migrateTasks(raw, defaultListId = DEFAULT_LIST_ID) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, index) => normalizeTask(item, index, defaultListId))
    .filter(Boolean);
}

export function nextDueDate(fromMs, recurrence) {
  const d = new Date(fromMs || Date.now());
  if (recurrence === "daily") {
    d.setDate(d.getDate() + 1);
  } else if (recurrence === "weekly") {
    d.setDate(d.getDate() + 7);
  } else {
    return null;
  }
  return d.getTime();
}

export function priorityWeight(p) {
  if (p === "high") return 3;
  if (p === "low") return 1;
  return 2;
}

export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    const pa = priorityWeight(a.priority);
    const pb = priorityWeight(b.priority);
    if (pa !== pb) return pb - pa;
    if (a.order !== b.order) return a.order - b.order;
    return a.createdAt - b.createdAt;
  });
}

export function filterAndSearchTasks(tasks, filter, query, tagFilter) {
  const q = query.trim().toLowerCase();
  const tag = tagFilter?.trim().toLowerCase();

  const filtered = tasks.filter((t) => {
    if (filter === "active" && t.completed) return false;
    if (filter === "completed" && !t.completed) return false;
    if (tag && !t.tags.some((x) => x.toLowerCase() === tag)) return false;
    if (q) {
      const inTitle = t.title.toLowerCase().includes(q);
      const inNotes = t.notes.toLowerCase().includes(q);
      const inTags = t.tags.some((x) => x.toLowerCase().includes(q));
      if (!inTitle && !inNotes && !inTags) return false;
    }
    return true;
  });

  return sortTasks(filtered);
}

export function allTagsFromTasks(tasks) {
  const set = new Set();
  tasks.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
  return [...set].sort((a, b) => a.localeCompare(b));
}
