import DashboardLayout from "@/components/DashboardLayout";
import { ShieldAlert, ThumbsUp, AlertTriangle, Clock } from "lucide-react";

const behaviourLogs = [
  { student: "Vikram Singh", class: "10B", type: "warning", note: "Repeated late arrivals — 5 times this month", date: "Today" },
  { student: "Priya Sharma", class: "10A", type: "concern", note: "Declining participation in class discussions", date: "Yesterday" },
  { student: "Rahul Kumar", class: "10A", type: "positive", note: "Excellent leadership during group project", date: "2 days ago" },
  { student: "Rohan Mehta", class: "9A", type: "positive", note: "Consistent improvement in homework submissions", date: "3 days ago" },
  { student: "Kavita Reddy", class: "10A", type: "concern", note: "Showing signs of disengagement in Physics class", date: "4 days ago" },
  { student: "Amit Patel", class: "10B", type: "positive", note: "Helped peer tutoring sessions voluntarily", date: "5 days ago" },
];

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Warning" },
  concern: { icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Concern" },
  positive: { icon: ThumbsUp, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Positive" },
};

const Behaviour = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Behaviour</h1>
          <p className="text-sm text-muted-foreground">Student behaviour tracking and reports</p>
        </div>

        <div className="space-y-3">
          {behaviourLogs.map((log, i) => {
            const config = typeConfig[log.type as keyof typeof typeConfig];
            return (
              <div key={i} className={`glass rounded-2xl p-5 border ${config.border} hover:scale-[1.01] transition-all duration-200`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                    <config.icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground text-sm">{log.student}</span>
                      <span className="text-xs text-muted-foreground">• {log.class}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${config.bg} ${config.color}`}>{config.label}</span>
                    </div>
                    <p className="text-sm text-foreground/80">{log.note}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {log.date}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Behaviour;
