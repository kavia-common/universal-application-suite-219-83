import * as React from "react";
import { cn } from "@/lib/utils";

export function Dialog({ open, onClose, children }: { open: boolean; onClose?: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4")} onClick={onClose}>
      <div className="w-full max-w-lg rounded-md border bg-background p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
