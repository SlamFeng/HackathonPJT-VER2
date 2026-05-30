import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { OotdCanvas } from "@/components/OotdCanvas";
import { ArrowRight } from "lucide-react";
import { useToasts } from "@/components/ToastProvider";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { generateOOTDBreakdownFromPhoto } from "@/mock-ai/ai";

export default function OotdBreakdown() {
  const navigate = useNavigate();
  const { push } = useToasts();
  const profile = useAppStore((s) => s.customerProfile);
  const items = useAppStore((s) => s.ootdItems);
  const customerPhoto = useAppStore((s) => s.customerPhoto);
  const input = useAppStore((s) => s.customerInput);
  const activeCategory = useAppStore((s) => s.activeCategory);
  const setActiveCategory = useAppStore((s) => s.setActiveCategory);
  const setCustomerPhoto = useAppStore((s) => s.setCustomerPhoto);
  const setOOTD = useAppStore((s) => s.setOOTDItems);

  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(14);

  React.useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 94 ? p : p + Math.max(1.2, (96 - p) * 0.06)));
    }, 120);
    return () => window.clearInterval(id);
  }, [loading]);

  if (!profile || !items) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="px-6 py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-display text-2xl tracking-tight text-mist-50">还没有 OOTD Breakdown</div>
              <div className="mt-2 text-sm text-mist-50/70">请先在 AI Profile 生成穿搭分解图。</div>
            </div>
            <Button variant="primary" onClick={() => navigate("/app/profile")}>
              去生成 <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-floatIn">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">OOTD Breakdown</Tag>
            <Tag tone="good">路演视觉亮点</Tag>
            <Tag tone="neutral">可点击选品</Tag>
          </div>
          <div className="mt-4 font-display text-3xl tracking-tight text-mist-50 sm:text-4xl">
            {profile.styleDirection}
          </div>
          <div className="mt-2 text-sm text-mist-50/70">
            中心人物 + 周边单品卡片 + 曲线连接线，像小红书/Pinterest 的穿搭拆解图。
          </div>
        </div>
        <Button variant="secondary" size="lg" onClick={() => navigate("/app/recommend")}>
          进入商品推荐 <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <OotdCanvas
        items={items}
        activeCategory={activeCategory}
        centerPhotoUrl={customerPhoto?.dataUrl ?? null}
        onPhotoPicked={async (p) => {
          if (!profile) return;
          setCustomerPhoto(p);
          setLoading(true);
          try {
            const next = await generateOOTDBreakdownFromPhoto(p, input, profile);
            setProgress(100);
            window.setTimeout(() => {
              setOOTD(next);
              setLoading(false);
              push({ tone: "success", title: "已从照片拆解 OOTD", description: "点击贴纸查看单品并进入推荐" });
            }, 220);
          } catch {
            setLoading(false);
            push({ tone: "warn", title: "拆解失败", description: "请重试（Demo Mock）" });
          }
        }}
        onSelectCategory={(c) => {
          setActiveCategory(c);
          push({ tone: "info", title: `已选择 ${c}`, description: "进入该分类商品推荐" });
          navigate("/app/recommend");
        }}
      />

      {loading ? (
        <LoadingOverlay title="正在识别并拆解 OOTD…" description="本地裁切缩略图 + Mock 风格识别与单品结构化" progress={progress} />
      ) : null}
    </div>
  );
}
