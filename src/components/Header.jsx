import ProgressRing from "./ProgressRing";
import ImportExportMenu from "./ImportExportMenu";

const themeLabels = { light: "Light", dark: "Dark", system: "System" };

export default function Header({
  activeCount,
  completedCount,
  totalCount,
  mode,
  onCycleTheme,
  listName,
  onOpenStats,
  onExport,
  onImport,
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <ProgressRing completed={completedCount} total={totalCount} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {listName}
            </p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Tasks
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {activeCount === 0
                ? "You're all caught up."
                : `${activeCount} item${activeCount === 1 ? "" : "s"} left`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenStats}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Stats
          </button>
          <ImportExportMenu onExport={onExport} onImport={onImport} />
          <button
            type="button"
            onClick={onCycleTheme}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
            aria-label="Cycle theme"
          >
            {themeLabels[mode] || "Theme"}
          </button>
        </div>
      </div>
    </header>
  );
}
