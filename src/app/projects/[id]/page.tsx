import { redirect } from "next/navigation";

import { ProjectWorkspaceView } from "@/components/project-workspace/project-workspace-view";
import { prisma } from "@/lib/prisma";
import { fromPrismaCategory } from "@/lib/requirements";
import { getServerSession } from "@/lib/session";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      requirements: {
        orderBy: [{ category: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!project) {
    redirect("/dashboard");
  }

  const serializedProject = {
    id: project.id,
    name: project.name,
    description: project.description,
    type: project.type,
    targetUsers: project.targetUsers,
    goal: project.goal,
    constraints: project.constraints,
    tech: project.tech,
    scale: project.scale,
    budget: project.budget,
    userId: project.userId,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };

  const serializedRequirements = project.requirements.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: fromPrismaCategory(r.category),
    priority: r.priority,
    constraints: r.constraints,
    assumptions: r.assumptions,
    status: r.status,
    projectId: r.projectId,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <ProjectWorkspaceView
      project={serializedProject}
      initialRequirements={serializedRequirements}
    />
  );
}
