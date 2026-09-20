"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    await authClient.signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-md border-white/[0.12] text-xs font-mono text-zinc-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white cursor-pointer"
    >
      {isPending ? "Signing out..." : "Log out"}
    </Button>
  );
}
