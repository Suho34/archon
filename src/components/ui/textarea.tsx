import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-white/[0.12] bg-[#09090B] p-4 text-sm text-foreground shadow-inner transition-colors placeholder:text-zinc-500 focus-visible:outline-hidden focus-visible:border-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400/40 disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

