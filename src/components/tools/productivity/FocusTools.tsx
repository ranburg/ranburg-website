"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Plus, RotateCcw, SkipForward, Trash2, Trophy } from "lucide-react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import CopyButton from "@/components/ui/CopyButton";
import { KPIStrip } from "@/components/tools/viz";
import { FieldLabel, Panel, Segmented, ToolNote, ToolStack, ghostButton, solidButton } from "@/components/tools/kit";
import {
  cgpaToPercentage,
  formatClock,
  formatUtcOffset,
  nextPomodoroPhase,
  percentageToCgpa,
  timeZoneOffsetMs,
  typingStats,
  zonedTimeToUtc,
  type CgpaMethod,
  type PomodoroPhase,
} from "@/lib/plannerMath";

/* ------------------------------------------------------------------ */
/* Pomodoro timer                                                      */
/* ------------------------------------------------------------------ */

const PHASES: { value: PomodoroPhase; label: string }[] = [
  { value: "focus", label: "Focus" },
  { value: "short-break", label: "Short break" },
  { value: "long-break", label: "Long break" },
];

const PHASE_LABEL: Record<PomodoroPhase, string> = {
  focus: "Focus",
  "short-break": "Short break",
  "long-break": "Long break",
};

const PHASE_HINT: Record<PomodoroPhase, string> = {
  focus: "One task. Nothing else until the bell.",
  "short-break": "Stand up, look away from the screen.",
  "long-break": "Take a proper rest — walk, stretch, eat.",
};

function playChime() {
  try {
    const Ctx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [660, 880, 990].forEach((frequency, i) => {
      const start = ctx.currentTime + i * 0.2;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.5);
    });
    window.setTimeout(() => void ctx.close(), 1600);
  } catch {
    /* audio unavailable — the visual change is enough */
  }
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-theme-subtle bg-theme-surface px-4 py-3 text-start text-sm text-theme-body transition-colors duration-200 hover:border-accent/50"
    >
      <span>{label}</span>
      <span
        aria-hidden
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-accent" : "bg-[var(--range-track)]"}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${checked ? "start-6" : "start-1"}`}
        />
      </span>
    </button>
  );
}

