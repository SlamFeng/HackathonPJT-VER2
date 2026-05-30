import { cn } from "@/lib/utils";

export function Tag({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "good" | "warn" | "accent";
}) {
  const tones: Record<NonNullable<typeof tone>, string> = {
    neutral: "bg-white/[0.06] text-mist-50/85 ring-white/10",
    good: "bg-success-400/14 text-success-100 ring-success-200/25",
    warn: "bg-warning-400/16 text-warning-100 ring-warning-200/25",
    accent: "bg-aurora-500/14 text-aurora-100 ring-aurora-200/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 backdrop-blur",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
