import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-aurora-400/90 to-aurora-600/85 text-mist-50 shadow-[0_18px_40px_rgba(110,122,199,0.28)] ring-1 ring-white/10 hover:brightness-[1.03] hover:shadow-[0_22px_55px_rgba(110,122,199,0.34)]",
  secondary:
    "lp-glass-soft text-mist-50 hover:bg-white/[0.075] ring-1 ring-white/10 hover:ring-white/15",
  ghost: "text-mist-50/85 hover:bg-white/[0.06] hover:text-mist-50 ring-1 ring-white/0 hover:ring-white/10",
  danger:
    "bg-gradient-to-b from-danger-400/85 to-danger-600/85 text-mist-50 ring-1 ring-white/10 hover:brightness-[1.03]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "secondary", size = "md", ...props },
  ref,
) {
  return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />;
});
