import DashboardLayout from "@/components/DashboardLayout";
import { Bell, AlertTriangle, TrendingUp, CalendarCheck, FileText, Clock } from "lucide-react";

const notifications = [
  { icon: AlertTriangle, title: "Risk Alert", message: "Vikram Singh's attendance dropped below 60%", time: "5 min ago", color: "text-destructive", bg: "bg-destructive/10", unread: true },
  { icon: TrendingUp, title: "Performance Update", message: "Class 10A average improved by 8% this month", time: "1 hr ago", color: "text-success", bg: "bg-success/10", unread: true },
  { icon: CalendarCheck, title: "Attendance Marked", message: "All classes attendance recorded for today", time: "2 hrs ago", color: "text-primary", bg: "bg-primary/10", unread: false },
  { icon: FileText, title: "Report Ready", message: "Term 1 Performance Report has been generated", time: "3 hrs ago", color: "text-info", bg: "bg-info/10", unread: false },
  { icon: AlertTriangle, title: "Fee Reminder", message: "8 students have unpaid fees for this quarter", time: "1 day ago", color: "text-warning", bg: "bg-warning/10", unread: false },
  { icon: TrendingUp, title: "AI Insight", message: "New predictions available for at-risk students", time: "2 days ago", color: "text-accent", bg: "bg-accent/10", unread: false },
];

const Notifications = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">Stay updated with alerts and events</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary">2 unread</span>
        </div>

        <div className="space-y-3">
          {notifications.map((n, i) => (
            <div key={i} className={`glass rounded-2xl p-5 flex items-start gap-4 hover:scale-[1.005] transition-all duration-200 ${n.unread ? 'border border-primary/20 glow-primary' : ''}`}>
              <div className={`w-10 h-10 rounded-xl ${n.bg} flex items-center justify-center shrink-0`}>
                <n.icon className={`w-5 h-5 ${n.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm">{n.title}</h3>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {n.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
