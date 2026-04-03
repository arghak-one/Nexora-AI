import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { store, ResultRecord } from "@/lib/store";

// Store usage

const gradeColors: Record<string, string> = {
  "A+": "bg-success/15 text-success",
  A: "bg-success/10 text-success",
  B: "bg-primary/10 text-primary",
  C: "bg-warning/10 text-warning",
  D: "bg-warning/15 text-warning",
  F: "bg-destructive/10 text-destructive",
};

type ViewMode = "summary" | "individual";

const subjects = ["Mathematics", "Physics", "Chemistry", "English", "Computer Science", "Biology"];
const classes = ["9A", "9B", "10A", "10B"];

function computeGrade(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

const Results = () => {
  const [results, setResults] = useState<ResultRecord[]>(() => store.getResults());
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("summary");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ResultRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResultRecord | null>(null);

  // Form state
  const [formStudentName, setFormStudentName] = useState("");
  const [formClass, setFormClass] = useState("9A");
  const [formSubject, setFormSubject] = useState("Mathematics");
  const [formMarks, setFormMarks] = useState("");
  const [formTotal, setFormTotal] = useState("100");

  useEffect(() => {
    store.setResults(results);
  }, [results]);

  const resetForm = () => {
    setFormStudentName("");
    setFormClass("9A");
    setFormSubject("Mathematics");
    setFormMarks("");
    setFormTotal("100");
    setEditingResult(null);
  };

  const openEditModal = (r: ResultRecord) => {
    setEditingResult(r);
    setFormStudentName(r.studentName);
    setFormClass(r.class);
    setFormSubject(r.subject);
    setFormMarks(String(r.marks));
    setFormTotal(String(r.total));
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formStudentName.trim()) {
      toast({ title: "Validation Error", description: "Student name is required.", variant: "destructive" });
      return;
    }
    const marks = Number(formMarks);
    const total = Number(formTotal);
    if (isNaN(marks) || marks < 0) {
      toast({ title: "Validation Error", description: "Enter valid marks.", variant: "destructive" });
      return;
    }
    if (isNaN(total) || total <= 0) {
      toast({ title: "Validation Error", description: "Total marks must be greater than 0.", variant: "destructive" });
      return;
    }
    if (marks > total) {
      toast({ title: "Validation Error", description: "Marks cannot exceed total.", variant: "destructive" });
      return;
    }

    const percentage = Math.round((marks / total) * 100);
    const status = percentage >= 40 ? "Pass" : "Fail";
    const grade = computeGrade(percentage);

    if (editingResult) {
      setResults((prev) =>
        prev.map((r) =>
          r.id === editingResult.id
            ? { ...r, studentName: formStudentName.trim(), class: formClass, subject: formSubject, marks, total, percentage, status, grade }
            : r
        )
      );
      toast({ title: "Result updated", description: `${formStudentName.trim()}'s result has been updated.` });
    } else {
      const newResult: ResultRecord = {
        id: Date.now(),
        studentName: formStudentName.trim(),
        class: formClass,
        subject: formSubject,
        marks,
        total,
        percentage,
        status,
        grade,
        isNew: true,
      };
      setResults((prev) => [newResult, ...prev]);
      toast({ title: "Result added", description: `Result for ${newResult.studentName} in ${newResult.subject} has been recorded.` });
      setTimeout(() => {
        setResults((prev) => prev.map((r) => (r.id === newResult.id ? { ...r, isNew: false } : r)));
      }, 600);
    }
    setModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setResults((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast({ title: "Result removed", description: `${deleteTarget.studentName}'s ${deleteTarget.subject} result has been deleted.` });
    setDeleteTarget(null);
  };

  // Filtered individual results
  const filtered = results.filter((r) => {
    const matchSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "All" || r.class === classFilter;
    const matchSubject = subjectFilter === "All" || r.subject === subjectFilter;
    return matchSearch && matchClass && matchSubject;
  });

  // Aggregated summary by subject
  const summaryData = useMemo(() => {
    const filteredForSummary = results.filter((r) => {
      const matchClass = classFilter === "All" || r.class === classFilter;
      const matchSubject = subjectFilter === "All" || r.subject === subjectFilter;
      const matchSearch =
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.subject.toLowerCase().includes(search.toLowerCase());
      return matchClass && matchSubject && matchSearch;
    });

    const grouped: Record<string, ResultRecord[]> = {};
    filteredForSummary.forEach((r) => {
      if (!grouped[r.subject]) grouped[r.subject] = [];
      grouped[r.subject].push(r);
    });

    return Object.entries(grouped).map(([subject, records]) => {
      const pcts = records.map((r) => r.percentage);
      const classAvg = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
      const highest = Math.max(...pcts);
      const lowest = Math.min(...pcts);
      const passRate = Math.round((records.filter((r) => r.status === "Pass").length / records.length) * 100);
      return { subject, classAvg, highest, lowest, passRate, count: records.length };
    });
  }, [results, classFilter, subjectFilter, search]);

  const previewPct = formMarks && formTotal && Number(formTotal) > 0 ? Math.round((Number(formMarks) / Number(formTotal)) * 100) : null;

  const inputClasses =
    "h-10 bg-secondary/50 border-border/50 text-foreground rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-shadow";

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Results</h1>
            <p className="text-sm text-muted-foreground">{results.length} total results recorded</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by student or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 h-9 bg-secondary/50 border-border/50 text-foreground text-sm"
              />
            </div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm outline-none"
            >
              <option value="All">All Classes</option>
              {classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm outline-none"
            >
              <option value="All">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="flex rounded-xl overflow-hidden border border-border/50">
              <button
                onClick={() => setViewMode("summary")}
                className={`px-3 h-9 text-xs font-medium transition-colors ${viewMode === "summary" ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}
              >
                Summary
              </button>
              <button
                onClick={() => setViewMode("individual")}
                className={`px-3 h-9 text-xs font-medium transition-colors ${viewMode === "individual" ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}
              >
                Individual
              </button>
            </div>
            <Button
              onClick={() => { resetForm(); setModalOpen(true); }}
              className="h-9 px-4 gradient-primary text-foreground font-semibold rounded-xl shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_28px_-4px_hsl(var(--primary)/0.7)] transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Result
            </Button>
          </div>
        </div>

        {/* Summary View */}
        {viewMode === "summary" && (
          <div className="glass rounded-2xl overflow-hidden glow-primary">
            {summaryData.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No results found matching your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Subject</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Records</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Class Average</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Highest</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Lowest</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.map((s) => (
                      <tr key={s.subject} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                              <BarChart3 className="w-4 h-4 text-foreground" />
                            </div>
                            <span className="font-medium text-foreground text-sm">{s.subject}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{s.count}</td>
                        <td className="px-5 py-4 text-sm text-foreground font-semibold">{s.classAvg}%</td>
                        <td className="px-5 py-4 text-sm text-success">{s.highest}%</td>
                        <td className="px-5 py-4 text-sm text-destructive">{s.lowest}%</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                              <div className="h-full rounded-full bg-success" style={{ width: `${s.passRate}%` }} />
                            </div>
                            <span className="text-sm text-foreground">{s.passRate}%</span>
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

        {/* Individual View */}
        {viewMode === "individual" && (
          <div className="glass rounded-2xl overflow-hidden glow-primary">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No results found matching your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Student</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Class</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Subject</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Marks</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Percentage</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Grade</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr
                        key={r.id}
                        className={`border-b border-border/30 hover:bg-secondary/30 transition-all group ${r.isNew ? "animate-fade-in" : ""}`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-foreground font-semibold text-xs">
                              {r.studentName.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="font-medium text-foreground text-sm">{r.studentName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{r.class}</td>
                        <td className="px-5 py-4 text-sm text-foreground">{r.subject}</td>
                        <td className="px-5 py-4 text-sm text-foreground">{r.marks}/{r.total}</td>
                        <td className="px-5 py-4 text-sm text-foreground font-semibold">{r.percentage}%</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${gradeColors[r.grade] || "bg-secondary/50 text-foreground"}`}>
                            {r.grade}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${r.status === "Pass" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => openEditModal(r)}
                                    className="p-2 rounded-[10px] text-muted-foreground/80 bg-secondary/40 hover:text-primary hover:bg-primary/15 hover:shadow-[0_0_12px_-3px_hsl(var(--primary)/0.4)] transition-all duration-200"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">Edit Result</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => setDeleteTarget(r)}
                                    className="p-2 rounded-[10px] text-muted-foreground/80 bg-secondary/40 hover:text-destructive hover:bg-destructive/15 hover:shadow-[0_0_12px_-3px_hsl(var(--destructive)/0.4)] transition-all duration-200"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">Delete Result</TooltipContent>
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

      {/* Add / Edit Result Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="glass-strong border-border/50 rounded-2xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.3)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingResult ? "Edit Result" : "Add New Result"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {editingResult ? "Update the result details below." : "Enter the student's result. Grade and status are auto-calculated."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Student Name</Label>
              <Input
                placeholder="e.g. Arjun Verma"
                value={formStudentName}
                onChange={(e) => setFormStudentName(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Class</Label>
                <select
                  value={formClass}
                  onChange={(e) => setFormClass(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                >
                  {classes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Subject</Label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Marks Obtained</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 85"
                  value={formMarks}
                  onChange={(e) => setFormMarks(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Total Marks</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 100"
                  value={formTotal}
                  onChange={(e) => setFormTotal(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {previewPct !== null && (
              <div className="flex gap-3 pt-1 animate-fade-in">
                <div className="flex-1 rounded-xl bg-secondary/40 border border-border/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Percentage</p>
                  <p className="text-lg font-bold text-primary">{previewPct}%</p>
                </div>
                <div className="flex-1 rounded-xl bg-secondary/40 border border-border/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Grade</p>
                  <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-lg ${gradeColors[computeGrade(previewPct)] || ""}`}>
                    {computeGrade(previewPct)}
                  </span>
                </div>
                <div className="flex-1 rounded-xl bg-secondary/40 border border-border/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                  <span className={`text-sm font-semibold ${previewPct >= 40 ? "text-success" : "text-destructive"}`}>
                    {previewPct >= 40 ? "Pass" : "Fail"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setModalOpen(false); resetForm(); }} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="gradient-primary text-foreground font-semibold rounded-xl shadow-[0_0_16px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)] transition-all duration-300"
            >
              {editingResult ? "Save Changes" : "Add Result"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="glass-strong border-border/50 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete {deleteTarget?.studentName}'s {deleteTarget?.subject} result. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
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

export default Results;
