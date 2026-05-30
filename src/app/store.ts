import { create } from "zustand";
import type {
  CustomerInput,
  CustomerProfile,
  OOTDItem,
  Product,
  ProductCategory,
  SalesTalkType,
  SelectedOutfit,
  VirtualOutfitPreview,
} from "@/types";
import { calculateSelectedOutfit, generateSalesTalk } from "@/mock-ai/ai";
import { TALK_TYPES } from "@/app/steps";

const DEFAULT_INPUT: CustomerInput = {
  heightPreference: "Average",
  bodyType: "Regular",
  ageRange: "20s",
  currentStyle: "Workwear",
  scenario: "通勤",
  budget: "¥20,000",
  fitPreference: "Relaxed",
  likedColors: ["Khaki", "Navy", "Black"],
  dislikedColors: "Bright Red / Neon / Pink / Yellow",
};

function emptyOutfit(): SelectedOutfit {
  return { itemsByCategory: {}, totalPrice: 0, overallMatchScore: 0 };
}

type AppState = {
  customerInput: CustomerInput;
  customerProfile: CustomerProfile | null;
  ootdItems: OOTDItem[] | null;
  activeCategory: ProductCategory;
  selectedOutfit: SelectedOutfit;
  talkType: SalesTalkType;
  talkByType: Record<SalesTalkType, string>;
  virtualPreview: VirtualOutfitPreview | null;
};

type AppActions = {
  resetProposal: () => void;
  updateCustomerInput: (patch: Partial<CustomerInput>) => void;
  setCustomerProfile: (profile: CustomerProfile) => void;
  setOOTDItems: (items: OOTDItem[]) => void;
  setActiveCategory: (category: ProductCategory) => void;
  selectProduct: (category: ProductCategory, product: Product) => void;
  removeProduct: (category: ProductCategory) => void;
  setTalkType: (type: SalesTalkType) => void;
  setVirtualPreview: (preview: VirtualOutfitPreview | null) => void;
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  customerInput: DEFAULT_INPUT,
  customerProfile: null,
  ootdItems: null,
  activeCategory: "Jacket",
  selectedOutfit: emptyOutfit(),
  talkType: "标准推荐话术",
  talkByType: TALK_TYPES.reduce((acc, t) => ({ ...acc, [t]: "" }), {} as Record<SalesTalkType, string>),
  virtualPreview: null,

  resetProposal: () =>
    set({
      customerInput: DEFAULT_INPUT,
      customerProfile: null,
      ootdItems: null,
      activeCategory: "Jacket",
      selectedOutfit: emptyOutfit(),
      talkType: "标准推荐话术",
      talkByType: TALK_TYPES.reduce((acc, t) => ({ ...acc, [t]: "" }), {} as Record<SalesTalkType, string>),
      virtualPreview: null,
    }),

  updateCustomerInput: (patch) => set({ customerInput: { ...get().customerInput, ...patch } }),

  setCustomerProfile: (profile) => {
    const selectedOutfit = get().selectedOutfit;
    const talkByType = TALK_TYPES.reduce(
      (acc, t) => ({ ...acc, [t]: generateSalesTalk(selectedOutfit, profile, t).content }),
      {} as Record<SalesTalkType, string>,
    );
    set({ customerProfile: profile, talkByType });
  },

  setOOTDItems: (items) => set({ ootdItems: items }),

  setActiveCategory: (category) => set({ activeCategory: category }),

  selectProduct: (category, product) => {
    const profile = get().customerProfile;
    const nextItemsByCategory = { ...get().selectedOutfit.itemsByCategory, [category]: product };
    const nextOutfit = calculateSelectedOutfit(nextItemsByCategory);
    const talkByType =
      profile == null
        ? get().talkByType
        : TALK_TYPES.reduce(
            (acc, t) => ({ ...acc, [t]: generateSalesTalk(nextOutfit, profile, t).content }),
            {} as Record<SalesTalkType, string>,
          );
    set({ selectedOutfit: nextOutfit, talkByType, virtualPreview: null });
  },

  removeProduct: (category) => {
    const profile = get().customerProfile;
    const nextItemsByCategory = { ...get().selectedOutfit.itemsByCategory };
    delete nextItemsByCategory[category];
    const nextOutfit = calculateSelectedOutfit(nextItemsByCategory);
    const talkByType =
      profile == null
        ? get().talkByType
        : TALK_TYPES.reduce(
            (acc, t) => ({ ...acc, [t]: generateSalesTalk(nextOutfit, profile, t).content }),
            {} as Record<SalesTalkType, string>,
          );
    set({ selectedOutfit: nextOutfit, talkByType, virtualPreview: null });
  },

  setTalkType: (type) => set({ talkType: type }),

  setVirtualPreview: (preview) => set({ virtualPreview: preview }),
}));

