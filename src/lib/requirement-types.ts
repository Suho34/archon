export const REQUIREMENT_CATEGORIES = [
  "Functional",
  "Non-functional",
  "Security",
  "Performance",
  "AI",
  "Data",
  "Infrastructure",
  "Business",
] as const;

export type RequirementCategory = (typeof REQUIREMENT_CATEGORIES)[number];

export const REQUIREMENT_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Critical",
] as const;

export type RequirementPriority = (typeof REQUIREMENT_PRIORITIES)[number];

export const REQUIREMENT_STATUSES = ["draft", "confirmed"] as const;

export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number];
