import { X, Download, FileText, Calendar, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportRecord } from "@/lib/store";
import { StrictModal } from "@/components/StrictModal";

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportRecord | null;
  onDownload: (report: ReportRecord) => void;
}

export function ReportPreviewModal({ isOpen, onClose, report, onDownload }: ReportPreviewModalProps) {
  if (!report) return null;

  return (
    <StrictModal open={isOpen} setOpen={(open) => { if (!open) onClose(); }}>
      <div 
        className="w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-border/20 flex flex-col gap-4 bg-primary/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-foreground pr-4 leading-tight">{report.title}</h2>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-muted-foreground">
                  {report.type}
                </div>
              </div>
            </div>
            <button title="Click X to close" onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0 p-2 rounded-full hover:bg-secondary/50 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-6 mt-1 ml-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{report.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HardDrive className="w-3.5 h-3.5" />
              <span>{report.size}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Preview Content</h3>
          <div className="text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-5 rounded-xl border border-border/50 min-h-[150px]">
            {report.content ? report.content : "No preview available for this document."}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border/20 bg-secondary/10">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onDownload(report)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </StrictModal>
  );
}
