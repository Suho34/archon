"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SerializedRequirement } from "./requirement-types";

interface DeleteRequirementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: SerializedRequirement | null;
  onSuccess: (deletedId: string) => void;
}

export function DeleteRequirementDialog({
  isOpen,
  onClose,
  requirement,
  onSuccess,
}: DeleteRequirementDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!requirement) return null;

  async function handleDelete() {
    if (!requirement) return;
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/requirements/${requirement.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete requirement");
      }

      onSuccess(requirement.id);
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to delete requirement",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#121215] border border-white/[0.08]">
        <DialogHeader>
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-2 border border-rose-500/20">
            <Trash2 className="size-6" />
          </div>
          <DialogTitle className="text-center text-white">Delete Requirement?</DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">
              &ldquo;{requirement.title}&rdquo;
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter className="sm:justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl flex-1 border-white/[0.08] bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.04]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex-1 gap-2 shadow-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Requirement
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
