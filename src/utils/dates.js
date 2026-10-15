export function startOfDay(ms) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function dueLabel(dueAt) {
  if (!dueAt) return null;
  const today = startOfDay(Date.now());
  const due = startOfDay(dueAt);
  const diff = (due - today) / (24 * 60 * 60 * 1000);
  if (diff < 0) return { text: "Overdue", tone: "danger" };
  if (diff === 0) return { text: "Today", tone: "warn" };
  if (diff === 1) return { text: "Tomorrow", tone: "neutral" };
  return {
    text: new Date(dueAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    tone: "neutral",
  };
}
