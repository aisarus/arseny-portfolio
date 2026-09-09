import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "ap-visual-effects";

type EffectsContextValue = {
  /** true when the animated broadcast layer is running */
  enabled: boolean;
  toggle: () => void;
};

const EffectsContext = createContext<EffectsContextValue>({ enabled: true, toggle: () => {} });

export function EffectsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    let initial = true;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "on" || stored === "off") {
        initial = stored === "on";
      } else {
        initial = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
    } catch {
      initial = true;
    }
    setEnabled(initial);
  }, []);

  useEffect(() => {
    document.documentElement.dataset["fx"] = enabled ? "on" : "off";
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((value) => {
      const next = !value;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        /* storage unavailable — keep the in-memory choice */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);
  return <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>;
}

export function useEffectsEnabled() {
  return useContext(EffectsContext);
}

/** true when every animated/decorative layer must render as a stable, static state. */
export function useStaticMode() {
  const { enabled } = useEffectsEnabled();
  return !enabled;
}

export function EffectsToggle() {
  const { enabled, toggle } = useEffectsEnabled();
  return (
    <div className="fx-control">
      <span aria-hidden className="fx-note">
        <span className="fx-note-long">Visual effects · motion / glitch</span>
        <span className="fx-note-short">Motion / glitch</span>
      </span>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? "Disable visual effects" : "Enable visual effects"}
        className="fx-button"
      >
        <i aria-hidden data-on={enabled} />
        FX {enabled ? "On" : "Off"}
      </button>
    </div>
  );
}
