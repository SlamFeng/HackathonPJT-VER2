import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ImageUp, Trash2 } from "lucide-react";

export function PhotoUploader({
  title,
  subtitle,
  value,
  onChange,
  onClear,
}: {
  title: string;
  subtitle: string;
  value: { name: string; dataUrl: string } | null;
  onChange: (next: { name: string; dataUrl: string }) => void;
  onClear: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = React.useState(false);

  const pick = () => inputRef.current?.click();

  const readAsDataUrl = async (file: File) => {
    setBusy(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = () => reject(new Error("Failed to read file"));
        fr.readAsDataURL(file);
      });
      onChange({ name: file.name, dataUrl });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card variant="soft" className="overflow-hidden">
      <div className="px-5 pb-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-display text-lg tracking-tight text-mist-50">{title}</div>
            <div className="mt-1 text-sm text-mist-50/70">{subtitle}</div>
          </div>
          {value ? <Tag tone="accent">已上传</Tag> : <Tag tone="neutral">可选</Tag>}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/10">
          {value ? (
            <div className="relative">
              <img src={value.dataUrl} alt="OOTD Photo" className="h-56 w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/70 to-transparent px-4 pb-3 pt-8">
                <div className="text-xs text-mist-50/70">文件</div>
                <div className="mt-1 truncate text-sm font-medium text-mist-50">{value.name}</div>
              </div>
            </div>
          ) : (
            <div className="flex h-56 flex-col items-center justify-center gap-2 px-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
                <ImageUp className="h-5 w-5 text-aurora-200" />
              </div>
              <div className="text-sm font-medium text-mist-50">上传真人 OOTD 照片</div>
              <div className="text-xs leading-5 text-mist-50/70">用于拆取单品并生成 Pinterest 风格 OOTD Breakdown</div>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            void readAsDataUrl(file);
            e.target.value = "";
          }}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={pick} disabled={busy}>
            <ImageUp className="h-4 w-4" />
            {value ? "更换照片" : "选择照片"}
          </Button>
          {value ? (
            <Button variant="secondary" onClick={onClear} disabled={busy}>
              <Trash2 className="h-4 w-4" />
              移除
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

