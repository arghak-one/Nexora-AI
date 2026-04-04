import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Phone, Mail, User, Pencil, Trash2, AlertTriangle, CalendarCheck, BarChart3, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import type { Parent } from "@/lib/store";

const STORAGE_KEY = "nexora_parents";

const allStudents = [
  { name: "Rahul Kumar", class: "10A", attendance: 95, marks: 88, risk: "Low", aiScore: 9.2 },
  { name: "Priya Sharma", class: "10A", attendance: 72, marks: 65, risk: "High", aiScore: 5.8 },
  { name: "Amit Patel", class: "10B", attendance: 88, marks: 76, risk: "Low", aiScore: 7.9 },
  { name: "Sneha Gupta", class: "9A", attendance: 91, marks: 82, risk: "Low", aiScore: 8.5 },
  { name: "Vikram Singh", class: "10B", attendance: 58, marks: 45, risk: "High", aiScore: 3.2 },
  { name: "Ananya Das", class: "9B", attendance: 85, marks: 79, risk: "Medium", aiScore: 7.1 },
  { name: "Rohan Mehta", class: "9A", attendance: 93, marks: 91, risk: "Low", aiScore: 9.5 },
  { name: "Kavita Reddy", class: "10A", attendance: 78, marks: 68, risk: "Medium", aiScore: 6.4 },
];

const relationshipOptions = ["Father", "Mother", "Guardian"];

const riskColors: Record<string, string> = {
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
};

const riskBars: Record<string, string> = {
  Low: "bg-success",
  Medium: "bg-warning",
  High: "bg-destructive",
};

function loadParents(): Parent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveParents(parents: Parent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parents));
}

const ParentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parents, setParents] = useState<Parent[]>(loadParents);
  const parent = parents.find((p) => p.id === Number(id));

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formStudent, setFormStudent] = useState(allStudents[0].name);
  const [formClass, setFormClass] = useState(allStudents[0].class);
  const [classTouched, setClassTouched] = useState(false);
  const [formRelationship, setFormRelationship] = useState("Father");

  const availableClasses = Array.from(new Set(allStudents.map((s) => s.class))).sort();

  useEffect(() => {
    saveParents(parents);
  }, [parents]);

  useEffect(() => {
    if (parent) {
      setFormName(parent.parentName);
      setFormPhone(parent.phone);
      setFormEmail(parent.email);
      setFormStudent(parent.studentName);
      setFormClass(parent.class);
      setClassTouched(false);
      setFormRelationship(parent.relationship);
    }
  }, [parent]);

  const handleStudentChange = (studentName: string) => {
    setFormStudent(studentName);
    if (!classTouched) {
      const found = allStudents.find((s) => s.name === studentName);
      if (found) setFormClass(found.class);
    }
  };

  const handleClassChange = (cls: string) => {
    setFormClass(cls);
    setClassTouched(true);
  };

  if (!parent) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <p className="text-muted-foreground text-sm">Parent not found.</p>
          <Button variant="ghost" onClick={() => navigate("/parents")} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Parents
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const linkedStudent = allStudents.find((s) => s.name === parent.studentName);

  const handleSaveEdit = () => {
    if (!formName.trim()) {
      toast({ title: "Validation Error", description: "Parent name is required.", variant: "destructive" });
      return;
    }
    const updated = parents.map((p) =>
      p.id === parent.id
        ? { ...p, parentName: formName.trim(), phone: formPhone.trim(), email: formEmail.trim(), studentName: formStudent, class: formClass, relationship: formRelationship }
        : p
    );
    setParents(updated);
    setEditModalOpen(false);
    toast({ title: "Parent updated", description: `${formName.trim()}'s details have been saved.` });
  };

  const handleDelete = () => {
    const updated = parents.filter((p) => p.id !== parent.id);
    setParents(updated);
    toast({ title: "Parent removed", description: `${parent.parentName} has been deleted.` });
    navigate("/parents");
  };

  const inputClasses =
    "h-10 bg-secondary/50 border-border/50 text-foreground rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-shadow";

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <button
          data-testid="button-back-parents"
          onClick={() => navigate("/parents")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Parents
        </button>

        {/* Header Card */}
        <div className="glass rounded-2xl p-6 glow-teal flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl gradient-teal flex items-center justify-center text-foreground text-2xl font-bold shrink-0">
            {parent.parentName.split(" ").slice(-1)[0][0]}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-parent-name">{parent.parentName}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{parent.relationship} of {parent.studentName}</p>
            <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-lg bg-secondary/60 text-foreground">
              Class {parent.class}
            </span>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              data-testid="button-edit-parent-profile"
              variant="ghost"
              onClick={() => setEditModalOpen(true)}
              className="rounded-xl border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button
              data-testid="button-delete-parent-profile"
              variant="ghost"
              onClick={() => setDeleteOpen(true)}
              className="rounded-xl border border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        {/* Contact Info + Student Performance */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Contact Details */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-medium text-foreground" data-testid="text-parent-phone">{parent.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-foreground" data-testid="text-parent-email">{parent.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                <User className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Relationship</p>
                  <p className="text-sm font-medium text-foreground">{parent.relationship}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Linked Student Performance */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Child's Performance — {parent.studentName}
            </h2>
            {linkedStudent ? (
              <div className="space-y-3">
                {/* Attendance */}
                <div className="p-3 rounded-xl bg-secondary/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Attendance</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{linkedStudent.attendance}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${linkedStudent.attendance}%` }}
                    />
                  </div>
                </div>

                {/* Marks */}
                <div className="p-3 rounded-xl bg-secondary/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Avg Marks</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{linkedStudent.marks} / 100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${linkedStudent.marks}%` }}
                    />
                  </div>
                </div>

                {/* AI Score + Risk */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-secondary/40 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Brain className="w-3.5 h-3.5 text-primary" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Score</p>
                    </div>
                    <p className="text-xl font-bold text-primary">{linkedStudent.aiScore}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/40 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Risk Level</p>
                    <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${riskColors[linkedStudent.risk]}`}>
                      {linkedStudent.risk}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Student data not available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="glass-strong border-border/50 rounded-2xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.3)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Edit Parent</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">Update parent details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Parent Name</Label>
              <Input data-testid="input-edit-name" placeholder="e.g. Mr. Arjun Verma" value={formName} onChange={(e) => setFormName(e.target.value)} className={inputClasses} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Phone</Label>
                <Input data-testid="input-edit-phone" placeholder="+91 98765 43210" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Relationship</Label>
                <select
                  data-testid="select-edit-relationship"
                  value={formRelationship}
                  onChange={(e) => setFormRelationship(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                >
                  {relationshipOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Email</Label>
              <Input data-testid="input-edit-email" placeholder="parent@example.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className={inputClasses} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Linked Student</Label>
                <select
                  data-testid="select-edit-student"
                  value={formStudent}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                >
                  {allStudents.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Class</Label>
                <select
                  data-testid="select-edit-class"
                  value={formClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                >
                  {availableClasses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button data-testid="button-edit-cancel" variant="ghost" onClick={() => setEditModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button data-testid="button-edit-save" onClick={handleSaveEdit} className="gradient-primary text-foreground font-semibold rounded-xl shadow-[0_0_16px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)] transition-all duration-300">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="glass-strong border-border/50 rounded-2xl shadow-[0_8px_40px_-12px_hsl(var(--destructive)/0.3)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Parent
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove <span className="font-semibold text-foreground">{parent.parentName}</span>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-border/50">Cancel</AlertDialogCancel>
            <AlertDialogAction data-testid="button-confirm-delete-profile" onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ParentProfile;
