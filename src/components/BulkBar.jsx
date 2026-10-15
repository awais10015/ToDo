export default function BulkBar({ selectedCount, onComplete, onDelete, onClear }) {
  if (selectedCount === 0) return null;
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 dark:border-indigo-900 dark:bg-indigo-950/40"
    >
      <span className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
        {selectedCount} selected
      </span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onComplete}
          className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
        >
          Mark done
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
        >
          Delete
        </button>
        <button type="button" onClick={onClear} className="text-sm text-slate-600 dark:text-slate-400">
          Clear
        </button>
      </div>
    </div>
  );
}
