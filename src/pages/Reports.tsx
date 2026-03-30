import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Download, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const reports = [
  { title: "Term 1 Performance Report", type: "Academic", date: "March 15, 2026", size: "2.4 MB" },
  { title: "Monthly Attendance Summary", type: "Attendance", date: "March 1, 2026", size: "1.1 MB" },
  { title: "AI Risk Assessment Report", type: "AI Analytics", date: "Feb 28, 2026", size: "3.2 MB" },
  { title: "Fee Collection Summary — Q1", type: "Financial", date: "Feb 15, 2026", size: "0.8 MB" },
  { title: "Student Behaviour Analysis", type: "Behavioural", date: "Feb 10, 2026", size: "1.6 MB" },
  { title: "Parent Feedback Compilation", type: "Feedback", date: "Jan 30, 2026", size: "2.0 MB" },
];

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">Generated reports and documents</p>
          </div>
          <Button className="gradient-primary text-foreground glow-primary gap-2">
            <FileText className="w-4 h-4" />
            Generate New Report
          </Button>
        </div>

        <div className="space-y-3">
          {reports.map((report, i) => (
            <div key={i} className="glass rounded-2xl p-5 flex items-center justify-between hover:scale-[1.005] transition-all duration-200 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{report.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">{report.type}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{report.date}</span>
                    <span className="text-xs text-muted-foreground">{report.size}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
