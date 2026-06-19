"use client";

import { useCallback, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import CopyButton from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "0O1lI";

function randomChar(pool: string): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return pool[arr[0] % pool.length];
}

function generatePassword(opts: {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}): string {
  let pool = "";
  if (opts.upper) pool += UPPER;
  if (opts.lower) pool += LOWER;
  if (opts.numbers) pool += NUMBERS;
  if (opts.symbols) pool += SYMBOLS;
  if (opts.excludeAmbiguous) pool = [...pool].filter((c) => !AMBIGUOUS.includes(c)).join("");
  if (!pool) pool = LOWER + NUMBERS;

  const required: string[] = [];
  if (opts.upper) required.push(randomChar(opts.excludeAmbiguous ? UPPER.replace(/[O]/g, "") || UPPER : UPPER));
  if (opts.lower) required.push(randomChar(opts.excludeAmbiguous ? LOWER.replace(/[l]/g, "") || LOWER : LOWER));
  if (opts.numbers) required.push(randomChar(opts.excludeAmbiguous ? NUMBERS.replace(/[01]/g, "") || NUMBERS : NUMBERS));
  if (opts.symbols) required.push(randomChar(SYMBOLS));

  const chars = [...required];
  while (chars.length < opts.length) chars.push(randomChar(pool));
  for (let i = chars.length - 1; i > 0; i--) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const j = arr[0] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function strengthScore(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Fair", color: "bg-amber-500" };
  if (score <= 5) return { score, label: "Strong", color: "bg-emerald-500" };
  return { score, label: "Very Strong", color: "bg-accent-emerald" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    setPassword(generatePassword({ length, upper, lower, numbers, symbols, excludeAmbiguous }));
  }, [length, upper, lower, numbers, symbols, excludeAmbiguous]);

  const strength = useMemo(() => strengthScore(password), [password]);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
          >
            <RefreshCw className="h-4 w-4" /> Generate Password
          </button>
          {password && <CopyButton text={password} />}
        </div>

        {password && (
          <div className="mt-6">
            <code className="block break-all rounded-xl bg-theme-surface px-4 py-4 font-mono text-xl text-theme-heading">{password}</code>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-theme-muted">Strength</span>
                <span className="font-medium text-theme-heading">{strength.label}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-theme-surface">
                <div className={cn("h-full rounded-full transition-all", strength.color)} style={{ width: `${(strength.score / 7) * 100}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card space-y-4 p-6">
        <div>
          <label className="mb-2 flex justify-between text-sm text-theme-muted">
            <span>Length</span>
            <span className="font-medium text-accent">{length}</span>
          </label>
          <input type="range" min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-accent" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Uppercase (A-Z)", checked: upper, set: setUpper },
            { label: "Lowercase (a-z)", checked: lower, set: setLower },
            { label: "Numbers (0-9)", checked: numbers, set: setNumbers },
            { label: "Symbols (!@#…)", checked: symbols, set: setSymbols },
          ].map((opt) => (
            <label key={opt.label} className="flex cursor-pointer items-center gap-2 text-sm text-theme-muted">
              <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)} className="accent-accent" />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <AdvancedOptions>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-theme-muted">
          <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} className="accent-accent" />
          Exclude ambiguous characters (0, O, 1, l, I)
        </label>
      </AdvancedOptions>
    </div>
  );
}
