import { Card } from "@/components/ui/Card";

export function LoadingOverlay({
  title,
  description,
  progress,
}: {
  title: string;
  description: string;
  progress: number;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-xl" />
      <Card className="relative w-full max-w-md overflow-hidden">
        <div className="px-6 py-6">
          <div className="font-display text-xl tracking-tight text-mist-50">{title}</div>
          <div className="mt-2 text-sm text-mist-50/70">{description}</div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-aurora-500/95 via-champagne-400/40 to-aurora-400/85 transition-all duration-300"
              style={{ width: `${Math.max(8, Math.min(100, progress))}%` }}
            />
          </div>
          <div className="mt-3 text-xs text-mist-50/75">{Math.round(progress)}%</div>
        </div>
        <div className="pointer-events-none absolute inset-0 lp-noise" />
      </Card>
    </div>
  );
}
