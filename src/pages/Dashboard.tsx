import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import PerformanceChart from "@/components/PerformanceChart";
import SubjectProgress from "@/components/SubjectProgress";
import RecentActivity from "@/components/RecentActivity";
import AIInsights from "@/components/AIInsights";
import { CalendarCheck, BarChart3, Brain, ShieldAlert } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Attendance Rate"
            value="92.4%"
            icon={CalendarCheck}
            trend="+2.1%"
            trendUp
            glowClass="glow-primary"
            gradientClass="gradient-primary"
          />
          <StatCard
            title="Average Marks"
            value="78.5"
            icon={BarChart3}
            trend="+5.3"
            trendUp
            glowClass="glow-accent"
            gradientClass="gradient-warm"
          />
          <StatCard
            title="AI Performance Score"
            value="8.4/10"
            icon={Brain}
            trend="+0.6"
            trendUp
            glowClass="glow-teal"
            gradientClass="gradient-teal"
          />
          <StatCard
            title="Risk Level"
            value="Low"
            subtitle="3 students flagged"
            icon={ShieldAlert}
            glowClass="glow-primary"
            gradientClass="gradient-primary"
          />
        </div>

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
