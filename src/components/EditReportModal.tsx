import { StrictModal } from "@/components/StrictModal";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";
import { ReportRecord } from "@/lib/store";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportRecord | null;
  onSave: (updatedReport: ReportRecord) => void;
}

export function EditReportModal({ isOpen, onClose, report, onSave }: EditReportModalProps) {
  const [formData, setFormData] = useState<ReportRecord | null>(null);

  useEffect(() => {
    if (report) setFormData({ ...report });
  }, [report]);

  if (!formData) return null;

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: "Error", description: "Title and content cannot be empty.", variant: "destructive" });
      return;
    }
    const finalReport = { ...formData, updatedAt: Date.now() };
    onSave(finalReport);
  };

  return (
    <StrictModal open={isOpen} setOpen={(open) => { if (!open) onClose(); }}>
      <div className="w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Report</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
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

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Content Preview</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
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
