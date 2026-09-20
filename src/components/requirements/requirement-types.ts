import {
  RequirementCategory,
  RequirementPriority,
  RequirementStatus,
} from "@/lib/requirement-types";

export interface SerializedRequirement {
  id: string;
  title: string;
  description: string | null;
  category: RequirementCategory;
  priority: RequirementPriority;
  constraints: string | null;
  assumptions: string | null;
  status: RequirementStatus;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_DETAILS: Record<
  RequirementCategory,
  { label: string; description: string; color: string }
> = {
  Functional: {
    label: "Functional",
    description: "Core features, user workflows, and application behaviors",
    color: "emerald",
  },
  "Non-functional": {
    label: "Non-functional",
    description: "Reliability, maintainability, and quality criteria",
    color: "teal",
  },
  Security: {
    label: "Security",
    description:
      "Authentication, authorization, data protection, and compliance",
    color: "red",
  },
  Performance: {
    label: "Performance",
    description: "Latency targets, throughput, memory, and scaling benchmarks",
    color: "amber",
  },
  AI: {
    label: "AI & ML",
    description:
      "Model integrations, prompts, evaluations, and inference constraints",
    color: "purple",
  },
  Data: {
    label: "Data & Storage",
    description:
      "Schemas, pipelines, migrations, backups, and retention policies",
    color: "blue",
  },
  Infrastructure: {
    label: "Infrastructure",
    description:
      "Cloud hosting, CI/CD, networks, containers, and deployment targets",
    color: "cyan",
  },
  Business: {
    label: "Business & Legal",
    description:
      "Business rules, licensing, SLA terms, and compliance mandates",
    color: "indigo",
  },
};
