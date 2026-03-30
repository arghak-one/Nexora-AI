import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";

const resultsData = [
  { subject: "Mathematics", classAvg: 78, highest: 98, lowest: 42, passRate: 89 },
  { subject: "Physics", classAvg: 72, highest: 95, lowest: 35, passRate: 82 },
  { subject: "Chemistry", classAvg: 81, highest: 97, lowest: 48, passRate: 91 },
  { subject: "English", classAvg: 85, highest: 99, lowest: 55, passRate: 95 },
  { subject: "Computer Science", classAvg: 88, highest: 100, lowest: 60, passRate: 97 },
  { subject: "Biology", classAvg: 76, highest: 94, lowest: 38, passRate: 85 },
];

const Results = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Results</h1>
          <p className="text-sm text-muted-foreground">Examination results and analysis</p>
        </div>

        <div className="glass rounded-2xl overflow-hidden glow-primary">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Subject</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Class Average</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Highest</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Lowest</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {resultsData.map((r) => (
                  <tr key={r.subject} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-foreground" />
                        </div>
                        <span className="font-medium text-foreground text-sm">{r.subject}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground font-semibold">{r.classAvg}%</td>
                    <td className="px-5 py-4 text-sm text-success">{r.highest}</td>
                    <td className="px-5 py-4 text-sm text-destructive">{r.lowest}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                          <div className="h-full rounded-full bg-success" style={{ width: `${r.passRate}%` }} />
                        </div>
                        <span className="text-sm text-foreground">{r.passRate}%</span>
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

export default Results;
