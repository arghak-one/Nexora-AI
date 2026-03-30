import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Sparkles, CalendarCheck, BarChart3, Brain } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const studentsData: Record<number, any> = {
  1: { name: "Rahul Kumar", class: "10A", attendance: 95, marks: 88, risk: "Low", aiScore: 9.2 },
  2: { name: "Priya Sharma", class: "10A", attendance: 72, marks: 65, risk: "High", aiScore: 5.8 },
  3: { name: "Amit Patel", class: "10B", attendance: 88, marks: 76, risk: "Low", aiScore: 7.9 },
  4: { name: "Sneha Gupta", class: "9A", attendance: 91, marks: 82, risk: "Low", aiScore: 8.5 },
  5: { name: "Vikram Singh", class: "10B", attendance: 58, marks: 45, risk: "High", aiScore: 3.2 },
  6: { name: "Ananya Das", class: "9B", attendance: 85, marks: 79, risk: "Medium", aiScore: 7.1 },
  7: { name: "Rohan Mehta", class: "9A", attendance: 93, marks: 91, risk: "Low", aiScore: 9.5 },
  8: { name: "Kavita Reddy", class: "10A", attendance: 78, marks: 68, risk: "Medium", aiScore: 6.4 },
};

const chartData = [
  { month: "Jan", score: 65 }, { month: "Feb", score: 70 }, { month: "Mar", score: 68 },
  { month: "Apr", score: 75 }, { month: "May", score: 80 }, { month: "Jun", score: 85 },
  { month: "Jul", score: 82 }, { month: "Aug", score: 88 },
];

const riskColors: Record<string, string> = {
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
};

const suggestions = [
  "Recommend additional practice sessions for Physics",
  "Attendance has been consistent — maintain current routine",
  "Consider advanced materials for Computer Science",
  "Schedule parent-teacher meeting if marks drop below 70",
];

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = studentsData[Number(id)] || studentsData[1];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => navigate("/students")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>

        {/* Header */}
        <div className="glass rounded-2xl p-6 glow-primary flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-foreground text-2xl font-bold">
            {student.name.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Class {student.class}</p>
            <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-lg ${riskColors[student.risk]}`}>
              Risk: {student.risk}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5 text-center glow-primary">
            <CalendarCheck className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{student.attendance}%</p>
            <p className="text-sm text-muted-foreground">Attendance</p>
          </div>
          <div className="glass rounded-2xl p-5 text-center glow-accent">
            <BarChart3 className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{student.marks}</p>
            <p className="text-sm text-muted-foreground">Average Marks</p>
          </div>
          <div className="glass rounded-2xl p-5 text-center glow-teal">
            <Brain className="w-6 h-6 text-info mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{student.aiScore}/10</p>
            <p className="text-sm text-muted-foreground">AI Score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart */}
          <div className="glass rounded-2xl p-5 glow-primary">
            <h3 className="text-base font-semibold text-foreground mb-4">Performance Trend</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(222, 44%, 8%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "12px", color: "hsl(210, 40%, 96%)" }} />
                  <Area type="monotone" dataKey="score" stroke="hsl(217, 91%, 60%)" fill="url(#scoreGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="glass rounded-2xl p-5 glow-accent">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="text-base font-semibold text-foreground">AI Suggestions</h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div key={i} className="p-3 rounded-xl bg-accent/5 border border-accent/20">
                  <p className="text-sm text-foreground/90">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
