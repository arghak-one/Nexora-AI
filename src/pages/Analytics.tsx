import DashboardLayout from "@/components/DashboardLayout";
import PerformanceChart from "@/components/PerformanceChart";
import SubjectProgress from "@/components/SubjectProgress";
import StatCard from "@/components/StatCard";
import { LineChart, TrendingUp, Users, Brain } from "lucide-react";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">In-depth performance analytics and trends</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Assessments" value="128" icon={LineChart} trend="+12" trendUp glowClass="glow-primary" gradientClass="gradient-primary" />
          <StatCard title="Avg Improvement" value="+8.3%" icon={TrendingUp} trend="+2.1%" trendUp glowClass="glow-teal" gradientClass="gradient-teal" />
          <StatCard title="Top Performers" value="24" icon={Users} glowClass="glow-accent" gradientClass="gradient-warm" />
          <StatCard title="AI Accuracy" value="94.2%" icon={Brain} trend="+1.5%" trendUp glowClass="glow-primary" gradientClass="gradient-primary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
          <SubjectProgress />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
