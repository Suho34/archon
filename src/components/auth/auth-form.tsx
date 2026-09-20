"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArchonLogo } from "@/components/landing/archon-logo";
import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isSignUp = mode === "sign-up";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: "/dashboard",
          })
        : await authClient.signIn.email({
            email,
            password,
            callbackURL: "/dashboard",
          });

      if (result.error) {
        setError(
          result.error.message ?? "Something went wrong. Please try again.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to reach the authentication service. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setIsPending(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError(
          result.error.message ?? "Google sign-in is unavailable right now.",
        );
      }
    } catch {
      setError("Google sign-in is unavailable right now.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#121215] p-8 shadow-2xl shadow-black/80">
      <div className="mb-8">
        <div className="mb-5">
          <Link href="/" className="inline-block transition hover:opacity-85">
            <ArchonLogo variant="compact" size={28} />
          </Link>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-normal">
          {isSignUp
            ? "Start building with zero architectural regrets."
            : "Sign in to access your projects and specifications."}
        </p>
      </div>

      <form
        method="POST"
        data-hydrated={isMounted}
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        {isSignUp && (
          <label className="block text-xs font-mono font-medium text-zinc-300">
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-white/[0.12] bg-[#09090B] px-3 text-sm text-foreground outline-hidden transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 font-sans"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
            />
          </label>
        )}

        <label className="block text-xs font-mono font-medium text-zinc-300">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-white/[0.12] bg-[#09090B] px-3 text-sm text-foreground outline-hidden transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 font-sans"
            name="email"
            autoComplete="email"
            placeholder="architect@domain.com"
          />
        </label>

        <label className="block text-xs font-mono font-medium text-zinc-300">
          Password
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-white/[0.12] bg-[#09090B] px-3 text-sm text-foreground outline-hidden transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 font-sans"
            name="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-mono text-rose-400"
          >
            {error}
          </p>
        )}

        <button
          disabled={isPending || !isMounted}
          className="h-10 w-full rounded-md bg-white text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-xs"
          type="submit"
        >
          {isPending
            ? "Authenticating..."
            : isSignUp
              ? "Create Account"
              : "Sign In"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
        <span className="h-px flex-1 bg-white/[0.08]" />
        or
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <button
        disabled={isPending}
        onClick={handleGoogleSignIn}
        className="h-10 w-full rounded-md border border-white/[0.12] bg-[#09090B] text-xs font-mono font-semibold text-zinc-300 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        type="button"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-xs font-mono text-zinc-400">
        {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          className="font-semibold text-foreground hover:underline"
          href={isSignUp ? "/sign-in" : "/sign-up"}
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
