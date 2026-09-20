import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-6 py-12">
      <AuthForm mode="sign-up" />
    </main>
  );
}
