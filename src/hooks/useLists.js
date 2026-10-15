import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_LIST_ID } from "../utils/taskModel";

const LISTS_KEY = "todo_lists";
const ACTIVE_LIST_KEY = "todo_active_list";

function defaultLists() {
  return [
    { id: DEFAULT_LIST_ID, name: "Personal", createdAt: Date.now() },
    { id: crypto.randomUUID(), name: "Work", createdAt: Date.now() + 1 },
  ];
}

function loadLists() {
  try {
    const raw = localStorage.getItem(LISTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load lists", e);
  }
  return defaultLists();
}

function loadActiveListId() {
  return localStorage.getItem(ACTIVE_LIST_KEY) || DEFAULT_LIST_ID;
}

export function useLists() {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(DEFAULT_LIST_ID);
  const hydrated = useRef(false);
  const skipSave = useRef(true);

  useEffect(() => {
    setLists(loadLists());
    setActiveListId(loadActiveListId());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(ACTIVE_LIST_KEY, activeListId);
  }, [activeListId]);

  const addList = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const list = { id: crypto.randomUUID(), name: trimmed, createdAt: Date.now() };
    setLists((prev) => [...prev, list]);
    setActiveListId(list.id);
    return list.id;
  }, []);

  const renameList = useCallback((id, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLists((prev) => prev.map((l) => (l.id === id ? { ...l, name: trimmed } : l)));
  }, []);

  const deleteList = useCallback((id) => {
    if (id === DEFAULT_LIST_ID) return false;
    setLists((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((l) => l.id !== id);
    });
    setActiveListId((current) => (current === id ? DEFAULT_LIST_ID : current));
    return true;
  }, []);

  const ensureDefaultList = useCallback(() => {
    setLists((prev) => {
      if (prev.some((l) => l.id === DEFAULT_LIST_ID)) return prev;
      return [{ id: DEFAULT_LIST_ID, name: "Personal", createdAt: Date.now() }, ...prev];
    });
  }, []);

  const mergeLists = useCallback((incoming) => {
    if (!Array.isArray(incoming)) return;
    setLists((prev) => {
      const byId = new Map(prev.map((l) => [l.id, l]));
      incoming.forEach((l) => {
        if (l?.id && l?.name) byId.set(l.id, { ...l, name: String(l.name) });
      });
      return [...byId.values()];
    });
  }, []);

  return {
    lists,
    activeListId,
    setActiveListId,
    addList,
    renameList,
    deleteList,
    ensureDefaultList,
    mergeLists,
  };
}
