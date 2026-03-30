import { CalendarCheck, FileText, Award, Clock } from "lucide-react";

const activities = [
  { icon: CalendarCheck, text: "Attendance marked for Class 10A", time: "2 min ago", color: "text-success" },
  { icon: FileText, text: "Assignment submitted by Rahul K.", time: "15 min ago", color: "text-primary" },
  { icon: Award, text: "New scores uploaded for Physics", time: "1 hr ago", color: "text-accent" },
  { icon: CalendarCheck, text: "Attendance marked for Class 9B", time: "2 hrs ago", color: "text-info" },
  { icon: FileText, text: "Report generated for Term 2", time: "3 hrs ago", color: "text-warning" },
];

const RecentActivity = () => {
  return (
    <div className="glass rounded-2xl p-5 glow-teal">
      <h3 className="text-base font-semibold text-foreground mb-1">Recent Activity</h3>
      <p className="text-xs text-muted-foreground mb-4">Latest student actions</p>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
            <div className={`mt-0.5 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground/90">{activity.text}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
