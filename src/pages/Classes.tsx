import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { School, Plus, Search, Users, BookOpen, TrendingUp, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ClassData {
  id: number;
  name: string;
  teacher: string;
  students: number;
  avgScore: number;
  attendance: number;
  isNew?: boolean;
}

const STORAGE_KEY = "classes_data";

const defaultClasses: ClassData[] = [
  { id: 1, name: "Class 9A", students: 32, teacher: "Dr. Meera Roy", avgScore: 81, attendance: 91 },
  { id: 2, name: "Class 9B", students: 30, teacher: "Mr. Anil Das", avgScore: 74, attendance: 86 },
  { id: 3, name: "Class 10A", students: 35, teacher: "Ms. Priya Jain", avgScore: 79, attendance: 89 },
  { id: 4, name: "Class 10B", students: 28, teacher: "Dr. Suresh Nair", avgScore: 72, attendance: 84 },
  { id: 5, name: "Class 11A", students: 34, teacher: "Mrs. Kavita Rao", avgScore: 85, attendance: 93 },
  { id: 6, name: "Class 12A", students: 31, teacher: "Mr. Rajesh Kumar", avgScore: 77, attendance: 88 },
];

function loadClasses(): ClassData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultClasses;
}

function saveClasses(classes: ClassData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}

const Classes = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassData[]>(loadClasses);
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ClassData | null>(null);
  const [editTarget, setEditTarget] = useState<ClassData | null>(null);

  const [formName, setFormName] = useState("");
  const [formTeacher, setFormTeacher] = useState("");
  const [formStudents, setFormStudents] = useState("");
  const [formAvgScore, setFormAvgScore] = useState("");
  const [formAttendance, setFormAttendance] = useState("");

  useEffect(() => { saveClasses(classes); }, [classes]);

  const teachers = Array.from(new Set(classes.map(c => c.teacher)));

  const filtered = classes.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.teacher.toLowerCase().includes(search.toLowerCase());
    const matchesTeacher = teacherFilter === "all" || c.teacher === teacherFilter;
    return matchesSearch && matchesTeacher;
  });

  function resetForm() {
    setFormName(""); setFormTeacher(""); setFormStudents(""); setFormAvgScore(""); setFormAttendance("");
  }

  function openAdd() {
    setEditTarget(null);
    resetForm();
    setModalOpen(true);
  }

  function openEdit(cls: ClassData) {
    setEditTarget(cls);
    setFormName(cls.name);
    setFormTeacher(cls.teacher);
    setFormStudents(String(cls.students));
    setFormAvgScore(String(cls.avgScore));
    setFormAttendance(String(cls.attendance));
    setModalOpen(true);
  }

  function handleSubmit() {
    if (!formName.trim() || !formTeacher.trim()) {
      toast({ title: "Validation Error", description: "Class name and teacher are required.", variant: "destructive" });
      return;
    }
    const students = parseInt(formStudents) || 0;
    const avgScore = parseFloat(formAvgScore) || 0;
    const attendance = parseFloat(formAttendance) || 0;

    if (editTarget) {
      const updated = classes.map(c => c.id === editTarget.id ? { ...c, name: formName.trim(), teacher: formTeacher.trim(), students, avgScore, attendance } : c);
      setClasses(updated);
      setSelectedClass(prev => prev?.id === editTarget.id ? { ...editTarget, name: formName.trim(), teacher: formTeacher.trim(), students, avgScore, attendance } : prev);
      toast({ title: "Class Updated" });
    } else {
      const newClass: ClassData = {
        id: Date.now(),
        name: formName.trim(),
        teacher: formTeacher.trim(),
        students,
        avgScore,
        attendance,
        isNew: true,
      };
      setClasses(prev => [newClass, ...prev]);
      toast({ title: "Class Added" });
      setTimeout(() => setClasses(prev => prev.map(c => ({ ...c, isNew: false }))), 2000);
    }
    setModalOpen(false);
    resetForm();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setClasses(prev => prev.filter(c => c.id !== deleteTarget.id));
    if (selectedClass?.id === deleteTarget.id) setSelectedClass(null);
    setDeleteTarget(null);
    toast({ title: "Class Deleted" });
  }

  // Detail View
  if (selectedClass) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-fade-in">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => setSelectedClass(null)}>
            <ArrowLeft className="w-4 h-4" /> Back to Classes
          </Button>

          <div className="glass rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                  <School className="w-7 h-7 text-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{selectedClass.name}</h1>
                  <p className="text-sm text-muted-foreground">{selectedClass.teacher}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Tooltip><TooltipTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => openEdit(selectedClass)}>
                    <Pencil className="w-4 h-4" /> Edit
                  </Button>
                </TooltipTrigger><TooltipContent>Edit class</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2 text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(selectedClass)}>
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </TooltipTrigger><TooltipContent>Delete class</TooltipContent></Tooltip>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Students", value: selectedClass.students, icon: Users },
                { label: "Avg Score", value: `${selectedClass.avgScore}%`, icon: TrendingUp },
                { label: "Attendance", value: `${selectedClass.attendance}%`, icon: BookOpen },
              ].map(stat => (
                <div key={stat.label} className="glass rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delete dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent><AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete {deleteTarget?.name}? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader><AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter></AlertDialogContent>
        </AlertDialog>

        {/* Edit modal */}
        {renderModal()}
      </DashboardLayout>
    );
  }

  function renderModal() {
    return (
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass border-border/30">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Class" : "Add New Class"}</DialogTitle>
            <DialogDescription>{editTarget ? "Update class information." : "Fill in the details to create a new class."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Class Name</Label><Input placeholder="e.g. Class 9A" value={formName} onChange={e => setFormName(e.target.value)} /></div>
            <div><Label>Class Teacher</Label><Input placeholder="e.g. Dr. Meera Roy" value={formTeacher} onChange={e => setFormTeacher(e.target.value)} /></div>
            <div><Label>Total Students</Label><Input type="number" placeholder="0" value={formStudents} onChange={e => setFormStudents(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Avg Score (%)</Label><Input type="number" placeholder="0" value={formAvgScore} onChange={e => setFormAvgScore(e.target.value)} /></div>
              <div><Label>Attendance (%)</Label><Input type="number" placeholder="0" value={formAttendance} onChange={e => setFormAttendance(e.target.value)} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="gradient-primary text-foreground" onClick={handleSubmit}>{editTarget ? "Save Changes" : "Add Class"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Grid View
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Classes</h1>
            <p className="text-sm text-muted-foreground">Manage all classes and sections</p>
          </div>
          <Button className="gradient-primary text-foreground glow-primary gap-2" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Add Class
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search classes..." className="pl-9 glass border-border/30" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={teacherFilter} onValueChange={setTeacherFilter}>
            <SelectTrigger className="w-full sm:w-48 glass border-border/30"><SelectValue placeholder="All Teachers" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teachers</SelectItem>
              {teachers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <School className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No classes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(cls => (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`glass rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer glow-primary ${cls.isNew ? "animate-fade-in ring-2 ring-primary/40" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <School className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-lg bg-primary/10 text-primary">
                    {cls.students} students
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{cls.name}</h3>
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
        )}
      </div>

      {renderModal()}

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent><AlertDialogHeader>
          <AlertDialogTitle>Delete Class</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete {deleteTarget?.name}? This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader><AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
        </AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Classes;
