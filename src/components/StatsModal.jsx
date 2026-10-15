export default function StatsModal({ open, onClose, stats, listName }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 id="stats-title" className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Statistics
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-500">List: {listName}</p>
        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat label="Done this week" value={stats.completedThisWeek} />
          <Stat label="Overdue" value={stats.overdue} />
          <Stat label="All-time done" value={stats.totalCompleted} />
        </dl>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-800">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{value}</dd>
    </div>
  );
}
