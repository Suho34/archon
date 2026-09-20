import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-white/[0.12] bg-zinc-900/80 text-zinc-300 font-mono text-[11px]",
        secondary:
          "border border-border bg-secondary text-secondary-foreground text-[11px]",
        confirmed:
          "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 font-mono text-[11px]",
        verified:
          "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 font-mono text-[11px]",
        warning:
          "border border-amber-500/25 bg-amber-500/10 text-amber-400 font-mono text-[11px]",
        critical:
          "border border-rose-500/25 bg-rose-500/10 text-rose-400 font-mono text-[11px]",
        outline:
          "border border-white/[0.14] text-zinc-300 font-mono text-[11px]",
        stark:
          "border border-white/20 bg-white text-zinc-950 font-semibold text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
