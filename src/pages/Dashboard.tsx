import { useNavigate } from "react-router-dom";
import { DASHBOARD_METRICS, BEFORE_AFTER } from "@/mock-data/efficiency";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ArrowRight, TimerReset, Wand2 } from "lucide-react";
import { useAppStore } from "@/app/store";
import { useToasts } from "@/components/ToastProvider";

export default function Dashboard() {
  const navigate = useNavigate();
  const resetProposal = useAppStore((s) => s.resetProposal);
  const { push } = useToasts();

  return (
    <div className="space-y-6">
      <div className="grid items-end gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="animate-floatIn">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">门店效率看板</Tag>
            <Tag tone="good">提案流程自动化</Tag>
            <Tag tone="neutral">新人可复制</Tag>
          </div>
          <div className="mt-4 font-display text-3xl tracking-tight text-mist-50 sm:text-4xl">
            把搭配提案从 15 分钟缩短到 3 分钟
          </div>
          <div className="mt-3 max-w-2xl text-sm leading-7 text-mist-50/70">
            LookPilot 将“顾客画像整理、OOTD 分解、选品推荐、话术生成、提案输出”串成一条可视化流程。你只需要录入少量信息，即可快速得到可销售的整套提案。
          </div>
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-aurora-500/18 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-champagne-400/12 blur-3xl" />
          <CardContent className="relative px-6 pb-6 pt-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-mist-50/60">Today’s Impact</div>
                <div className="mt-2 font-display text-3xl tracking-tight text-mist-50">3.5 小时</div>
                <div className="mt-2 text-sm text-mist-50/70">预计节省时间（以 18 位顾客计算）</div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
                <TimerReset className="h-5 w-5 text-aurora-200" />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Tag tone="good">平均提案 3.2 分钟</Tag>
              <Tag tone="warn">传统 15 分钟</Tag>
              <Tag tone="accent">转化率 28%</Tag>
            </div>
          </CardContent>
          <div className="pointer-events-none absolute inset-0 lp-noise" />
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_METRICS.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Before / After</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/[0.04] px-5 py-5 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div className="font-display text-lg tracking-tight text-mist-50">Before</div>
              <Tag tone="warn">Manual + Experience</Tag>
            </div>
            <div className="mt-4 space-y-3">
              {BEFORE_AFTER.before.map((i) => (
                <div key={i.label} className="flex items-center justify-between gap-4">
                  <div className="text-sm text-mist-50/70">{i.label}</div>
                  <div className="text-sm font-medium text-mist-50">{i.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-b from-aurora-500/10 to-white/[0.03] px-5 py-5 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div className="font-display text-lg tracking-tight text-mist-50">After</div>
              <Tag tone="good">Automated Workflow</Tag>
            </div>
            <div className="mt-4 space-y-3">
              {BEFORE_AFTER.after.map((i) => (
                <div key={i.label} className="flex items-center justify-between gap-4">
                  <div className="text-sm text-mist-50/70">{i.label}</div>
                  <div className="text-sm font-medium text-mist-50">{i.value}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-mist-50/70">
          下一步：录入顾客信息 → 自动生成画像与 OOTD → 选品与话术 → 输出提案
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              resetProposal();
              push({ tone: "info", title: "已重置本次提案", description: "进入 Customer Intake 开始录入" });
              navigate("/app/intake");
            }}
          >
            创建新的顾客提案 <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              push({ tone: "success", title: "Demo Ready", description: "进入流程演示" });
              navigate("/app/intake");
            }}
          >
            开始生成 <Wand2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

