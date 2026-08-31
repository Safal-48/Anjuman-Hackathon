import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground border-border",
        cyber:
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-glow-sm",
        violet:
          "border-violet-500/30 bg-violet-500/10 text-violet-400 shadow-glow-purple",
        emerald:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        amber:
          "border-amber-500/30 bg-amber-500/10 text-amber-400",
        glass:
          "border-white/10 bg-white/5 backdrop-blur-md text-foreground/90",
      },
      size: {
        default: "text-xs px-2.5 py-0.5",
        sm: "text-[10px] px-2 py-0.2",
        lg: "text-sm px-3.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: "cyan" | "emerald" | "amber" | "rose" | "violet";
}

function Badge({
  className,
  variant,
  size,
  dot,
  dotColor = "cyan",
  children,
  ...props
}: BadgeProps) {
  const dotColorMap = {
    cyan: "bg-cyan-400 shadow-[0_0_8px_#06b6d4]",
    emerald: "bg-emerald-400 shadow-[0_0_8px_#10b981]",
    amber: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
    rose: "bg-rose-400 shadow-[0_0_8px_#f43f5e]",
    violet: "bg-violet-400 shadow-[0_0_8px_#8b5cf6]",
  };

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "mr-1.5 h-1.5 w-1.5 rounded-full animate-pulse",
            dotColorMap[dotColor]
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
