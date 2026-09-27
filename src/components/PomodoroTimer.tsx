"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Phase = "focus" | "break";

const PRESETS = { focus: 25 * 60, break: 5 * 60 };
const STORAGE_KEY = "pomodoro_state";

type SavedState = {
  phase: Phase;
  seconds: number;
  sessions: number;
  savedAt: number; // timestamp when we saved
  wasRunning: boolean;
};

function loadState(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch { return null; }
}

function saveState(state: SavedState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
}

export default function PomodoroTimer() {
  // Restore from localStorage on mount
  const saved = loadState();

  // If it was running when we left, compute elapsed time
  const getRestoredSeconds = (s: SavedState): number => {
    if (!s.wasRunning) return s.seconds;
    const elapsed = Math.floor((Date.now() - s.savedAt) / 1000);
    const remaining = s.seconds - elapsed;
    return remaining > 0 ? remaining : 0;
  };

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>(saved?.phase ?? "focus");
  const [seconds, setSeconds] = useState<number>(
    saved ? getRestoredSeconds(saved) : PRESETS.focus
  );
  const [running, setRunning] = useState(
    // auto-resume if it was running and time remains
    saved ? (saved.wasRunning && getRestoredSeconds(saved) > 0) : false
  );
  const [sessions, setSessions] = useState(saved?.sessions ?? 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist state whenever something changes
  useEffect(() => {
    saveState({ phase, seconds, sessions, savedAt: Date.now(), wasRunning: running });
  }, [phase, seconds, sessions, running]);

  // Save on page unload/visibility change
  useEffect(() => {
    function persist() {
      saveState({ phase, seconds, sessions, savedAt: Date.now(), wasRunning: running });
    }
    window.addEventListener("beforeunload", persist);
    document.addEventListener("visibilitychange", persist);
    return () => {
      window.removeEventListener("beforeunload", persist);
      document.removeEventListener("visibilitychange", persist);
    };
  }, [phase, seconds, sessions, running]);

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.2);
    } catch { /* audio blocked */ }
  }, []);

  const switchPhase = useCallback(() => {
    playBeep();
    setPhase(p => {
      const next: Phase = p === "focus" ? "break" : "focus";
      setSeconds(PRESETS[next]);
      return next;
    });
    if (phase === "focus") setSessions(s => s + 1);
    setRunning(false);
  }, [phase, playBeep]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { switchPhase(); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, switchPhase]);

  // Space to toggle
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault(); setRunning(r => !r);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function reset() { setRunning(false); setSeconds(PRESETS[phase]); }
  function skip() { switchPhase(); }

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const progress = 1 - seconds / PRESETS[phase];
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - progress);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Focus Timer (Pomodoro)"
        style={{
          position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 100,
          width: 52, height: 52, borderRadius: "50%",
          background: open ? "var(--primary)" : "var(--sidebar-bg)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          transition: "background 0.2s, transform 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"}
      >
        {/* Show pulsing ring when running */}
        {running && (
          <span style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            border: "2px solid var(--primary)",
            animation: "pulse 1.8s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </button>

      {/* Timer panel */}
      {open && (
        <div className="animate-scale-in" style={{
          position: "fixed", bottom: "5.5rem", right: "1.5rem", zIndex: 100,
          width: 284, background: "#0f0e14",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          padding: "1.5rem", color: "white",
        }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Focus Timer
            </span>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
              {sessions} session{sessions !== 1 ? "s" : ""} today
            </span>
          </div>

          {/* Phase toggle */}
          <div style={{ display: "flex", borderRadius: 10, background: "rgba(255,255,255,0.06)", padding: 3, marginBottom: "1.5rem" }}>
            {(["focus", "break"] as Phase[]).map(p => (
              <button key={p} onClick={() => { setPhase(p); setSeconds(PRESETS[p]); setRunning(false); }}
                style={{
                  flex: 1, padding: "0.4rem", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: "0.8125rem", fontWeight: 600,
                  background: phase === p ? (p === "focus" ? "var(--primary)" : "#10b981") : "transparent",
                  color: phase === p ? "white" : "rgba(255,255,255,0.4)",
                  transition: "all 0.2s",
                }}
              >
                {p === "focus" ? "🎯 Focus" : "☕ Break"}
              </button>
            ))}
          </div>

          {/* Circular timer */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div style={{ position: "relative", width: 120, height: 120 }}>
              <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7"/>
                <circle cx="60" cy="60" r="52" fill="none"
                  stroke={phase === "focus" ? "var(--primary)" : "#10b981"}
                  strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: running ? "stroke-dashoffset 0.9s linear" : "none" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {mins}:{secs}
                </span>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {phase}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1.25rem" }}>
            <CtrlBtn onClick={reset} title="Reset">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>
            </CtrlBtn>

            <button onClick={() => setRunning(r => !r)} style={{
              width: 52, height: 52, borderRadius: "50%",
              background: running ? "rgba(255,255,255,0.12)" : "var(--primary)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", transition: "background 0.2s",
            }}>
              {running
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              }
            </button>

            <CtrlBtn onClick={skip} title="Skip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
            </CtrlBtn>
          </div>

          {/* Session dots + persistence note */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "0.375rem" }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < (sessions % 4) ? (phase === "break" ? "#10b981" : "var(--primary)") : "rgba(255,255,255,0.1)" }} />
              ))}
            </div>
            <span style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.28)" }}>
              auto-saved · Space
            </span>
          </div>
        </div>
      )}
    </>
  );
}

function CtrlBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.55)", transition: "background 0.15s" }}
      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.14)"}
      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"}
    >
      {children}
    </button>
  );
}
