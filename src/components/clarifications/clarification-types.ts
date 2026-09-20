import { RequirementCategory } from "@/lib/requirement-types";
import { ClarificationStatus } from "@/lib/clarifications";

export interface SerializedClarification {
  id: string;
  question: string;
  ambiguity: string | null;
  options: string[];
  answer: string | null;
  category: RequirementCategory | null;
  status: ClarificationStatus;
  requirementId: string | null;
  projectId: string;
  convertedReqId: string | null;
  createdAt: string;
  updatedAt: string;
}
