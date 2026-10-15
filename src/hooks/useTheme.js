import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function getSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveDark(mode) {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return getSystemDark();
}

function applyTheme(mode) {
  document.documentElement.classList.toggle("dark", resolveDark(mode));
}

function readInitialMode() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function useTheme() {
  const [mode, setMode] = useState(() => {
    const initial = readInitialMode();
    applyTheme(initial);
    return initial;
  });

  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  const cycleTheme = useCallback(() => {
    setMode((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  }, []);

  const isDark = resolveDark(mode);

  return { mode, isDark, cycleTheme };
}
