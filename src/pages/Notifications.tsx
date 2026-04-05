import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Bell, AlertTriangle, TrendingUp, CalendarCheck,
  FileText, Clock, DollarSign, Brain, CheckCheck, Trash2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/store";

// ─── Types ────────────────────────────────────────────────────────────────────
type NotifCategory = "risk" | "performance" | "attendance" | "fees" | "system" | "ai";

interface Notification {
  id: string;
  category: NotifCategory;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  unread: boolean;
}

// ─── Generate smart notifications from live data ──────────────────────────────
function generateNotifications(): Notification[] {
  const students = store.getStudents();
  const fees     = store.getStudentFees ? store.getStudentFees() : [];
  const results  = store.getResults();
  const now      = Date.now();
  const notifs: Notification[] = [];

  // High-risk students
  const highRisk = students.filter((s) => s.risk === "High");
  highRisk.forEach((s, i) => {
    notifs.push({
      id: `risk-${s.id}`,
      category: "risk",
      title: "Risk Alert",
      message: `${s.name} has ${s.attendance}% attendance and ${s.marks}% marks — flagged as High Risk.`,
      time: "Just now",
      timestamp: now - i * 60000,
      unread: true,
    });
  });

  // Unpaid fees
  const unpaid = fees.filter((f: any) => f.status === "Unpaid");
  if (unpaid.length > 0) {
    notifs.push({
      id: "fees-unpaid",
      category: "fees",
      title: "Fee Reminder",
      message: `${unpaid.length} student${unpaid.length > 1 ? "s have" : " has"} unpaid fees. Follow up needed.`,
      time: "1 hr ago",
      timestamp: now - 3600000,
      unread: unpaid.length >= 3,
    });
  }

  // Partial fees
  const partial = fees.filter((f: any) => f.status === "Partial");
  if (partial.length > 0) {
    notifs.push({
      id: "fees-partial",
      category: "fees",
      title: "Partial Payment",
      message: `${partial.length} student${partial.length > 1 ? "s have" : " has"} partially paid fees. Dues pending.`,
      time: "2 hrs ago",
      timestamp: now - 7200000,
      unread: false,
    });
  }

  // Failing students in results
  const failing = results.filter((r) => r.status === "Fail");
  if (failing.length > 0) {
    notifs.push({
      id: "results-fail",
      category: "performance",
      title: "Performance Alert",
      message: `${failing.length} result record${failing.length > 1 ? "s show" : " shows"} failing grades. Review required.`,
      time: "3 hrs ago",
      timestamp: now - 10800000,
      unread: false,
    });
  }

  // Top performers
  const topPerformers = students.filter((s) => (s.aiScore ?? 0) >= 9);
  if (topPerformers.length > 0) {
    notifs.push({
      id: "top-performers",
      category: "ai",
      title: "AI Insight",
      message: `${topPerformers.length} student${topPerformers.length > 1 ? "s are" : " is"} performing exceptionally (AI Score ≥ 9). Consider recognition.`,
      time: "5 hrs ago",
      timestamp: now - 18000000,
      unread: false,
    });
  }

  // Attendance drop (students below 75%)
  const lowAttendance = students.filter((s) => (s.attendance ?? 100) < 75);
  if (lowAttendance.length > 0) {
    notifs.push({
      id: "attendance-low",
      category: "attendance",
      title: "Attendance Warning",
      message: `${lowAttendance.length} student${lowAttendance.length > 1 ? "s have" : " has"} attendance below 75%. Parent notification recommended.`,
      time: "6 hrs ago",
      timestamp: now - 21600000,
      unread: false,
    });
  }

  // System defaults (always show)
  notifs.push(
    {
      id: "sys-report",
      category: "system",
      title: "Report Ready",
      message: "Term 1 Performance Report has been generated and is ready for download.",
      time: "1 day ago",
      timestamp: now - 86400000,
      unread: false,
    },
    {
      id: "sys-attendance",
      category: "attendance",
      title: "Attendance Recorded",
      message: "All classes attendance has been recorded successfully for today.",
      time: "1 day ago",
      timestamp: now - 90000000,
      unread: false,
    }
  );

  // Sort newest first
  return notifs.sort((a, b) => b.timestamp - a.timestamp);
}

// ─── Config ───────────────────────────────────────────────────────────────────
const categoryConfig: Record<NotifCategory, { icon: React.ElementType; color: string; bg: string }> = {
  risk:        { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  performance: { icon: TrendingUp,    color: "text-success",     bg: "bg-success/10"     },
  attendance:  { icon: CalendarCheck, color: "text-primary",     bg: "bg-primary/10"     },
  fees:        { icon: DollarSign,    color: "text-warning",     bg: "bg-warning/10"     },
  system:      { icon: FileText,      color: "text-muted-foreground", bg: "bg-secondary/50" },
  ai:          { icon: Brain,         color: "text-accent",      bg: "bg-accent/10"      },
};

const categoryLabels: Record<NotifCategory, string> = {
  risk: "Risk", performance: "Performance", attendance: "Attendance",
  fees: "Fees", system: "System", ai: "AI Insights",
};

const filterTabs = ["All", "Risk", "Performance", "Attendance", "Fees", "AI Insights", "System"] as const;

// ─── Component ────────────────────────────────────────────────────────────────
const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => generateNotifications());
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter(
      (n) => categoryLabels[n.category].toLowerCase() === activeFilter.toLowerCase()
    );
  }, [notifications, activeFilter]);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-sm text-muted-foreground">Smart alerts based on live student data</p>
            </div>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary animate-pulse-glow">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllRead} className="rounded-xl h-8 text-xs flex items-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="outline" onClick={clearAll} className="rounded-xl h-8 text-xs flex items-center gap-1.5 text-destructive hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" /> Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${
                activeFilter === tab
                  ? "gradient-primary text-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No notifications</p>
            <p className="text-xs text-muted-foreground/60 mt-1">You're all caught up!</p>
          </div>
        )}

        {/* Notification list */}
        <div className="space-y-3">
          {filtered.map((n) => {
            const cfg = categoryConfig[n.category];
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`glass rounded-2xl p-4 flex items-start gap-4 hover:scale-[1.005] transition-all duration-200 cursor-pointer group ${
                  n.unread ? "border border-primary/20 glow-primary" : "border border-transparent"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground text-sm">{n.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${cfg.bg} ${cfg.color}`}>
                      {categoryLabels[n.category]}
                    </span>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {n.time}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all shrink-0"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
