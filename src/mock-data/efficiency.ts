import type { EfficiencyMetric } from "@/types";

export const DASHBOARD_METRICS: EfficiencyMetric[] = [
  { label: "今日接客人数", value: "18", emphasis: "neutral" },
  { label: "已生成穿搭方案", value: "42", emphasis: "neutral" },
  { label: "平均提案时间", value: "3.2 分钟", emphasis: "good" },
  { label: "传统提案时间", value: "15 分钟", emphasis: "warn" },
  { label: "今日预计节省时间", value: "3.5 小时", emphasis: "good" },
  { label: "推荐商品转化率", value: "28%", emphasis: "good" },
  { label: "热门推荐品类", value: "Jacket / Pants / Sneakers", emphasis: "neutral" },
];

export const BEFORE_AFTER = {
  before: [
    { label: "单次搭配提案时间", value: "15 分钟" },
    { label: "商品查找时间", value: "8 分钟" },
    { label: "新人话术准备时间", value: "10 分钟" },
    { label: "接客记录整理", value: "手动记录" },
  ],
  after: [
    { label: "单次搭配提案时间", value: "3 分钟" },
    { label: "商品查找时间", value: "2 分钟" },
    { label: "新人话术准备时间", value: "1 分钟" },
    { label: "接客记录整理", value: "自动生成" },
  ],
};

export const SUMMARY_EFFICIENCY_METRICS: EfficiencyMetric[] = [
  { label: "传统提案时间", value: "15 分钟", emphasis: "warn" },
  { label: "LookPilot 提案时间", value: "3 分钟", emphasis: "good" },
  { label: "节省时间", value: "80%", emphasis: "good" },
  { label: "商品查找时间减少", value: "75%", emphasis: "good" },
  { label: "新人话术准备时间减少", value: "90%", emphasis: "good" },
  { label: "接客记录", value: "自动生成", emphasis: "neutral" },
];

