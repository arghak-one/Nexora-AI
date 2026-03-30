import DashboardLayout from "@/components/DashboardLayout";
import { GraduationCap, Mail, Phone } from "lucide-react";

const teachersData = [
  { name: "Dr. Meera Roy", subject: "Mathematics", classes: "9A, 10A", email: "meera@eduai.com", rating: 4.8 },
  { name: "Mr. Anil Das", subject: "Physics", classes: "9B, 10B", email: "anil@eduai.com", rating: 4.5 },
  { name: "Ms. Priya Jain", subject: "Chemistry", classes: "10A, 11A", email: "priya@eduai.com", rating: 4.9 },
  { name: "Dr. Suresh Nair", subject: "English", classes: "10B, 12A", email: "suresh@eduai.com", rating: 4.3 },
  { name: "Mrs. Kavita Rao", subject: "Computer Science", classes: "11A, 12A", email: "kavita@eduai.com", rating: 4.7 },
  { name: "Mr. Rajesh Kumar", subject: "Biology", classes: "9A, 9B", email: "rajesh@eduai.com", rating: 4.6 },
];

const Teachers = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-sm text-muted-foreground">Faculty directory and management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachersData.map((teacher) => (
            <div key={teacher.name} className="glass rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 glow-teal cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center text-foreground font-bold text-lg">
                  {teacher.name.split(" ").slice(-1)[0][0]}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{teacher.name}</h3>
                  <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>Classes: {teacher.classes}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{teacher.email}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Rating</span>
                <span className="text-sm font-semibold text-warning">{teacher.rating}/5.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Teachers;
