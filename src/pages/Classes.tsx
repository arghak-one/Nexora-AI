import DashboardLayout from "@/components/DashboardLayout";
import { School, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const classesData = [
  { name: "Class 9A", students: 32, teacher: "Dr. Meera Roy", avgScore: 81, attendance: 91 },
  { name: "Class 9B", students: 30, teacher: "Mr. Anil Das", avgScore: 74, attendance: 86 },
  { name: "Class 10A", students: 35, teacher: "Ms. Priya Jain", avgScore: 79, attendance: 89 },
  { name: "Class 10B", students: 28, teacher: "Dr. Suresh Nair", avgScore: 72, attendance: 84 },
  { name: "Class 11A", students: 34, teacher: "Mrs. Kavita Rao", avgScore: 85, attendance: 93 },
  { name: "Class 12A", students: 31, teacher: "Mr. Rajesh Kumar", avgScore: 77, attendance: 88 },
];

const Classes = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Classes</h1>
            <p className="text-sm text-muted-foreground">Manage all classes and sections</p>
          </div>
          <Button className="gradient-primary text-foreground glow-primary gap-2">
            <Plus className="w-4 h-4" />
            Add Class
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classesData.map((cls) => (
            <div key={cls.name} className="glass rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 group cursor-pointer glow-primary">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <School className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-primary/10 text-primary">
                  {cls.students} students
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{cls.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{cls.teacher}</p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                  <p className="text-sm font-semibold text-foreground">{cls.avgScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                  <p className="text-sm font-semibold text-foreground">{cls.attendance}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Classes;
