"use client";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// TODO: Replace with ShadCN CLI install: npx shadcn@latest add dialog
export const Dialog = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
Dialog.displayName = "Dialog";
