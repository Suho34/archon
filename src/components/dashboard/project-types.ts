export interface SerializedProject {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  targetUsers: string | null;
  goal: string | null;
  constraints: string | null;
  tech: string[];
  scale: string | null;
  budget: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  type: string;
  targetUsers: string;
  goal: string;
  constraints: string;
  tech: string;
  scale: string;
  budget: string;
}
