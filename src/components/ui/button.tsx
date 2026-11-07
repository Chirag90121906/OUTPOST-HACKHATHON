import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        {
          "bg-primary text-white hover:bg-[#18294f] shadow-sm": variant === "primary",
          "bg-secondary text-white hover:bg-[#2f4fc4] shadow-sm": variant === "secondary",
          "border border-border bg-white text-foreground hover:border-secondary/30 hover:bg-slate-50": variant === "outline",
          "text-foreground hover:bg-slate-100": variant === "ghost",
          "bg-danger text-white hover:bg-red-600": variant === "danger",
          "h-9 px-3 text-sm": size === "sm",
          "h-11 px-4 text-sm": size === "md",
          "h-12 px-6 text-base": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
