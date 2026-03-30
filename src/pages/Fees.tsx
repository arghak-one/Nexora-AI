import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { DollarSign, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const feesData = [
  { student: "Rahul Kumar", class: "10A", total: 25000, paid: 25000, status: "Paid" },
  { student: "Priya Sharma", class: "10A", total: 25000, paid: 15000, status: "Partial" },
  { student: "Amit Patel", class: "10B", total: 25000, paid: 25000, status: "Paid" },
  { student: "Vikram Singh", class: "10B", total: 25000, paid: 0, status: "Unpaid" },
  { student: "Sneha Gupta", class: "9A", total: 22000, paid: 22000, status: "Paid" },
  { student: "Rohan Mehta", class: "9A", total: 22000, paid: 12000, status: "Partial" },
];

const statusColors: Record<string, string> = {
  Paid: "bg-success/10 text-success",
  Partial: "bg-warning/10 text-warning",
  Unpaid: "bg-destructive/10 text-destructive",
};

const Fees = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fees</h1>
          <p className="text-sm text-muted-foreground">Fee collection and payment tracking</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Collected" value="₹4.2L" icon={DollarSign} trend="+12%" trendUp glowClass="glow-primary" gradientClass="gradient-primary" />
          <StatCard title="Fully Paid" value="142" icon={CheckCircle} glowClass="glow-teal" gradientClass="gradient-teal" />
          <StatCard title="Partially Paid" value="28" icon={Clock} glowClass="glow-accent" gradientClass="gradient-warm" />
          <StatCard title="Unpaid" value="8" icon={AlertTriangle} glowClass="glow-primary" gradientClass="gradient-primary" />
        </div>

        <div className="glass rounded-2xl overflow-hidden glow-primary">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Student</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Class</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Total</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Paid</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {feesData.map((f, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground text-sm">{f.student}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{f.class}</td>
                    <td className="px-5 py-4 text-sm text-foreground">₹{f.total.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-foreground">₹{f.paid.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusColors[f.status]}`}>{f.status}</span>
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

export default Fees;
