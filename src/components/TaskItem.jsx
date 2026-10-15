import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { dueLabel } from "../utils/dates";
import { PRIORITIES, RECURRENCES } from "../utils/taskModel";

const priorityDot = {
  low: "bg-slate-400",
  medium: "bg-amber-400",
  high: "bg-red-500",
};

export default function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
  bulkMode,
  selected,
  onSelect,
}) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const inputRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: editing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  useEffect(() => {
    if (!editing) setDraft(task.title);
  }, [task.title, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function saveEdit() {
    const trimmed = draft.trim();
    if (!trimmed) onDelete(task.id);
    else if (trimmed !== task.title) onUpdate(task.id, { title: trimmed });
    setEditing(false);
  }

  const due = dueLabel(task.dueAt);

  if (editing) {
    return (
      <li
        ref={setNodeRef}
        style={style}
        className="rounded-xl border border-indigo-200 bg-indigo-50/50 px-4 py-3 dark:border-indigo-800 dark:bg-indigo-950/30"
      >
        <form
          className="flex min-w-0 flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            saveEdit();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            aria-label="Edit task title"
          />
          <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white">
            Save
          </button>
        </form>
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="group rounded-xl border border-slate-200/80 bg-white shadow-sm transition hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-start gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        {bulkMode ? (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect?.(task.id)}
            className="mt-1 h-5 w-5 shrink-0"
            aria-label={`Select ${task.title}`}
          />
        ) : (
          <button
            type="button"
            className="mt-1 cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing"
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
        )}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-indigo-600"
          aria-label={`Mark "${task.title}" complete`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-sm sm:text-base ${
                task.completed
                  ? "text-slate-400 line-through"
                  : "text-slate-800 dark:text-slate-100"
              }`}
            >
              {task.title}
            </span>
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${priorityDot[task.priority]}`}
              title={`Priority: ${task.priority}`}
            />
            {task.pinned && (
              <span className="text-xs text-amber-500" title="Pinned">★</span>
            )}
            {due && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  due.tone === "danger"
                    ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                    : due.tone === "warn"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                }`}
              >
                {due.text}
              </span>
            )}
            {task.recurrence !== "none" && (
              <span className="text-xs text-indigo-500">↻ {task.recurrence}</span>
            )}
          </div>
          {task.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
          <IconButton label="Pin" onClick={() => onUpdate(task.id, { pinned: !task.pinned })}>
            ★
          </IconButton>
          <IconButton label="Edit" onClick={() => setEditing(true)}>✎</IconButton>
          <IconButton label="Details" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "▲" : "▼"}
          </IconButton>
          <IconButton label="Delete" onClick={() => onDelete(task.id)} danger>
            ×
          </IconButton>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-500">Notes</label>
          <textarea
            value={task.notes}
            onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            placeholder="Add notes…"
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <label className="text-xs text-slate-500">
              Due
              <input
                type="date"
                value={task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 10) : ""}
                onChange={(e) =>
                  onUpdate(task.id, {
                    dueAt: e.target.value ? new Date(e.target.value).getTime() : null,
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
            <label className="text-xs text-slate-500">
              Priority
              <select
                value={task.priority}
                onChange={(e) => onUpdate(task.id, { priority: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-slate-500">
              Repeat
              <select
                value={task.recurrence}
                onChange={(e) => onUpdate(task.id, { recurrence: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                {RECURRENCES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
          </div>
          <Subtasks task={task} onUpdate={onUpdate} />
        </div>
      )}
    </li>
  );
}

function IconButton({ children, label, onClick, danger }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`rounded-lg px-2 py-1 text-sm ${
        danger
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
          : "text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

function Subtasks({ task, onUpdate }) {
  const [draft, setDraft] = useState("");

  function addSubtask(e) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    onUpdate(task.id, {
      subtasks: [
        ...task.subtasks,
        { id: crypto.randomUUID(), title, completed: false },
      ],
    });
    setDraft("");
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-slate-500">Subtasks</p>
      <ul className="mt-2 space-y-1">
        {task.subtasks.map((st) => (
          <li key={st.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={st.completed}
              onChange={() =>
                onUpdate(task.id, {
                  subtasks: task.subtasks.map((s) =>
                    s.id === st.id ? { ...s, completed: !s.completed } : s
                  ),
                })
              }
            />
            <span className={st.completed ? "line-through text-slate-400" : ""}>{st.title}</span>
            <button
              type="button"
              className="text-xs text-red-500"
              onClick={() =>
                onUpdate(task.id, {
                  subtasks: task.subtasks.filter((s) => s.id !== st.id),
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={addSubtask} className="mt-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add subtask…"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
        <button type="submit" className="text-sm text-indigo-600">Add</button>
      </form>
    </div>
  );
}
