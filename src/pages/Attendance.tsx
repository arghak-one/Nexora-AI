import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import {
  CalendarCheck, Users, AlertTriangle, TrendingUp,
  Plus, Pencil, Trash2, Search, CheckCircle, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────
interface AttendanceRecord {
  id: string;
  studentName: string;
  class: string;
  date: string;          // YYYY-MM-DD
  status: "Present" | "Absent" | "Late";
  remarks?: string;
  isNew?: boolean;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const today = new Date().toISOString().split("T")[0];

const STORAGE_KEY = "nexora_attendance";

function loadRecords(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AttendanceRecord[];
  } catch {}
  return [
    { id: "a1", studentName: "Rahul Kumar",  class: "10A", date: today, status: "Present" },
    { id: "a2", studentName: "Priya Sharma", class: "10A", date: today, status: "Late",    remarks: "Arrived 15 min late" },
    { id: "a3", studentName: "Amit Patel",   class: "10B", date: today, status: "Present" },
    { id: "a4", studentName: "Vikram Singh", class: "10B", date: today, status: "Absent",  remarks: "Not notified" },
    { id: "a5", studentName: "Sneha Gupta",  class: "9A",  date: today, status: "Present" },
    { id: "a6", studentName: "Rohan Mehta",  class: "9A",  date: today, status: "Present" },
    { id: "a7", studentName: "Ananya Das",   class: "9B",  date: today, status: "Absent",  remarks: "Medical leave" },
    { id: "a8", studentName: "Kavita Reddy", class: "10A", date: today, status: "Present" },
  ];
}

function saveRecords(data: AttendanceRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColors = {
  Present: "bg-success/10 text-success",
  Absent:  "bg-destructive/10 text-destructive",
  Late:    "bg-warning/10 text-warning",
};

const statusIcon = {
  Present: <CheckCircle className="w-3.5 h-3.5" />,
  Absent:  <XCircle    className="w-3.5 h-3.5" />,
  Late:    <AlertTriangle className="w-3.5 h-3.5" />,
};

const classOptions = ["9A", "9B", "10A", "10B", "11A", "12A"];
const statusOptions: AttendanceRecord["status"][] = ["Present", "Absent", "Late"];

const emptyForm = {
  studentName: "",
  class: "9A",
  date: today,
  status: "Present" as AttendanceRecord["status"],
  remarks: "",
};

// ─── Component ────────────────────────────────────────────────────────────────
const Attendance = () => {
  const [records, setRecords]         = useState<AttendanceRecord[]>(loadRecords);
  const [search,  setSearch]          = useState("");
  const [dateFilter, setDateFilter]   = useState(today);
  const [classFilter, setClassFilter] = useState("All");
  const [dialogOpen, setDialogOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen]   = useState(false);
  const [editing,  setEditing]        = useState<AttendanceRecord | null>(null);
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [form, setForm]               = useState(emptyForm);
  const [errors, setErrors]           = useState<Partial<typeof emptyForm>>({});

  // Persist on every change
  useEffect(() => { saveRecords(records); }, [records]);

  // ── Derived stats (for selected date) ─────────────────────────────────────
  const stats = useMemo(() => {
    const day = records.filter((r) => r.date === dateFilter);
    const present = day.filter((r) => r.status === "Present").length;
    const absent  = day.filter((r) => r.status === "Absent").length;
    const late    = day.filter((r) => r.status === "Late").length;
    const total   = day.length;
    const rate    = total ? Math.round(((present + late) / total) * 100) : 0;
    return { present, absent, late, total, rate };
  }, [records, dateFilter]);

  // ── Class-wise breakdown ───────────────────────────────────────────────────
  const classBreakdown = useMemo(() => {
    const day = records.filter((r) => r.date === dateFilter);
    const map: Record<string, { present: number; absent: number; late: number; total: number }> = {};
    day.forEach((r) => {
      if (!map[r.class]) map[r.class] = { present: 0, absent: 0, late: 0, total: 0 };
      map[r.class].total++;
      if (r.status === "Present") map[r.class].present++;
      else if (r.status === "Absent") map[r.class].absent++;
      else map[r.class].late++;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cls, d]) => ({
        class: cls,
        ...d,
        rate: d.total ? Math.round(((d.present + d.late) / d.total) * 100) : 0,
      }));
  }, [records, dateFilter]);

  // ── Filtered individual records ────────────────────────────────────────────
  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchDate  = !dateFilter || r.date === dateFilter;
      const matchClass = classFilter === "All" || r.class === classFilter;
      const matchSearch = r.studentName.toLowerCase().includes(search.toLowerCase());
      return matchDate && matchClass && matchSearch;
    });
  }, [records, dateFilter, classFilter, search]);

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(true);
  };

  const handleOpenEdit = (rec: AttendanceRecord) => {
    setEditing(rec);
    setForm({ studentName: rec.studentName, class: rec.class, date: rec.date, status: rec.status, remarks: rec.remarks ?? "" });
    setErrors({});
    setDialogOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const validate = (): boolean => {
    const e: Partial<typeof emptyForm> = {};
    if (!form.studentName.trim()) e.studentName = "Student name is required";
    if (!form.date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, ...form, studentName: form.studentName.trim(), remarks: form.remarks.trim() || undefined }
            : r
        )
      );
      toast({ title: "Record updated", description: `${form.studentName}'s attendance updated.` });
    } else {
      const rec: AttendanceRecord = {
        id: Date.now().toString(),
        studentName: form.studentName.trim(),
        class: form.class,
        date: form.date,
        status: form.status,
        remarks: form.remarks.trim() || undefined,
        isNew: true,
      };
      setRecords((prev) => [rec, ...prev]);
      toast({ title: "Attendance recorded", description: `${rec.studentName} marked ${rec.status}.` });
      setTimeout(() => setRecords((p) => p.map((r) => r.id === rec.id ? { ...r, isNew: false } : r)), 600);
    }
    setDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      const rec = records.find((r) => r.id === deletingId);
      setRecords((prev) => prev.filter((r) => r.id !== deletingId));
      toast({ title: "Record deleted", description: `${rec?.studentName}'s record removed.`, variant: "destructive" });
    }
    setDeleteOpen(false);
    setDeletingId(null);
  };

  const fc = (field: keyof typeof emptyForm, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
            <p className="text-sm text-muted-foreground">Daily attendance tracking and management</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button onClick={handleOpenAdd} className="gradient-primary text-foreground font-medium flex items-center gap-2 rounded-xl h-9 px-4">
              <Plus className="w-4 h-4" /> Mark Attendance
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Attendance Rate"  value={`${stats.rate}%`}     icon={CalendarCheck} glowClass="glow-primary"  gradientClass="gradient-primary" />
          <StatCard title="Present"          value={String(stats.present)} icon={Users}         glowClass="glow-teal"    gradientClass="gradient-teal" />
          <StatCard title="Absent"           value={String(stats.absent)}  icon={AlertTriangle} glowClass="glow-accent"  gradientClass="gradient-warm" />
          <StatCard title="Late"             value={String(stats.late)}    icon={TrendingUp}    glowClass="glow-primary" gradientClass="gradient-primary" />
        </div>

        {/* Class Breakdown */}
        {classBreakdown.length > 0 && (
          <div className="glass rounded-2xl overflow-hidden glow-teal">
            <div className="p-5 border-b border-border/30">
              <h3 className="text-base font-semibold text-foreground">
                Class-wise Breakdown — {dateFilter === today ? "Today" : dateFilter}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    {["Class","Present","Absent","Late","Total","Rate"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classBreakdown.map((c) => (
                    <tr key={c.class} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground text-sm">Class {c.class}</td>
                      <td className="px-5 py-3 text-sm text-success">{c.present}</td>
                      <td className="px-5 py-3 text-sm text-destructive">{c.absent}</td>
                      <td className="px-5 py-3 text-sm text-warning">{c.late}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{c.total}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${c.rate >= 90 ? "bg-success" : c.rate >= 75 ? "bg-warning" : "bg-destructive"}`}
                              style={{ width: `${c.rate}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${c.rate >= 90 ? "text-success" : c.rate >= 75 ? "text-warning" : "text-destructive"}`}>
                            {c.rate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Individual Records */}
        <div className="glass rounded-2xl overflow-hidden glow-primary">
          <div className="p-5 border-b border-border/30 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <h3 className="text-base font-semibold text-foreground">Individual Records</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-8 rounded-xl bg-secondary/50 border-border/50 text-sm w-44"
                />
              </div>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="h-8 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none"
              >
                <option value="All">All Classes</option>
                {classOptions.map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {["Student","Class","Date","Status","Remarks","Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      No records found. Click "Mark Attendance" to add.
                    </td>
                  </tr>
                )}
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className={`border-b border-border/30 hover:bg-secondary/30 transition-colors ${r.isNew ? "animate-fade-in" : ""}`}
                  >
                    <td className="px-5 py-3 font-medium text-foreground text-sm">{r.studentName}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{r.class}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{r.date}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${statusColors[r.status]}`}>
                        {statusIcon[r.status]} {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground max-w-[180px] truncate">{r.remarks ?? "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenEdit(r)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenDelete(r.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-border/30 text-xs text-muted-foreground">
              Showing {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass border border-border/50 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editing ? "Edit Attendance" : "Mark Attendance"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Student Name</Label>
              <Input placeholder="e.g. Rahul Kumar" value={form.studentName} onChange={(e) => fc("studentName", e.target.value)} className="glass border-border/50 rounded-xl" />
              {errors.studentName && <p className="text-xs text-destructive">{errors.studentName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Class</Label>
                <select value={form.class} onChange={(e) => fc("class", e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {classOptions.map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Date</Label>
                <input type="date" value={form.date} onChange={(e) => fc("date", e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => fc("status", s)}
                    className={`h-9 rounded-xl text-xs font-medium border transition-all ${form.status === s ? statusColors[s] + " border-current" : "bg-secondary/50 border-border/50 text-muted-foreground hover:bg-secondary"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Remarks <span className="text-xs">(optional)</span></Label>
              <Input placeholder="e.g. Medical leave, came late..." value={form.remarks} onChange={(e) => fc("remarks", e.target.value)} className="glass border-border/50 rounded-xl" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="gradient-primary text-foreground rounded-xl">{editing ? "Save Changes" : "Mark Attendance"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="glass border border-border/50 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Record</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">This will permanently remove the attendance record. Are you sure?</AlertDialogDescription>
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

export default Attendance;
