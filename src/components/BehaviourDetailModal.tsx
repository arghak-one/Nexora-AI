import { StrictModal } from "@/components/StrictModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Trash2, Bell, TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, ShieldAlert, ThumbsUp } from "lucide-react";
import { useState, useMemo } from "react";
import { BehaviourRecord, store } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

interface BehaviourDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  records: BehaviourRecord[];
  onDelete: (id: string) => void;
  behaviourStatus: string;
}

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Warning" },
  concern: { icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10", label: "Concern" },
  positive: { icon: ThumbsUp, color: "text-success", bg: "bg-success/10", label: "Positive" },
};

const severityColors: Record<string, string> = {
  low: "bg-success/15 text-success",
  medium: "bg-warning/15 text-warning",
  high: "bg-destructive/15 text-destructive",
};

export function BehaviourDetailModal({ isOpen, onClose, studentName, records, onDelete, behaviourStatus }: BehaviourDetailModalProps) {
  const [tab, setTab] = useState<"timeline" | "analytics">("timeline");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const sorted = useMemo(() => [...records].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), [records]);

  const stats = useMemo(() => {
    const warnings = records.filter(r => r.type === "warning").length;
    const concerns = records.filter(r => r.type === "concern").length;
    const positives = records.filter(r => r.type === "positive").length;
    // Simple score: positive=+2, concern=-1, warning=-2
    const score = positives * 2 - concerns - warnings * 2;
    return { warnings, concerns, positives, score, total: records.length };
  }, [records]);

  const trend = stats.score > 0 ? "improving" : stats.score < -2 ? "declining" : "stable";
  const TrendIcon = trend === "improving" ? TrendingUp : trend === "declining" ? TrendingDown : Minus;
  const trendColor = trend === "improving" ? "text-success" : trend === "declining" ? "text-destructive" : "text-warning";

  const handleDelete = (id: string) => {
    onDelete(id);
    setConfirmDeleteId(null);
    toast({ title: "Deleted", description: "Record removed.", variant: "destructive" });
  };

  const handleNotifyParent = () => {
    toast({ title: "Notification Sent", description: `Parent of ${studentName} has been notified about behaviour status.` });
  };

  const statusColors: Record<string, string> = {
    "High Risk": "bg-destructive/15 text-destructive border-destructive/30",
    "Declining": "bg-warning/15 text-warning border-warning/30",
    "Improving": "bg-success/15 text-success border-success/30",
    "Stable": "bg-muted text-muted-foreground border-border",
  };

  return (
    <StrictModal open={isOpen} setOpen={(open) => { if (!open) onClose(); }}>
      <div className="w-full max-w-2xl bg-card border border-border/50 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{studentName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${statusColors[behaviourStatus] || statusColors["Stable"]}`}>
                  {behaviourStatus}
                </span>
                <span className={`flex items-center gap-1 text-xs ${trendColor}`}>
                  <TrendIcon className="w-3 h-3" />
                  {trend.charAt(0).toUpperCase() + trend.slice(1)} trend
                </span>
                <span className="text-xs text-muted-foreground">{stats.total} records</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleNotifyParent} className="text-xs">
                <Bell className="w-3.5 h-3.5 mr-1" /> Notify Parent
              </Button>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 bg-secondary/30 p-1 rounded-xl">
            {(["timeline", "analytics"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg capitalize transition-all ${tab === t ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t === "timeline" ? "Full History" : "Analytics"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "timeline" ? (
            <div className="space-y-0 relative">
              <div className="absolute left-5 top-2 bottom-2 w-px bg-border/50" />
              {sorted.map((rec) => {
                const cfg = typeConfig[rec.type];
                return (
                  <div key={rec.id} className="relative pl-12 pb-6 group">
                    <div className={`absolute left-3 top-1 w-5 h-5 rounded-full ${cfg.bg} flex items-center justify-center z-10 ring-2 ring-card`}>
                      <cfg.icon className={`w-3 h-3 ${cfg.color}`} />
                    </div>
                    <div className="bg-secondary/30 border border-border/30 rounded-xl p-3 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                            <span className={`text-[10px] font-medium uppercase px-1.5 py-0.5 rounded ${severityColors[rec.severity]}`}>{rec.severity}</span>
                            {rec.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary capitalize">{tag}</span>
                            ))}
                          </div>
                          <p className="text-sm text-foreground/90 mt-1.5">{rec.description}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rec.date}</span>
                            <span>By: {rec.reportedBy}</span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {confirmDeleteId === rec.id ? (
                            <div className="flex gap-1">
                              <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={() => handleDelete(rec.id)}>Yes</Button>
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setConfirmDeleteId(null)}>No</Button>
                            </div>
                          ) : (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setConfirmDeleteId(rec.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-destructive">{stats.warnings}</p>
                  <p className="text-xs text-muted-foreground">Warnings</p>
                </div>
                <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-warning">{stats.concerns}</p>
                  <p className="text-xs text-muted-foreground">Concerns</p>
                </div>
                <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-success">{stats.positives}</p>
                  <p className="text-xs text-muted-foreground">Positive</p>
                </div>
              </div>

              {/* Behaviour Score */}
              <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Behaviour Score</h4>
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${trendColor}`}>{stats.score > 0 ? "+" : ""}{stats.score}</div>
                  <div className="flex-1">
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${trend === "improving" ? "bg-success" : trend === "declining" ? "bg-destructive" : "bg-warning"}`}
                        style={{ width: `${Math.min(100, Math.max(10, 50 + stats.score * 10))}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag breakdown */}
              <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Tag Frequency</h4>
                <div className="space-y-2">
                  {(() => {
                    const tagCounts: Record<string, number> = {};
                    records.forEach(r => r.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
                    const max = Math.max(...Object.values(tagCounts), 1);
                    return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag, count]) => (
                      <div key={tag} className="flex items-center gap-2">
                        <span className="text-xs capitalize w-20 text-muted-foreground">{tag}</span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary/60 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StrictModal>
  );
}
