import { StrictModal } from "@/components/StrictModal";
import { X, Calendar, Clock, User, Hash } from "lucide-react";
import { BehaviourRecord } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, ThumbsUp } from "lucide-react";

interface BehaviourPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: BehaviourRecord | null;
}

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Warning" },
  concern: { icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10", label: "Concern" },
  positive: { icon: ThumbsUp, color: "text-success", bg: "bg-success/10", label: "Positive" },
};

export function BehaviourPreviewModal({ isOpen, onClose, record }: BehaviourPreviewModalProps) {
  if (!record) return null;
  const config = typeConfig[record.type];

  return (
    <StrictModal open={isOpen} setOpen={(open) => { if (!open) onClose(); }}>
      <div className="w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className={`p-4 border-b border-border/20 flex items-center gap-4 ${config.bg}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
            <config.icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${config.color} bg-background/50 backdrop-blur-md`}>
                {config.label}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-foreground leading-tight">{record.studentName}</h2>
            <p className="text-sm font-medium text-muted-foreground mt-0.5">Class {record.class}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors self-start">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-foreground">{record.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Reported By</p>
                <p className="text-sm font-medium text-foreground">{record.reportedBy}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 col-span-2">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Frequency Tracker</p>
                <p className="text-sm font-medium text-foreground">{record.frequency ? `${record.frequency} Incidents` : "1 Incident"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Detailed Description</h3>
            <div className="p-4 rounded-xl bg-secondary/20 border border-border/50">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {record.description}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end p-4 border-t border-border/20 bg-secondary/10">
          <Button onClick={onClose} variant="ghost">Close Preview</Button>
        </div>
        
      </div>
    </StrictModal>
  );
}
