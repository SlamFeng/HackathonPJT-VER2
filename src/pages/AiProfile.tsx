import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { generateOOTDBreakdown } from "@/mock-ai/ai";
import { useToasts } from "@/components/ToastProvider";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { AvatarDoll } from "@/components/AvatarDoll";

export default function AiProfile() {
  const navigate = useNavigate();
  const { push } = useToasts();
  const profile = useAppStore((s) => s.customerProfile);
  const avatar = useAppStore((s) => s.avatar);
  const setOOTD = useAppStore((s) => s.setOOTDItems);

  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(18);

  React.useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 94 ? p : p + Math.max(1.1, (96 - p) * 0.06)));
    }, 120);
    return () => window.clearInterval(id);
  }, [loading]);

  const onGenerateOOTD = async () => {
    if (!profile) {
      push({ tone: "warn", title: "缺少顾客画像", description: "请先在 Customer Intake 生成画像" });
      navigate("/app/intake");
      return;
    }
    setLoading(true);
    try {
      const items = await generateOOTDBreakdown(profile);
      setProgress(100);
      window.setTimeout(() => {
        setOOTD(items);
        setLoading(false);
        push({ tone: "success", title: "OOTD Breakdown 已生成", description: "进入强视觉穿搭分解图" });
        navigate("/app/ootd");
      }, 240);
    } catch {
      setLoading(false);
      push({ tone: "warn", title: "生成失败", description: "请重试（Demo Mock）" });
    }
  };

  if (!profile) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="px-6 py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-display text-2xl tracking-tight text-mist-50">还没有顾客画像</div>
              <div className="mt-2 text-sm text-mist-50/70">请先回到 Customer Intake 生成结构化画像。</div>
            </div>
            <Button variant="primary" onClick={() => navigate("/app/intake")}>
              去录入 <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-floatIn">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">AI Customer Profile</Tag>
            <Tag tone="good">结构化可执行</Tag>
          </div>
          <div className="mt-4 font-display text-3xl tracking-tight text-mist-50 sm:text-4xl">{profile.styleDirection}</div>
          <div className="mt-2 text-sm text-mist-50/70">把顾客信息“翻译”为门店可落地的选品策略与搭配原则。</div>
        </div>
        <Button variant="primary" size="lg" onClick={onGenerateOOTD} disabled={loading}>
          生成 OOTD 穿搭分解图 <Wand2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>2D 人偶（体型可视化）</CardTitle>
          </CardHeader>
          <CardContent>
            {avatar ? (
              <div className="rounded-3xl bg-white/[0.03] p-4 ring-1 ring-white/10">
                <div className="mx-auto max-w-[240px]">
                  <AvatarDoll avatar={avatar} className="w-full" />
                </div>
                <div className="mt-3 text-sm text-mist-50/70">用于更直观观察体型轮廓与版型建议。</div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/[0.03] px-4 py-4 text-sm text-mist-50/70 ring-1 ring-white/10">
                点击上一页“生成 AI 顾客画像”后会自动生成 2D 人偶。
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>风格定位</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl tracking-tight text-mist-50">{profile.styleDirection}</div>
            <div className="mt-3 text-sm leading-7 text-mist-50/70">
              以“城市日常可复穿”为导向，用更稳的中性色调做门店可销售的搭配提案。
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>体型与版型建议</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm leading-7 text-mist-50/75">{profile.bodyAndFitInsight}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag tone="neutral">比例优化</Tag>
              <Tag tone="accent">轮廓优先</Tag>
              <Tag tone="good">更易成交</Tag>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>推荐颜色</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.colorRecommendation.map((c) => (
                <Tag key={c} tone="accent">
                  {c}
                </Tag>
              ))}
            </div>
            <div className="mt-3 text-sm leading-7 text-mist-50/70">优先中性色与低饱和度，让门店替换推荐更容易。</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader>
            <CardTitle>推荐单品类别</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {profile.recommendedCategories.map((c) => (
                <div key={c} className="rounded-2xl bg-white/[0.04] px-4 py-4 ring-1 ring-white/10">
                  <div className="text-xs text-mist-50/60">Category</div>
                  <div className="mt-2 font-display text-lg tracking-tight text-mist-50">{c}</div>
                  <div className="mt-2 text-xs text-mist-50/60">可直接引导顾客做搭配联想</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>避免事项</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile.avoid.map((a, idx) => (
                <div key={idx} className="rounded-xl bg-white/[0.035] px-3 py-2 text-sm text-mist-50/75 ring-1 ring-white/10">
                  {a}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden lg:col-span-3">
          <CardHeader>
            <CardTitle>推荐理由摘要</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-aurora-500/10 via-white/[0.02] to-champagne-400/10 px-5 py-5 ring-1 ring-white/10">
              <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
                <Sparkles className="h-4.5 w-4.5 text-aurora-200" />
              </div>
              <div>
                <div className="text-sm leading-7 text-mist-50/80">{profile.rationaleSummary}</div>
                <div className="mt-3 text-xs text-mist-50/70">下一步：生成 OOTD Breakdown 让顾客一眼看懂整套搭配。</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <LoadingOverlay title="正在生成 OOTD Breakdown…" description="Mock AI 正在组合核心单品与配件策略" progress={progress} />
      ) : null}
    </div>
  );
}
