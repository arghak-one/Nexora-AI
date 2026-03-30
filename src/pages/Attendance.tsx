import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { CalendarCheck, Users, AlertTriangle, TrendingUp } from "lucide-react";

const attendanceByClass = [
  { class: "9A", present: 30, absent: 2, total: 32, rate: 94 },
  { class: "9B", present: 26, absent: 4, total: 30, rate: 87 },
  { class: "10A", present: 33, absent: 2, total: 35, rate: 94 },
  { class: "10B", present: 23, absent: 5, total: 28, rate: 82 },
  { class: "11A", present: 32, absent: 2, total: 34, rate: 94 },
  { class: "12A", present: 29, absent: 2, total: 31, rate: 94 },
];

const Attendance = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground">Daily attendance tracking and insights</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Today's Rate" value="91.5%" icon={CalendarCheck} trend="+1.2%" trendUp glowClass="glow-primary" gradientClass="gradient-primary" />
          <StatCard title="Present Today" value="173" icon={Users} trend="+5" trendUp glowClass="glow-teal" gradientClass="gradient-teal" />
          <StatCard title="Absent Today" value="17" icon={AlertTriangle} trend="-3" trendUp glowClass="glow-accent" gradientClass="gradient-warm" />
          <StatCard title="Weekly Avg" value="92.8%" icon={TrendingUp} trend="+0.4%" trendUp glowClass="glow-primary" gradientClass="gradient-primary" />
        </div>

        <div className="glass rounded-2xl overflow-hidden glow-teal">
          <div className="p-5 border-b border-border/30">
            <h3 className="text-base font-semibold text-foreground">Class-wise Attendance — Today</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Class</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Present</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Absent</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Total</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Rate</th>
                </tr>
              </thead>
              <tbody>
                {attendanceByClass.map((a) => (
                  <tr key={a.class} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground text-sm">Class {a.class}</td>
                    <td className="px-5 py-4 text-sm text-success">{a.present}</td>
                    <td className="px-5 py-4 text-sm text-destructive">{a.absent}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{a.total}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                          <div className={`h-full rounded-full ${a.rate >= 90 ? 'bg-success' : a.rate >= 80 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${a.rate}%` }} />
                        </div>
                        <span className="text-sm text-foreground">{a.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
