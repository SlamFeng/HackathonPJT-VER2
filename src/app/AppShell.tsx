import { ProgressNav } from "@/components/ProgressNav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Moon, Sparkles, Sun } from "lucide-react";
import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

type ViewportMode = "desktop" | "tablet" | "mobile";

export function AppShell() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const inApp = location.pathname.startsWith("/app");
  const [viewportMode, setViewportMode] = React.useState<ViewportMode>(() => {
    const saved = localStorage.getItem("lp:viewport") as ViewportMode | null;
    return saved ?? "desktop";
  });

  React.useEffect(() => {
    localStorage.setItem("lp:viewport", viewportMode);
  }, [viewportMode]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vp = params.get("vp");
    if (vp === "desktop" || vp === "tablet" || vp === "mobile") setViewportMode(vp);
  }, [location.search]);

  const stageClass =
    viewportMode === "desktop"
      ? "w-full"
      : viewportMode === "tablet"
        ? "mx-auto w-full max-w-[1024px]"
        : "mx-auto w-full max-w-[375px]";

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 lp-mesh" />
      <div className="pointer-events-none fixed inset-0 lp-noise" />
      <div className="relative">
        <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <button onClick={() => navigate("/")} className="group flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
                <Sparkles className="h-5 w-5 text-aurora-200" />
                <div className="absolute -inset-6 -z-10 rounded-full bg-aurora-500/10 blur-2xl transition-opacity group-hover:opacity-80" />
              </div>
              <div className="leading-tight">
                <div className="font-display text-lg tracking-tight text-mist-50">LookPilot</div>
                <div className="text-xs text-mist-50/60">AI Styling Workbench</div>
              </div>
            </button>
            <div className="flex items-center gap-3">
              <Card
                variant="soft"
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-2.5",
                  inApp ? "" : "opacity-0 pointer-events-none",
                )}
              >
                <div className="text-xs text-mist-50/60">From profile to proposal</div>
                <div className="font-display text-base tracking-tight text-mist-50">≈ 3 min</div>
              </Card>
              <Card
                variant="soft"
                className={cn(
                  "hidden items-center gap-1 rounded-2xl p-1 sm:flex",
                  inApp ? "" : "opacity-0 pointer-events-none",
                )}
              >
                {(["desktop", "tablet", "mobile"] as const).map((m) => {
                  const active = viewportMode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setViewportMode(m)}
                      className={cn(
                        "rounded-xl px-3 py-2 text-xs font-medium transition-all ring-1",
                        active
                          ? "bg-white/[0.08] text-mist-50 ring-white/18 shadow-glow"
                          : "bg-transparent text-mist-50/75 ring-white/0 hover:bg-white/[0.05] hover:text-mist-50 hover:ring-white/10",
                      )}
                    >
                      {m === "desktop" ? "1920" : m === "tablet" ? "1024" : "375"}
                    </button>
                  );
                })}
              </Card>
              <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
              </Button>
            </div>
          </header>

          {inApp ? (
            <div className="mt-6">
              <ProgressNav />
            </div>
          ) : null}

          <main className={cn("mt-6", inApp ? "mt-6" : "mt-10")}>
            <div className={cn(stageClass, inApp && viewportMode !== "desktop" ? "rounded-[28px] bg-white/[0.02] p-4 ring-1 ring-white/10" : "")}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
