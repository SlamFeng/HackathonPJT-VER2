import * as React from "react";
import { CATEGORY_LABEL } from "@/app/steps";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import type { CustomerPhoto, OOTDItem, ProductCategory } from "@/types";

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
  centerPhotoUrl,
  onPhotoPicked,
}: {
  items: OOTDItem[];
  activeCategory?: ProductCategory;
  onSelectCategory: (c: ProductCategory) => void;
  centerPhotoUrl?: string | null;
  onPhotoPicked?: (p: CustomerPhoto) => void;
}) {
  const centerTitle = centerPhotoUrl ? "真人照片拆解" : "Urban Persona";
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  return (
    <div className="relative overflow-hidden rounded-3xl lp-glass">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-white/[0.01]" />
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-aurora-500/22 blur-3xl" />
      <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-champagne-400/18 blur-3xl" />
      {onPhotoPicked ? (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const fr = new FileReader();
            fr.onload = () => onPhotoPicked({ name: file.name, dataUrl: String(fr.result) });
            fr.readAsDataURL(file);
            e.target.value = "";
          }}
        />
      ) : null}

      <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-80 sm:block">
        <defs>
          <linearGradient id="lpLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(110,122,199,0.58)" />
            <stop offset="1" stopColor="rgba(201,164,106,0.28)" />
          </linearGradient>
          <marker id="lpArrow" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(242,240,234,0.68)" />
          </marker>
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
              strokeWidth="0.85"
              strokeLinecap="round"
              markerEnd="url(#lpArrow)"
              fill="none"
              filter="url(#softGlow)"
            />
          );
        })}
      </svg>

      <div className="relative mx-auto max-w-[1100px] px-6 py-7">
        <div className="sm:hidden">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-white/[0.08] to-white/[0.03] ring-1 ring-white/12 shadow-glass">
            <div className="absolute -left-16 -top-20 h-44 w-44 rounded-full bg-aurora-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-52 w-52 rounded-full bg-champagne-400/18 blur-3xl" />
            <div className="relative px-5 pb-5 pt-5">
              <div className="text-xs text-mist-50/60">OOTD Photo</div>
              <div className="mt-2 font-display text-2xl tracking-tight text-mist-50">{centerTitle}</div>
              <div className="mt-4 aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-ink-900/60 to-ink-950/60 ring-1 ring-white/10">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(110,122,199,0.22),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(201,164,106,0.16),transparent_50%)]" />
                  {centerPhotoUrl ? (
                    <div className="absolute inset-0">
                      <img
                        src={centerPhotoUrl}
                        alt="OOTD Reference"
                        loading="eager"
                        decoding="async"
                        className="h-full w-full object-cover opacity-[0.94]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/10 to-ink-950/45" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-44 w-24 rounded-[999px] bg-white/[0.06] ring-1 ring-white/10 blur-[0.2px]" />
                    </div>
                  )}
                  {onPhotoPicked ? (
                    <div className="absolute inset-x-4 bottom-4">
                      <button
                        onClick={() => inputRef.current?.click()}
                        className="w-full rounded-2xl bg-ink-950/55 px-4 py-3 text-sm font-medium text-mist-50 ring-1 ring-white/14 backdrop-blur transition-all hover:bg-ink-950/65"
                      >
                        {centerPhotoUrl ? "更换穿搭照片" : "上传穿搭照片（用于拆解）"}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Tag tone="accent">OOTD 拆解</Tag>
                <div className="text-xs text-mist-50/75">点选单品进入推荐</div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 lp-noise" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {items.map((it) => {
              const selected = activeCategory === it.category;
              return (
                <button
                  key={it.category}
                  onClick={() => onSelectCategory(it.category)}
                  className={cn(
                    "group relative overflow-hidden rounded-[22px] bg-white/[0.03] p-3 text-left ring-1 transition-all",
                    selected ? "ring-aurora-200/40 shadow-glass" : "ring-white/10 hover:bg-white/[0.06] hover:ring-white/15",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-mist-50/60">{CATEGORY_LABEL[it.category]}</div>
                      <div className="mt-1 truncate text-sm font-medium text-mist-50">{it.labelZh ?? it.itemName}</div>
                    </div>
                    <Tag tone={tone(it.matchScore)} className="shrink-0">
                      {it.matchScore}%
                    </Tag>
                  </div>
                  <div className="mt-3 overflow-hidden rounded-2xl bg-white ring-1 ring-white/20 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
                    {it.thumbnailUrl ? (
                      <img src={it.thumbnailUrl} alt={it.itemName} loading="lazy" decoding="async" className="h-28 w-full object-cover" />
                    ) : (
                      <div className="h-28 w-full bg-gradient-to-b from-ink-900/60 to-ink-950/60" />
                    )}
                  </div>
                  <div className="mt-3 text-xs leading-5 text-mist-50/70">{it.reason}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto hidden h-[560px] w-full sm:block">
          <div className="absolute left-1/2 top-1/2 w-[300px] -translate-x-1/2 -translate-y-1/2">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-white/[0.08] to-white/[0.03] ring-1 ring-white/12 shadow-glass">
              <div className="absolute -left-16 -top-20 h-44 w-44 rounded-full bg-aurora-500/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-16 h-52 w-52 rounded-full bg-champagne-400/18 blur-3xl" />
              <div className="relative px-6 pb-6 pt-6">
                <div className="text-xs text-mist-50/60">OOTD Photo</div>
                <div className="mt-2 font-display text-2xl tracking-tight text-mist-50">{centerTitle}</div>
                <div className="mt-4 aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-ink-900/60 to-ink-950/60 ring-1 ring-white/10">
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(110,122,199,0.22),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(201,164,106,0.16),transparent_50%)]" />
                    {centerPhotoUrl ? (
                      <div className="absolute inset-0">
                        <img
                          src={centerPhotoUrl}
                          alt="OOTD Reference"
                          loading="eager"
                          decoding="async"
                          className="h-full w-full object-cover opacity-[0.94]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/10 to-ink-950/45" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-44 w-24 rounded-[999px] bg-white/[0.06] ring-1 ring-white/10 blur-[0.2px]" />
                      </div>
                    )}
                    {onPhotoPicked ? (
                      <div className="absolute inset-x-4 bottom-4">
                        <button
                          onClick={() => inputRef.current?.click()}
                          className="w-full rounded-2xl bg-ink-950/55 px-4 py-3 text-sm font-medium text-mist-50 ring-1 ring-white/14 backdrop-blur transition-all hover:bg-ink-950/65"
                        >
                          {centerPhotoUrl ? "更换穿搭照片" : "上传穿搭照片（用于拆解）"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Tag tone="accent">OOTD 拆解</Tag>
                  <div className="text-xs text-mist-50/75">点击贴纸进入推荐</div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 lp-noise" />
            </div>
          </div>

          {items.map((it) => {
            const p = POS[it.category];
            const selected = activeCategory === it.category;
            const label = it.labelZh ?? it.itemName;
            return (
              <button
                key={it.category}
                onClick={() => onSelectCategory(it.category)}
                className="group absolute text-left"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: `translate(-${p.align === "l" ? 10 : 90}%, -50%)`,
                }}
              >
                <div className="relative">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-[26px] bg-white ring-2 shadow-[0_18px_60px_rgba(0,0,0,0.32)] transition-all duration-200",
                      selected ? "ring-aurora-200/70 scale-[1.01]" : "ring-white/80 hover:scale-[1.01]",
                    )}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(110,122,199,0.16),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(201,164,106,0.10),transparent_55%)]" />
                    {it.thumbnailUrl ? (
                      <img
                        src={it.thumbnailUrl}
                        alt={it.itemName}
                        loading="lazy"
                        decoding="async"
                        className="relative h-[168px] w-[168px] object-cover"
                      />
                    ) : (
                      <div className="relative h-[168px] w-[168px] bg-gradient-to-b from-ink-900/60 to-ink-950/60" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "mt-3 inline-flex max-w-[220px] items-center gap-2 rounded-full bg-ink-950/65 px-4 py-2 text-sm font-semibold text-mist-50 ring-1 ring-white/14 backdrop-blur",
                      p.align === "l" ? "origin-left" : "origin-right",
                    )}
                  >
                    <span className="text-mist-50/80">{label}</span>
                  </div>

                  <div
                    className={cn(
                      "pointer-events-none absolute z-10 w-[280px] translate-y-2 opacity-0 transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100",
                      p.align === "l" ? "left-0 top-full" : "right-0 top-full",
                    )}
                  >
                    <Card variant="soft" className="ring-1 ring-white/14">
                      <div className="px-4 pb-4 pt-4">
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
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
