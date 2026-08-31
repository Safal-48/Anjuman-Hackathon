import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { glow?: boolean }
>(({ className, glow = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-2xl border border-white/[0.08] bg-slate-900/50 backdrop-blur-xl text-card-foreground shadow-glass transition-all duration-300 hover:border-white/[0.18] hover:bg-slate-900/70 overflow-hidden",
      glow && "hover:shadow-glow-sm hover:border-cyan-500/30",
      className
    )}
    {...props}
  />
));
GlassCard.displayName = "GlassCard";

const MetricCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
    icon?: React.ReactNode;
  }
>(({ className, title, value, change, isPositive = true, icon, ...props }, ref) => (
  <GlassCard
    ref={ref}
    className={cn("p-6 flex flex-col justify-between group", className)}
    {...props}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
      {icon && (
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      )}
    </div>
    <div className="mt-4 flex flex-col gap-2">
      <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
        {value}
      </div>
      {change && (
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-0.5 rounded-full border w-fit font-mono tracking-tight",
            isPositive
              ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              : "text-rose-400 border-rose-500/30 bg-rose-500/10"
          )}
        >
          {change}
        </span>
      )}
    </div>
  </GlassCard>
));
MetricCard.displayName = "MetricCard";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-lg text-foreground", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-white/[0.04] mt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  GlassCard,
  MetricCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
