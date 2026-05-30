import type { ProductCategory, SalesTalkType } from "@/types";

export type AppStepKey =
  | "dashboard"
  | "intake"
  | "profile"
  | "ootd"
  | "recommend"
  | "talk"
  | "preview"
  | "summary";

export const APP_STEPS: { key: AppStepKey; label: string; path: string }[] = [
  { key: "dashboard", label: "Dashboard", path: "/app/dashboard" },
  { key: "intake", label: "Customer Intake", path: "/app/intake" },
  { key: "profile", label: "AI Profile", path: "/app/profile" },
  { key: "ootd", label: "OOTD Breakdown", path: "/app/ootd" },
  { key: "recommend", label: "Product Recommendation", path: "/app/recommend" },
  { key: "talk", label: "Sales Talk", path: "/app/talk" },
  { key: "preview", label: "Virtual Preview", path: "/app/preview" },
  { key: "summary", label: "Proposal Summary", path: "/app/summary" },
];

export const TALK_TYPES: SalesTalkType[] = [
  "标准推荐话术",
  "简短版话术",
  "Upsell 话术",
  "顾客犹豫时应对话术",
  "尺码建议话术",
];

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  Hat: "Hat",
  Jacket: "Jacket",
  Innerwear: "Innerwear",
  Pants: "Pants",
  Shoes: "Shoes",
  Bag: "Bag",
};