export function PomodoroTool() {
  const [minutes, setMinutes] = useState<Record<PomodoroPhase, number>>({ focus: 25, "short-break": 5, "long-break": 15 });
  const [longBreakEvery, setLongBreakEvery] = useState(4);
  const [autoStart, setAutoStart] = useState(true);
  const [sound, setSound] = useState(true);
  const [phase, setPhase] = useState<PomodoroPhase>("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const endAt = useRef<number | null>(null);
  const baseTitle = useRef<string | null>(null);

  // Wall-clock based so the countdown stays right when the tab is in the background.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const end = endAt.current;
      if (end === null) return;
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      if (left > 0) {
        setRemaining(left);
        return;
      }
      const sessionsDone = phase === "focus" ? sessions + 1 : sessions;
      const next = nextPomodoroPhase(phase, sessionsDone, longBreakEvery);
      const nextSeconds = minutes[next] * 60;
      if (sound) playChime();
      setSessions(sessionsDone);
      setPhase(next);
      setRemaining(nextSeconds);
      if (autoStart) {
        endAt.current = Date.now() + nextSeconds * 1000;
      } else {
        endAt.current = null;
        setRunning(false);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running, phase, sessions, longBreakEvery, minutes, sound, autoStart]);

  // Show the countdown in the tab title while the timer runs.
  useEffect(() => {
    if (baseTitle.current === null) baseTitle.current = document.title;
    document.title = running ? `${formatClock(remaining)} · ${PHASE_LABEL[phase]}` : baseTitle.current;
  }, [running, remaining, phase]);
  useEffect(
    () => () => {
      if (baseTitle.current !== null) document.title = baseTitle.current;
    },
    []
  );

  const stop = () => {
    endAt.current = null;
    setRunning(false);
  };

  const toggle = () => {
    if (running) {
      if (endAt.current !== null) setRemaining(Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000)));
      stop();
    } else {
      endAt.current = Date.now() + remaining * 1000;
      setRunning(true);
    }
  };

  const goTo = (next: PomodoroPhase) => {
    stop();
    setPhase(next);
    setRemaining(minutes[next] * 60);
  };

  const setLength = (key: PomodoroPhase, value: number) => {
    setMinutes((m) => ({ ...m, [key]: value }));
    if (key === phase && !running) setRemaining(value * 60);
  };

  const total = Math.max(1, minutes[phase] * 60);
  const progress = Math.min(1, Math.max(0, 1 - remaining / total));
  const radius = 132;
  const circumference = 2 * Math.PI * radius;
  const untilLong = longBreakEvery - (sessions % longBreakEvery);

  return (
    <ToolStack>
      <div className="flex justify-center">
        <Segmented label="Timer phase" value={phase} onChange={goTo} options={PHASES} />
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative h-72 w-72 sm:h-80 sm:w-80">
          <svg viewBox="0 0 300 300" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="150" cy="150" r={radius} fill="none" stroke="var(--range-track)" strokeWidth="10" />
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke={phase === "focus" ? "var(--accent)" : "var(--accent-emerald)"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: "stroke-dashoffset 400ms linear, stroke 300ms ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="eyebrow">{PHASE_LABEL[phase]}</p>
            <p
              role="timer"
              aria-live="off"
              aria-label={`${PHASE_LABEL[phase]} time remaining`}
              className="mt-2 font-mono text-6xl font-light tabular-nums tracking-tight text-theme-heading sm:text-7xl"
            >
              {formatClock(remaining)}
            </p>
            <p className="mt-3 max-w-[13rem] text-xs leading-relaxed text-theme-subtle">{PHASE_HINT[phase]}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" className={`${solidButton} min-w-[8.5rem] !px-6 !py-3`} onClick={toggle}>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : remaining < total ? "Resume" : "Start"}
          </button>
          <button type="button" className={ghostButton} onClick={() => goTo(phase)}>
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            type="button"
            className={ghostButton}
            onClick={() => goTo(nextPomodoroPhase(phase, sessions, longBreakEvery))}
          >
            <SkipForward className="h-4 w-4" /> Skip
          </button>
        </div>
      </div>

      <KPIStrip
        items={[
          { label: "Focus sessions done", value: String(sessions), highlight: true },
          { label: "Focused time", value: `${sessions * minutes.focus} min` },
          { label: "Until long break", value: `${untilLong} session${untilLong === 1 ? "" : "s"}` },
        ]}
      />

      <Panel
        title="Timer settings"
        action={
          sessions > 0 ? (
            <button type="button" className={ghostButton} onClick={() => setSessions(0)}>
              Clear count
            </button>
          ) : undefined
        }
      >
        <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          <CalculatorSlider label="Focus length" value={minutes.focus} min={5} max={90} step={5} unit=" min" onChange={(v) => setLength("focus", v)} />
          <CalculatorSlider label="Short break" value={minutes["short-break"]} min={1} max={30} step={1} unit=" min" onChange={(v) => setLength("short-break", v)} />
          <CalculatorSlider label="Long break" value={minutes["long-break"]} min={5} max={60} step={5} unit=" min" onChange={(v) => setLength("long-break", v)} />
          <CalculatorSlider label="Long break after" value={longBreakEvery} min={2} max={8} step={1} unit=" sessions" onChange={setLongBreakEvery} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Toggle label="Start the next phase automatically" checked={autoStart} onChange={setAutoStart} />
          <Toggle label="Play a chime when a phase ends" checked={sound} onChange={setSound} />
        </div>
      </Panel>
      <ToolNote>
        The countdown also shows in the browser tab title, so you can keep an eye on it from another window. Keep this tab open —
        the session count resets when the page is closed.
      </ToolNote>
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */
/* Typing speed test                                                   */
/* ------------------------------------------------------------------ */

const SENTENCES = [
  "The quickest way to finish a hard task is to start it before you feel ready.",
  "Small habits repeated every day shape a year far more than any single big decision.",
  "A clear plan written on paper beats a perfect plan that only lives in your head.",
  "Good writing is mostly rewriting, and good typing makes rewriting feel light.",
  "Markets rise and fall, but patient investors measure progress in years, not days.",
  "Save a little from every pay cheque and let time do the heavy lifting for you.",
  "A tidy desk does not do the work, yet it removes one more excuse for delay.",
  "Read the error message slowly; it usually tells you exactly what went wrong.",
  "Clean code is written for the next person who has to read it, often yourself.",
  "Take a short walk when you are stuck, because answers often arrive on the way back.",
  "Accuracy comes first; speed is what accuracy turns into after enough practice.",
  "Keep your wrists level, your shoulders loose, and your eyes on the screen.",
  "Ask a simple question early instead of solving the wrong problem beautifully.",
  "Every large project is only a long list of small steps taken in the right order.",
  "Rest is part of the work, not a reward you earn only when everything is done.",
  "Numbers tell a story, but someone still has to decide what the story means.",
  "Measure twice, cut once, and keep a backup of anything you cannot rebuild.",
  "The best time to learn touch typing was years ago; the second best time is today.",
  "Simple tools that load fast and respect your time are worth coming back to.",
  "Finish the draft first, then make it better, and only then make it shorter.",
];

const DURATIONS = [
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
  { value: 120, label: "2 min" },
] as const;

const BEST_KEY = "ranburg:typing-best";
const PAGE_CHARS = 210;

function buildTypingText(seed: number): string {
  const n = SENTENCES.length;
  const start = (seed * 7) % n;
  const stride = [1, 3, 7, 9, 11, 13][seed % 6];
  const picked: string[] = [];
  // Long enough that even a very fast typist cannot run out within two minutes.
  for (let i = 0; i < n * 2; i++) picked.push(SENTENCES[(start + i * stride) % n]);
  return picked.join(" ");
}

/** Split the passage into screens that break on a space, so words never wrap across screens. */
function paginate(text: string): { start: number; end: number }[] {
  const pages: { start: number; end: number }[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(text.length, start + PAGE_CHARS);
    if (end < text.length) {
      const space = text.lastIndexOf(" ", end);
      if (space > start) end = space + 1;
    }
    pages.push({ start, end });
    start = end;
  }
  return pages;
}

function readBest(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(BEST_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as Record<string, number>) : {};
  } catch {
    return {};
  }
}

type TypingStatus = "idle" | "running" | "done";

export function TypingSpeedTool() {
  const [duration, setDuration] = useState<number>(60);
  const [seed, setSeed] = useState(0);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<TypingStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [best, setBest] = useState<Record<string, number>>(readBest);
  const [isNewBest, setIsNewBest] = useState(false);
  const [focused, setFocused] = useState(false);
  const startedAt = useRef<number | null>(null);
  const typedRef = useRef("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const target = useMemo(() => buildTypingText(seed), [seed]);
  const pages = useMemo(() => paginate(target), [target]);

  useEffect(() => {
    if (status !== "running") return;
    const limit = duration * 1000;
    const id = window.setInterval(() => {
      if (startedAt.current === null) return;
      const elapsed = Date.now() - startedAt.current;
      if (elapsed < limit) {
        setElapsedMs(elapsed);
        return;
      }
      window.clearInterval(id);
      setElapsedMs(limit);
      setStatus("done");
      const final = typingStats(typedRef.current, target, limit);
      const net = Math.round(final.netWpm);
      if (net > (best[String(duration)] ?? 0)) {
        const next = { ...best, [String(duration)]: net };
        setBest(next);
        setIsNewBest(true);
        try {
          window.localStorage.setItem(BEST_KEY, JSON.stringify(next));
        } catch {
          /* storage unavailable — keep the score for this visit only */
        }
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [status, duration, target, best]);

  const reset = (nextSeed = seed) => {
    startedAt.current = null;
    typedRef.current = "";
    setTyped("");
    setElapsedMs(0);
    setStatus("idle");
    setIsNewBest(false);
    setSeed(nextSeed);
    inputRef.current?.focus();
  };

  const onType = (value: string) => {
    if (status === "done") return;
    const next = value.replace(/\n/g, " ").slice(0, target.length);
    if (status === "idle" && next.length > 0) {
      startedAt.current = Date.now();
      setStatus("running");
    }
    typedRef.current = next;
    setTyped(next);
  };

  const stats = typingStats(typed, target, status === "done" ? duration * 1000 : elapsedMs);
  const settled = status === "done" || elapsedMs >= 2000;
  const secondsLeft = Math.max(0, Math.ceil((duration * 1000 - elapsedMs) / 1000));
  const page = pages.find((p) => typed.length < p.end) ?? pages[pages.length - 1];
  const bestForDuration = best[String(duration)];

  return (
    <ToolStack>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Segmented
          label="Test length"
          value={duration}
          onChange={(v) => {
            setDuration(v);
            reset();
          }}
          options={DURATIONS}
        />
        <p className="flex items-center gap-2 text-sm text-theme-muted">
          <Trophy className="h-4 w-4 text-accent" aria-hidden />
          Personal best: <span className="font-medium text-theme-heading">{bestForDuration ? `${bestForDuration} WPM` : "—"}</span>
        </p>
      </div>

      <KPIStrip
        items={[
          { label: "Net WPM", value: settled ? String(Math.round(stats.netWpm)) : "—", highlight: true },
          { label: "Accuracy", value: typed.length ? `${stats.accuracy.toFixed(1)}%` : "—" },
          { label: "Mistakes", value: String(stats.errors) },
          { label: status === "done" ? "Time" : "Time left", value: status === "done" ? `${duration}s` : `${secondsLeft}s` },
        ]}
      />

      <div
        className={`relative rounded-2xl border bg-theme-surface/40 p-5 transition-colors duration-200 sm:p-7 ${
          focused && status !== "done" ? "border-accent/60" : "border-theme-subtle"
        }`}
      >
        <p
          aria-hidden
          className={`select-none font-mono text-lg leading-[2.1] tracking-wide sm:text-xl ${status === "done" ? "opacity-50" : ""}`}
        >
          {Array.from(target.slice(page.start, page.end)).map((char, offset) => {
            const i = page.start + offset;
            const isTyped = i < typed.length;
            const correct = isTyped && typed[i] === char;
            const isCaret = i === typed.length && status !== "done";
            return (
              <span
                key={i}
                className={
                  isCaret
                    ? "rounded-sm bg-accent/25 text-theme-heading shadow-[inset_0_-2px_0_var(--accent)]"
                    : !isTyped
                      ? "text-theme-subtle"
                      : correct
                        ? "text-theme-heading"
                        : "rounded-sm bg-red-500/25 text-red-500 dark:text-red-300"
                }
              >
                {char}
              </span>
            );
          })}
        </p>
        <textarea
          ref={inputRef}
          aria-label="Typing area. Type the passage shown; the timer starts with your first key."
          value={typed}
          onChange={(e) => onType(e.target.value)}
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={status === "done"}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className="absolute inset-0 h-full w-full cursor-text resize-none rounded-2xl opacity-0"
        />
        {status === "idle" && !focused && (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-theme-muted">
            Click the text and start typing — the timer starts with your first key.
          </p>
        )}
      </div>

      {status === "done" && (
        <Panel title={isNewBest ? "New personal best" : "Your result"}>
          <p className="text-sm leading-relaxed text-theme-body">
            You typed <span className="font-medium text-theme-heading">{Math.round(stats.netWpm)} net WPM</span> at{" "}
            <span className="font-medium text-theme-heading">{stats.accuracy.toFixed(1)}%</span> accuracy ({Math.round(stats.grossWpm)}{" "}
            gross WPM, {stats.errors} uncorrected mistake{stats.errors === 1 ? "" : "s"}, {typed.length} characters).{" "}
            {stats.accuracy < 95
              ? "Slow down a little next time: accuracy above 95% is what lets speed keep climbing."
              : "Accuracy is solid, so push the pace a little on the next run."}
          </p>
        </Panel>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" className={solidButton} onClick={() => reset(seed + 1)}>
          <RotateCcw className="h-4 w-4" /> {status === "done" ? "Try again" : "New passage"}
        </button>
        {status !== "idle" && (
          <button type="button" className={ghostButton} onClick={() => reset()}>
            Retry same passage
          </button>
        )}
      </div>
      <ToolNote>
        A word is counted as five characters, including spaces. Net WPM counts only correctly typed characters; backspace is
        allowed and pasting is disabled. Your personal best is saved in this browser only — nothing you type is uploaded.
      </ToolNote>
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */
/* Time zone converter                                                 */
/* ------------------------------------------------------------------ */

const ZONES: { id: string; label: string }[] = [
  { id: "Pacific/Honolulu", label: "Honolulu" },
  { id: "America/Anchorage", label: "Anchorage" },
  { id: "America/Los_Angeles", label: "Los Angeles" },
  { id: "America/Vancouver", label: "Vancouver" },
  { id: "America/Denver", label: "Denver" },
  { id: "America/Phoenix", label: "Phoenix" },
  { id: "America/Chicago", label: "Chicago" },
  { id: "America/Mexico_City", label: "Mexico City" },
  { id: "America/New_York", label: "New York" },
  { id: "America/Toronto", label: "Toronto" },
  { id: "America/Bogota", label: "Bogotá" },
  { id: "America/Sao_Paulo", label: "São Paulo" },
  { id: "America/Argentina/Buenos_Aires", label: "Buenos Aires" },
  { id: "UTC", label: "UTC" },
  { id: "Europe/London", label: "London" },
  { id: "Europe/Dublin", label: "Dublin" },
  { id: "Europe/Lisbon", label: "Lisbon" },
  { id: "Europe/Madrid", label: "Madrid" },
  { id: "Europe/Paris", label: "Paris" },
  { id: "Europe/Amsterdam", label: "Amsterdam" },
  { id: "Europe/Berlin", label: "Berlin" },
  { id: "Europe/Rome", label: "Rome" },
  { id: "Europe/Stockholm", label: "Stockholm" },
  { id: "Europe/Athens", label: "Athens" },
  { id: "Europe/Istanbul", label: "Istanbul" },
  { id: "Africa/Lagos", label: "Lagos" },
  { id: "Africa/Cairo", label: "Cairo" },
  { id: "Africa/Johannesburg", label: "Johannesburg" },
  { id: "Africa/Nairobi", label: "Nairobi" },
  { id: "Europe/Moscow", label: "Moscow" },
  { id: "Asia/Riyadh", label: "Riyadh" },
  { id: "Asia/Dubai", label: "Dubai" },
  { id: "Asia/Karachi", label: "Karachi" },
  { id: "Asia/Kolkata", label: "India (IST)" },
  { id: "Asia/Kathmandu", label: "Kathmandu" },
  { id: "Asia/Dhaka", label: "Dhaka" },
  { id: "Asia/Bangkok", label: "Bangkok" },
  { id: "Asia/Jakarta", label: "Jakarta" },
  { id: "Asia/Singapore", label: "Singapore" },
  { id: "Asia/Hong_Kong", label: "Hong Kong" },
  { id: "Asia/Shanghai", label: "Shanghai" },
  { id: "Asia/Manila", label: "Manila" },
  { id: "Asia/Seoul", label: "Seoul" },
  { id: "Asia/Tokyo", label: "Tokyo" },
  { id: "Australia/Perth", label: "Perth" },
  { id: "Australia/Sydney", label: "Sydney" },
  { id: "Pacific/Auckland", label: "Auckland" },
];

const DEFAULT_TARGETS = ["America/New_York", "Europe/London", "Asia/Dubai", "Asia/Singapore", "Asia/Kolkata"];

function browserZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
  } catch {
    return "Asia/Kolkata";
  }
}

/** Wall-clock date-time (YYYY-MM-DDTHH:mm) shown in `timeZone` at the given instant. */
function wallClock(at: Date, timeZone: string): string {
  return new Date(at.getTime() + timeZoneOffsetMs(timeZone, at)).toISOString().slice(0, 16);
}

function zoneLabel(id: string): string {
  return ZONES.find((z) => z.id === id)?.label ?? id.split("/").pop()?.replace(/_/g, " ") ?? id;
}

function describeGap(ms: number): string {
  if (ms === 0) return "Same time";
  const minutes = Math.abs(Math.round(ms / 60_000));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h ? `${h} h` : ""}${h && m ? " " : ""}${m ? `${m} min` : ""} ${ms > 0 ? "ahead" : "behind"}`;
}

function dayPart(hour: number): { label: string; tone: string } {
  if (hour >= 9 && hour < 18) return { label: "Working hours", tone: "bg-emerald-400" };
  if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 22)) return { label: "Early or late", tone: "bg-amber-400" };
  return { label: "Night", tone: "bg-rose-400" };
}

export function TimeZoneTool() {
  const [fromZone, setFromZone] = useState(browserZone);
  const [dateTime, setDateTime] = useState(() => wallClock(new Date(), browserZone()));
  const [targets, setTargets] = useState<string[]>(() => DEFAULT_TARGETS.filter((z) => z !== browserZone()).slice(0, 4));
  const [adding, setAdding] = useState("");

  const zoneOptions = useMemo(
    () => (ZONES.some((z) => z.id === fromZone) ? ZONES : [{ id: fromZone, label: zoneLabel(fromZone) }, ...ZONES]),
    [fromZone]
  );

  const instant = useMemo(() => zonedTimeToUtc(dateTime, fromZone), [dateTime, fromZone]);

  const rows = useMemo(() => {
    if (!instant) return [];
    const fromOffset = timeZoneOffsetMs(fromZone, instant);
    const fromDay = wallClock(instant, fromZone).slice(0, 10);
    return targets.map((zone) => {
      const offset = timeZoneOffsetMs(zone, instant);
      const local = wallClock(instant, zone);
      const day = local.slice(0, 10);
      const dayShift = Math.round((Date.parse(`${day}T00:00:00Z`) - Date.parse(`${fromDay}T00:00:00Z`)) / 86_400_000);
      return {
        zone,
        label: zoneLabel(zone),
        time: new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "numeric", minute: "2-digit", hour12: true }).format(instant),
        date: new Intl.DateTimeFormat("en-GB", { timeZone: zone, weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(instant),
        offset: formatUtcOffset(offset),
        gap: describeGap(offset - fromOffset),
        dayShift,
        part: dayPart(Number(local.slice(11, 13))),
      };
    });
  }, [instant, fromZone, targets]);

  const summary = useMemo(() => {
    if (!instant) return "";
    const head = `${new Intl.DateTimeFormat("en-GB", {
      timeZone: fromZone,
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(instant)} — ${zoneLabel(fromZone)} (${formatUtcOffset(timeZoneOffsetMs(fromZone, instant))})`;
    return [head, ...rows.map((r) => `${r.date}, ${r.time} — ${r.label} (${r.offset})`)].join("\n");
  }, [instant, fromZone, rows]);

  const available = ZONES.filter((z) => z.id !== fromZone && !targets.includes(z.id));

  return (
    <ToolStack>
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <FieldLabel label="Date and time">
          <input
            type="datetime-local"
            className="input-field"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="In this time zone">
          <select
            className="input-field"
            value={fromZone}
            onChange={(e) => {
              const next = e.target.value;
              // Keep the same instant when the source zone changes, and keep the old source in the list.
              if (instant) setDateTime(wallClock(instant, next));
              setTargets((list) => [fromZone, ...list.filter((z) => z !== next && z !== fromZone)].slice(0, 8));
              setFromZone(next);
            }}
          >
            {zoneOptions.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </FieldLabel>
        <button type="button" className={`${ghostButton} h-[46px]`} onClick={() => setDateTime(wallClock(new Date(), fromZone))}>
          Now
        </button>
      </div>

      {!instant ? (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-300">
          Enter a valid date and time to convert.
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {rows.map((row) => (
            <li key={row.zone} className="rounded-2xl border border-theme-subtle bg-theme-surface/40 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-theme-heading">{row.label}</p>
                  <p className="mt-0.5 text-xs text-theme-subtle">
                    {row.offset} · {row.gap}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${row.label}`}
                  className={`${ghostButton} h-9 w-9 !px-0`}
                  onClick={() => setTargets((list) => list.filter((z) => z !== row.zone))}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-3xl font-light tabular-nums tracking-tight text-theme-heading">{row.time}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-theme-muted">
                <span>{row.date}</span>
                {row.dayShift !== 0 && (
                  <span className="rounded-full border border-accent/40 px-2 py-0.5 font-medium text-accent">
                    {row.dayShift > 0 ? "Next day" : "Previous day"}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${row.part.tone}`} />
                  {row.part.label}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[14rem] flex-1 sm:max-w-xs">
          <FieldLabel label="Add a city">
            <select className="input-field" value={adding} onChange={(e) => setAdding(e.target.value)} disabled={targets.length >= 8}>
              <option value="">Choose a city…</option>
              {available.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.label}
                </option>
              ))}
            </select>
          </FieldLabel>
        </div>
        <button
          type="button"
          className={`${ghostButton} h-[46px]`}
          disabled={!adding || targets.length >= 8}
          onClick={() => {
            setTargets((list) => [...list, adding]);
            setAdding("");
          }}
        >
          <Plus className="h-4 w-4" /> Add
        </button>
        {instant && rows.length > 0 && <CopyButton text={summary} label="Copy times" toolSlug="time-zone-converter" />}
      </div>
      <ToolNote>
        Offsets are worked out for the date you pick, so daylight saving is applied automatically where it is observed. The
        working-hours hint assumes a 9 am to 6 pm day. Uses your browser&apos;s built-in time zone database.
      </ToolNote>
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */
/* CGPA ⇄ percentage                                                   */
/* ------------------------------------------------------------------ */

const CGPA_METHODS: { id: CgpaMethod; label: string; formula: string; note: string }[] = [
  {
    id: "multiplier-9.5",
    label: "CGPA × 9.5",
    formula: "Percentage = CGPA × 9.5",
    note: "The widely used 10-point rule, popularised by CBSE.",
  },
  {
    id: "minus-0.75",
    label: "(CGPA − 0.75) × 10",
    formula: "Percentage = (CGPA − 0.75) × 10",
    note: "Used by some universities on a 10-point scale.",
  },
  {
    id: "proportional",
    label: "Proportional",
    formula: "Percentage = CGPA ÷ scale × 100",
    note: "A straight share of the maximum grade point — works for 4, 5 and 10-point scales.",
  },
  {
    id: "custom",
    label: "Custom multiplier",
    formula: "Percentage = CGPA × multiplier",
    note: "Enter the multiplier printed in your institution's regulations or transcript.",
  },
];

const CGPA_DIRECTIONS = [
  { value: "to-percent", label: "CGPA → Percentage" },
  { value: "to-cgpa", label: "Percentage → CGPA" },
] as const;

const CGPA_SCALES = [
  { value: 10, label: "10-point" },
  { value: 5, label: "5-point" },
  { value: 4, label: "4-point" },
] as const;

type CgpaDirection = (typeof CGPA_DIRECTIONS)[number]["value"];

export function CgpaTool() {
  const [direction, setDirection] = useState<CgpaDirection>("to-percent");
  const [method, setMethod] = useState<CgpaMethod>("multiplier-9.5");
  const [scale, setScale] = useState<number>(10);
  const [multiplier, setMultiplier] = useState(9.5);
  const [cgpa, setCgpa] = useState(8.4);
  const [percentage, setPercentage] = useState(80);

  const usesScale = method === "proportional";
  const effectiveScale = usesScale ? scale : 10;
  const active = CGPA_METHODS.find((m) => m.id === method) ?? CGPA_METHODS[0];
  const safeCgpa = Math.min(cgpa, effectiveScale);

  const result =
    direction === "to-percent"
      ? cgpaToPercentage(safeCgpa, method, effectiveScale, multiplier)
      : percentageToCgpa(percentage, method, effectiveScale, multiplier);

  const table = useMemo(() => {
    const step = effectiveScale === 10 ? 0.5 : 0.25;
    const rows: { cgpa: number; percentage: number }[] = [];
    for (let value = effectiveScale; value >= effectiveScale / 2 - 1e-9; value -= step) {
      rows.push({ cgpa: value, percentage: cgpaToPercentage(value, method, effectiveScale, multiplier) });
    }
    return rows;
  }, [effectiveScale, method, multiplier]);

  return (
    <ToolStack>
      <Segmented label="Conversion direction" value={direction} onChange={setDirection} options={CGPA_DIRECTIONS} />

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldLabel label="Conversion formula">
          <select className="input-field" value={method} onChange={(e) => setMethod(e.target.value as CgpaMethod)}>
            {CGPA_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </FieldLabel>
        {usesScale ? (
          <div>
            <p className="text-sm font-medium text-theme-body">Grading scale</p>
            <Segmented className="mt-2" label="Grading scale" value={scale} onChange={setScale} options={CGPA_SCALES} />
          </div>
        ) : method === "custom" ? (
          <FieldLabel label="Multiplier">
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={25}
              step={0.05}
              className="input-field tabular-nums"
              value={multiplier}
              onChange={(e) => setMultiplier(Math.min(25, Math.max(0, Number(e.target.value) || 0)))}
            />
          </FieldLabel>
        ) : null}
      </div>

      {direction === "to-percent" ? (
        <CalculatorSlider label="Your CGPA" value={safeCgpa} min={0} max={effectiveScale} step={0.01} onChange={setCgpa} />
      ) : (
        <CalculatorSlider label="Your percentage" value={percentage} min={0} max={100} step={0.1} unit="%" onChange={setPercentage} />
      )}

      <KPIStrip
        items={[
          direction === "to-percent"
            ? { label: "Equivalent percentage", value: `${result.toFixed(2)}%`, highlight: true }
            : { label: `Equivalent CGPA (out of ${effectiveScale})`, value: result.toFixed(2), highlight: true },
          { label: "Formula used", value: active.label, hint: active.formula },
        ]}
      />

      <Panel title={`Quick reference · ${active.label}`}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm sm:grid-cols-3">
          {table.map((row) => (
            <p key={row.cgpa} className="flex justify-between gap-4 border-b border-theme-subtle py-1.5 tabular-nums">
              <span className="text-theme-muted">{row.cgpa.toFixed(2)}</span>
              <span className="font-medium text-theme-heading">{row.percentage.toFixed(1)}%</span>
            </p>
          ))}
        </div>
      </Panel>
      <ToolNote>
        {active.note} Conversion rules differ between boards and universities, and some publish no official formula at all — for
        applications and forms, always use the method stated on your transcript or in your institution&apos;s regulations.
      </ToolNote>
    </ToolStack>
  );
}
