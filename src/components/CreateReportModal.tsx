import { useState } from "react";
import { StrictModal } from "@/components/StrictModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, FileEdit, ArrowLeft, Loader2, Save } from "lucide-react";

const REPORT_CATEGORIES = [
  "Performance",
  "Attendance",
  "Behaviour",
  "Financial",
  "Academic",
  "Administrative",
];

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateManual: (data: { title: string; type: string; content: string }) => void;
  onCreateAI: (type: string) => Promise<void>;
}

export function CreateReportModal({ isOpen, onClose, onCreateManual, onCreateAI }: CreateReportModalProps) {
  const [mode, setMode] = useState<"select" | "ai" | "manual">("select");
  const [aiCategory, setAiCategory] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const reset = () => {
    setMode("select");
    setAiCategory("");
    setAiLoading(false);
    setTitle("");
    setCategory("");
    setContent("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAIGenerate = async () => {
    if (!aiCategory) return;
    setAiLoading(true);
    try {
      await onCreateAI(aiCategory);
      handleClose();
    } finally {
      setAiLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (!title.trim() || !category || !content.trim()) return;
    onCreateManual({ title: title.trim(), type: category, content: content.trim() });
    handleClose();
  };

  return (
    <StrictModal open={isOpen} setOpen={(open) => { if (!open) handleClose(); }}>
      <div className="w-full max-w-lg glass-strong rounded-2xl p-6 space-y-5">
        {mode === "select" && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Create New Report</h2>
            <p className="text-sm text-muted-foreground">Choose how you'd like to create your report.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setMode("ai")}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">AI Generated</p>
                  <p className="text-xs text-muted-foreground mt-1">Auto-generate from real data</p>
                </div>
              </button>
              <button
                onClick={() => setMode("manual")}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileEdit className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Manual Report</p>
                  <p className="text-xs text-muted-foreground mt-1">Write your own content</p>
                </div>
              </button>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={handleClose} className="text-muted-foreground">Cancel</Button>
            </div>
          </>
        )}

        {mode === "ai" && (
          <>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMode("select")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold text-foreground">AI Generated Report</h2>
            </div>
            <p className="text-sm text-muted-foreground">Select a report category and we'll generate it from your data.</p>
            <div className="space-y-4 pt-1">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Report Category</label>
                <Select value={aiCategory} onValueChange={setAiCategory}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="ghost" onClick={handleClose} className="text-muted-foreground">Cancel</Button>
              <Button
                onClick={handleAIGenerate}
                disabled={!aiCategory || aiLoading}
                className="gradient-primary text-foreground glow-primary gap-2"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiLoading ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </>
        )}

        {mode === "manual" && (
          <>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMode("select")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold text-foreground">Manual Report</h2>
            </div>
            <div className="space-y-4 pt-1">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Report Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter report title" className="bg-background/50 border-border/50" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Content</label>
                <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write report content..." rows={5} className="bg-background/50 border-border/50" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="ghost" onClick={handleClose} className="text-muted-foreground">Cancel</Button>
              <Button
                onClick={handleManualSubmit}
                disabled={!title.trim() || !category || !content.trim()}
                className="gradient-primary text-foreground glow-primary gap-2"
              >
                <Save className="w-4 h-4" />
                Create Report
              </Button>
            </div>
          </>
        )}
      </div>
    </StrictModal>
  );
}
