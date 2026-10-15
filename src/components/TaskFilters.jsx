const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Done" },
];

export default function TaskFilters({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  searchInputId = "task-search",
  tags = [],
  tagFilter,
  onTagFilterChange,
  bulkMode,
  onBulkModeChange,
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-600 dark:bg-slate-800"
          role="group"
          aria-label="Filter tasks"
        >
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === value
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
              aria-pressed={filter === value}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block min-w-0 flex-1 sm:max-w-xs">
            <span className="sr-only">Search tasks</span>
            <input
              id={searchInputId}
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </label>
          <button
            type="button"
            onClick={() => onBulkModeChange?.(!bulkMode)}
            className={`rounded-xl border px-3 py-2 text-sm ${
              bulkMode
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50"
                : "border-slate-200 text-slate-600 dark:border-slate-600"
            }`}
          >
            Select
          </button>
        </div>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onTagFilterChange("")}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              !tagFilter ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
            }`}
          >
            All tags
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagFilterChange(tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                tagFilter === tag
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
