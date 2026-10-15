export default function TaskFooter({ activeCount, completedCount, onClearCompleted }) {
  if (activeCount === 0 && completedCount === 0) return null;

  return (
    <footer
      className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:flex-row dark:border-slate-700 dark:text-slate-400"
    >
      <span>
        {activeCount} item{activeCount === 1 ? "" : "s"} left
      </span>
      {completedCount > 0 && (
        <button
          type="button"
          onClick={onClearCompleted}
          className="font-medium text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
        >
          Clear completed ({completedCount})
        </button>
      )}
    </footer>
  );
}
