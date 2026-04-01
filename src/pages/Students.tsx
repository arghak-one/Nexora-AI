import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Student {
  id: number;
  name: string;
  class: string;
  attendance: number;
  marks: number;
  risk: string;
  aiScore: number;
  isNew?: boolean;
}

const initialStudents: Student[] = [
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

function computeRisk(attendance: number, marks: number): string {
  if (attendance < 60) return "High";
  if (marks < 70) return "Medium";
  return "Low";
}

function computeAiScore(attendance: number, marks: number): number {
  const score = (attendance * 0.4 + marks * 0.6) / 10;
  return Math.round(score * 10) / 10;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formName, setFormName] = useState("");
  const [formClass, setFormClass] = useState("9A");
  const [formAttendance, setFormAttendance] = useState("");
  const [formMarks, setFormMarks] = useState("");

  const resetForm = () => {
    setFormName("");
    setFormClass("9A");
    setFormAttendance("");
    setFormMarks("");
  };

  const handleAdd = () => {
    if (!formName.trim()) {
      toast({ title: "Validation Error", description: "Full name is required.", variant: "destructive" });
      return;
    }
    const attendance = Number(formAttendance);
    const marks = Number(formMarks);
    if (isNaN(attendance) || attendance < 0 || attendance > 100) {
      toast({ title: "Validation Error", description: "Attendance must be 0–100.", variant: "destructive" });
      return;
    }
    if (isNaN(marks) || marks < 0 || marks > 100) {
      toast({ title: "Validation Error", description: "Marks must be 0–100.", variant: "destructive" });
      return;
    }

    const newStudent: Student = {
      id: Date.now(),
      name: formName.trim(),
      class: formClass,
      attendance,
      marks,
      risk: computeRisk(attendance, marks),
      aiScore: computeAiScore(attendance, marks),
      isNew: true,
    };

    setStudents((prev) => [newStudent, ...prev]);
    setModalOpen(false);
    resetForm();
    toast({ title: "Student added successfully", description: `${newStudent.name} has been enrolled.` });

    // Remove animation flag after animation completes
    setTimeout(() => {
      setStudents((prev) => prev.map((s) => (s.id === newStudent.id ? { ...s, isNew: false } : s)));
    }, 600);
  };

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "All" || s.class === classFilter;
    const matchRisk = riskFilter === "All" || s.risk === riskFilter;
    return matchSearch && matchClass && matchRisk;
  });

  const inputClasses =
    "h-10 bg-secondary/50 border-border/50 text-foreground rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-shadow";

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <p className="text-sm text-muted-foreground">{students.length} total students enrolled</p>
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
            <Button
              onClick={() => setModalOpen(true)}
              className="h-9 px-4 gradient-primary text-foreground font-semibold rounded-xl shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_28px_-4px_hsl(var(--primary)/0.7)] transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Student
            </Button>
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
                    className={`border-b border-border/30 hover:bg-secondary/30 transition-all cursor-pointer group ${student.isNew ? "animate-fade-in" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-foreground font-semibold text-xs">
                          {student.name.split(" ").map((n) => n[0]).join("")}
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

      {/* Add Student Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass-strong border-border/50 rounded-2xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.3)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Add New Student</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">Fill in the details below. Risk level and AI score are auto-calculated.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Full Name</Label>
              <Input
                placeholder="e.g. Arjun Verma"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Class</Label>
              <select
                value={formClass}
                onChange={(e) => setFormClass(e.target.value)}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              >
                <option value="9A">9A</option>
                <option value="9B">9B</option>
                <option value="10A">10A</option>
                <option value="10B">10B</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Attendance (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0–100"
                  value={formAttendance}
                  onChange={(e) => setFormAttendance(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Average Marks</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0–100"
                  value={formMarks}
                  onChange={(e) => setFormMarks(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Live preview of computed values */}
            {formAttendance && formMarks && (
              <div className="flex gap-3 pt-1 animate-fade-in">
                <div className="flex-1 rounded-xl bg-secondary/40 border border-border/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">AI Score</p>
                  <p className="text-lg font-bold text-primary">{computeAiScore(Number(formAttendance), Number(formMarks))}</p>
                </div>
                <div className="flex-1 rounded-xl bg-secondary/40 border border-border/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Risk Level</p>
                  <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-lg ${riskColors[computeRisk(Number(formAttendance), Number(formMarks))]}`}>
                    {computeRisk(Number(formAttendance), Number(formMarks))}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setModalOpen(false); resetForm(); }} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              className="gradient-primary text-foreground font-semibold rounded-xl shadow-[0_0_16px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)] transition-all duration-300"
            >
              Add Student
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Students;
