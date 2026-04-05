import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import PerformanceChart from "@/components/PerformanceChart";
import SubjectProgress from "@/components/SubjectProgress";
import RecentActivity from "@/components/RecentActivity";
import AIInsights from "@/components/AIInsights";
import { CalendarCheck, BarChart3, Brain, ShieldAlert, Users, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { store } from "@/lib/store";

// ─── Pull live data from store ────────────────────────────────────────────────
function getLiveStats() {
  const students = store.getStudents();
  const results  = store.getResults();
  const fees     = store.getStudentFees ? store.getStudentFees() : [];

  // Attendance rate from students
  const avgAttendance = students.length
    ? Math.round(students.reduce((s, st) => s + (st.attendance ?? 0), 0) / students.length * 10) / 10
    : 0;

  // Average marks from results
  const avgMarks = results.length
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length * 10) / 10
    : 0;

  // AI score from students
  const avgAI = students.length
    ? Math.round(students.reduce((s, st) => s + (st.aiScore ?? 0), 0) / students.length * 10) / 10
    : 0;

  // High-risk students
  const highRisk = students.filter((s) => s.risk === "High").length;
  const medRisk  = students.filter((s) => s.risk === "Medium").length;

  // Fee stats
  const totalCollected = fees.reduce((s: number, f: any) => s + (f.paidAmount ?? 0), 0);
  const unpaidFees     = fees.filter((f: any) => f.status === "Unpaid").length;

  // Risk level label
  const riskLabel = highRisk === 0 ? "Low" : highRisk <= 2 ? "Medium" : "High";
  const flagged   = highRisk + medRisk;

  return { avgAttendance, avgMarks, avgAI, highRisk, medRisk, flagged, riskLabel, totalCollected, unpaidFees, totalStudents: students.length };
}

const formatMoney = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

const riskColor = (label: string) => {
  if (label === "High")   return "bg-destructive/10 text-destructive";
  if (label === "Medium") return "bg-warning/10 text-warning";
  return "bg-success/10 text-success";
};

// ─── Component ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const stats = useMemo(() => getLiveStats(), []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* Top KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Attendance Rate"
            value={`${stats.avgAttendance}%`}
            icon={CalendarCheck}
            trend={stats.avgAttendance >= 90 ? "+Good" : "Needs attention"}
            trendUp={stats.avgAttendance >= 90}
            glowClass="glow-primary"
            gradientClass="gradient-primary"
          />
          <StatCard
            title="Average Marks"
            value={`${stats.avgMarks}%`}
            icon={BarChart3}
            trend={stats.avgMarks >= 75 ? "Above target" : "Below target"}
            trendUp={stats.avgMarks >= 75}
            glowClass="glow-accent"
            gradientClass="gradient-warm"
          />
          <StatCard
            title="AI Performance Score"
            value={`${stats.avgAI}/10`}
            icon={Brain}
            trend={stats.avgAI >= 7 ? "On track" : "Review needed"}
            trendUp={stats.avgAI >= 7}
            glowClass="glow-teal"
            gradientClass="gradient-teal"
          />
          <StatCard
            title="Risk Level"
            value={stats.riskLabel}
            subtitle={`${stats.flagged} student${stats.flagged !== 1 ? "s" : ""} flagged`}
            icon={ShieldAlert}
            glowClass="glow-primary"
            gradientClass="gradient-primary"
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-4 glow-primary hover:scale-[1.02] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center">
                <Users className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 glow-teal hover:scale-[1.02] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{formatMoney(stats.totalCollected)}</p>
                <p className="text-xs text-muted-foreground">Fees Collected</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 glow-accent hover:scale-[1.02] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-warm flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.unpaidFees}</p>
                <p className="text-xs text-muted-foreground">Unpaid Fees</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 glow-primary hover:scale-[1.02] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.highRisk}</p>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner — only if high-risk students exist */}
        {stats.highRisk > 0 && (
          <div className="glass rounded-2xl p-4 border border-destructive/30 glow-primary flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {stats.highRisk} high-risk student{stats.highRisk !== 1 ? "s" : ""} need immediate attention
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Low attendance or poor performance detected. Review in Students section.
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
          <SubjectProgress />
        </div>

        {/* Activity & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentActivity />
          <AIInsights />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
