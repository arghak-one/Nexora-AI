import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Building2, Plus, Pencil, Trash2, Search, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { store, Department, useStoreUpdate } from "@/lib/store";

const Departments = () => {
  useStoreUpdate();
  const [departments, setDepartments] = useState<Department[]>(() => store.getDepartments());
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");

  const persist = (data: Department[]) => {
    setDepartments(data);
    store.setDepartments(data);
  };

  const students = store.getStudents();
  const fees = store.getStudentFees();

  const deptStats = useMemo(() => {
    const map: Record<string, { students: number; feeStudents: number; collected: number }> = {};
    departments.forEach((d) => {
      map[d.name] = { students: 0, feeStudents: 0, collected: 0 };
    });
    // Count students by class prefix isn't reliable, so we count fee records by department
    fees.forEach((f) => {
      if (map[f.department]) {
        map[f.department].feeStudents++;
        map[f.department].collected += f.paidAmount;
      }
    });
    return map;
  }, [departments, fees]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return departments.filter((d) => !q || d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q));
  }, [departments, search]);

  const openAdd = () => {
    setEditId(null);
    setFormName("");
    setFormCode("");
    setModalOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditId(dept.id);
    setFormName(dept.name);
    setFormCode(dept.code);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast({ title: "Error", description: "Department name is required.", variant: "destructive" });
      return;
    }
    const duplicate = departments.find((d) => d.name.toLowerCase() === formName.trim().toLowerCase() && d.id !== editId);
    if (duplicate) {
      toast({ title: "Error", description: "A department with this name already exists.", variant: "destructive" });
      return;
    }

    if (editId) {
      const oldDept = departments.find((d) => d.id === editId);
      const updated = departments.map((d) =>
        d.id === editId ? { ...d, name: formName.trim(), code: formCode.trim() || formName.trim().toUpperCase().slice(0, 4) } : d
      );
      persist(updated);

      // Update fee records if department name changed
      if (oldDept && oldDept.name !== formName.trim()) {
        const updatedFees = fees.map((f) =>
          f.department === oldDept.name ? { ...f, department: formName.trim() } : f
        );
        store.setStudentFees(updatedFees);
      }
      toast({ title: "Updated", description: "Department updated successfully." });
    } else {
      const newDept: Department = {
        id: "dept" + Date.now(),
        name: formName.trim(),
        code: formCode.trim() || formName.trim().toUpperCase().slice(0, 4),
        createdAt: Date.now(),
      };
      persist([newDept, ...departments]);
      toast({ title: "Created", description: "Department added successfully." });
    }
    setModalOpen(false);
  };

  const confirmDelete = (id: string) => {
    const dept = departments.find((d) => d.id === id);
    if (!dept) return;
    const linkedFees = fees.filter((f) => f.department === dept.name);
    if (linkedFees.length > 0) {
      toast({
        title: "Cannot Delete",
        description: `${linkedFees.length} student fee record(s) are assigned to "${dept.name}". Reassign them first.`,
        variant: "destructive",
      });
      return;
    }
    setDeleteTarget(id);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    persist(departments.filter((d) => d.id !== deleteTarget));
    setDeleteOpen(false);
    setDeleteTarget(null);
    toast({ title: "Deleted", description: "Department removed.", variant: "destructive" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Departments</h1>
            <p className="text-sm text-muted-foreground">Manage academic departments dynamically</p>
          </div>
          <Button onClick={openAdd} className="gradient-primary text-foreground gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Add Department
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-4 glow-primary">
            <Building2 className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{departments.length}</p>
            <p className="text-xs text-muted-foreground">Total Departments</p>
          </div>
          <div className="glass rounded-2xl p-4 glow-teal">
            <Users className="w-5 h-5 text-success mb-2" />
            <p className="text-2xl font-bold text-foreground">{fees.length}</p>
            <p className="text-xs text-muted-foreground">Fee Records</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search departments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 glass border-border/50 rounded-xl" />
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden glow-primary">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {["Department", "Code", "Fee Records", "Revenue Collected", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">No departments found.</td></tr>
                )}
                {filtered.map((dept) => {
                  const stats = deptStats[dept.name] || { feeStudents: 0, collected: 0 };
                  return (
                    <tr key={dept.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground text-sm">{dept.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm"><span className="px-2 py-0.5 rounded-md bg-secondary/50 text-muted-foreground font-mono text-xs">{dept.code}</span></td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground">{stats.feeStudents}</td>
                      <td className="px-4 py-3.5 text-sm text-success">₹{stats.collected.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(dept)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => confirmDelete(dept.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass border border-border/50 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editId ? "Edit Department" : "Add Department"}</DialogTitle>
            <DialogDescription>{editId ? "Update department details" : "Create a new academic department"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Department Name *</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Computer Science" className="glass border-border/50 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Code (optional)</Label>
              <Input value={formCode} onChange={(e) => setFormCode(e.target.value)} placeholder="e.g. CSE" className="glass border-border/50 rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="gradient-primary text-foreground rounded-xl">{editId ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="glass border border-border/50 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Department</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this department. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Departments;
