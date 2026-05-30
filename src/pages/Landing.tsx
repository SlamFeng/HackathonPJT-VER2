import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="animate-floatIn">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-mist-50/70 ring-1 ring-white/10">
            <Sparkles className="h-4 w-4 text-aurora-200" />
            Productivity Enhancement / 业务效率化
          </div>
          <h1 className="mt-5 font-display text-4xl tracking-tight text-mist-50 sm:text-5xl">
            LookPilot AI Styling Workbench
          </h1>
          <p className="mt-3 text-lg text-mist-50/70">From customer profile to outfit proposal in 3 minutes</p>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-mist-50/70">
            面向线下服装门店的 AI 导购效率化工作台。通过顾客画像、OOTD 穿搭分解、店内商品推荐、销售话术生成和虚拟穿搭预览，帮助店员更快完成高质量个性化搭配提案。
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <Tag tone="good">提案时间减少 80%</Tag>
            <Tag tone="accent">新人店员快速上手</Tag>
            <Tag tone="neutral">商品推荐标准化</Tag>
            <Tag tone="warn">提升交叉销售机会</Tag>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" onClick={() => navigate("/app/dashboard")}>
              开始 Demo <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/app/intake")}
              className="hidden sm:inline-flex"
            >
              直接录入顾客
            </Button>
          </div>
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute -right-14 -top-14 h-56 w-56 rounded-full bg-aurora-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-champagne-400/14 blur-3xl" />
          <CardContent className="relative px-6 pb-6 pt-6">
            <div className="font-display text-xl tracking-tight text-mist-50">门店导购的 3 分钟闭环</div>
            <div className="mt-2 text-sm text-mist-50/70">把“经验活”变成“流程化可复用”的标准动作。</div>

            <div className="mt-6 grid gap-3">
              {[
                { k: "1", t: "Customer Intake", d: "结构化录入 + 实时摘要" },
                { k: "2", t: "AI Profile", d: "画像与风格方向一键生成" },
                { k: "3", t: "OOTD Breakdown", d: "强视觉拆解图用于现场说服" },
                { k: "4", t: "Product Rec", d: "店内选品标准化 + 实时总价/匹配分" },
                { k: "5", t: "Sales Talk", d: "新人也能输出专业话术" },
                { k: "6", t: "Virtual Preview", d: "最终成果感与提案输出" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-white/[0.045] px-4 py-3 ring-1 ring-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] text-sm font-semibold text-mist-50/85">
                      {s.k}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-mist-50">{s.t}</div>
                      <div className="mt-0.5 text-xs text-mist-50/65">{s.d}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="pointer-events-none absolute inset-0 lp-noise" />
        </Card>
      </div>
    </div>
  );
}

