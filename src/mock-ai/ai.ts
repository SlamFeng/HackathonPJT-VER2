import { MOCK_PRODUCTS } from "@/mock-data/products";
import type {
  CustomerInput,
  CustomerPhoto,
  CustomerProfile,
  EfficiencyMetric,
  OOTDItem,
  Product,
  ProductCategory,
  SalesTalk,
  SalesTalkType,
  SelectedOutfit,
  VirtualOutfitPreview,
} from "@/types";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function budgetCap(budget: CustomerInput["budget"]) {
  if (budget === "¥10,000") return 10000;
  if (budget === "¥20,000") return 20000;
  if (budget === "¥30,000") return 30000;
  return 999999;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function inferredStyleDirection(input: CustomerInput): string {
  if (input.currentStyle === "Workwear") return "Urban Workwear Casual";
  if (input.currentStyle === "Office") return input.scenario === "商务" ? "Modern Office Sharp" : "Soft Office Minimal";
  if (input.currentStyle === "Street") return "Street Utility Minimal";
  if (input.currentStyle === "Minimal") return "Clean Minimal Neutral";
  return "Relaxed Casual Minimal";
}

export async function generateCustomerProfile(input: CustomerInput): Promise<CustomerProfile> {
  await delay(1100);

  const styleDirection = inferredStyleDirection(input);
  const avoid: string[] = [];
  if (input.fitPreference === "Slim") avoid.push("过于宽松的外套与裤装会削弱利落感");
  if (input.fitPreference === "Oversized") avoid.push("过于紧身的外套与内搭会影响整体比例");
  avoid.push("过于鲜艳的撞色组合");

  const recommendedCategories: ProductCategory[] =
    input.currentStyle === "Workwear"
      ? ["Jacket", "Pants", "Shoes", "Innerwear", "Bag", "Hat"]
      : input.currentStyle === "Office"
        ? ["Jacket", "Innerwear", "Pants", "Shoes", "Bag", "Hat"]
        : ["Jacket", "Pants", "Shoes", "Innerwear", "Bag", "Hat"];

  const baseColors = input.likedColors.length ? input.likedColors : (["Khaki", "Navy", "Black"] as const);
  const colorRecommendation = uniq([...baseColors, "Off-white"]).slice(0, 4) as CustomerProfile["colorRecommendation"];

  const bodyAndFitInsight = `${input.heightPreference} / ${input.bodyType} body type. ${input.fitPreference} fit is recommended to balance the silhouette.`;

  const rationaleSummary =
    "将顾客的风格偏好与场景需求转化为可落地的店内选品策略：用“外套轮廓 + 下装比例 + 鞋履收尾”快速建立可销售的整套搭配，并用中性色系提升复购与可穿性。";

  return {
    styleDirection,
    bodyAndFitInsight,
    colorRecommendation,
    recommendedCategories,
    avoid,
    rationaleSummary,
  };
}

export async function generateOOTDBreakdown(profile: CustomerProfile): Promise<OOTDItem[]> {
  await delay(1200);

  const workwearCore: OOTDItem[] = [
    {
      category: "Hat",
      itemName: "Nylon Utility Cap",
      style: "Workwear",
      color: "Khaki",
      matchScore: 84,
      reason: "让整体更像“门店导购的标准化 Workwear 提案”，同时不抢主单品。",
    },
    {
      category: "Jacket",
      itemName: "Khaki Work Jacket",
      style: "Workwear",
      color: "Khaki",
      matchScore: 92,
      reason: "最能建立风格方向的核心单品，宽松轮廓利于修饰比例。",
    },
    {
      category: "Innerwear",
      itemName: "Off-white Heavy Tee",
      style: "Minimal",
      color: "Off-white",
      matchScore: 90,
      reason: "干净的内搭让外套更突出，也更适合多场景复用。",
    },
    {
      category: "Pants",
      itemName: "Relaxed Navy Pants",
      style: "Casual",
      color: "Navy",
      matchScore: 91,
      reason: "深色下装让上半身更轻，且利于门店搭配替换推荐。",
    },
    {
      category: "Shoes",
      itemName: "Minimal Black Sneakers",
      style: "Minimal",
      color: "Black",
      matchScore: 88,
      reason: "提升购买信心的“安全选择”，适合通勤与周末。",
    },
    {
      category: "Bag",
      itemName: "Nylon Crossbody Bag",
      style: "Utility",
      color: "Black",
      matchScore: 87,
      reason: "强化机能感并支持 Upsell，不影响整体中性色调。",
    },
  ];

  if (profile.styleDirection.includes("Workwear")) return workwearCore;
  if (profile.styleDirection.includes("Office"))
    return workwearCore.map((i) => ({
      ...i,
      matchScore: clamp(i.matchScore - 4, 75, 96),
      reason: i.reason.replace("Workwear", "Office"),
    }));

  return workwearCore.map((i) => ({ ...i, matchScore: clamp(i.matchScore - 2, 75, 96) }));
}

export async function generateOOTDBreakdownFromPhoto(
  photo: CustomerPhoto,
  input: CustomerInput,
  profile: CustomerProfile,
): Promise<OOTDItem[]> {
  await delay(1100);

  const base: OOTDItem[] = [
    {
      category: "Hat",
      itemName: "Duckbill Baseball Cap",
      style: "Workwear",
      color: "Navy",
      matchScore: 86,
      reason: "参考照片：鸭舌帽强化休闲工装氛围，同时保持上半身清爽利落。",
    },
    {
      category: "Jacket",
      itemName: "Detroit Work Jacket",
      style: "Workwear",
      color: "Khaki",
      matchScore: 93,
      reason: "参考照片：短款工装夹克是风格核心，搭配宽松裤装更显比例。",
    },
    {
      category: "Innerwear",
      itemName: "Cropped Hoodie",
      style: "Casual",
      color: "Black",
      matchScore: 90,
      reason: "参考照片：连帽内搭增强层次，黑色更好压住整体色彩。",
    },
    {
      category: "Pants",
      itemName: "Wide Curved Pants",
      style: "Casual",
      color: "Navy",
      matchScore: 91,
      reason: "参考照片：阔腿/弯刀裤型能制造下半身量感，让上衣短款更显腿长。",
    },
    {
      category: "Shoes",
      itemName: "Brown Work Boots",
      style: "Utility",
      color: "Brown",
      matchScore: 88,
      reason: "参考照片：工装靴为整体收尾，耐穿且更符合门店可销售的“完整度”。",
    },
    {
      category: "Bag",
      itemName: "Workwear Canvas Tote",
      style: "Utility",
      color: "Khaki",
      matchScore: 87,
      reason: "参考照片：大容量帆布包强化工装气质，也自然引导配件 Upsell。",
    },
  ];

  const fitBoost = input.fitPreference === "Relaxed" || input.fitPreference === "Oversized" ? 2 : 0;
  const sceneBoost = input.scenario === "旅行" || input.scenario === "周末休闲" ? 1 : 0;
  const styleBoost = profile.styleDirection.includes("Workwear") ? 1 : 0;

  const boost = fitBoost + sceneBoost + styleBoost;
  return base.map((it) => ({
    ...it,
    matchScore: clamp(it.matchScore + boost, 76, 98),
    reason: `${it.reason}（图像：${photo.name}）`,
  }));
}

export async function recommendProducts(category: ProductCategory, input: CustomerInput, profile: CustomerProfile): Promise<Product[]> {
  await delay(700);

  const cap = budgetCap(input.budget);
  const preferredStyleTags = profile.styleDirection.includes("Workwear")
    ? ["Workwear", "Casual", "Minimal"]
    : profile.styleDirection.includes("Office")
      ? ["Office", "Minimal"]
      : ["Casual", "Minimal", "Street"];

  const likedColors = input.likedColors.length ? input.likedColors : profile.colorRecommendation;

  const candidates = MOCK_PRODUCTS.filter((p) => p.category === category && p.stock !== "Out of Stock").map((p) => {
    let score = p.matchScore;

    const hasStyle = p.styleTags.some((t) => preferredStyleTags.includes(t));
    if (hasStyle) score += 4;

    const fit = input.fitPreference;
    if (fit === "Relaxed" && p.styleTags.includes("Relaxed")) score += 3;
    if (fit === "Oversized" && p.styleTags.includes("Oversized")) score += 3;
    if (fit === "Slim" && p.styleTags.includes("Slim")) score += 3;

    if (likedColors.includes(p.color as never)) score += 4;
    if (p.stock === "Low Stock") score -= 2;

    if (cap <= 10000) score += p.price <= 9000 ? 3 : -2;
    if (cap <= 20000) score += p.price <= 13000 ? 2 : -1;

    return { ...p, matchScore: clamp(score, 72, 98) };
  });

  return candidates
    .sort((a, b) => b.matchScore - a.matchScore || a.price - b.price)
    .slice(0, 3)
    .map((p, idx) => ({ ...p, id: `${p.id}-${idx}` }));
}

export function calculateSelectedOutfit(itemsByCategory: SelectedOutfit["itemsByCategory"]): SelectedOutfit {
  const items = Object.values(itemsByCategory).filter(Boolean) as Product[];
  const totalPrice = items.reduce((acc, p) => acc + p.price, 0);
  const baseScore = items.length ? items.reduce((acc, p) => acc + p.matchScore, 0) / items.length : 0;
  const penalty = items.some((p) => p.stock === "Low Stock") ? 1.2 : 0;
  const overallMatchScore = clamp(Math.round(baseScore - penalty), 0, 98);
  return { itemsByCategory, totalPrice, overallMatchScore };
}

export function generateSalesTalk(selected: SelectedOutfit, profile: CustomerProfile, talkType: SalesTalkType): SalesTalk {
  const items = Object.values(selected.itemsByCategory).filter(Boolean) as Product[];
  const hero = items[0] ?? null;
  const outfitName = profile.styleDirection;
  const mainPiece = hero ? `这件${hero.color}的${hero.name}` : "这套搭配";

  const sizeHint =
    hero?.sizes?.length && hero.sizes.includes("L")
      ? "如果想要更自然的宽松轮廓，建议选择 L 码；如果希望更利落，可以选择 M 码。"
      : "建议根据肩线与袖长选择合身尺码，想更宽松可上调一档。";

  if (talkType === "标准推荐话术") {
    return {
      type: talkType,
      content: `${mainPiece}和您想要的${outfitName}风格很匹配。版型会更偏向“好看又好穿”的日常轮廓，既能修饰比例，也方便在门店里替换不同下装/鞋履来做延展搭配。整体颜色以中性色为主，更耐看也更容易复穿。`,
    };
  }

  if (talkType === "简短版话术") {
    return {
      type: talkType,
      content: `${mainPiece}很适合${outfitName}方向，中性色好搭配，通勤和周末都能直接穿。`,
    };
  }

  if (talkType === "Upsell 话术") {
    const upsell = items.find((p) => p.category === "Shoes") ?? items.find((p) => p.category === "Bag");
    if (!upsell) {
      return {
        type: talkType,
        content: "如果想让整体更完整，我们可以再补一件“收尾单品”（鞋或包），会让风格更统一、也更显质感。",
      };
    }
    return {
      type: talkType,
      content: `如果想让整体更完整，可以一起搭配这款${upsell.color}的${upsell.name}。它能把上半身的风格稳住，同时也很适合日常通勤和周末外出，属于“买了就经常用”的加分单品。`,
    };
  }

  if (talkType === "顾客犹豫时应对话术") {
    return {
      type: talkType,
      content:
        "如果您担心颜色或风格太明显，我们可以先从深色下装/简洁内搭开始搭配，让整体更稳重、更日常；之后再根据场景，把帽子/包这样的配件当作“可选加分项”。",
    };
  }

  return {
    type: talkType,
    content: sizeHint,
  };
}

export async function generateVirtualOutfitPreview(selected: SelectedOutfit, profile: CustomerProfile): Promise<VirtualOutfitPreview> {
  await delay(1300);

  const stockPenalty = Object.values(selected.itemsByCategory).some((p) => p?.stock === "Low Stock") ? 4 : 0;
  const purchaseConfidence = clamp(86 - stockPenalty + Math.round(selected.overallMatchScore / 30), 70, 95);
  const outfitName = profile.styleDirection;
  const summary =
    "A relaxed workwear-inspired outfit designed for weekend casual use, combining khaki outerwear, navy pants, and minimal black sneakers for a balanced and approachable look.";

  return {
    outfitName,
    styleMatchScore: clamp(selected.overallMatchScore || 92, 76, 96),
    purchaseConfidence,
    summary,
  };
}

export function calculateEfficiencyImpact(): EfficiencyMetric[] {
  return [
    { label: "传统提案时间", value: "15 分钟", emphasis: "warn" },
    { label: "LookPilot 提案时间", value: "3 分钟", emphasis: "good" },
    { label: "节省时间", value: "80%", emphasis: "good" },
    { label: "商品查找时间减少", value: "75%", emphasis: "good" },
    { label: "新人话术准备时间减少", value: "90%", emphasis: "good" },
    { label: "接客记录", value: "自动生成", emphasis: "neutral" },
  ];
}
