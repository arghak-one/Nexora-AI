import DashboardLayout from "@/components/DashboardLayout";
import { ShieldAlert, ThumbsUp, AlertTriangle, Clock, Search, Filter, Plus, MoreVertical, History, BarChart3, Bell, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { store, BehaviourRecord, BehaviourSeverity, useStoreUpdate } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { LogBehaviourModal } from "@/components/LogBehaviourModal";
import { BehaviourDetailModal } from "@/components/BehaviourDetailModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Warning" },
  concern: { icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Concern" },
  positive: { icon: ThumbsUp, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Positive" },
};

const severityColors: Record<string, string> = {
  low: "bg-success/15 text-success",
  medium: "bg-warning/15 text-warning",
  high: "bg-destructive/15 text-destructive",
};

function computeBehaviourStatus(records: BehaviourRecord[]): string {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 86400000;
  const recentRecords = records.filter(r => (r.createdAt || 0) >= sevenDaysAgo);
  const recentWarnings = recentRecords.filter(r => r.type === "warning").length;
  const recentConcerns = recentRecords.filter(r => r.type === "concern").length;
  const recentPositives = recentRecords.filter(r => r.type === "positive").length;

  if (recentWarnings >= 3) return "High Risk";
  if (recentConcerns >= 2 && recentPositives === 0) return "Declining";
  if (recentPositives >= 2 && recentWarnings === 0) return "Improving";
  return "Stable";
}

const statusConfig: Record<string, { color: string; icon: typeof TrendingUp }> = {
  "High Risk": { color: "bg-destructive/15 text-destructive border-destructive/30", icon: TrendingDown },
  "Declining": { color: "bg-warning/15 text-warning border-warning/30", icon: TrendingDown },
  "Improving": { color: "bg-success/15 text-success border-success/30", icon: TrendingUp },
  "Stable": { color: "bg-muted text-muted-foreground border-border", icon: Minus },
};

const Behaviour = () => {
  useStoreUpdate();
  const [behaviours, setBehaviours] = useState<BehaviourRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "warning" | "concern" | "positive">("all");
  const [filterSeverity, setFilterSeverity] = useState<"all" | BehaviourSeverity>("all");
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState<string | null>(null);

  useEffect(() => {
    setBehaviours(store.getBehaviours());
  }, []);

  const handleLogSave = (record: BehaviourRecord) => {
    const updated = [record, ...behaviours];
    setBehaviours(updated);
    store.setBehaviours(updated);
  };

  const handleDelete = (id: string) => {
    const updated = behaviours.filter(r => r.id !== id);
    setBehaviours(updated);
    store.setBehaviours(updated);
  };

  // Group by student for status computation
  const studentGroups = useMemo(() => {
    const groups: Record<string, BehaviourRecord[]> = {};
    behaviours.forEach(b => {
      if (!groups[b.studentName]) groups[b.studentName] = [];
      groups[b.studentName].push(b);
    });
    return groups;
  }, [behaviours]);

  const studentStatuses = useMemo(() => {
    const statuses: Record<string, string> = {};
    Object.entries(studentGroups).forEach(([name, recs]) => {
      statuses[name] = computeBehaviourStatus(recs);
    });
    return statuses;
  }, [studentGroups]);

  const filteredBehaviours = useMemo(() => {
    return behaviours.filter(b => {
      const matchesSearch = b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || b.type === filterType;
      const matchesSeverity = filterSeverity === "all" || b.severity === filterSeverity;
      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [behaviours, searchQuery, filterType, filterSeverity]);

  // Summary stats
  const stats = useMemo(() => ({
    total: behaviours.length,
    warnings: behaviours.filter(b => b.type === "warning").length,
    concerns: behaviours.filter(b => b.type === "concern").length,
    positives: behaviours.filter(b => b.type === "positive").length,
    highRisk: Object.values(studentStatuses).filter(s => s === "High Risk").length,
  }), [behaviours, studentStatuses]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Behaviour</h1>
            <p className="text-sm text-muted-foreground">Intelligent behaviour monitoring & insights</p>
          </div>
          <Button onClick={() => setIsLogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Log Behaviour
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total Logs", value: stats.total, color: "text-foreground", bg: "bg-card" },
            { label: "Warnings", value: stats.warnings, color: "text-destructive", bg: "bg-destructive/5" },
            { label: "Concerns", value: stats.concerns, color: "text-warning", bg: "bg-warning/5" },
            { label: "Positive", value: stats.positives, color: "text-success", bg: "bg-success/5" },
            { label: "High Risk", value: stats.highRisk, color: "text-destructive", bg: "bg-destructive/5" },
          ].map(card => (
            <div key={card.label} className={`${card.bg} border border-border/50 rounded-2xl p-4 text-center glass`}>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-card border border-border/50 p-4 rounded-2xl glass">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search student or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex bg-secondary/50 p-1 rounded-xl overflow-x-auto hide-scrollbar">
            {["all", "warning", "concern", "positive"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${filterType === type ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex bg-secondary/50 p-1 rounded-xl overflow-x-auto hide-scrollbar">
            {["all", "low", "medium", "high"].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${filterSeverity === sev ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {sev === "all" ? "All Severity" : sev}
              </button>
            ))}
          </div>
        </div>

        {/* Records */}
        <div className="space-y-3">
          {filteredBehaviours.length === 0 ? (
            <div className="text-center p-12 glass rounded-2xl border border-border/50">
              <Filter className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-foreground">No records found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or log a new behaviour.</p>
            </div>
          ) : (
            filteredBehaviours.map((log) => {
              const config = typeConfig[log.type];
              const studentStatus = studentStatuses[log.studentName] || "Stable";
              const statusCfg = statusConfig[studentStatus];
              return (
                <div
                  key={log.id}
                  className={`glass rounded-2xl p-5 border ${config.border} hover:scale-[1.005] cursor-pointer transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group relative`}
                  onClick={() => setDetailStudent(log.studentName)}
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />

                  <div className="flex items-start gap-4 relative z-10 w-full">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                      <config.icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-foreground text-sm">{log.studentName}</span>
                        <span className="text-xs text-muted-foreground">• Class {log.class}</span>
                        <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${config.bg} ${config.color}`}>{config.label}</span>
                        <span className={`text-[10px] font-medium uppercase px-1.5 py-0.5 rounded-md ${severityColors[log.severity]}`}>{log.severity}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${statusCfg.color}`}>{studentStatus}</span>
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-1">{log.description}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {log.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary capitalize">{tag}</span>
                        ))}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground ml-1"><Clock className="w-3 h-3" />{log.date}</span>
                        <span className="text-xs text-muted-foreground">• {log.reportedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 sm:ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setDetailStudent(log.studentName)}>
                          <History className="w-4 h-4 mr-2" /> View Full History
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDetailStudent(log.studentName)}>
                          <BarChart3 className="w-4 h-4 mr-2" /> View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Notification Sent", description: `Parent of ${log.studentName} has been notified.` })}>
                          <Bell className="w-4 h-4 mr-2" /> Notify Parent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <LogBehaviourModal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} onSave={handleLogSave} />

      {detailStudent && (
        <BehaviourDetailModal
          isOpen={!!detailStudent}
          onClose={() => setDetailStudent(null)}
          studentName={detailStudent}
          records={studentGroups[detailStudent] || []}
          onDelete={handleDelete}
          behaviourStatus={studentStatuses[detailStudent] || "Stable"}
        />
      )}
    </DashboardLayout>
  );
};
export default Behaviour;
