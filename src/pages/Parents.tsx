import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, Plus, AlertTriangle, MoreVertical, Eye, BarChart3, MessageSquare, CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { store, Parent } from "@/lib/store";

// Code using store

const relationshipOptions = ["Father", "Mother", "Guardian"];

const Parents = () => {
  const [parents, setParents] = useState<Parent[]>(() => store.getParents());
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [studentFilter, setStudentFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Parent | null>(null);
  const navigate = useNavigate();

  // Form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formStudent, setFormStudent] = useState("Rahul Kumar");
  const [formClass, setFormClass] = useState("10A");
  const [classTouched, setClassTouched] = useState(false);
  const [formRelationship, setFormRelationship] = useState("Father");

  const students = store.getStudents();
  const availableClasses = Array.from(new Set(students.map((s) => s.class))).sort();


  useEffect(() => {
    store.setParents(parents);
  }, [parents]);

  const handleStudentChange = (studentName: string) => {
    setFormStudent(studentName);
    if (!classTouched) {
      const found = students.find((s) => s.name === studentName);
      if (found) setFormClass(found.class);
    }
  };

  const handleClassChange = (cls: string) => {
    setFormClass(cls);
    setClassTouched(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormStudent("Rahul Kumar");
    setFormClass("10A");
    setClassTouched(false);
    setFormRelationship("Father");
    setEditingParent(null);
  };

  const openEditModal = (parent: Parent) => {
    setEditingParent(parent);
    setFormName(parent.parentName);
    setFormPhone(parent.phone);
    setFormEmail(parent.email);
    setFormStudent(parent.studentName);
    setFormClass(parent.class);
    setClassTouched(false);
    setFormRelationship(parent.relationship);
    setModalOpen(true);
  };

  const validateForm = (): boolean => {
    if (!formName.trim()) {
      toast({ title: "Validation Error", description: "Parent name is required.", variant: "destructive" });
      return false;
    }
    if (!formPhone.trim()) {
      toast({ title: "Validation Error", description: "Phone number is required.", variant: "destructive" });
      return false;
    }
    if (!formEmail.trim()) {
      toast({ title: "Validation Error", description: "Email is required.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingParent) {
      setParents((prev) =>
        prev.map((p) =>
          p.id === editingParent.id
            ? { ...p, parentName: formName.trim(), phone: formPhone.trim(), email: formEmail.trim(), studentName: formStudent, class: formClass, relationship: formRelationship }
            : p
        )
      );
      setModalOpen(false);
      resetForm();
      toast({ title: "Parent updated", description: `${formName.trim()}'s record has been updated.` });
    } else {
      const newParent: Parent = {
        id: Date.now(),
        parentName: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        studentName: formStudent,
        class: formClass,
        relationship: formRelationship,
        isNew: true,
      };
      setParents((prev) => [newParent, ...prev]);
      setModalOpen(false);
      resetForm();
      toast({ title: "Parent added successfully", description: `${newParent.parentName} has been added.` });
      setTimeout(() => {
        setParents((prev) => prev.map((p) => (p.id === newParent.id ? { ...p, isNew: false } : p)));
      }, 600);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setParents((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast({ title: "Parent removed", description: `${deleteTarget.parentName} has been removed.` });
    setDeleteTarget(null);
  };

  const uniqueClasses = ["All", ...Array.from(new Set(students.map((s) => s.class))).sort()];
  const uniqueStudents = ["All", ...students.map((s) => s.name)];

  const filtered = parents.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.parentName.toLowerCase().includes(q) ||
      p.studentName.toLowerCase().includes(q) ||
      p.class.toLowerCase().includes(q) ||
      p.phone.includes(q);
    const matchClass = classFilter === "All" || p.class === classFilter;
    const matchStudent = studentFilter === "All" || p.studentName === studentFilter;
    return matchSearch && matchClass && matchStudent;
  });

  const selectClasses =
    "h-9 px-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow";

  const inputClasses =
    "h-10 bg-secondary/50 border-border/50 text-foreground rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-shadow";

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Parents</h1>
            <p className="text-sm text-muted-foreground">{parents.length} total parents registered</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-testid="input-search-parents"
                placeholder="Search parents, student, or class..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 h-9 bg-secondary/50 border-border/50 text-foreground text-sm"
              />
            </div>
            <select
              data-testid="select-class-filter"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className={selectClasses}
            >
              {uniqueClasses.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Classes" : c}</option>
              ))}
            </select>
            <select
              data-testid="select-student-filter"
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className={selectClasses}
            >
              {uniqueStudents.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Students" : s}</option>
              ))}
            </select>
            <Button
              data-testid="button-add-parent"
              onClick={() => { resetForm(); setModalOpen(true); }}
              className="h-9 px-4 gradient-primary text-foreground font-semibold rounded-xl shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_28px_-4px_hsl(var(--primary)/0.7)] transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Parent
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden glow-teal">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Parent</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Relationship</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Child (Student)</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Class</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Phone</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Risk</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      No parents found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((parent) => (
                    <tr
                      key={parent.id}
                      data-testid={`row-parent-${parent.id}`}
                      className={`border-b border-border/30 hover:bg-secondary/30 transition-all cursor-pointer group ${parent.isNew ? "animate-fade-in" : ""}`}
                    >
                      <td className="px-5 py-4" onClick={() => navigate(`/parents/${parent.id}`)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center text-foreground font-semibold text-xs shrink-0">
                            {parent.parentName.split(" ").slice(-1)[0][0]}
                          </div>
                          <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors whitespace-nowrap">
                            {parent.parentName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground" onClick={() => navigate(`/parents/${parent.id}`)}>
                        <span className="px-2.5 py-1 rounded-lg bg-secondary/60 text-xs font-medium text-foreground">
                          {parent.relationship}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground" onClick={() => navigate(`/parents/${parent.id}`)}>{parent.studentName}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground" onClick={() => navigate(`/parents/${parent.id}`)}>{parent.class}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground" onClick={() => navigate(`/parents/${parent.id}`)}>{parent.phone}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground" onClick={() => navigate(`/parents/${parent.id}`)}>{parent.email}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  data-testid={`button-edit-parent-${parent.id}`}
                                  onClick={(e) => { e.stopPropagation(); openEditModal(parent); }}
                                  className="p-2 rounded-[10px] text-muted-foreground/80 bg-secondary/40 hover:text-primary hover:bg-primary/15 hover:shadow-[0_0_12px_-3px_hsl(var(--primary)/0.4)] transition-all duration-200"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs">Edit Parent</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  data-testid={`button-delete-parent-${parent.id}`}
                                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(parent); }}
                                  className="p-2 rounded-[10px] text-muted-foreground/80 bg-secondary/40 hover:text-destructive hover:bg-destructive/15 hover:shadow-[0_0_12px_-3px_hsl(var(--destructive)/0.4)] transition-all duration-200"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs">Delete Parent</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Parent Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="glass-strong border-border/50 rounded-2xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.3)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingParent ? "Edit Parent" : "Add New Parent"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {editingParent ? "Update parent details below." : "Fill in the parent's contact details and link them to a student."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Parent Name</Label>
              <Input
                data-testid="input-form-parent-name"
                placeholder="e.g. Mr. Arjun Verma"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Phone Number</Label>
                <Input
                  data-testid="input-form-phone"
                  placeholder="+91 98765 43210"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Relationship</Label>
                <select
                  data-testid="select-form-relationship"
                  value={formRelationship}
                  onChange={(e) => setFormRelationship(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                >
                  {relationshipOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Email</Label>
              <Input
                data-testid="input-form-email"
                placeholder="parent@example.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Linked Student</Label>
                <select
                  data-testid="select-form-student"
                  value={formStudent}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                >
                  {students.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Class</Label>
                <select
                  data-testid="select-form-class"
                  value={formClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                >
                  {availableClasses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              data-testid="button-form-cancel"
              variant="ghost"
              onClick={() => { setModalOpen(false); resetForm(); }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              data-testid="button-form-save"
              onClick={handleSubmit}
              className="gradient-primary text-foreground font-semibold rounded-xl shadow-[0_0_16px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)] transition-all duration-300"
            >
              {editingParent ? "Save Changes" : "Save Parent"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="glass-strong border-border/50 rounded-2xl shadow-[0_8px_40px_-12px_hsl(var(--destructive)/0.3)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Parent
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove <span className="font-semibold text-foreground">{deleteTarget?.parentName}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-border/50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirm-delete"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Parents;
