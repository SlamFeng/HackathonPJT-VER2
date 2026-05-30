import * as React from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "@/mock-data/products";
import { useAppStore } from "@/app/store";
import { recommendProducts } from "@/mock-ai/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { formatJPY } from "@/utils/format";
import type { Product, ProductCategory } from "@/types";
import { useToasts } from "@/components/ToastProvider";
import { ArrowRight, Check, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

function ProductImage({ p }: { p: Product }) {
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.02] ring-1 ring-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(167,139,250,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(231,169,67,0.18),transparent_55%)]" />
      <div className="absolute inset-0 flex items-end justify-between px-4 py-3">
        <div>
          <div className="text-xs text-mist-50/75">{p.category}</div>
          <div className="mt-1 text-sm font-medium text-mist-50">{p.color}</div>
        </div>
        <div className="rounded-xl bg-white/[0.06] px-2 py-1 text-xs text-mist-50/70 ring-1 ring-white/10">
          {p.matchScore}%
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 lp-noise" />
    </div>
  );
}

function ProductCard({
  product,
  selected,
  onSelect,
}: {
  product: Product;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      variant="soft"
      className={cn(
        "overflow-hidden transition-all duration-200 hover:bg-white/[0.07]",
        selected ? "ring-1 ring-aurora-200/40 shadow-glass" : "ring-1 ring-white/10",
      )}
    >
      <CardContent className="px-5 pb-5 pt-5">
        <ProductImage p={product} />
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate font-display text-lg tracking-tight text-mist-50">{product.name}</div>
            <div className="mt-1 text-xs text-mist-50/60">
              {product.category} · {product.color}
            </div>
          </div>
          <Tag tone={product.stock === "Low Stock" ? "warn" : "good"}>{product.stock}</Tag>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Tag tone="neutral">{formatJPY(product.price)}</Tag>
          <Tag tone="accent">{product.matchScore}% Match</Tag>
          <Tag tone="neutral">Size: {product.sizes.join(", ")}</Tag>
        </div>

        <div className="mt-3 text-sm leading-6 text-mist-50/70">{product.reason}</div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-mist-50/70">
            推荐策略：风格/场景/预算/库存
          </div>
          <Button variant={selected ? "secondary" : "primary"} onClick={onSelect}>
            {selected ? (
              <>
                <Check className="h-4 w-4" />
                已选择
              </>
            ) : (
              <>
                选择该商品 <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductRecommendation() {
  const navigate = useNavigate();
  const { push } = useToasts();

  const input = useAppStore((s) => s.customerInput);
  const profile = useAppStore((s) => s.customerProfile);
  const activeCategory = useAppStore((s) => s.activeCategory);
  const setActiveCategory = useAppStore((s) => s.setActiveCategory);
  const selectedOutfit = useAppStore((s) => s.selectedOutfit);
  const selectProduct = useAppStore((s) => s.selectProduct);
  const removeProduct = useAppStore((s) => s.removeProduct);
  const talkByType = useAppStore((s) => s.talkByType);

  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<Product[]>([]);

  const load = React.useCallback(
    async (category: ProductCategory) => {
      if (!profile) return;
      setLoading(true);
      try {
        const res = await recommendProducts(category, input, profile);
        setItems(res);
      } finally {
        setLoading(false);
      }
    },
    [input, profile],
  );

  React.useEffect(() => {
    void load(activeCategory);
  }, [activeCategory, load]);

  if (!profile) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="px-6 py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-display text-2xl tracking-tight text-mist-50">还没有顾客画像</div>
              <div className="mt-2 text-sm text-mist-50/70">请先生成 AI Profile，再进入选品推荐。</div>
            </div>
            <Button variant="primary" onClick={() => navigate("/app/intake")}>
              去生成 <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selected = selectedOutfit.itemsByCategory[activeCategory];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.42fr]">
      <div className="space-y-5">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>Product Recommendation</CardTitle>
                <div className="mt-2 text-sm text-mist-50/70">
                  点击 OOTD 单品后，系统会从 Mock 商品库中推荐该品类下的 3 个商品，并给出匹配分与推荐理由。
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="accent">{profile.styleDirection}</Tag>
                <Tag tone="neutral">Budget {input.budget}</Tag>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = c === activeCategory;
                const already = selectedOutfit.itemsByCategory[c];
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm ring-1 transition-all",
                      active
                        ? "bg-white/[0.08] text-mist-50 ring-white/20 shadow-glow"
                        : "bg-white/[0.04] text-mist-50/75 ring-white/10 hover:bg-white/[0.06] hover:text-mist-50",
                    )}
                  >
                    <span className="mr-2 font-medium">{c}</span>
                    {already ? <span className="text-xs text-aurora-200">Selected</span> : null}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Card key={idx} variant="soft" className="animate-pulse overflow-hidden ring-1 ring-white/10">
                  <div className="px-5 pb-5 pt-5">
                    <div className="h-28 rounded-2xl bg-white/[0.06]" />
                    <div className="mt-4 h-5 w-3/4 rounded bg-white/[0.06]" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-white/[0.06]" />
                    <div className="mt-4 h-10 rounded bg-white/[0.06]" />
                  </div>
                </Card>
              ))
            : items.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  selected={selected?.name === p.name}
                  onSelect={() => {
                    selectProduct(activeCategory, p);
                    push({ tone: "success", title: "已加入 Selected Outfit", description: `${activeCategory} → ${p.name}` });
                  }}
                />
              ))}
        </div>
      </div>

      <Card className="sticky top-6 h-fit overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Selected Outfit</CardTitle>
              <div className="mt-2 text-sm text-mist-50/70">选中商品后，右侧清单会实时更新总价、匹配分与话术。</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
              <ShoppingBag className="h-5 w-5 text-aurora-200" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {CATEGORIES.map((c) => {
              const it = selectedOutfit.itemsByCategory[c];
              return (
                <div key={c} className="rounded-2xl bg-white/[0.035] px-4 py-3 ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-mist-50/60">{c}</div>
                      <div className="mt-1 truncate text-sm font-medium text-mist-50">{it ? it.name : "—"}</div>
                      {it ? <div className="mt-1 text-xs text-mist-50/70">{formatJPY(it.price)} · {it.stock}</div> : null}
                    </div>
                    {it ? (
                      <button
                        onClick={() => {
                          removeProduct(c);
                          push({ tone: "info", title: "已移除商品", description: `${c} 已清空` });
                        }}
                        className="rounded-xl p-2 text-mist-50/75 hover:bg-white/[0.06] hover:text-mist-50"
                        aria-label={`Remove ${c}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.03] px-5 py-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-mist-50/60">Total Price</div>
              <div className="font-display text-2xl tracking-tight text-mist-50">{formatJPY(selectedOutfit.totalPrice)}</div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs text-mist-50/60">Overall Match</div>
              <Tag tone="good">{selectedOutfit.overallMatchScore || 0}%</Tag>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-aurora-500/90 via-champagne-400/40 to-aurora-400/80 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, selectedOutfit.overallMatchScore || 0))}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.03] px-5 py-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-aurora-200" />
              <div className="text-sm font-medium text-mist-50">自动生成话术（预览）</div>
            </div>
            <div className="mt-3 text-sm leading-7 text-mist-50/75">{talkByType["标准推荐话术"] || "选择任意商品后自动生成"}</div>
            <div className="mt-3 text-xs text-mist-50/70">下一步：进入 Sales Talk 页面可切换不同话术类型并一键复制。</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => navigate("/app/talk")} className="flex-1">
              进入接客话术 <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                push({ tone: "info", title: "提示", description: "建议至少选择 Jacket / Pants / Shoes 三件形成完整提案" });
              }}
            >
              小技巧
            </Button>
          </div>
        </CardContent>
        <div className="pointer-events-none absolute inset-0 lp-noise" />
      </Card>
    </div>
  );
}
