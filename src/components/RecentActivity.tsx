import { useMemo, useState } from "react";
import { CalendarCheck, FileText, Award, Clock, BarChart3, DollarSign, AlertTriangle, ExternalLink, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { store } from "@/lib/store";

// ─── Types ────────────────────────────────────────────────────────────────────
type ActivityType = "attendance" | "result" | "fee" | "risk" | "report";

interface ActivityItem {
  id: string;
  icon: React.ElementType;
  text: string;
  time: string;
  color: string;
  type: ActivityType;
  route?: string;
  detail?: string;
}

// ─── Generate live activity feed ──────────────────────────────────────────────
function buildActivityFeed(): ActivityItem[] {
  const students = store.getStudents();
  const results  = store.getResults();
  const fees     = store.getStudentFees ? store.getStudentFees() : [];
  const items: ActivityItem[] = [];

  // High-risk students — show latest 2
  const highRisk = students.filter((s) => s.risk === "High").slice(0, 2);
  highRisk.forEach((s, i) => {
    items.push({
      id: `risk-${s.id}`,
      icon: AlertTriangle,
      text: `${s.name} flagged as High Risk (${s.attendance}% attendance, ${s.marks}% marks)`,
      time: i === 0 ? "Just now" : "5 min ago",
      color: "text-destructive",
      type: "risk",
      route: "/students",
      detail: `Student: ${s.name} | Class: ${s.class} | AI Score: ${s.aiScore}`,
    });
  });

  // Most recent result records — show latest 2
  const latestResults = [...results].reverse().slice(0, 2);
  latestResults.forEach((r, i) => {
    items.push({
      id: `result-${r.id}`,
      icon: Award,
      text: `${r.studentName} scored ${r.marks}/${r.total} in ${r.subject} — ${r.grade}`,
      time: i === 0 ? "15 min ago" : "30 min ago",
      color: r.status === "Pass" ? "text-success" : "text-destructive",
      type: "result",
      route: "/results",
      detail: `Subject: ${r.subject} | Class: ${r.class} | Status: ${r.status}`,
    });
  });

  // Unpaid fees — show 1
  const unpaidFee = (fees as any[]).find((f) => f.status === "Unpaid");
  if (unpaidFee) {
    items.push({
      id: `fee-${unpaidFee.id}`,
      icon: DollarSign,
      text: `${unpaidFee.studentName} has an unpaid fee of ₹${unpaidFee.dueAmount?.toLocaleString() ?? "—"}`,
      time: "1 hr ago",
      color: "text-warning",
      type: "fee",
      route: "/fees",
      detail: `Course: ${unpaidFee.course} | Semester: ${unpaidFee.semester}`,
    });
  }

  // Partial fees — show 1
  const partialFee = (fees as any[]).find((f) => f.status === "Partial");
  if (partialFee) {
    items.push({
      id: `partial-${partialFee.id}`,
      icon: DollarSign,
      text: `${partialFee.studentName} partially paid — ₹${partialFee.dueAmount?.toLocaleString() ?? "—"} still due`,
      time: "2 hrs ago",
      color: "text-accent",
      type: "fee",
      route: "/fees",
      detail: `Paid: ₹${partialFee.paidAmount?.toLocaleString()} of ₹${partialFee.totalFee?.toLocaleString()}`,
    });
  }

  // Fallback — always show at least one static item
  if (items.length < 2) {
    items.push({
      id: "static-report",
      icon: FileText,
      text: "Term 1 Performance Report has been generated",
      time: "3 hrs ago",
      color: "text-primary",
      type: "report",
      route: "/reports",
    });
  }

  return items.slice(0, 5);
}

// ─── Component ────────────────────────────────────────────────────────────────
const RecentActivity = () => {
  const navigate = useNavigate();
  const activities = useMemo(() => buildActivityFeed(), []);
  const [modalItem, setModalItem] = useState<ActivityItem | null>(null);

  const handleClick = (item: ActivityItem) => {
    if (item.detail) {
      setModalItem(item);
    } else if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <div className="glass rounded-2xl p-5 glow-teal">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
        <Activity className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground mb-4">Live feed from students, results &amp; fees</p>

      {activities.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Add students, results or fees to populate this feed.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleClick(item)}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/30 hover:scale-[1.01] cursor-pointer transition-all duration-200 group relative"
              >
                <div className={`mt-0.5 shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/90 group-hover:text-foreground transition-colors leading-snug">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!modalItem} onOpenChange={(open) => { if (!open) setModalItem(null); }}>
        <DialogContent className="glass border border-border/50 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              {modalItem && <modalItem.icon className={`w-4 h-4 ${modalItem.color}`} />}
              Activity Detail
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              {modalItem?.text}
            </DialogDescription>
          </DialogHeader>
          {modalItem?.detail && (
            <div className="glass rounded-xl p-3 border border-border/30 mt-2">
              {modalItem.detail.split(" | ").map((line, i) => {
                const [key, val] = line.split(": ");
                return (
                  <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-border/20 last:border-0">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="text-foreground font-medium">{val}</span>
                  </div>
                );
              })}
            </div>
          )}
          {modalItem?.route && (
            <button
              onClick={() => { navigate(modalItem.route!); setModalItem(null); }}
              className="w-full mt-2 h-9 rounded-xl gradient-primary text-foreground text-sm font-medium transition-all hover:opacity-90"
            >
              View in {modalItem.route.replace("/", "").replace(/^\w/, c => c.toUpperCase())}
            </button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecentActivity;
