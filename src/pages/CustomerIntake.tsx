import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { InputPills, MultiSelectChips } from "@/components/InputPills";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useAppStore } from "@/app/store";
import { generateCustomerProfile } from "@/mock-ai/ai";
import type { AgeRange, BodyType, BudgetRange, ColorName, CurrentStyle, FitPreference, HeightPreference, UsageScenario } from "@/types";
import { useToasts } from "@/components/ToastProvider";
import { ArrowRight, Sparkles } from "lucide-react";
import { PhotoUploader } from "@/components/PhotoUploader";

export default function CustomerIntake() {
  const navigate = useNavigate();
  const { push } = useToasts();
  const input = useAppStore((s) => s.customerInput);
  const update = useAppStore((s) => s.updateCustomerInput);
  const setProfile = useAppStore((s) => s.setCustomerProfile);
  const customerPhoto = useAppStore((s) => s.customerPhoto);
  const setCustomerPhoto = useAppStore((s) => s.setCustomerPhoto);

  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    if (!loading) return;
    setProgress(12);
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + Math.max(1.2, (96 - p) * 0.06)));
    }, 120);
    return () => window.clearInterval(id);
  }, [loading]);

  const onGenerate = async () => {
    setLoading(true);
    try {
      const profile = await generateCustomerProfile(input);
      setProgress(100);
      window.setTimeout(() => {
        setProfile(profile);
        setLoading(false);
        push({ tone: "success", title: "AI 顾客画像已生成", description: "进入 AI Profile 查看结构化结果" });
        navigate("/app/profile");
      }, 240);
    } catch {
      setLoading(false);
      push({ tone: "warn", title: "生成失败", description: "请重试（Demo Mock）" });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.42fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Customer Intake</CardTitle>
              <div className="mt-2 text-sm text-mist-50/70">快速录入关键信息，让 AI 帮你生成可执行的搭配策略。</div>
            </div>
            <Tag tone="accent" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              实时摘要同步更新
            </Tag>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <InputPills<HeightPreference>
              label="身高倾向"
              value={input.heightPreference}
              options={[
                { value: "Short", label: "Short" },
                { value: "Average", label: "Average" },
                { value: "Tall", label: "Tall" },
              ]}
              onChange={(v) => update({ heightPreference: v })}
            />
            <InputPills<BodyType>
              label="体型"
              value={input.bodyType}
              options={[
                { value: "Slim", label: "Slim" },
                { value: "Regular", label: "Regular" },
                { value: "Curvy", label: "Curvy" },
              ]}
              onChange={(v) => update({ bodyType: v })}
            />
            <InputPills<AgeRange>
              label="年龄段"
              value={input.ageRange}
              options={[
                { value: "Teens", label: "Teens" },
                { value: "20s", label: "20s" },
                { value: "30s", label: "30s" },
                { value: "40s+", label: "40s+" },
              ]}
              onChange={(v) => update({ ageRange: v })}
            />
            <InputPills<CurrentStyle>
              label="当前风格"
              value={input.currentStyle}
              options={[
                { value: "Casual", label: "Casual" },
                { value: "Workwear", label: "Workwear" },
                { value: "Office", label: "Office" },
                { value: "Street", label: "Street" },
                { value: "Minimal", label: "Minimal" },
              ]}
              onChange={(v) => update({ currentStyle: v })}
            />
            <InputPills<UsageScenario>
              label="使用场景"
              value={input.scenario}
              options={[
                { value: "通勤", label: "通勤" },
                { value: "约会", label: "约会" },
                { value: "旅行", label: "旅行" },
                { value: "周末休闲", label: "周末休闲" },
                { value: "商务", label: "商务" },
              ]}
              onChange={(v) => update({ scenario: v })}
            />
            <InputPills<BudgetRange>
              label="预算"
              value={input.budget}
              options={[
                { value: "¥10,000", label: "¥10,000" },
                { value: "¥20,000", label: "¥20,000" },
                { value: "¥30,000", label: "¥30,000" },
                { value: "¥50,000+", label: "¥50,000+" },
              ]}
              onChange={(v) => update({ budget: v })}
            />
            <InputPills<FitPreference>
              label="偏好版型"
              value={input.fitPreference}
              options={[
                { value: "Slim", label: "Slim" },
                { value: "Regular", label: "Regular" },
                { value: "Relaxed", label: "Relaxed" },
                { value: "Oversized", label: "Oversized" },
              ]}
              onChange={(v) => update({ fitPreference: v })}
            />
            <div className="rounded-2xl bg-white/[0.035] px-4 py-4 ring-1 ring-white/10">
              <div className="text-xs text-mist-50/60">不喜欢的颜色</div>
              <input
                value={input.dislikedColors}
                onChange={(e) => update({ dislikedColors: e.target.value })}
                className="mt-2 h-11 w-full rounded-xl bg-white/[0.05] px-3 text-sm text-mist-50 outline-none ring-1 ring-white/10 placeholder:text-mist-50/55 focus:ring-white/20"
                placeholder="Bright Red / Neon / Pink / Yellow"
              />
              <div className="mt-2 text-xs text-mist-50/70">用于过滤“踩雷配色”，让推荐更稳。</div>
            </div>
          </div>

          <MultiSelectChips<ColorName>
            label="喜欢的颜色"
            values={input.likedColors}
            options={[
              { value: "Khaki", label: "Khaki" },
              { value: "Navy", label: "Navy" },
              { value: "Black", label: "Black" },
              { value: "White", label: "White" },
              { value: "Beige", label: "Beige" },
              { value: "Gray", label: "Gray" },
              { value: "Brown", label: "Brown" },
            ]}
            onChange={(next) => update({ likedColors: next })}
          />

          <PhotoUploader
            title="真人照片参考（用于拆取 OOTD）"
            subtitle="上传后会在 OOTD Breakdown 里按照片风格生成单品拆解（Demo Mock）。"
            value={customerPhoto}
            onChange={(p) => setCustomerPhoto(p)}
            onClear={() => setCustomerPhoto(null)}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-aurora-500/10 via-white/[0.02] to-champagne-400/10 px-5 py-4 ring-1 ring-white/10">
            <div className="text-sm text-mist-50/75">底部一键生成结构化顾客画像（展示 AI 分析与加载态）。</div>
            <Button variant="primary" size="lg" onClick={onGenerate} disabled={loading}>
              生成 AI 顾客画像 <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="sticky top-6 h-fit overflow-hidden">
        <CardHeader>
          <CardTitle>Customer Input Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            ["身高倾向", input.heightPreference],
            ["体型", input.bodyType],
            ["年龄段", input.ageRange],
            ["当前风格", input.currentStyle],
            ["使用场景", input.scenario],
            ["预算", input.budget],
            ["偏好版型", input.fitPreference],
            ["喜欢的颜色", input.likedColors.join(" / ") || "—"],
            ["不喜欢的颜色", input.dislikedColors || "—"],
            ["参考照片", customerPhoto ? "已上传" : "未上传"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4 rounded-xl bg-white/[0.035] px-3 py-2 ring-1 ring-white/10">
              <div className="text-xs text-mist-50/75">{k}</div>
              <div className="text-right text-xs font-medium text-mist-50">{v}</div>
            </div>
          ))}
          <div className="mt-2 rounded-2xl bg-white/[0.03] px-4 py-4 ring-1 ring-white/10">
            <div className="text-xs text-mist-50/60">提示</div>
            <div className="mt-2 text-sm leading-6 text-mist-50/75">
              这个 Summary 卡片用于在接客时“边聊边录入”，让顾客感知到你在做专业的画像整理。
            </div>
          </div>
        </CardContent>
        <div className="pointer-events-none absolute inset-0 lp-noise" />
      </Card>

      {loading ? (
        <LoadingOverlay
          title="正在分析顾客风格与搭配需求…"
          description="Mock AI 正在组合风格规则、场景偏好、预算与库存策略"
          progress={progress}
        />
      ) : null}
    </div>
  );
}
