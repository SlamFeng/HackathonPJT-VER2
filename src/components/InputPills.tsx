import { cn } from "@/lib/utils";

export function InputPills<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="text-xs text-mist-50/60">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              className={cn(
                "rounded-xl px-3 py-2 text-sm transition-all ring-1",
                active
                  ? "bg-white/[0.08] text-mist-50 ring-white/20 shadow-glow"
                  : "bg-white/[0.04] text-mist-50/75 ring-white/10 hover:bg-white/[0.06] hover:text-mist-50",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MultiSelectChips<T extends string>({
  label,
  values,
  options,
  onChange,
}: {
  label: string;
  values: T[];
  options: { value: T; label: string }[];
  onChange: (next: T[]) => void;
}) {
  return (
    <div>
      <div className="text-xs text-mist-50/60">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = values.includes(o.value);
          return (
            <button
              key={o.value}
              onClick={() => onChange(active ? values.filter((v) => v !== o.value) : [...values, o.value])}
              className={cn(
                "rounded-xl px-3 py-2 text-sm transition-all ring-1",
                active
                  ? "bg-gradient-to-b from-aurora-400/20 to-white/[0.05] text-mist-50 ring-white/20 shadow-glow"
                  : "bg-white/[0.04] text-mist-50/75 ring-white/10 hover:bg-white/[0.06] hover:text-mist-50",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

