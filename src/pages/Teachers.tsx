import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { GraduationCap, Mail, Plus, Pencil, Trash2, AlertTriangle, Search, Star, ArrowLeft, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Teacher {
  id: number;
  name: string;
  subject: string;
  classes: string[];
  email: string;
  rating: number;
  isNew?: boolean;
}

const STORAGE_KEY = "teachers_data";

const defaultTeachers: Teacher[] = [
  { id: 1, name: "Dr. Meera Roy", subject: "Mathematics", classes: ["9A", "10A"], email: "meera@eduai.com", rating: 4.8 },
  { id: 2, name: "Mr. Anil Das", subject: "Physics", classes: ["9B", "10B"], email: "anil@eduai.com", rating: 4.5 },
  { id: 3, name: "Ms. Priya Jain", subject: "Chemistry", classes: ["10A", "11A"], email: "priya@eduai.com", rating: 4.9 },
  { id: 4, name: "Dr. Suresh Nair", subject: "English", classes: ["10B", "12A"], email: "suresh@eduai.com", rating: 4.3 },
  { id: 5, name: "Mrs. Kavita Rao", subject: "Computer Science", classes: ["11A", "12A"], email: "kavita@eduai.com", rating: 4.7 },
  { id: 6, name: "Mr. Rajesh Kumar", subject: "Biology", classes: ["9A", "9B"], email: "rajesh@eduai.com", rating: 4.6 },
];

const subjects = ["Mathematics", "Physics", "Chemistry", "English", "Computer Science", "Biology", "History", "Geography"];
const allClasses = ["9A", "9B", "10A", "10B", "11A", "11B", "12A", "12B"];

function loadTeachers(): Teacher[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultTeachers;
}

function saveTeachers(teachers: Teacher[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
}

const ratingColor = (r: number) => {
  if (r >= 4.5) return "text-success";
  if (r >= 4.0) return "text-warning";
  return "text-destructive";
};

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(loadTeachers);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formSubject, setFormSubject] = useState(subjects[0]);
  const [formClasses, setFormClasses] = useState<string[]>([]);
  const [formEmail, setFormEmail] = useState("");
  const [formRating, setFormRating] = useState("");

  useEffect(() => {
    saveTeachers(teachers);
  }, [teachers]);

  const resetForm = () => {
    setFormName("");
    setFormSubject(subjects[0]);
    setFormClasses([]);
    setFormEmail("");
    setFormRating("");
    setEditingTeacher(null);
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormName(teacher.name);
    setFormSubject(teacher.subject);
    setFormClasses([...teacher.classes]);
    setFormEmail(teacher.email);
    setFormRating(String(teacher.rating));
    setModalOpen(true);
  };

  const toggleClass = (cls: string) => {
    setFormClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const validateForm = (): boolean => {
    if (!formName.trim()) {
      toast({ title: "Validation Error", description: "Full name is required.", variant: "destructive" });
      return false;
    }
    if (!formEmail.trim() || !formEmail.includes("@")) {
      toast({ title: "Validation Error", description: "Valid email is required.", variant: "destructive" });
      return false;
    }
    if (formClasses.length === 0) {
      toast({ title: "Validation Error", description: "Select at least one class.", variant: "destructive" });
      return false;
    }
    const rating = Number(formRating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      toast({ title: "Validation Error", description: "Rating must be 0–5.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const rating = Math.round(Number(formRating) * 10) / 10;

    if (editingTeacher) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === editingTeacher.id
            ? { ...t, name: formName.trim(), subject: formSubject, classes: [...formClasses], email: formEmail.trim(), rating }
            : t
        )
      );
      // Also update selected teacher detail view if open
      if (selectedTeacher?.id === editingTeacher.id) {
        setSelectedTeacher({ ...editingTeacher, name: formName.trim(), subject: formSubject, classes: [...formClasses], email: formEmail.trim(), rating });
      }
      setModalOpen(false);
      resetForm();
      toast({ title: "Teacher updated", description: `${formName.trim()}'s record has been updated.` });
    } else {
      const newTeacher: Teacher = {
        id: Date.now(),
        name: formName.trim(),
        subject: formSubject,
        classes: [...formClasses],
        email: formEmail.trim(),
        rating,
        isNew: true,
      };
      setTeachers((prev) => [newTeacher, ...prev]);
      setModalOpen(false);
      resetForm();
      toast({ title: "Teacher added successfully", description: `${newTeacher.name} has been added to the faculty.` });
      setTimeout(() => {
        setTeachers((prev) => prev.map((t) => (t.id === newTeacher.id ? { ...t, isNew: false } : t)));
      }, 600);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setTeachers((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    if (selectedTeacher?.id === deleteTarget.id) setSelectedTeacher(null);
    toast({ title: "Teacher removed", description: `${deleteTarget.name} has been removed.` });
    setDeleteTarget(null);
  };

  const filtered = teachers.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "All" || t.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  const inputClasses =
    "h-10 bg-secondary/50 border-border/50 text-foreground rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-shadow";

  // Detail View
  if (selectedTeacher) {
    const teacher = teachers.find((t) => t.id === selectedTeacher.id) || selectedTeacher;
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => setSelectedTeacher(null)}
            className="text-muted-foreground hover:text-foreground rounded-xl gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Teachers
          </Button>

          <div className="glass rounded-2xl p-6 glow-primary">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-20 h-20 rounded-2xl gradient-teal flex items-center justify-center text-foreground font-bold text-3xl shrink-0">
                {teacher.name.split(" ").slice(-1)[0][0]}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{teacher.name}</h1>
                  <p className="text-muted-foreground">{teacher.subject}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-secondary/40 border border-border/30 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                    <div className="flex items-center gap-2 text-foreground text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      {teacher.email}
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary/40 border border-border/30 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Classes</p>
                    <div className="flex items-center gap-2 text-foreground text-sm">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      {teacher.classes.join(", ")}
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary/40 border border-border/30 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Rating</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className={`text-lg font-bold ${ratingColor(teacher.rating)}`}>{teacher.rating}/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => openEditModal(teacher)}
                    className="gradient-primary text-foreground font-semibold rounded-xl shadow-[0_0_16px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)] transition-all duration-300"
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit Teacher
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteTarget(teacher)}
                    className="border-destructive/50 text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete Teacher
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals rendered below */}
        {renderFormModal()}
        {renderDeleteDialog()}
      </DashboardLayout>
    );
  }

  function renderFormModal() {
    return (
      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="glass-strong border-border/50 rounded-2xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.3)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {editingTeacher ? "Update the teacher details below." : "Fill in the details to add a new faculty member."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Full Name</Label>
              <Input placeholder="e.g. Dr. Meera Roy" value={formName} onChange={(e) => setFormName(e.target.value)} className={inputClasses} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Subject</Label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                >
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Rating (0–5)</Label>
                <Input type="number" min={0} max={5} step={0.1} placeholder="4.5" value={formRating} onChange={(e) => setFormRating(e.target.value)} className={inputClasses} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Email</Label>
              <Input type="email" placeholder="name@eduai.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className={inputClasses} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Assigned Classes</Label>
              <div className="flex flex-wrap gap-2">
                {allClasses.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => toggleClass(cls)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      formClasses.includes(cls)
                        ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_8px_-2px_hsl(var(--primary)/0.4)]"
                        : "bg-secondary/40 border-border/50 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {formRating && (
              <div className="rounded-xl bg-secondary/40 border border-border/30 p-3 text-center animate-fade-in">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Rating Preview</p>
                <div className="flex items-center justify-center gap-1.5">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className={`text-lg font-bold ${ratingColor(Number(formRating) || 0)}`}>
                    {Math.round((Number(formRating) || 0) * 10) / 10}/5.0
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setModalOpen(false); resetForm(); }} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleSubmit}
              className="gradient-primary text-foreground font-semibold rounded-xl shadow-[0_0_16px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)] transition-all duration-300"
            >
              {editingTeacher ? "Save Changes" : "Add Teacher"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  function renderDeleteDialog() {
    return (
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="glass-strong border-border/50 rounded-2xl shadow-[0_8px_40px_-12px_hsl(var(--destructive)/0.3)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Teacher
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-border/50">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Card Grid View
  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
            <p className="text-sm text-muted-foreground">{teachers.length} faculty members</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 h-9 bg-secondary/50 border-border/50 text-foreground text-sm"
              />
            </div>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm outline-none"
            >
              <option value="All">All Subjects</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Button
              onClick={() => { resetForm(); setModalOpen(true); }}
              className="h-9 px-4 gradient-primary text-foreground font-semibold rounded-xl shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_28px_-4px_hsl(var(--primary)/0.7)] transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Teacher
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((teacher) => (
            <div
              key={teacher.id}
              className={`glass rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 glow-teal cursor-pointer group ${teacher.isNew ? "animate-fade-in" : ""}`}
              onClick={() => setSelectedTeacher(teacher)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center text-foreground font-bold text-lg">
                    {teacher.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(teacher); }}
                          className="p-2 rounded-[10px] text-muted-foreground/80 bg-secondary/40 hover:text-primary hover:bg-primary/15 hover:shadow-[0_0_12px_-3px_hsl(var(--primary)/0.4)] transition-all duration-200"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">Edit Teacher</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(teacher); }}
                          className="p-2 rounded-[10px] text-muted-foreground/80 bg-secondary/40 hover:text-destructive hover:bg-destructive/15 hover:shadow-[0_0_12px_-3px_hsl(var(--destructive)/0.4)] transition-all duration-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">Delete Teacher</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>Classes: {teacher.classes.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{teacher.email}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                  <span className={`text-sm font-semibold ${ratingColor(teacher.rating)}`}>{teacher.rating}/5.0</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No teachers found matching your criteria.</div>
        )}
      </div>

      {renderFormModal()}
      {renderDeleteDialog()}
    </DashboardLayout>
  );
};

export default Teachers;
