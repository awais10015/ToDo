export default function Toast({ message, actionLabel, onAction, onDismiss }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-600 dark:bg-slate-800"
      role="status"
    >
      <span className="text-sm text-slate-700 dark:text-slate-200">{message}</span>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          {actionLabel}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
