import { CalendarCheck, FileText, Award, Clock, BarChart3, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Activity {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  time: string;
  color: string;
  type: "attendance" | "assignment" | "result" | "report";
  meta: Record<string, string>;
}

const activities: Activity[] = [
  {
    icon: CalendarCheck,
    text: "Attendance marked for Class 10A",
    time: "2 min ago",
    color: "text-success",
    type: "attendance",
    meta: { class: "10A" },
  },
  {
    icon: FileText,
    text: "Assignment submitted by Rahul K.",
    time: "15 min ago",
    color: "text-primary",
    type: "assignment",
    meta: { studentName: "Rahul Kumar" },
  },
  {
    icon: Award,
    text: "New scores uploaded for Physics",
    time: "1 hr ago",
    color: "text-accent",
    type: "result",
    meta: { subject: "Physics" },
  },
  {
    icon: CalendarCheck,
    text: "Attendance marked for Class 9B",
    time: "2 hrs ago",
    color: "text-info",
    type: "attendance",
    meta: { class: "9B" },
  },
  {
    icon: FileText,
    text: "Report generated for Term 2",
    time: "3 hrs ago",
    color: "text-warning",
    type: "report",
    meta: { term: "Term 2" },
  },
];

const attendanceDetails: Record<string, { name: string; status: "Present" | "Absent" }[]> = {
  "10A": [
    { name: "Rahul Kumar", status: "Present" },
    { name: "Priya Sharma", status: "Present" },
    { name: "Amit Patel", status: "Present" },
    { name: "Sneha Gupta", status: "Absent" },
    { name: "Vikram Singh", status: "Present" },
  ],
  "9B": [
    { name: "Ananya Das", status: "Present" },
    { name: "Rohan Mehta", status: "Absent" },
    { name: "Kavita Joshi", status: "Present" },
    { name: "Sunil Yadav", status: "Present" },
    { name: "Meera Nair", status: "Absent" },
  ],
};

const RecentActivity = () => {
  const navigate = useNavigate();
  const [modalData, setModalData] = useState<Activity | null>(null);

  const handleClick = (activity: Activity) => {
    switch (activity.type) {
      case "attendance":
        setModalData(activity);
        break;
      case "assignment":
        navigate("/students");
        break;
      case "result":
        navigate("/results");
        break;
      case "report":
        navigate("/reports");
        break;
    }
  };

  const classKey = modalData?.meta?.class || "";
  const students = attendanceDetails[classKey] || [];
  const presentCount = students.filter((s) => s.status === "Present").length;
  const absentCount = students.filter((s) => s.status === "Absent").length;

  return (
    <div className="glass rounded-2xl p-5 glow-teal">
      <h3 className="text-base font-semibold text-foreground mb-1">Recent Activity</h3>
      <p className="text-xs text-muted-foreground mb-4">Click any activity for details</p>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div
            key={i}
            onClick={() => handleClick(activity)}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/30 hover:scale-[1.02] cursor-pointer transition-all duration-200 group relative"
          >
            <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className={`mt-0.5 ${activity.color} relative z-10`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <p className="text-sm text-foreground/90 group-hover:text-foreground transition-colors">
                {activity.text}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {activity.time}
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 relative z-10" />
          </div>
        ))}
      </div>

      {/* Attendance Detail Modal */}
      <Dialog open={!!modalData} onOpenChange={(open) => { if (!open) setModalData(null); }}>
        <DialogContent className="bg-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <CalendarCheck className="w-5 h-5 text-success" />
              Attendance — Class {classKey}
            </DialogTitle>
            <DialogDescription>Student-wise attendance snapshot</DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 my-2">
            <div className="flex-1 rounded-xl bg-success/10 border border-success/20 p-3 text-center">
              <p className="text-2xl font-bold text-success">{presentCount}</p>
              <p className="text-xs text-muted-foreground">Present</p>
            </div>
            <div className="flex-1 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-center">
              <p className="text-2xl font-bold text-destructive">{absentCount}</p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {students.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/30">
                <span className="text-sm text-foreground">{s.name}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${s.status === "Present" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-2">
            <Button size="sm" variant="outline" onClick={() => { setModalData(null); navigate("/attendance"); }} className="gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              View Full Attendance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecentActivity;
