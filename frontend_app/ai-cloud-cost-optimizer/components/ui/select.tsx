import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
  return <select className={cn("h-10 rounded-md border border-input bg-background px-3 text-sm", className)} {...props}>{children}</select>;
}
