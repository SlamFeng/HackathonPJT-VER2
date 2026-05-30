import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { generateVirtualOutfitPreview } from "@/mock-ai/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { CircularGauge } from "@/components/CircularGauge";
import { formatJPY } from "@/utils/format";
import { useToasts } from "@/components/ToastProvider";
import { ArrowRight, Send, ShoppingCart, Sparkles, Save } from "lucide-react";

export default function VirtualPreview() {
  const navigate = useNavigate();
  const { push } = useToasts();
  const profile = useAppStore((s) => s.customerProfile);
  const customerPhoto = useAppStore((s) => s.customerPhoto);
  const selectedOutfit = useAppStore((s) => s.selectedOutfit);
  const preview = useAppStore((s) => s.virtualPreview);
  const setPreview = useAppStore((s) => s.setVirtualPreview);

  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(14);

  React.useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 94 ? p : p + Math.max(1.2, (96 - p) * 0.06)));
    }, 120);
    return () => window.clearInterval(id);
  }, [loading]);

  const onGenerate = async () => {
    if (!profile) {
      push({ tone: "warn", title: "缺少顾客画像", description: "请先生成 AI Profile" });
      navigate("/app/intake");
      return;
    }
    setLoading(true);
    try {
      const res = await generateVirtualOutfitPreview(selectedOutfit, profile);
      setProgress(100);
      window.setTimeout(() => {
        setPreview(res);
        setLoading(false);
        push({ tone: "success", title: "虚拟穿搭预览已生成", description: "可用于现场路演展示成果感" });
      }, 240);
    } catch {
      setLoading(false);
      push({ tone: "warn", title: "生成失败", description: "请重试（Demo Mock）" });
    }
  };

  const selectedItems = Object.values(selectedOutfit.itemsByCategory).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-floatIn">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">Virtual Outfit Preview</Tag>
            <Tag tone="good">最终成果感</Tag>
          </div>
          <div className="mt-4 font-display text-3xl tracking-tight text-mist-50 sm:text-4xl">个性化虚拟穿搭预览</div>
          <div className="mt-2 text-sm text-mist-50/70">Demo 版本使用风格化插画/渐变人物卡片模拟最终效果。</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate("/app/talk")}>
            返回话术
          </Button>
          <Button variant="primary" onClick={() => navigate("/app/summary")}>
            进入提案汇总 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Preview Panel</CardTitle>
              <div className="mt-2 text-sm text-mist-50/70">
                点击按钮生成预览，并展示 Outfit Name、Match Score、Purchase Confidence 与总价。
              </div>
            </div>
            <Button variant="primary" onClick={onGenerate} disabled={loading}>
              生成虚拟穿搭预览 <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] ring-1 ring-white/10">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-aurora-500/18 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-champagne-400/16 blur-3xl" />
            <div className="relative px-6 pb-6 pt-6">
              <div className="text-xs text-mist-50/60">Silhouette / Illustration</div>
              <div className="mt-2 font-display text-2xl tracking-tight text-mist-50">{preview?.outfitName ?? profile?.styleDirection ?? "—"}</div>
              <div className="mt-4 aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-ink-900/60 to-ink-950/60 ring-1 ring-white/10">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(110,122,199,0.22),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(201,164,106,0.16),transparent_55%)]" />
                  {customerPhoto ? (
                    <div className="absolute inset-0">
                      <img src={customerPhoto.dataUrl} alt="OOTD Reference" className="h-full w-full object-cover opacity-[0.92]" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/10 to-ink-950/45" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-52 w-28 rounded-[999px] bg-white/[0.06] ring-1 ring-white/10 blur-[0.2px]" />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 text-sm text-mist-50/70">用于路演的“成果卡”，强调提案已经可以直接发给顾客。</div>
            </div>
            <div className="pointer-events-none absolute inset-0 lp-noise" />
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <CircularGauge value={preview?.styleMatchScore ?? selectedOutfit.overallMatchScore ?? 0} label="Style Match Score" tone="accent" />
              <CircularGauge value={preview?.purchaseConfidence ?? 0} label="Purchase Confidence" tone="good" />
            </div>

            <div className="rounded-3xl bg-white/[0.035] px-6 py-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-mist-50/60">Total Price</div>
                <div className="font-display text-2xl tracking-tight text-mist-50">{formatJPY(selectedOutfit.totalPrice)}</div>
              </div>
              <div className="mt-4 grid gap-2">
                {selectedItems.length ? (
                  selectedItems.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.03] px-4 py-2.5 ring-1 ring-white/10">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-mist-50">{p.name}</div>
                        <div className="mt-0.5 text-xs text-mist-50/60">
                          {p.category} · {p.color} · {p.stock}
                        </div>
                      </div>
                      <Tag tone="accent">{p.matchScore}%</Tag>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-white/[0.03] px-4 py-3 text-sm text-mist-50/70 ring-1 ring-white/10">
                    还未选择商品。建议先在 Product Recommendation 选满 3~4 件形成完整提案。
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.03] px-6 py-5 ring-1 ring-white/10">
              <div className="text-xs text-mist-50/60">Outfit Summary</div>
              <div className="mt-3 text-sm leading-7 text-mist-50/80">
                {preview?.summary ??
                  "点击“生成虚拟穿搭预览”后，会展示一段可直接用于提案页面的总结描述。"}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => push({ tone: "info", title: "已发送给顾客（Demo）", description: "可在真实版本接入短信/IM" })}
                >
                  <Send className="h-4 w-4" />
                  发送给顾客
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => push({ tone: "success", title: "已加入购物车（Demo）", description: "可在真实版本接入门店 POS" })}
                >
                  <ShoppingCart className="h-4 w-4" />
                  加入购物车
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => push({ tone: "success", title: "已保存提案（Demo）", description: "可在真实版本写入 CRM" })}
                >
                  <Save className="h-4 w-4" />
                  保存提案
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingOverlay
          title="正在生成个性化虚拟穿搭预览…"
          description="Mock AI 正在合成评分、库存信心与提案摘要"
          progress={progress}
        />
      ) : null}
    </div>
  );
}
