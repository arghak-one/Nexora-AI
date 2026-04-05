import { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import PerformanceChart from "@/components/PerformanceChart";
import RecentActivity from "@/components/RecentActivity";
import AIInsights from "@/components/AIInsights";
import SubjectProgress from "@/components/SubjectProgress";
import {
  CalendarCheck, BarChart3, Brain, ShieldAlert,
  Users, DollarSign, TrendingUp, AlertTriangle, RefreshCw,
} from "lucide-react";
import { store } from "@/lib/store";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LiveStats {
  avgAttendance: number;
  avgMarks: number;
  avgAI: number;
  highRisk: number;
  medRisk: number;
  flagged: number;
  riskLabel: "Low" | "Medium" | "High";
  totalCollected: number;
  unpaidFees: number;
  partialFees: number;
  totalStudents: number;
  totalTeachers: number;
  passRate: number;
  topScore: number;
}

// ─── Compute live stats from localStorage ─────────────────────────────────────
function computeStats(): LiveStats {
  const students = store.getStudents();
  const results  = store.getResults();
  const fees     = store.getStudentFees ? store.getStudentFees() : [];
  const teachers = store.getTeachers ? store.getTeachers() : [];

  const avgAttendance = students.length
    ? Math.round(students.reduce((s, st) => s + (st.attendance ?? 0), 0) / students.length * 10) / 10
    : 0;

  const avgMarks = results.length
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length * 10) / 10
    : 0;

  const avgAI = students.length
    ? Math.round(students.reduce((s, st) => s + (st.aiScore ?? 0), 0) / students.length * 10) / 10
    : 0;

  const highRisk = students.filter((s) => s.risk === "High").length;
  const medRisk  = students.filter((s) => s.risk === "Medium").length;

  const totalCollected = fees.reduce((s: number, f: any) => s + (f.paidAmount ?? 0), 0);
  const unpaidFees     = fees.filter((f: any) => f.status === "Unpaid").length;
  const partialFees    = fees.filter((f: any) => f.status === "Partial").length;

  const riskLabel =
    highRisk === 0 ? "Low"
    : highRisk <= 2 ? "Medium"
    : "High";

  const passRate = results.length
    ? Math.round(results.filter((r) => r.status === "Pass").length / results.length * 100)
    : 0;

  const topScore = results.length ? Math.max(...results.map((r) => r.percentage)) : 0;

  return {
    avgAttendance, avgMarks, avgAI, highRisk, medRisk,
    flagged: highRisk + medRisk, riskLabel,
    totalCollected, unpaidFees, partialFees,
    totalStudents: students.length, totalTeachers: teachers.length,
    passRate, topScore,
  };
}

const fmt = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

// ─── Mini KPI Card (secondary row) ───────────────────────────────────────────
const MiniCard = ({
  icon: Icon, value, label, gradient, glow,
}: { icon: React.ElementType; value: string; label: string; gradient: string; glow: string }) => (
  <div className={`glass rounded-2xl p-4 ${glow} hover:scale-[1.02] transition-all duration-200 cursor-default`}>
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl ${gradient} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4 text-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-foreground leading-tight truncate">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</p>
      </div>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  // Tick state — bumped every time we want to recompute stats
  const [tick, setTick] = useState(0);

  // Recompute whenever tick changes (covers manual refresh + storage events)
  const stats = useMemo(() => computeStats(), [tick]);

  // Re-read from localStorage when user navigates back to this tab
  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);

    // Storage event fires when ANOTHER tab writes to localStorage
    window.addEventListener("storage", refresh);
    // Visibility change fires when user switches back to this tab
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const handleRefresh = useCallback(() => setTick((t) => t + 1), []);

  // ── Derived UI helpers ─────────────────────────────────────────────────────
  const riskCardColor =
    stats.riskLabel === "High"   ? "text-destructive" :
    stats.riskLabel === "Medium" ? "text-warning" : "text-success";

  const attendanceTrend = stats.avgAttendance >= 90 ? "✓ On Target" : stats.avgAttendance >= 75 ? "⚠ Needs Work" : "✕ Critical";
  const marksTrend      = stats.avgMarks >= 75 ? "✓ Above Target" : stats.avgMarks >= 50 ? "⚠ Below Target" : "✕ Critical";
  const aiTrend         = stats.avgAI >= 7 ? "✓ On Track" : stats.avgAI >= 5 ? "⚠ Average" : "✕ Low";

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Live overview — updates automatically from all modules</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground glass px-3 py-2 rounded-xl transition-all hover:scale-105"
            title="Refresh stats"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* ── Primary KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Attendance Rate"
            value={`${stats.avgAttendance}%`}
            icon={CalendarCheck}
            trend={attendanceTrend}
            trendUp={stats.avgAttendance >= 75}
            glowClass="glow-primary"
            gradientClass="gradient-primary"
          />
          <StatCard
            title="Average Marks"
            value={`${stats.avgMarks}%`}
            icon={BarChart3}
            trend={marksTrend}
            trendUp={stats.avgMarks >= 75}
            glowClass="glow-accent"
            gradientClass="gradient-warm"
          />
          <StatCard
            title="AI Performance Score"
            value={`${stats.avgAI}/10`}
            icon={Brain}
            trend={aiTrend}
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

        {/* ── Secondary KPI Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCard icon={Users}        value={String(stats.totalStudents)}      label="Total Students"   gradient="gradient-teal"    glow="glow-teal" />
          <MiniCard icon={DollarSign}   value={fmt(stats.totalCollected)}         label="Fees Collected"   gradient="gradient-primary" glow="glow-primary" />
          <MiniCard icon={AlertTriangle} value={String(stats.unpaidFees)}         label="Unpaid Fees"      gradient="gradient-warm"    glow="glow-accent" />
          <MiniCard icon={TrendingUp}   value={`${stats.passRate}%`}              label="Overall Pass Rate" gradient="gradient-teal"   glow="glow-teal" />
        </div>

        {/* ── Alert Banners ── */}
        {stats.highRisk > 0 && (
          <div className="glass rounded-2xl p-4 border border-destructive/30 flex items-start gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                🚨 {stats.highRisk} high-risk student{stats.highRisk !== 1 ? "s" : ""} need immediate attention
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Low attendance or critical marks detected. Go to <strong>Students</strong> to review and take action.
              </p>
            </div>
          </div>
        )}
        {stats.unpaidFees > 0 && (
          <div className="glass rounded-2xl p-4 border border-warning/30 flex items-start gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center shrink-0 mt-0.5">
              <DollarSign className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                💰 {stats.unpaidFees} unpaid + {stats.partialFees} partial fee{(stats.unpaidFees + stats.partialFees) !== 1 ? "s" : ""} pending
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Follow up with students or parents. Review in the <strong>Fees</strong> module.
              </p>
            </div>
          </div>
        )}

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
          <SubjectProgress />
        </div>

        {/* ── Activity & Insights ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentActivity />
          <AIInsights />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
