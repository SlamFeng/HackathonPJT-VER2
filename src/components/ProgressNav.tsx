import { APP_STEPS } from "@/app/steps";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function ProgressNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeIdx = Math.max(0, APP_STEPS.findIndex((s) => location.pathname.startsWith(s.path)));

  return (
    <div className="lp-glass-soft rounded-2xl px-3 py-2">
      <div className="flex items-center gap-1 overflow-x-auto">
        {APP_STEPS.map((s, idx) => {
          const active = idx === activeIdx;
          const done = idx < activeIdx;
          return (
            <button
              key={s.key}
              onClick={() => navigate(s.path)}
              className={cn(
                "group relative flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left transition-all",
                active ? "bg-white/[0.08] ring-1 ring-white/15" : "hover:bg-white/[0.06] ring-1 ring-white/0 hover:ring-white/10",
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-lg text-xs font-semibold",
                  active
                    ? "bg-gradient-to-b from-aurora-300/80 to-aurora-600/70 text-mist-50 shadow-[0_14px_26px_rgba(110,122,199,0.26)]"
                    : done
                      ? "bg-white/[0.07] text-mist-50/80"
                      : "bg-white/[0.05] text-mist-50/75",
                )}
              >
                {idx + 1}
              </div>
              <div className="min-w-[140px]">
                <div className={cn("text-xs font-medium", active ? "text-mist-50" : "text-mist-50/75")}>{s.label}</div>
                <div className={cn("text-[11px] leading-4", active ? "text-mist-50/70" : "text-mist-50/65")}>
                  {s.key === "recommend" ? "Select in-store items" : s.key === "ootd" ? "Visual breakdown" : "Workflow step"}
                </div>
              </div>
              {idx !== APP_STEPS.length - 1 ? (
                <ChevronRight className="h-4 w-4 text-mist-50/25 group-hover:text-mist-50/40" />
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-aurora-500/90 via-champagne-400/40 to-aurora-400/80 transition-all duration-500"
          style={{ width: `${((activeIdx + 1) / APP_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
