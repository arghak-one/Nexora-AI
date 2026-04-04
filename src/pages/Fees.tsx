import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import {
  DollarSign, CheckCircle, Clock, AlertTriangle, Plus, Search, Eye, CreditCard,
  Trash2, Building2, GraduationCap, BookOpen, ArrowLeft, Receipt, Sparkles, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import {
  store, StudentFeeRecord, FeePayment, FeeStatus, PaymentMethod,
  departments, courses, semesters, paymentMethods, useStoreUpdate
} from "@/lib/store";

const statusColors: Record<FeeStatus, string> = {
  Paid: "bg-success/10 text-success",
  Partial: "bg-warning/10 text-warning",
  Unpaid: "bg-destructive/10 text-destructive",
};

const methodIcons: Record<PaymentMethod, string> = {
  UPI: "💳", Card: "💳", Cash: "💵", "Bank Transfer": "🏦",
};

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const computeStatus = (total: number, paid: number): FeeStatus => {
  if (paid >= total) return "Paid";
  if (paid > 0) return "Partial";
  return "Unpaid";
};

type ViewMode = "table" | "detail";

const Fees = () => {
  useStoreUpdate();
  const [fees, setFees] = useState<StudentFeeRecord[]>(() => store.getStudentFees());
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [semFilter, setSemFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Detail view
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedFee, setSelectedFee] = useState<StudentFeeRecord | null>(null);

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Add form
  const [formName, setFormName] = useState("");
  const [formDept, setFormDept] = useState("CSE");
  const [formCourse, setFormCourse] = useState("B.Tech");
  const [formSem, setFormSem] = useState("Sem 1");
  const [formTotal, setFormTotal] = useState("");
  const [formScholarship, setFormScholarship] = useState("0");

  // Pay form
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("UPI");

  const persist = (updated: StudentFeeRecord[]) => {
    setFees(updated);
    store.setStudentFees(updated);
  };

  // Filters
  const filtered = useMemo(() => {
    return fees.filter((f) => {
      const q = search.toLowerCase();
      const matchSearch = !q || f.studentName.toLowerCase().includes(q) || f.department.toLowerCase().includes(q) || f.course.toLowerCase().includes(q);
      const matchDept = deptFilter === "All" || f.department === deptFilter;
      const matchCourse = courseFilter === "All" || f.course === courseFilter;
      const matchSem = semFilter === "All" || f.semester === semFilter;
      const matchStatus = statusFilter === "All" || f.status === statusFilter;
      return matchSearch && matchDept && matchCourse && matchSem && matchStatus;
    });
  }, [fees, search, deptFilter, courseFilter, semFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalRevenue = fees.reduce((s, f) => s + f.paidAmount, 0);
    const totalDue = fees.reduce((s, f) => s + f.dueAmount, 0);
    const totalFees = fees.reduce((s, f) => s + f.totalFee, 0);
    const collectionRate = totalFees > 0 ? Math.round((totalRevenue / totalFees) * 100) : 0;
    const totalScholarships = fees.reduce((s, f) => s + f.scholarship, 0);
    return { totalRevenue, totalDue, collectionRate, totalScholarships };
  }, [fees]);

  // Dept breakdown
  const deptRevenue = useMemo(() => {
    const map: Record<string, { collected: number; due: number; count: number }> = {};
    fees.forEach((f) => {
      if (!map[f.department]) map[f.department] = { collected: 0, due: 0, count: 0 };
      map[f.department].collected += f.paidAmount;
      map[f.department].due += f.dueAmount;
      map[f.department].count++;
    });
    return map;
  }, [fees]);

  // Handlers
  const handleAdd = () => {
    const total = parseFloat(formTotal);
    const scholarship = parseFloat(formScholarship) || 0;
    if (!formName.trim() || isNaN(total) || total <= 0) {
      toast({ title: "Validation Error", description: "Fill all required fields correctly.", variant: "destructive" });
      return;
    }
    if (scholarship > total) {
      toast({ title: "Error", description: "Scholarship cannot exceed total fee.", variant: "destructive" });
      return;
    }
    const effectiveTotal = total - scholarship;
    const record: StudentFeeRecord = {
      id: "sf" + Date.now(),
      studentName: formName.trim(),
      department: formDept,
      course: formCourse,
      semester: formSem,
      totalFee: total,
      paidAmount: 0,
      dueAmount: effectiveTotal,
      scholarship,
      status: "Unpaid",
      payments: [],
      isNew: true,
    };
    persist([record, ...fees]);
    setAddOpen(false);
    setFormName(""); setFormTotal(""); setFormScholarship("0");
    toast({ title: "Success", description: "Fee record created." });
  };

  const handlePay = () => {
    if (!selectedFee) return;
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Error", description: "Enter a valid amount.", variant: "destructive" });
      return;
    }
    if (amount > selectedFee.dueAmount) {
      toast({ title: "Error", description: "Amount exceeds due balance.", variant: "destructive" });
      return;
    }
    const payment: FeePayment = {
      id: "pay" + Date.now(),
      amount,
      date: new Date().toISOString().split("T")[0],
      method: payMethod,
    };
    const newPaid = selectedFee.paidAmount + amount;
    const effectiveTotal = selectedFee.totalFee - selectedFee.scholarship;
    const newDue = effectiveTotal - newPaid;
    const updated: StudentFeeRecord = {
      ...selectedFee,
      paidAmount: newPaid,
      dueAmount: Math.max(0, newDue),
      status: computeStatus(effectiveTotal, newPaid),
      payments: [...selectedFee.payments, payment],
    };
    const newFees = fees.map((f) => (f.id === updated.id ? updated : f));
    persist(newFees);
    setSelectedFee(updated);
    setPayOpen(false);
    setPayAmount("");
    toast({ title: "Payment Recorded", description: `${formatINR(amount)} paid via ${payMethod}.` });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    persist(fees.filter((f) => f.id !== deleteTarget));
    if (selectedFee?.id === deleteTarget) { setViewMode("table"); setSelectedFee(null); }
    setDeleteOpen(false);
    setDeleteTarget(null);
    toast({ title: "Deleted", description: "Fee record removed.", variant: "destructive" });
  };

  const openDetail = (fee: StudentFeeRecord) => {
    setSelectedFee(fee);
    setViewMode("detail");
  };

  const availableCourses = formDept ? (courses[formDept] || []) : [];

  // ── DETAIL VIEW ──
  if (viewMode === "detail" && selectedFee) {
    const effectiveTotal = selectedFee.totalFee - selectedFee.scholarship;
    const progressPct = effectiveTotal > 0 ? Math.min(100, Math.round((selectedFee.paidAmount / effectiveTotal) * 100)) : 0;
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setViewMode("table")} className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{selectedFee.studentName}</h1>
              <p className="text-sm text-muted-foreground">{selectedFee.department} · {selectedFee.course} · {selectedFee.semester}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button onClick={() => { setPayOpen(true); setPayAmount(""); }} className="gradient-primary text-foreground gap-2 rounded-xl" disabled={selectedFee.status === "Paid"}>
                <CreditCard className="w-4 h-4" /> Record Payment
              </Button>
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl" onClick={() => { setDeleteTarget(selectedFee.id); setDeleteOpen(true); }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass rounded-2xl p-4 glow-primary">
              <p className="text-xs text-muted-foreground mb-1">Total Fee</p>
              <p className="text-xl font-bold text-foreground">{formatINR(selectedFee.totalFee)}</p>
            </div>
            <div className="glass rounded-2xl p-4 glow-teal">
              <p className="text-xs text-muted-foreground mb-1">Paid</p>
              <p className="text-xl font-bold text-success">{formatINR(selectedFee.paidAmount)}</p>
            </div>
            <div className="glass rounded-2xl p-4 glow-accent">
              <p className="text-xs text-muted-foreground mb-1">Due</p>
              <p className="text-xl font-bold text-warning">{formatINR(selectedFee.dueAmount)}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Scholarship</p>
              <p className="text-xl font-bold text-primary">{formatINR(selectedFee.scholarship)}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Payment Progress</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusColors[selectedFee.status]}`}>{selectedFee.status}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-secondary/50 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${selectedFee.status === "Paid" ? "bg-success" : "bg-primary"}`} style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{progressPct}% of {formatINR(effectiveTotal)} (after scholarship)</p>
          </div>

          {/* Fee Breakdown */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Receipt className="w-4 h-4 text-primary" /> Fee Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Tuition", amount: selectedFee.totalFee * 0.63 },
                { label: "Exam", amount: selectedFee.totalFee * 0.05 },
                { label: "Library", amount: selectedFee.totalFee * 0.03 },
                { label: "Lab", amount: selectedFee.totalFee * 0.08 },
                { label: "Hostel", amount: selectedFee.totalFee * 0.16 },
                { label: "Other", amount: selectedFee.totalFee * 0.05 },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{formatINR(Math.round(item.amount))}</p>
                </div>
              ))}
            </div>
            {selectedFee.scholarship > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Scholarship discount: <strong className="text-primary">{formatINR(selectedFee.scholarship)}</strong></span>
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Payment History</h3>
            {selectedFee.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {selectedFee.payments.map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/20 border border-border/30">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-lg">{methodIcons[p.method]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{formatINR(p.amount)}</p>
                      <p className="text-xs text-muted-foreground">{p.method} · {p.date}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pay Modal */}
        <Dialog open={payOpen} onOpenChange={setPayOpen}>
          <DialogContent className="glass border border-border/50 rounded-2xl max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-foreground">Record Payment</DialogTitle>
              <DialogDescription>Due: {formatINR(selectedFee.dueAmount)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Amount (₹)</Label>
                <Input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="Enter amount" className="glass border-border/50 rounded-xl" min={1} max={selectedFee.dueAmount} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Payment Method</Label>
                <Select value={payMethod} onValueChange={(v) => setPayMethod(v as PaymentMethod)}>
                  <SelectTrigger className="glass border-border/50 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{paymentMethods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                {[5000, 10000, 25000].filter((a) => a <= selectedFee.dueAmount).map((a) => (
                  <Button key={a} variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setPayAmount(String(a))}>{formatINR(a)}</Button>
                ))}
                <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setPayAmount(String(selectedFee.dueAmount))}>Full</Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPayOpen(false)} className="rounded-xl">Cancel</Button>
              <Button onClick={handlePay} className="gradient-primary text-foreground rounded-xl">Confirm Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent className="glass border border-border/50 rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Delete Fee Record</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove this fee record and all payment history.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    );
  }

  // ── TABLE VIEW ──
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Fee Management</h1>
            <p className="text-sm text-muted-foreground">University-level fee tracking & collection</p>
          </div>
          <Button onClick={() => { setAddOpen(true); setFormName(""); setFormTotal(""); setFormScholarship("0"); setFormDept("CSE"); setFormCourse("B.Tech"); setFormSem("Sem 1"); }} className="gradient-primary text-foreground gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Add Fee Record
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={formatINR(stats.totalRevenue)} icon={DollarSign} glowClass="glow-primary" gradientClass="gradient-primary" />
          <StatCard title="Total Due" value={formatINR(stats.totalDue)} icon={AlertTriangle} glowClass="glow-accent" gradientClass="gradient-warm" />
          <StatCard title="Collection Rate" value={`${stats.collectionRate}%`} icon={TrendingUp} glowClass="glow-teal" gradientClass="gradient-teal" />
          <StatCard title="Scholarships" value={formatINR(stats.totalScholarships)} icon={GraduationCap} glowClass="glow-primary" gradientClass="gradient-primary" />
        </div>

        {/* Department Revenue Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(deptRevenue).map(([dept, data]) => (
            <div key={dept} className="glass rounded-xl p-3 text-center hover:scale-[1.03] transition-transform cursor-default">
              <Building2 className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-xs font-semibold text-foreground">{dept}</p>
              <p className="text-xs text-success">{formatINR(data.collected)}</p>
              <p className="text-[10px] text-muted-foreground">{data.count} students</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 glass border-border/50 rounded-xl" />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[130px] glass border-border/50 rounded-xl"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Depts</SelectItem>
              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[120px] glass border-border/50 rounded-xl"><SelectValue placeholder="Course" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Courses</SelectItem>
              {Array.from(new Set(fees.map((f) => f.course))).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={semFilter} onValueChange={setSemFilter}>
            <SelectTrigger className="w-[120px] glass border-border/50 rounded-xl"><SelectValue placeholder="Semester" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sems</SelectItem>
              {semesters.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] glass border-border/50 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Partial">Partial</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden glow-primary">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {["Student", "Dept", "Course", "Sem", "Total", "Paid", "Due", "Scholarship", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={10} className="px-5 py-10 text-center text-sm text-muted-foreground">No fee records found.</td></tr>
                )}
                {filtered.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => openDetail(f)}
                    className={`border-b border-border/30 hover:bg-secondary/30 cursor-pointer transition-all duration-200 hover:scale-[1.005] ${f.isNew ? "animate-fade-in" : ""}`}
                  >
                    <td className="px-4 py-3.5 font-medium text-foreground text-sm">{f.studentName}</td>
                    <td className="px-4 py-3.5 text-xs"><span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">{f.department}</span></td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground">{f.course}</td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground">{f.semester}</td>
                    <td className="px-4 py-3.5 text-sm text-foreground">{formatINR(f.totalFee)}</td>
                    <td className="px-4 py-3.5 text-sm text-success">{formatINR(f.paidAmount)}</td>
                    <td className="px-4 py-3.5 text-sm text-warning">{formatINR(f.dueAmount)}</td>
                    <td className="px-4 py-3.5 text-sm text-primary">{f.scholarship > 0 ? formatINR(f.scholarship) : "—"}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusColors[f.status]}`}>{f.status}</span>
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <TooltipProvider>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => openDetail(f)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                            </TooltipTrigger>
                            <TooltipContent>View Details</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => { setSelectedFee(f); setPayOpen(true); setPayAmount(""); }} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" disabled={f.status === "Paid"}><CreditCard className="w-4 h-4" /></button>
                            </TooltipTrigger>
                            <TooltipContent>Record Payment</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => { setDeleteTarget(f.id); setDeleteOpen(true); }} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Fee Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="glass border border-border/50 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Fee Record</DialogTitle>
            <DialogDescription>Create a new student fee entry</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Student Name</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Rahul Kumar" className="glass border-border/50 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Department</Label>
                <Select value={formDept} onValueChange={(v) => { setFormDept(v); setFormCourse(courses[v]?.[0] || ""); }}>
                  <SelectTrigger className="glass border-border/50 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Course</Label>
                <Select value={formCourse} onValueChange={setFormCourse}>
                  <SelectTrigger className="glass border-border/50 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{availableCourses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Semester</Label>
              <Select value={formSem} onValueChange={setFormSem}>
                <SelectTrigger className="glass border-border/50 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{semesters.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Total Fee (₹)</Label>
                <Input type="number" value={formTotal} onChange={(e) => setFormTotal(e.target.value)} placeholder="e.g. 95000" className="glass border-border/50 rounded-xl" min={0} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Scholarship (₹)</Label>
                <Input type="number" value={formScholarship} onChange={(e) => setFormScholarship(e.target.value)} placeholder="0" className="glass border-border/50 rounded-xl" min={0} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAdd} className="gradient-primary text-foreground rounded-xl">Create Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Pay Modal (from table) */}
      {selectedFee && (
        <Dialog open={payOpen} onOpenChange={setPayOpen}>
          <DialogContent className="glass border border-border/50 rounded-2xl max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-foreground">Record Payment — {selectedFee.studentName}</DialogTitle>
              <DialogDescription>Due: {formatINR(selectedFee.dueAmount)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Amount (₹)</Label>
                <Input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="Enter amount" className="glass border-border/50 rounded-xl" min={1} max={selectedFee.dueAmount} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Payment Method</Label>
                <Select value={payMethod} onValueChange={(v) => setPayMethod(v as PaymentMethod)}>
                  <SelectTrigger className="glass border-border/50 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{paymentMethods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPayOpen(false)} className="rounded-xl">Cancel</Button>
              <Button onClick={handlePay} className="gradient-primary text-foreground rounded-xl">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="glass border border-border/50 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Fee Record</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this record and all payment history.</AlertDialogDescription>
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

export default Fees;
