import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { DollarSign, CheckCircle, Clock, AlertTriangle, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FeeStatus = "Paid" | "Partial" | "Unpaid";

interface FeeRecord {
  id: string;
  student: string;
  class: string;
  total: number;
  paid: number;
  status: FeeStatus;
}

const computeStatus = (total: number, paid: number): FeeStatus => {
  if (paid <= 0) return "Unpaid";
  if (paid >= total) return "Paid";
  return "Partial";
};

const initialData: FeeRecord[] = [
  { id: "1", student: "Rahul Kumar", class: "10A", total: 25000, paid: 25000, status: "Paid" },
  { id: "2", student: "Priya Sharma", class: "10A", total: 25000, paid: 15000, status: "Partial" },
  { id: "3", student: "Amit Patel", class: "10B", total: 25000, paid: 25000, status: "Paid" },
  { id: "4", student: "Vikram Singh", class: "10B", total: 25000, paid: 0, status: "Unpaid" },
  { id: "5", student: "Sneha Gupta", class: "9A", total: 22000, paid: 22000, status: "Paid" },
  { id: "6", student: "Rohan Mehta", class: "9A", total: 22000, paid: 12000, status: "Partial" },
];

const statusColors: Record<FeeStatus, string> = {
  Paid: "bg-success/10 text-success",
  Partial: "bg-warning/10 text-warning",
  Unpaid: "bg-destructive/10 text-destructive",
};

const emptyForm = { student: "", class: "", total: "", paid: "" };

const Fees = () => {
  const [fees, setFees] = useState<FeeRecord[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  const stats = useMemo(() => {
    const totalCollected = fees.reduce((sum, f) => sum + f.paid, 0);
    const fullyPaid = fees.filter((f) => f.status === "Paid").length;
    const partial = fees.filter((f) => f.status === "Partial").length;
    const unpaid = fees.filter((f) => f.status === "Unpaid").length;
    return { totalCollected, fullyPaid, partial, unpaid };
  }, [fees]);

  const formatAmount = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const handleOpenAdd = () => {
    setEditingFee(null);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(true);
  };

  const handleOpenEdit = (fee: FeeRecord) => {
    setEditingFee(fee);
    setForm({ student: fee.student, class: fee.class, total: String(fee.total), paid: String(fee.paid) });
    setErrors({});
    setDialogOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const validate = () => {
    const newErrors: Partial<typeof emptyForm> = {};
    if (!form.student.trim()) newErrors.student = "Student name is required";
    if (!form.class.trim()) newErrors.class = "Class is required";
    const total = parseFloat(form.total);
    const paid = parseFloat(form.paid);
    if (!form.total || isNaN(total) || total <= 0) newErrors.total = "Enter a valid total amount";
    if (form.paid === "" || isNaN(paid) || paid < 0) newErrors.paid = "Enter a valid paid amount";
    if (!isNaN(total) && !isNaN(paid) && paid > total) newErrors.paid = "Paid cannot exceed total";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const total = parseFloat(form.total);
    const paid = parseFloat(form.paid);
    const status = computeStatus(total, paid);
    if (editingFee) {
      setFees((prev) =>
        prev.map((f) =>
          f.id === editingFee.id
            ? { ...f, student: form.student.trim(), class: form.class.trim(), total, paid, status }
            : f
        )
      );
    } else {
      setFees((prev) => [...prev, { id: Date.now().toString(), student: form.student.trim(), class: form.class.trim(), total, paid, status }]);
    }
    setDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) setFees((prev) => prev.filter((f) => f.id !== deletingId));
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleFormChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Fees</h1>
            <p className="text-sm text-muted-foreground">Fee collection and payment tracking</p>
          </div>
          <Button onClick={handleOpenAdd} className="gradient-primary text-foreground font-medium flex items-center gap-2 rounded-xl px-4 py-2">
            <Plus className="w-4 h-4" />
            Add Fee
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Collected" value={formatAmount(stats.totalCollected)} icon={DollarSign} glowClass="glow-primary" gradientClass="gradient-primary" />
          <StatCard title="Fully Paid" value={String(stats.fullyPaid)} icon={CheckCircle} glowClass="glow-teal" gradientClass="gradient-teal" />
          <StatCard title="Partially Paid" value={String(stats.partial)} icon={Clock} glowClass="glow-accent" gradientClass="gradient-warm" />
          <StatCard title="Unpaid" value={String(stats.unpaid)} icon={AlertTriangle} glowClass="glow-primary" gradientClass="gradient-primary" />
        </div>

        <div className="glass rounded-2xl overflow-hidden glow-primary">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Student</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Class</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Total</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Paid</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Due</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">No fee records found. Click "Add Fee" to get started.</td></tr>
                )}
                {fees.map((f) => (
                  <tr key={f.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground text-sm">{f.student}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{f.class}</td>
                    <td className="px-5 py-4 text-sm text-foreground">₹{f.total.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-foreground">₹{f.paid.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-foreground">₹{(f.total - f.paid).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusColors[f.status]}`}>{f.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenEdit(f)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenDelete(f.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass border border-border/50 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingFee ? "Edit Fee Record" : "Add Fee Record"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Student Name</Label>
              <Input placeholder="e.g. Rahul Kumar" value={form.student} onChange={(e) => handleFormChange("student", e.target.value)} className="glass border-border/50 rounded-xl" />
              {errors.student && <p className="text-xs text-destructive">{errors.student}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Class</Label>
              <Input placeholder="e.g. 10A" value={form.class} onChange={(e) => handleFormChange("class", e.target.value)} className="glass border-border/50 rounded-xl" />
              {errors.class && <p className="text-xs text-destructive">{errors.class}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Total Fee (₹)</Label>
              <Input type="number" placeholder="e.g. 25000" value={form.total} onChange={(e) => handleFormChange("total", e.target.value)} className="glass border-border/50 rounded-xl" min={0} />
              {errors.total && <p className="text-xs text-destructive">{errors.total}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Amount Paid (₹)</Label>
              <Input type="number" placeholder="e.g. 15000" value={form.paid} onChange={(e) => handleFormChange("paid", e.target.value)} className="glass border-border/50 rounded-xl" min={0} />
              {errors.paid && <p className="text-xs text-destructive">{errors.paid}</p>}
            </div>
            {form.total && form.paid && !isNaN(parseFloat(form.total)) && !isNaN(parseFloat(form.paid)) && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">Status preview:</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusColors[computeStatus(parseFloat(form.total), parseFloat(form.paid))]}`}>
                  {computeStatus(parseFloat(form.total), parseFloat(form.paid))}
                </span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="gradient-primary text-foreground rounded-xl">{editingFee ? "Save Changes" : "Add Fee"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass border border-border/50 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Fee Record</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">Are you sure you want to delete this fee record? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Fees;
