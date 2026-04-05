import { StrictModal } from "@/components/StrictModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { store, BehaviourRecord, BehaviourSeverity, BehaviourTag, behaviourTags, defaultProfile } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

interface LogBehaviourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: BehaviourRecord) => void;
}

export function LogBehaviourModal({ isOpen, onClose, onSave }: LogBehaviourModalProps) {
  const students = store.getStudents();
  const profile = store.getUserProfile();

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{ name: string; class: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [type, setType] = useState<"warning" | "concern" | "positive">("concern");
  const [severity, setSeverity] = useState<BehaviourSeverity>("medium");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<BehaviourTag[]>([]);

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students;
    return students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()));
  }, [studentSearch, students]);

  const toggleTag = (tag: BehaviourTag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const resetForm = () => {
    setStudentSearch("");
    setSelectedStudent(null);
    setType("concern");
    setSeverity("medium");
    setDescription("");
    setSelectedTags([]);
  };

  const handleSubmit = () => {
    if (!selectedStudent) {
      toast({ title: "Error", description: "Please select a student.", variant: "destructive" });
      return;
    }
    if (!description.trim()) {
      toast({ title: "Error", description: "Please enter a description.", variant: "destructive" });
      return;
    }

    const now = Date.now();
    const record: BehaviourRecord = {
      id: `b_${now}`,
      studentName: selectedStudent.name,
      class: selectedStudent.class,
      type,
      severity,
      description: description.trim(),
      tags: selectedTags,
      date: new Date().toISOString().split("T")[0],
      reportedBy: profile.name,
      frequency: 1,
      createdAt: now,
    };

    onSave(record);
    resetForm();
    onClose();
    toast({ title: "Success", description: "Behaviour logged successfully." });
  };

  const typeOptions = [
    { value: "warning" as const, label: "Warning", color: "bg-destructive/20 text-destructive border-destructive/30" },
    { value: "concern" as const, label: "Concern", color: "bg-warning/20 text-warning border-warning/30" },
    { value: "positive" as const, label: "Positive", color: "bg-success/20 text-success border-success/30" },
  ];

  const severityOptions = [
    { value: "low" as const, label: "Low", color: "bg-success/20 text-success" },
    { value: "medium" as const, label: "Medium", color: "bg-warning/20 text-warning" },
    { value: "high" as const, label: "High", color: "bg-destructive/20 text-destructive" },
  ];

  return (
    <StrictModal open={isOpen} setOpen={(open) => { if (!open) onClose(); }}>
      <div className="w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Log Behaviour</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Search */}
        <div className="space-y-1.5 relative">
          <label className="text-sm font-medium text-foreground">Student *</label>
          {selectedStudent ? (
            <div className="flex items-center gap-2 h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl">
              <span className="text-sm flex-1">{selectedStudent.name} — Class {selectedStudent.class}</span>
              <button onClick={() => { setSelectedStudent(null); setStudentSearch(""); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search student..."
                value={studentSearch}
                onChange={(e) => { setStudentSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                className="w-full h-10 pl-10 pr-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
              {showDropdown && (
                <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border/50 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                  {filteredStudents.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">No students found</div>
                  ) : (
                    filteredStudents.map(s => (
                      <button
                        key={s.id}
                        onClick={() => { setSelectedStudent({ name: s.name, class: s.class }); setShowDropdown(false); setStudentSearch(""); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 transition-colors flex justify-between"
                      >
                        <span>{s.name}</span>
                        <span className="text-muted-foreground">Class {s.class}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Behaviour Type</label>
          <div className="flex gap-2">
            {typeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${type === opt.value ? opt.color : "bg-secondary/30 text-muted-foreground border-border/30 hover:bg-secondary/50"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Severity</label>
          <div className="flex gap-2">
            {severityOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSeverity(opt.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${severity === opt.value ? opt.color + " border-current" : "bg-secondary/30 text-muted-foreground border-border/30 hover:bg-secondary/50"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Tags</label>
          <div className="flex flex-wrap gap-1.5">
            {behaviourTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all border ${selectedTags.includes(tag) ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary/30 text-muted-foreground border-border/30 hover:bg-secondary/50"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the behaviour incident..."
            className="w-full p-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        {/* Auto-filled */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Date</label>
            <div className="h-9 px-3 bg-secondary/30 border border-border/30 rounded-xl text-sm flex items-center text-muted-foreground">
              {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Reported By</label>
            <div className="h-9 px-3 bg-secondary/30 border border-border/30 rounded-xl text-sm flex items-center text-muted-foreground">
              {profile.name}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
          <Button variant="ghost" onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Log Behaviour
          </Button>
        </div>
      </div>
    </StrictModal>
  );
}
