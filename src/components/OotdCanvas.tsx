import { CATEGORY_LABEL } from "@/app/steps";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import type { OOTDItem, ProductCategory } from "@/types";

const POS: Record<ProductCategory, { x: number; y: number; align: "l" | "r" }> = {
  Hat: { x: 18, y: 18, align: "l" },
  Jacket: { x: 82, y: 18, align: "r" },
  Innerwear: { x: 14, y: 52, align: "l" },
  Pants: { x: 86, y: 52, align: "r" },
  Shoes: { x: 22, y: 85, align: "l" },
  Bag: { x: 78, y: 85, align: "r" },
};

function tone(score: number) {
  if (score >= 90) return "good" as const;
  if (score >= 85) return "accent" as const;
  return "neutral" as const;
}

export function OotdCanvas({
  items,
  onSelectCategory,
  activeCategory,
}: {
  items: OOTDItem[];
  activeCategory?: ProductCategory;
  onSelectCategory: (c: ProductCategory) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl lp-glass">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-white/[0.01]" />
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-aurora-500/22 blur-3xl" />
      <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-champagne-400/18 blur-3xl" />

      <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full opacity-80">
        <defs>
          <linearGradient id="lpLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(110,122,199,0.58)" />
            <stop offset="1" stopColor="rgba(201,164,106,0.28)" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {items.map((it) => {
          const p = POS[it.category];
          const cx = 50;
          const cy = 50;
          const x2 = p.x;
          const y2 = p.y;
          const dx = (x2 - cx) * 0.35;
          const dy = (y2 - cy) * 0.35;
          const c1x = cx + dx;
          const c1y = cy + dy;
          const c2x = x2 - dx;
          const c2y = y2 - dy;
          return (
            <path
              key={it.category}
              d={`M ${cx} ${cy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`}
              stroke="url(#lpLine)"
              strokeWidth="0.7"
              strokeDasharray="2.2 2.2"
              fill="none"
              filter="url(#softGlow)"
            />
          );
        })}
      </svg>

      <div className="relative mx-auto max-w-[1100px] px-6 py-7">
        <div className="relative mx-auto h-[560px] w-full">
          <div className="absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-white/[0.08] to-white/[0.03] ring-1 ring-white/12 shadow-glass">
              <div className="absolute -left-16 -top-20 h-44 w-44 rounded-full bg-aurora-500/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-16 h-52 w-52 rounded-full bg-champagne-400/18 blur-3xl" />
              <div className="relative px-6 pb-6 pt-6">
                <div className="text-xs text-mist-50/60">Customer Silhouette</div>
                <div className="mt-2 font-display text-2xl tracking-tight text-mist-50">Urban Persona</div>
                <div className="mt-4 aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-ink-900/60 to-ink-950/60 ring-1 ring-white/10">
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(167,139,250,0.28),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(231,169,67,0.18),transparent_50%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-44 w-24 rounded-[999px] bg-white/[0.06] ring-1 ring-white/10 blur-[0.2px]" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Tag tone="accent">OOTD Breakdown</Tag>
                  <div className="text-xs text-mist-50/75">Tap items to recommend</div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 lp-noise" />
            </div>
          </div>

          {items.map((it) => {
            const p = POS[it.category];
            const selected = activeCategory === it.category;
            return (
              <button
                key={it.category}
                onClick={() => onSelectCategory(it.category)}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: `translate(-${p.align === "l" ? 8 : 92}%, -50%)`,
                }}
              >
                <Card
                  variant="soft"
                  className={cn(
                    "w-[260px] text-left transition-all duration-200 hover:scale-[1.01] hover:bg-white/[0.07]",
                    selected ? "ring-1 ring-aurora-200/40 shadow-glass" : "ring-1 ring-white/10",
                  )}
                >
                  <div className="px-5 pb-4 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-mist-50/60">{CATEGORY_LABEL[it.category]}</div>
                        <div className="mt-1 font-display text-lg tracking-tight text-mist-50">{it.itemName}</div>
                      </div>
                      <Tag tone={tone(it.matchScore)}>{it.matchScore}%</Tag>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-mist-50/65">
                      <div className="rounded-lg bg-white/[0.04] px-2 py-1 ring-1 ring-white/10">
                        <span className="text-mist-50/75">Style</span>
                        <div className="mt-0.5 font-medium text-mist-50/80">{it.style}</div>
                      </div>
                      <div className="rounded-lg bg-white/[0.04] px-2 py-1 ring-1 ring-white/10">
                        <span className="text-mist-50/75">Color</span>
                        <div className="mt-0.5 font-medium text-mist-50/80">{it.color}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs leading-5 text-mist-50/70">{it.reason}</div>
                    <div className="mt-3 text-xs text-mist-50/75">点击进入该类商品推荐 →</div>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
