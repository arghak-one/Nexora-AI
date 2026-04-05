import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { BarChart3, Search, Plus, Pencil, Trash2, TrendingUp, CheckCircle, XCircle, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { store, ResultRecord } from "@/lib/store";

// ─── Config ───────────────────────────────────────────────────────────────────
const subjects = ["Mathematics", "Physics", "Chemistry", "English", "Computer Science", "Biology"];
const classes  = ["9A", "9B", "10A", "10B", "11A", "12A"];

type ViewMode = "summary" | "individual";

const gradeColors: Record<string, string> = {
  "A+": "bg-success/15 text-success",
  A:   "bg-success/10 text-success",
  B:   "bg-primary/10 text-primary",
  C:   "bg-warning/10 text-warning",
  D:   "bg-warning/15 text-warning",
  F:   "bg-destructive/10 text-destructive",
};

function computeGrade(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

// ─── Shared select style (consistent with rest of app) ────────────────────────
const selectCls =
  "h-9 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow";

const inputCls =
  "h-10 bg-secondary/50 border-border/50 text-foreground rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-shadow";

// ─── Component ────────────────────────────────────────────────────────────────
const Results = () => {
  const [results, setResults]           = useState<ResultRecord[]>(() => store.getResults());
  const [search, setSearch]             = useState("");
  const [classFilter, setClassFilter]   = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode]         = useState<ViewMode>("summary");
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingResult, setEditingResult] = useState<ResultRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResultRecord | null>(null);

  // Form
  const [formStudentName, setFormStudentName] = useState("");
  const [formClass,   setFormClass]   = useState("9A");
  const [formSubject, setFormSubject] = useState("Mathematics");
  const [formMarks,   setFormMarks]   = useState("");
  const [formTotal,   setFormTotal]   = useState("100");

  useEffect(() => { store.setResults(results); }, [results]);

  const resetForm = () => {
    setFormStudentName(""); setFormClass("9A");
    setFormSubject("Mathematics"); setFormMarks(""); setFormTotal("100");
    setEditingResult(null);
  };

  const openEditModal = (r: ResultRecord) => {
    setEditingResult(r);
    setFormStudentName(r.studentName); setFormClass(r.class);
    setFormSubject(r.subject); setFormMarks(String(r.marks)); setFormTotal(String(r.total));
    setModalOpen(true);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total   = results.length;
    const passed  = results.filter((r) => r.status === "Pass").length;
    const failed  = results.filter((r) => r.status === "Fail").length;
    const avgPct  = total ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / total) : 0;
    const topScore = total ? Math.max(...results.map((r) => r.percentage)) : 0;
    return { total, passed, failed, avgPct, topScore };
  }, [results]);

  // ── Filtered records ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return results.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch  = r.studentName.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q);
      const matchClass   = classFilter   === "All" || r.class   === classFilter;
      const matchSubject = subjectFilter === "All" || r.subject === subjectFilter;
      const matchStatus  = statusFilter  === "All" || r.status  === statusFilter;
      return matchSearch && matchClass && matchSubject && matchStatus;
    });
  }, [results, search, classFilter, subjectFilter, statusFilter]);

  // ── Summary by subject ─────────────────────────────────────────────────────
  const summaryData = useMemo(() => {
    const base = results.filter((r) => {
      const matchClass   = classFilter   === "All" || r.class   === classFilter;
      const matchSubject = subjectFilter === "All" || r.subject === subjectFilter;
      const q = search.toLowerCase();
      const matchSearch  = r.studentName.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q);
      return matchClass && matchSubject && matchSearch;
    });
    const grouped: Record<string, ResultRecord[]> = {};
    base.forEach((r) => { if (!grouped[r.subject]) grouped[r.subject] = []; grouped[r.subject].push(r); });
    return Object.entries(grouped).map(([subject, recs]) => {
      const pcts    = recs.map((r) => r.percentage);
      const avg     = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
      const highest = Math.max(...pcts);
      const lowest  = Math.min(...pcts);
      const passRate = Math.round((recs.filter((r) => r.status === "Pass").length / recs.length) * 100);
      return { subject, avg, highest, lowest, passRate, count: recs.length };
    });
  }, [results, classFilter, subjectFilter, search]);

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!formStudentName.trim()) {
      toast({ title: "Validation Error", description: "Student name is required.", variant: "destructive" }); return;
    }
    const marks = Number(formMarks); const total = Number(formTotal);
    if (isNaN(marks) || marks < 0) { toast({ title: "Validation Error", description: "Enter valid marks.", variant: "destructive" }); return; }
    if (isNaN(total) || total <= 0) { toast({ title: "Validation Error", description: "Total must be > 0.", variant: "destructive" }); return; }
    if (marks > total) { toast({ title: "Validation Error", description: "Marks cannot exceed total.", variant: "destructive" }); return; }

    const percentage = Math.round((marks / total) * 100);
    const status     = percentage >= 40 ? "Pass" : "Fail";
    const grade      = computeGrade(percentage);

    if (editingResult) {
      setResults((prev) => prev.map((r) =>
        r.id === editingResult.id
          ? { ...r, studentName: formStudentName.trim(), class: formClass, subject: formSubject, marks, total, percentage, status, grade }
          : r
      ));
      toast({ title: "Result updated", description: `${formStudentName.trim()}'s result updated.` });
    } else {
      const nr: ResultRecord = {
        id: Date.now(), studentName: formStudentName.trim(), class: formClass,
        subject: formSubject, marks, total, percentage, status, grade, isNew: true,
      };
      setResults((prev) => [nr, ...prev]);
      toast({ title: "Result added", description: `${nr.studentName} — ${nr.subject} recorded.` });
      setTimeout(() => setResults((prev) => prev.map((r) => r.id === nr.id ? { ...r, isNew: false } : r)), 600);
    }
    setModalOpen(false); resetForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setResults((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast({ title: "Result deleted", description: `${deleteTarget.studentName}'s ${deleteTarget.subject} result removed.`, variant: "destructive" });
    setDeleteTarget(null);
  };

  const previewPct = formMarks && formTotal && Number(formTotal) > 0
    ? Math.round((Number(formMarks) / Number(formTotal)) * 100) : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Results</h1>
            <p className="text-sm text-muted-foreground">{results.length} total results recorded</p>
          </div>
          <Button
            onClick={() => { resetForm(); setModalOpen(true); }}
            className="h-9 px-4 gradient-primary text-foreground font-semibold rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Result
          </Button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Results"  value={String(stats.total)}   icon={BarChart3}    glowClass="glow-primary"  gradientClass="gradient-primary" />
          <StatCard title="Pass"           value={String(stats.passed)}  icon={CheckCircle}  glowClass="glow-teal"     gradientClass="gradient-teal" />
          <StatCard title="Fail"           value={String(stats.failed)}  icon={XCircle}      glowClass="glow-accent"   gradientClass="gradient-warm" />
          <StatCard title="Class Average"  value={`${stats.avgPct}%`}    icon={TrendingUp}   glowClass="glow-primary"  gradientClass="gradient-primary" />
        </div>

        {/* ── Filters + View Toggle ── */}
        <div className="glass rounded-2xl p-4 glow-primary">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search student or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-56 h-9 bg-secondary/50 border-border/50 text-sm rounded-xl"
                />
              </div>
              {/* Class filter */}
              <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className={selectCls}>
                <option value="All">All Classes</option>
                {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
              {/* Subject filter */}
              <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className={selectCls}>
                <option value="All">All Subjects</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {/* Status filter */}
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
                <option value="All">All Status</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
            {/* View toggle */}
            <div className="flex rounded-xl overflow-hidden border border-border/50">
              <button
                onClick={() => setViewMode("summary")}
                className={`px-4 h-9 text-xs font-medium transition-colors ${viewMode === "summary" ? "gradient-primary text-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}
              >
                Summary
              </button>
              <button
                onClick={() => setViewMode("individual")}
                className={`px-4 h-9 text-xs font-medium transition-colors ${viewMode === "individual" ? "gradient-primary text-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}
              >
                Individual
              </button>
            </div>
          </div>
          {/* Active filter chips */}
          {(search || classFilter !== "All" || subjectFilter !== "All" || statusFilter !== "All") && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground">Filters:</span>
              {search && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary flex items-center gap-1">
                  "{search}" <button onClick={() => setSearch("")} className="hover:text-foreground">×</button>
                </span>
              )}
              {classFilter !== "All" && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary flex items-center gap-1">
                  Class {classFilter} <button onClick={() => setClassFilter("All")} className="hover:text-foreground">×</button>
                </span>
              )}
              {subjectFilter !== "All" && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary flex items-center gap-1">
                  {subjectFilter} <button onClick={() => setSubjectFilter("All")} className="hover:text-foreground">×</button>
                </span>
              )}
              {statusFilter !== "All" && (
                <span className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 ${statusFilter === "Pass" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {statusFilter} <button onClick={() => setStatusFilter("All")} className="hover:text-foreground">×</button>
                </span>
              )}
              <button onClick={() => { setSearch(""); setClassFilter("All"); setSubjectFilter("All"); setStatusFilter("All"); }} className="text-xs text-muted-foreground hover:text-foreground underline">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ── Summary View ── */}
        {viewMode === "summary" && (
          <div className="glass rounded-2xl overflow-hidden glow-primary">
            <div className="p-5 border-b border-border/30">
              <h3 className="text-base font-semibold text-foreground">Subject-wise Performance</h3>
            </div>
            {summaryData.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">No results match the current filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      {["Subject", "Students", "Avg %", "Highest", "Lowest", "Pass Rate"].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.map((s) => (
                      <tr key={s.subject} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-4 font-medium text-foreground text-sm">{s.subject}</td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{s.count}</td>
                        <td className="px-5 py-4">
                          <span className={`text-sm font-semibold ${s.avg >= 75 ? "text-success" : s.avg >= 50 ? "text-warning" : "text-destructive"}`}>{s.avg}%</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-success font-medium">{s.highest}%</td>
                        <td className="px-5 py-4 text-sm text-destructive font-medium">{s.lowest}%</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                              <div className={`h-full rounded-full ${s.passRate >= 80 ? "bg-success" : s.passRate >= 60 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${s.passRate}%` }} />
                            </div>
                            <span className={`text-sm font-medium ${s.passRate >= 80 ? "text-success" : s.passRate >= 60 ? "text-warning" : "text-destructive"}`}>{s.passRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Individual View ── */}
        {viewMode === "individual" && (
          <div className="glass rounded-2xl overflow-hidden glow-primary">
            <div className="p-5 border-b border-border/30 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Individual Results</h3>
              <span className="text-xs text-muted-foreground">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            {filtered.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">No results match your filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      {["Student", "Class", "Subject", "Marks", "%", "Grade", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className={`border-b border-border/30 hover:bg-secondary/30 transition-all group ${r.isNew ? "animate-fade-in" : ""}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-foreground font-bold text-xs shrink-0">
                              {r.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <span className="font-medium text-foreground text-sm">{r.studentName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{r.class}</td>
                        <td className="px-5 py-4 text-sm text-foreground">{r.subject}</td>
                        <td className="px-5 py-4 text-sm text-foreground">{r.marks}/{r.total}</td>
                        <td className="px-5 py-4">
                          <span className={`text-sm font-bold ${r.percentage >= 75 ? "text-success" : r.percentage >= 50 ? "text-warning" : "text-destructive"}`}>{r.percentage}%</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl ${gradeColors[r.grade] ?? "bg-secondary/50 text-foreground"}`}>{r.grade}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl ${r.status === "Pass" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{r.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button onClick={() => openEditModal(r)} className="p-1.5 rounded-xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">Edit</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">Delete</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="glass border border-border/50 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingResult ? "Edit Result" : "Add New Result"}</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {editingResult ? "Update the result details below." : "Grade and status are auto-calculated."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Student Name</Label>
              <Input placeholder="e.g. Rahul Kumar" value={formStudentName} onChange={(e) => setFormStudentName(e.target.value)} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Class</Label>
                <select value={formClass} onChange={(e) => setFormClass(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Subject</Label>
                <select value={formSubject} onChange={(e) => setFormSubject(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Marks Obtained</Label>
                <Input type="number" min={0} placeholder="e.g. 85" value={formMarks} onChange={(e) => setFormMarks(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Total Marks</Label>
                <Input type="number" min={1} placeholder="e.g. 100" value={formTotal} onChange={(e) => setFormTotal(e.target.value)} className={inputCls} />
              </div>
            </div>
            {/* Live preview */}
            {previewPct !== null && (
              <div className="grid grid-cols-3 gap-2 pt-1 animate-fade-in">
                <div className="glass rounded-xl border border-border/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Percentage</p>
                  <p className="text-lg font-bold text-primary">{previewPct}%</p>
                </div>
                <div className="glass rounded-xl border border-border/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Grade</p>
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${gradeColors[computeGrade(previewPct)] ?? ""}`}>{computeGrade(previewPct)}</span>
                </div>
                <div className="glass rounded-xl border border-border/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                  <span className={`text-sm font-semibold ${previewPct >= 40 ? "text-success" : "text-destructive"}`}>{previewPct >= 40 ? "Pass" : "Fail"}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setModalOpen(false); resetForm(); }} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSubmit} className="gradient-primary text-foreground font-semibold rounded-xl">{editingResult ? "Save Changes" : "Add Result"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="glass border border-border/50 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Result?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete {deleteTarget?.studentName}'s {deleteTarget?.subject} result. Cannot be undone.
            </AlertDialogDescription>
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

export default Results;
