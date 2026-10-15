import { useState } from "react";

export default function ListSidebar({
  lists,
  activeListId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  taskCountByList,
}) {
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  function submitNew(e) {
    e.preventDefault();
    onAdd(draft);
    setDraft("");
  }

  return (
    <aside
      className="w-full shrink-0 rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 lg:w-56"
      aria-label="Task lists"
    >
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Lists
      </h2>
      <ul className="space-y-1">
        {lists.map((list) => {
          const active = list.id === activeListId;
          const count = taskCountByList?.[list.id] ?? 0;
          if (editingId === list.id) {
            return (
              <li key={list.id}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onRename(list.id, editName);
                    setEditingId(null);
                  }}
                >
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                    autoFocus
                  />
                </form>
              </li>
            );
          }
          return (
            <li key={list.id} className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelect(list.id)}
                className={`flex min-w-0 flex-1 items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-indigo-600 font-medium text-white"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <span className="truncate">{list.name}</span>
                <span className={`text-xs ${active ? "text-indigo-100" : "text-slate-400"}`}>
                  {count}
                </span>
              </button>
              <button
                type="button"
                title="Rename list"
                onClick={() => {
                  setEditingId(list.id);
                  setEditName(list.name);
                }}
                className="rounded p-1 text-xs text-slate-400 opacity-0 hover:text-indigo-600 group-hover:opacity-100"
              >
                ✎
              </button>
              {list.id !== "default" && (
                <button
                  type="button"
                  title="Delete list"
                  onClick={() => onDelete(list.id)}
                  className="rounded p-1 text-xs text-slate-400 opacity-0 hover:text-red-500 group-hover:opacity-100"
                >
                  ×
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <form onSubmit={submitNew} className="mt-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="New list…"
          className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
      </form>
    </aside>
  );
}
