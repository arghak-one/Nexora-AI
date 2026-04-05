import { StrictModal } from "@/components/StrictModal";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { BehaviourRecord } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

interface EditBehaviourModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: BehaviourRecord | null;
  onSave: (updatedRecord: BehaviourRecord) => void;
}

export function EditBehaviourModal({ isOpen, onClose, record, onSave }: EditBehaviourModalProps) {
  const [formData, setFormData] = useState<BehaviourRecord | null>(null);

  useEffect(() => {
    if (record) setFormData({ ...record });
  }, [record]);

  if (!formData) return null;

  const handleSave = () => {
    if (!formData.studentName.trim() || !formData.description.trim()) {
      toast({ title: "Error", description: "Student name and description cannot be empty.", variant: "destructive" });
      return;
    }
    onSave({ ...formData, updatedAt: Date.now() });
  };

  return (
    <StrictModal open={isOpen} setOpen={(open) => { if (!open) onClose(); }}>
      <div className="w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Behaviour Record</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Student Name</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Class</label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Behaviour Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="positive">Positive</option>
                <option value="concern">Concern</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Reported By</label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Frequency</label>
              <input
                type="number"
                value={formData.frequency || 1}
                onChange={(e) => setFormData({ ...formData, frequency: parseInt(e.target.value) || 1 })}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full p-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </StrictModal>
  );
}
