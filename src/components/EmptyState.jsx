import sleepImage from "../assets/sleep.webp";

const SAMPLES = ["Plan the week", "Buy groceries", "Call mom"];

export default function EmptyState({ inputId = "new-task", onAddSample }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <img src={sleepImage} alt="" className="mb-4 h-28 w-auto opacity-90" />
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">No tasks yet</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Add a task above or try a quick example.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {SAMPLES.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => onAddSample?.(sample)}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-600 dark:text-slate-300"
          >
            {sample}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => document.getElementById(inputId)?.focus()}
        className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400"
      >
        Focus input
      </button>
    </div>
  );
}
