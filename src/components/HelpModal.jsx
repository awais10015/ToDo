export default function HelpModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Keyboard shortcuts</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li><kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">n</kbd> — focus new task</li>
          <li><kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">/</kbd> — focus search</li>
          <li><kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">?</kbd> — this help</li>
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
