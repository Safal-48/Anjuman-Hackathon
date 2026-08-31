import * as React from "react";
import { FolderSearch, AlertCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./card";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <GlassCard
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center border-dashed border-white/10",
        className
      )}
      {...props}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 shadow-glow-sm">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </GlassCard>
  );
}
