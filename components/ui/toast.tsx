"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "destructive";
  onDismiss?: () => void;
}

function Toast({ className, variant = "default", onDismiss, ...props }: ToastProps) {
  return (
    <div
      data-slot="toast"
      className={cn(
        "bg-background text-foreground border-border flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg",
        variant === "success" && "border-success/50 bg-success/10 text-success",
        variant === "destructive" && "border-destructive/50 bg-destructive/10 text-destructive",
        className
      )}
      {...props}
    >
      <div className="flex-1 text-sm">{props.children}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { Toast };
