import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Info, TriangleAlert, X } from "lucide-react";

type ToastTone = "success" | "info" | "warn";
type ToastItem = { id: string; title: string; description?: string; tone: ToastTone };

const ToastContext = React.createContext<{ push: (t: Omit<ToastItem, "id">) => void } | null>(null);

function iconFor(tone: ToastTone) {
  if (tone === "success") return Check;
  if (tone === "warn") return TriangleAlert;
  return Info;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const push = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setItems((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed right-5 top-5 z-[60] flex w-[340px] flex-col gap-2">
        {items.map((t) => {
          const Icon = iconFor(t.tone);
          const toneCls =
            t.tone === "success"
              ? "bg-success-400/14 ring-success-200/25"
              : t.tone === "warn"
                ? "bg-warning-400/16 ring-warning-200/25"
                : "bg-white/[0.06] ring-white/10";
          return (
            <div
              key={t.id}
              className={cn(
                "lp-glass-soft animate-floatIn rounded-2xl px-4 py-3 ring-1",
                toneCls,
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06]">
                  <Icon className="h-4 w-4 text-mist-50/85" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-mist-50">{t.title}</div>
                  {t.description ? <div className="mt-0.5 text-xs text-mist-50/70">{t.description}</div> : null}
                </div>
                <button
                  onClick={() => setItems((prev) => prev.filter((p) => p.id !== t.id))}
                  className="rounded-lg p-1 text-mist-50/75 hover:bg-white/[0.06] hover:text-mist-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToasts = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider is missing");
  return ctx;
};
