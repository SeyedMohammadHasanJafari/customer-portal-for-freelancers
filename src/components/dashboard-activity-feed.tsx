import * as React from "react";
import { ActivityItem } from "@/lib/services/dashboard";
import { CheckCircle2, DollarSign, FolderPlus, Send, Clock } from "lucide-react";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function DashboardActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "PAYMENT":
        return <DollarSign className="w-3.5 h-3.5 text-emerald-500" />;
      case "TASK_COMPLETED":
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />;
      case "PROJECT_CREATED":
        return <FolderPlus className="w-3.5 h-3.5 text-purple-500" />;
      case "INVOICE_SENT":
        return <Send className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" /> Recent Activity
        </h3>
        <span className="text-[11px] text-muted-foreground font-medium">Live Feed</span>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center space-y-1">
          <p className="text-xs font-medium text-muted-foreground">No recent activity yet.</p>
          <p className="text-[11px] text-muted-foreground/70">
            Create a project or issue an invoice to see live events here.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-border/70">
          {activities.map((act) => (
          <div key={act.id} className="relative flex items-start justify-between gap-3 text-xs">
            <div className="absolute -left-6 mt-0.5 h-5 w-5 rounded-full bg-background border border-border flex items-center justify-center shadow-xs">
              {getIcon(act.type)}
            </div>

            <div className="space-y-0.5 pr-2">
              <p className="font-semibold text-foreground leading-tight">{act.title}</p>
              <p className="text-[11px] text-muted-foreground leading-snug">{act.description}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-muted-foreground font-medium">
                {formatRelativeTime(act.timestamp)}
              </span>
              {act.amount && (
                <div className="text-[11px] font-bold text-emerald-500">
                  +${act.amount.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
