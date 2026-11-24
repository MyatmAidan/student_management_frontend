import type { LucideIcon } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface TableEmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  action?: ReactNode;
}

export function TableEmptyState({ title, description, icon: Icon = BarChart3, className, action }: TableEmptyStateProps) {
  return (
    <div className={cn("flex min-h-[260px] w-full flex-col items-center justify-center gap-4 px-6 py-12 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/80 ring-1 ring-border/60">
        <Icon className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
