import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { ProjectsView } from "@/components/dashboard/projects-view";
import { ArchonLogo } from "@/components/landing/archon-logo";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  const rawProjects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const serializedProjects = rawProjects.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#09090B]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <ArchonLogo variant="compact" size={26} />
            <span className="hidden sm:inline-block rounded border border-white/[0.08] bg-zinc-900/80 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-400">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-xs font-mono font-medium text-foreground">
                {session.user.name}
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {session.user.email}
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 pt-8 space-y-8">
        {/* Workspace Title & Greeting */}
        <div>
          <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
            Overview
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans">
            Your workspace
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400 font-normal">
            Welcome back, <span className="font-semibold text-zinc-200">{session.user.name}</span>. Manage your projects, architectural specs, and technical roadmap.
          </p>
        </div>

        {/* Projects View: Metrics, Search, and My Projects Grid */}
        <ProjectsView initialProjects={serializedProjects} />
      </div>
    </main>
  );
}
