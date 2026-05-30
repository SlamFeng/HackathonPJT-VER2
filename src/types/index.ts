export type HeightPreference = "Short" | "Average" | "Tall";
export type BodyType = "Slim" | "Regular" | "Curvy";
export type AgeRange = "Teens" | "20s" | "30s" | "40s+";
export type CurrentStyle = "Casual" | "Workwear" | "Office" | "Street" | "Minimal";
export type UsageScenario = "通勤" | "约会" | "旅行" | "周末休闲" | "商务";
export type BudgetRange = "¥10,000" | "¥20,000" | "¥30,000" | "¥50,000+";
export type FitPreference = "Slim" | "Regular" | "Relaxed" | "Oversized";
export type ColorName =
  | "Khaki"
  | "Navy"
  | "Black"
  | "White"
  | "Off-white"
  | "Beige"
  | "Gray"
  | "Brown"
  | "Light Blue";

export type ProductCategory = "Hat" | "Jacket" | "Innerwear" | "Pants" | "Shoes" | "Bag";
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type CustomerInput = {
  heightPreference: HeightPreference;
  bodyType: BodyType;
  ageRange: AgeRange;
  currentStyle: CurrentStyle;
  scenario: UsageScenario;
  budget: BudgetRange;
  fitPreference: FitPreference;
  likedColors: ColorName[];
  dislikedColors: string;
};

export type CustomerProfile = {
  styleDirection: string;
  bodyAndFitInsight: string;
  colorRecommendation: ColorName[];
  recommendedCategories: ProductCategory[];
  avoid: string[];
  rationaleSummary: string;
};

export type CustomerPhoto = {
  name: string;
  dataUrl: string;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  color: ColorName | string;
  sizes: string[];
  price: number;
  stock: StockStatus;
  styleTags: string[];
  matchScore: number;
  reason: string;
};

export type OOTDItem = {
  category: ProductCategory;
  itemName: string;
  style: string;
  color: string;
  matchScore: number;
  reason: string;
  thumbnailUrl?: string;
  labelZh?: string;
};

export type SelectedOutfit = {
  itemsByCategory: Partial<Record<ProductCategory, Product>>;
  totalPrice: number;
  overallMatchScore: number;
};

export type SalesTalkType =
  | "标准推荐话术"
  | "简短版话术"
  | "Upsell 话术"
  | "顾客犹豫时应对话术"
  | "尺码建议话术";

export type SalesTalk = {
  type: SalesTalkType;
  content: string;
};

export type VirtualOutfitPreview = {
  outfitName: string;
  styleMatchScore: number;
  purchaseConfidence: number;
  summary: string;
};

export type EfficiencyMetric = {
  label: string;
  value: string;
  helper?: string;
  emphasis?: "good" | "neutral" | "warn";
};
