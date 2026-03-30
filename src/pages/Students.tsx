import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const studentsData = [
  { id: 1, name: "Rahul Kumar", class: "10A", attendance: 95, marks: 88, risk: "Low", aiScore: 9.2 },
  { id: 2, name: "Priya Sharma", class: "10A", attendance: 72, marks: 65, risk: "High", aiScore: 5.8 },
  { id: 3, name: "Amit Patel", class: "10B", attendance: 88, marks: 76, risk: "Low", aiScore: 7.9 },
  { id: 4, name: "Sneha Gupta", class: "9A", attendance: 91, marks: 82, risk: "Low", aiScore: 8.5 },
  { id: 5, name: "Vikram Singh", class: "10B", attendance: 58, marks: 45, risk: "High", aiScore: 3.2 },
  { id: 6, name: "Ananya Das", class: "9B", attendance: 85, marks: 79, risk: "Medium", aiScore: 7.1 },
  { id: 7, name: "Rohan Mehta", class: "9A", attendance: 93, marks: 91, risk: "Low", aiScore: 9.5 },
  { id: 8, name: "Kavita Reddy", class: "10A", attendance: 78, marks: 68, risk: "Medium", aiScore: 6.4 },
];

const riskColors: Record<string, string> = {
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
};

const Students = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const navigate = useNavigate();

  const filtered = studentsData.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "All" || s.class === classFilter;
    const matchRisk = riskFilter === "All" || s.risk === riskFilter;
    return matchSearch && matchClass && matchRisk;
  });

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <p className="text-sm text-muted-foreground">{studentsData.length} total students enrolled</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 h-9 bg-secondary/50 border-border/50 text-foreground text-sm"
              />
            </div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm outline-none"
            >
              <option value="All">All Classes</option>
              <option value="9A">9A</option>
              <option value="9B">9B</option>
              <option value="10A">10A</option>
              <option value="10B">10B</option>
            </select>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm outline-none"
            >
              <option value="All">All Risk</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden glow-primary">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Student</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Class</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Attendance</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Avg Marks</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">AI Score</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-foreground font-semibold text-xs">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{student.class}</td>
                    <td className="px-5 py-4 text-sm text-foreground">{student.attendance}%</td>
                    <td className="px-5 py-4 text-sm text-foreground">{student.marks}</td>
                    <td className="px-5 py-4 text-sm text-foreground">{student.aiScore}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${riskColors[student.risk]}`}>
                        {student.risk}
                      </span>
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

export default Students;
