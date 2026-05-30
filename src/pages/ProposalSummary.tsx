import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { calculateEfficiencyImpact } from "@/mock-ai/ai";
import { formatJPY } from "@/utils/format";
import { MOCK_PRODUCTS, CATEGORIES } from "@/mock-data/products";
import { useToasts } from "@/components/ToastProvider";
import { ArrowRight, Download, Save, Sparkles, RefreshCcw } from "lucide-react";
import type { ProductCategory } from "@/types";

function alternatives(category: ProductCategory, selectedName?: string) {
  return MOCK_PRODUCTS.filter((p) => p.category === category && p.name !== selectedName).slice(0, 2);
}

export default function ProposalSummary() {
  const navigate = useNavigate();
  const { push } = useToasts();
  const profile = useAppStore((s) => s.customerProfile);
  const input = useAppStore((s) => s.customerInput);
  const selectedOutfit = useAppStore((s) => s.selectedOutfit);
  const talkByType = useAppStore((s) => s.talkByType);
  const reset = useAppStore((s) => s.resetProposal);

  const efficiency = calculateEfficiencyImpact();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-floatIn">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">Proposal Summary</Tag>
            <Tag tone="good">业务闭环</Tag>
          </div>
          <div className="mt-4 font-display text-3xl tracking-tight text-mist-50 sm:text-4xl">最终提案结果</div>
          <div className="mt-2 text-sm text-mist-50/70">把“画像 + 选品 + 话术 + 预览 + 效率收益”集中输出，适合现场演示。</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => push({ tone: "success", title: "已保存提案（Demo）", description: "真实版本可写入门店 CRM" })}
          >
            <Save className="h-4 w-4" />
            保存提案
          </Button>
          <Button
            variant="secondary"
            onClick={() => push({ tone: "info", title: "已导出提案（Demo）", description: "真实版本可导出 PDF 或发送给顾客" })}
          >
            <Download className="h-4 w-4" />
            导出提案
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              reset();
              push({ tone: "info", title: "已开启下一位顾客", description: "进入 Customer Intake" });
              navigate("/app/intake");
            }}
          >
            创建下一个顾客提案 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader>
            <CardTitle>顾客画像摘要</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              ["风格方向", profile?.styleDirection ?? "—"],
              ["体型与版型建议", profile?.bodyAndFitInsight ?? "—"],
              ["推荐颜色", profile?.colorRecommendation?.join(", ") ?? "—"],
              ["推荐品类", profile?.recommendedCategories?.join(", ") ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white/[0.035] px-4 py-4 ring-1 ring-white/10">
                <div className="text-xs text-mist-50/60">{k}</div>
                <div className="mt-2 text-sm leading-7 text-mist-50/80">{v}</div>
              </div>
            ))}
            <div className="rounded-2xl bg-white/[0.03] px-4 py-4 ring-1 ring-white/10 sm:col-span-2">
              <div className="text-xs text-mist-50/60">顾客输入（用于接客记录）</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag tone="neutral">{input.currentStyle}</Tag>
                <Tag tone="neutral">{input.scenario}</Tag>
                <Tag tone="neutral">{input.budget}</Tag>
                <Tag tone="accent">Fit {input.fitPreference}</Tag>
              </div>
              <div className="mt-3 text-sm leading-7 text-mist-50/70">
                喜欢：{input.likedColors.join(" / ") || "—"}；不喜欢：{input.dislikedColors || "—"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>效率提升指标</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {efficiency.map((m) => (
              <div key={m.label} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.035] px-3 py-2 ring-1 ring-white/10">
                <div className="text-xs text-mist-50/60">{m.label}</div>
                <Tag tone={m.emphasis === "good" ? "good" : m.emphasis === "warn" ? "warn" : "neutral"}>{m.value}</Tag>
              </div>
            ))}
            <div className="mt-3 rounded-2xl bg-gradient-to-b from-aurora-500/10 to-white/[0.02] px-4 py-4 ring-1 ring-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-aurora-200" />
                <div className="text-sm font-medium text-mist-50">路演卖点</div>
              </div>
              <div className="mt-2 text-sm leading-6 text-mist-50/75">
                新人店员也能稳定产出高质量提案，让门店接客效率与交叉销售更可控。
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>已选择商品（含理由）</CardTitle>
              <div className="mt-2 text-sm text-mist-50/70">形成可销售的整套 Outfit，并实时计算总价与整体匹配分。</div>
            </div>
            <div className="flex items-center gap-2">
              <Tag tone="accent">Total {formatJPY(selectedOutfit.totalPrice)}</Tag>
              <Tag tone="good">Match {selectedOutfit.overallMatchScore || 0}%</Tag>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            {CATEGORIES.map((c) => {
              const it = selectedOutfit.itemsByCategory[c];
              return (
                <div key={c} className="rounded-2xl bg-white/[0.035] px-5 py-4 ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-mist-50/60">{c}</div>
                      <div className="mt-1 truncate font-display text-lg tracking-tight text-mist-50">{it ? it.name : "—"}</div>
                      {it ? (
                        <>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Tag tone="neutral">{formatJPY(it.price)}</Tag>
                            <Tag tone={it.stock === "Low Stock" ? "warn" : "good"}>{it.stock}</Tag>
                            <Tag tone="accent">{it.matchScore}%</Tag>
                          </div>
                          <div className="mt-3 text-sm leading-7 text-mist-50/75">{it.reason}</div>
                        </>
                      ) : (
                        <div className="mt-2 text-sm text-mist-50/65">该分类尚未选择商品。</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.03] px-6 py-5 ring-1 ring-white/10">
              <div className="text-xs text-mist-50/60">AI 生成的最终接客话术</div>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-mist-50/80">{talkByType["标准推荐话术"] || "—"}</div>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="secondary" onClick={() => navigate("/app/talk")}>
                  去切换话术类型
                </Button>
                <Button variant="secondary" onClick={() => navigate("/app/preview")}>
                  查看虚拟预览
                </Button>
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.03] px-6 py-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-mist-50/60">替代商品建议</div>
                  <div className="mt-2 text-sm text-mist-50/70">当顾客犹豫、缺码或预算变化时，用于快速替换。</div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    push({ tone: "info", title: "已刷新替代建议（Demo）", description: "真实版本可按库存实时更新" });
                  }}
                >
                  <RefreshCcw className="h-4 w-4" />
                  刷新
                </Button>
              </div>
              <div className="mt-4 grid gap-3">
                {CATEGORIES.slice(0, 3).map((c) => {
                  const it = selectedOutfit.itemsByCategory[c];
                  const alt = alternatives(c, it?.name);
                  return (
                    <div key={c} className="rounded-2xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/10">
                      <div className="text-xs text-mist-50/60">{c}</div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {alt.map((p) => (
                          <div key={p.id} className="rounded-xl bg-white/[0.03] px-3 py-2 ring-1 ring-white/10">
                            <div className="truncate text-sm font-medium text-mist-50">{p.name}</div>
                            <div className="mt-1 text-xs text-mist-50/60">
                              {formatJPY(p.price)} · {p.stock} · {p.matchScore}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.03] px-6 py-5 ring-1 ring-white/10">
              <div className="text-xs text-mist-50/60">下一次推荐建议</div>
              <div className="mt-3 text-sm leading-7 text-mist-50/75">
                下次到店可推荐：轻量风衣/针织开衫作为季节过渡单品；或用更精致的皮鞋/皮包进行高客单 Upsell。
              </div>
              <div className="mt-4 text-xs text-mist-50/70">用于提示店员“留钩子”，形成持续经营。</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
