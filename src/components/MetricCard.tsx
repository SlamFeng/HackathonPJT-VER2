import type { EfficiencyMetric } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

export function MetricCard({ metric }: { metric: EfficiencyMetric }) {
  const tone = metric.emphasis === "good" ? "good" : metric.emphasis === "warn" ? "warn" : "neutral";
  return (
    <Card variant="soft" className="animate-floatIn">
      <CardContent className="px-5 pb-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-mist-50/60">{metric.label}</div>
            <div className="mt-2 truncate font-display text-2xl tracking-tight text-mist-50">{metric.value}</div>
            {metric.helper ? <div className="mt-2 text-xs text-mist-50/75">{metric.helper}</div> : null}
          </div>
          <Tag
            tone={tone === "neutral" ? "accent" : tone}
            className={cn(tone === "warn" ? "animate-pulseSoft" : "", "shrink-0")}
          >
            {tone === "good" ? "Efficiency +" : tone === "warn" ? "Legacy" : "Live"}
          </Tag>
        </div>
      </CardContent>
    </Card>
  );
}
