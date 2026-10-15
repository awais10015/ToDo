import { useCallback, useEffect, useMemo, useState } from "react";
import BulkBar from "./components/BulkBar";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import HelpModal from "./components/HelpModal";
import ListSidebar from "./components/ListSidebar";
import SortableTaskList from "./components/SortableTaskList";
import StatsModal from "./components/StatsModal";
import TaskFilters from "./components/TaskFilters";
import TaskFooter from "./components/TaskFooter";
import TaskForm from "./components/TaskForm";
import Toast from "./components/Toast";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useLists } from "./hooks/useLists";
import { filterAndSearchTasks, useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";
import { DEFAULT_LIST_ID } from "./utils/taskModel";

const TASK_INPUT_ID = "new-task";
const SEARCH_INPUT_ID = "task-search";

export default function App() {
  const {
    lists,
    activeListId,
    setActiveListId,
    addList,
    renameList,
    deleteList,
    ensureDefaultList,
    mergeLists,
  } = useLists();

  const {
    listTasks,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    deleteTasks,
    bulkComplete,
    clearCompleted,
    reorderTasks,
    reassignTasksToList,
    counts,
    tags,
    undo,
    restoreUndo,
    dismissUndo,
    exportData,
    importData,
    stats,
    tasks,
  } = useTasks(activeListId);

  const { mode, cycleTheme } = useTheme();

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [statsOpen, setStatsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    ensureDefaultList();
  }, [ensureDefaultList]);

  const visibleTasks = useMemo(
    () => filterAndSearchTasks(listTasks, filter, query, tagFilter),
    [listTasks, filter, query, tagFilter]
  );

  const activeList = lists.find((l) => l.id === activeListId) ?? lists[0];

  const taskCountByList = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      map[t.listId] = (map[t.listId] || 0) + 1;
    });
    return map;
  }, [tasks]);

  const showGlobalEmpty = listTasks.length === 0;
  const showFilteredEmpty = !showGlobalEmpty && visibleTasks.length === 0;

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleDeleteList = useCallback(
    (id) => {
      reassignTasksToList(id, DEFAULT_LIST_ID);
      deleteList(id);
    },
    [deleteList, reassignTasksToList]
  );

  const handleExport = useCallback(() => {
    const data = exportData(lists, activeListId);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todo-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportData, lists, activeListId]);

  const handleImport = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          mergeLists(data.lists);
          importData(data, { replace: false });
          if (data.activeListId) setActiveListId(data.activeListId);
        } catch (e) {
          console.error("Import failed", e);
        }
      };
      reader.readAsText(file);
    },
    [importData, mergeLists, setActiveListId]
  );

  useKeyboardShortcuts({
    onFocusNew: () => document.getElementById(TASK_INPUT_ID)?.focus(),
    onFocusSearch: () => document.getElementById(SEARCH_INPUT_ID)?.focus(),
    onShowHelp: () => setHelpOpen(true),
  });

  return (
    <div className="min-h-screen bg-mesh px-4 py-6 sm:px-6 lg:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
        <ListSidebar
          lists={lists}
          activeListId={activeListId}
          onSelect={setActiveListId}
          onAdd={addList}
          onRename={renameList}
          onDelete={handleDeleteList}
          taskCountByList={taskCountByList}
        />

        <main
          className="min-w-0 flex-1 rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none sm:p-8"
        >
          <Header
            activeCount={counts.active}
            completedCount={counts.completed}
            totalCount={counts.total}
            mode={mode}
            onCycleTheme={cycleTheme}
            listName={activeList?.name ?? "Tasks"}
            onOpenStats={() => setStatsOpen(true)}
            onExport={handleExport}
            onImport={handleImport}
          />

          <div className="mt-8 space-y-6">
            <TaskForm onAdd={addTask} inputId={TASK_INPUT_ID} />

            {!showGlobalEmpty && (
              <>
                <TaskFilters
                  filter={filter}
                  onFilterChange={setFilter}
                  query={query}
                  onQueryChange={setQuery}
                  searchInputId={SEARCH_INPUT_ID}
                  tags={tags}
                  tagFilter={tagFilter}
                  onTagFilterChange={setTagFilter}
                  bulkMode={bulkMode}
                  onBulkModeChange={(on) => {
                    setBulkMode(on);
                    if (!on) setSelectedIds(new Set());
                  }}
                />
                <BulkBar
                  selectedCount={selectedIds.size}
                  onComplete={() => {
                    bulkComplete([...selectedIds], true);
                    setSelectedIds(new Set());
                  }}
                  onDelete={() => {
                    deleteTasks([...selectedIds]);
                    setSelectedIds(new Set());
                  }}
                  onClear={() => setSelectedIds(new Set())}
                />
              </>
            )}

            {showGlobalEmpty ? (
              <EmptyState
                inputId={TASK_INPUT_ID}
                onAddSample={(title) => addTask(title)}
              />
            ) : showFilteredEmpty ? (
              <SortableTaskList
                tasks={[]}
                onToggle={toggleTask}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onReorder={reorderTasks}
                bulkMode={bulkMode}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                emptyMessage="No matching tasks."
              />
            ) : (
              <SortableTaskList
                tasks={visibleTasks}
                onToggle={toggleTask}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onReorder={reorderTasks}
                bulkMode={bulkMode}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
            )}

            <TaskFooter
              activeCount={counts.active}
              completedCount={counts.completed}
              onClearCompleted={clearCompleted}
            />
          </div>
        </main>
      </div>

      <Toast
        message={undo?.message}
        actionLabel={undo ? "Undo" : undefined}
        onAction={undo ? restoreUndo : undefined}
        onDismiss={undo ? dismissUndo : undefined}
      />

      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        stats={stats}
        listName={activeList?.name ?? ""}
      />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
