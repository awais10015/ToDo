import { useEffect } from "react";

export function useKeyboardShortcuts({ onFocusNew, onFocusSearch, onShowHelp }) {
  useEffect(() => {
    function handleKey(e) {
      const tag = e.target.tagName;
      const editing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if (e.key === "?" && !editing) {
        e.preventDefault();
        onShowHelp?.();
        return;
      }
      if (editing) return;

      if (e.key === "n") {
        e.preventDefault();
        onFocusNew?.();
      }
      if (e.key === "/") {
        e.preventDefault();
        onFocusSearch?.();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onFocusNew, onFocusSearch, onShowHelp]);
}
