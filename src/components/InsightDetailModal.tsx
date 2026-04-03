import { X, TrendingUp, AlertTriangle, Target, Lightbulb, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { StrictModal } from "@/components/StrictModal";

export interface InsightData {
  title: string;
  description: string;
  variant: "destructive" | "success" | "primary" | "accent";
  type: "risk" | "attendance" | "improvement" | "rising" | "focus" | "suggestion" | "prediction";
  icon?: any;
}

interface InsightDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: InsightData | null;
}

export function InsightDetailModal({ isOpen, onClose, insight }: InsightDetailModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!insight) return null;

  const handleAction = (message: string) => {
    toast({ title: "Action Triggered", description: message });
    onClose();
  };

  const renderContent = () => {
    switch (insight.type) {
      case "risk":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <h4 className="font-semibold text-foreground mb-2">Key Indicators</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                <li>Attendance below 60% threshold over last 14 days</li>
                <li>Consistent decline in weekly test scores (Physics & Chemistry)</li>
                <li>Missed 3 consecutive assignments</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => { navigate("/students"); onClose(); }} variant="outline" className="flex-1">View Student Profile</Button>
              <Button onClick={() => handleAction("Parent Notification Sent")} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90">Notify Parent</Button>
              <Button onClick={() => handleAction("Intervention Scheduled")} variant="outline" className="flex-1">Schedule Intervention</Button>
            </div>
          </div>
        );
      case "attendance":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <h4 className="font-semibold text-foreground mb-2">Absence History (Last 7 Days)</h4>
              <div className="flex gap-2 mb-2">
                {["M", "T", "W", "T", "F"].map((day, i) => (
                  <div key={i} className={`flex-1 text-center text-xs py-1 rounded-sm ${i >= 2 ? "bg-destructive/30 text-destructive" : "bg-success/20 text-success"}`}>
                    {day}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Reason: Not provided in system.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => handleAction("Attendance Marked")} variant="outline" className="flex-1">Mark Attendance</Button>
              <Button onClick={() => handleAction("Warning Sent to Parent")} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90">Send Warning</Button>
            </div>
          </div>
        );
      case "improvement":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <h4 className="font-semibold text-foreground mb-2">Growth Dashboard</h4>
              <div className="space-y-2">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: "68%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Last Month: 60% Avg</span>
                  <span className="text-success font-medium">This Month: 68% Avg</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Strongest gains in Mathematics (+12%) and English (+8%).</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => { navigate("/results"); onClose(); }} variant="outline" className="flex-1">View Class Report</Button>
              <Button onClick={() => handleAction("Class Awarded")} className="flex-1 bg-success text-success-foreground hover:bg-success/90">Reward Class</Button>
            </div>
          </div>
        );
      case "rising":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <h4 className="font-semibold text-foreground mb-2">AI Score History</h4>
              <div className="flex items-end gap-2 h-16 border-b border-border/50 pb-1">
                {[6.2, 6.5, 6.8, 7.4, 7.9].map((score, i) => (
                  <div key={i} className="flex-1 bg-success/40 rounded-t-sm" style={{ height: `${(score / 10) * 100}%` }}></div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Strengths: Problem-solving speed, complex equations.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => handleAction("Student Promoted")} className="flex-1 bg-success text-success-foreground hover:bg-success/90">Promote Student</Button>
              <Button onClick={() => handleAction("Added to Top Performers")} variant="outline" className="flex-1">Add to Top Performers</Button>
            </div>
          </div>
        );
      case "focus":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <h4 className="font-semibold text-foreground mb-2">Subject Breakdown: Physics</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                <li>Topic: Electromagnetism (Lowest scores)</li>
                <li>Topic: Thermodynamics (Needs review)</li>
                <li>12 students identified for remediation</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => handleAction("Extra Classes Scheduled")} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Assign Extra Classes</Button>
              <Button onClick={() => handleAction("Practice Test Created")} variant="outline" className="flex-1">Create Practice Test</Button>
            </div>
          </div>
        );
      case "suggestion":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <h4 className="font-semibold text-foreground mb-2">AI Recommendation Engine</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our model suggests that implementing micro-assessments (5-10 mins) at the start of classes improves long-term retention by 22% for students in the 60-75% quartile.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => handleAction("Strategy Applied")} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">Apply Suggestion</Button>
              <Button onClick={() => handleAction("Custom Plan Configuration Opened")} variant="outline" className="flex-1">Customize Plan</Button>
            </div>
          </div>
        );
      case "prediction":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <h4 className="font-semibold text-foreground mb-2">Risk Probability Model</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Probability of Failure (Term 2)</span>
                  <span className="font-bold text-destructive">78%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-destructive h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">5 students across Class 9 and 10 flagged.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => { navigate("/students"); onClose(); }} variant="outline" className="flex-1">View Risk Students</Button>
              <Button onClick={() => handleAction("Intervention Plan Initiated")} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">Start Intervention Plan</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const Icon = insight.icon || Brain;

  return (
    <StrictModal open={isOpen} setOpen={(open) => { if (!open) onClose(); }}>
      <div className="w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className={`p-4 border-b border-border/20 flex items-center gap-3 bg-${insight.variant}/5`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-${insight.variant} bg-${insight.variant}/10`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{insight.title}</h2>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Insight Detail</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0 p-2 rounded-full hover:bg-secondary/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-foreground text-sm mb-6 leading-relaxed bg-secondary/30 p-4 rounded-xl border border-border/50">
            {insight.description}
          </p>
          {renderContent()}
        </div>
      </div>
    </StrictModal>
  );
}
