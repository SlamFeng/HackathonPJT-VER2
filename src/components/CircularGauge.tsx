import { cn } from "@/lib/utils";

export function CircularGauge({
  value,
  label,
  tone = "accent",
}: {
  value: number;
  label: string;
  tone?: "accent" | "good" | "warn";
}) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  const stroke =
    tone === "good"
      ? "rgba(111, 163, 139, 0.92)"
      : tone === "warn"
        ? "rgba(208, 167, 103, 0.92)"
        : "rgba(110, 122, 199, 0.92)";
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/[0.035] px-4 py-3 ring-1 ring-white/10">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 72 72" className="h-16 w-16 -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn("font-display text-lg tracking-tight text-mist-50")}>{Math.round(pct)}%</div>
        </div>
      </div>
      <div>
        <div className="text-xs text-mist-50/60">{label}</div>
        <div className="mt-1 text-sm font-medium text-mist-50">{pct >= 90 ? "Strong" : pct >= 80 ? "Good" : "OK"}</div>
      </div>
    </div>
  );
}
