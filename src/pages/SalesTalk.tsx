import { TALK_TYPES } from "@/app/steps";
import { useAppStore } from "@/app/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { useToasts } from "@/components/ToastProvider";
import { cn } from "@/lib/utils";
import { ArrowRight, Copy, MessageSquareText, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SalesTalk() {
  const navigate = useNavigate();
  const { push } = useToasts();
  const talkType = useAppStore((s) => s.talkType);
  const setTalkType = useAppStore((s) => s.setTalkType);
  const talkByType = useAppStore((s) => s.talkByType);
  const selectedOutfit = useAppStore((s) => s.selectedOutfit);

  const content = talkByType[talkType] || "请先在 Product Recommendation 选择商品。";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      push({ tone: "success", title: "已复制到剪贴板", description: talkType });
    } catch {
      push({ tone: "warn", title: "复制失败", description: "浏览器可能限制了剪贴板权限" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-floatIn">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">Sales Talk Generator</Tag>
            <Tag tone="good">新人店员也能专业推荐</Tag>
          </div>
          <div className="mt-4 font-display text-3xl tracking-tight text-mist-50 sm:text-4xl">接客话术一键生成</div>
          <div className="mt-2 text-sm text-mist-50/70">
            根据你已选择的商品自动生成不同类型话术：标准/简短/Upsell/犹豫应对/尺码建议。
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate("/app/recommend")}>
            返回选品
          </Button>
          <Button variant="primary" onClick={() => navigate("/app/preview")}>
            进入虚拟预览 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>话术类型</CardTitle>
              <div className="mt-2 text-sm text-mist-50/70">
                选中商品后会自动更新话术。当前已选商品数：{Object.values(selectedOutfit.itemsByCategory).filter(Boolean).length}
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
              <MessageSquareText className="h-5 w-5 text-aurora-200" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {TALK_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTalkType(t)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm ring-1 transition-all",
                  t === talkType
                    ? "bg-white/[0.08] text-mist-50 ring-white/20 shadow-glow"
                    : "bg-white/[0.04] text-mist-50/75 ring-white/10 hover:bg-white/[0.06] hover:text-mist-50",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.03] px-6 py-6 ring-1 ring-white/10">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-aurora-200" />
                <div className="text-sm font-medium text-mist-50">{talkType}</div>
              </div>
              <Button variant="secondary" onClick={copy}>
                <Copy className="h-4 w-4" />
                一键复制
              </Button>
            </div>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-mist-50/80">{content}</div>
            <div className="mt-4 rounded-2xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/10">
              <div className="text-xs text-mist-50/60">新人提示</div>
              <div className="mt-2 text-sm leading-6 text-mist-50/75">
                话术已包含“风格匹配 + 版型建议 + 场景理由 + 可延展推荐”，新人也能快速做到专业表达。
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

