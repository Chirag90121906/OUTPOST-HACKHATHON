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
          "bg-secondary text-white hover:bg-[#2c4d86] shadow-sm": variant === "primary",
          "bg-primary text-accent hover:bg-[#16284d] shadow-sm ring-1 ring-accent/20": variant === "secondary",
          "border border-border bg-white text-foreground hover:border-accent/40 hover:bg-ivory": variant === "outline",
          "text-foreground hover:bg-ivory": variant === "ghost",
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
